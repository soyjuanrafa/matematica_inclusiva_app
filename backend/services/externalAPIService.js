const axios = require('axios');
const textToSpeech = require('@google-cloud/text-to-speech');
const { Translate } = require('@google-cloud/translate').v2;
const admin = require('firebase-admin');

// Initialize Google services
let ttsClient, translateClient;
try {
  ttsClient = new textToSpeech.TextToSpeechClient();
  translateClient = new Translate();
} catch (error) {
  console.warn('Google Cloud services not configured:', error.message);
}

// Initialize Firebase (for push notifications)
let firebaseApp;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  }
} catch (error) {
  console.warn('Firebase not configured:', error.message);
}

class ExternalAPIService {
  constructor() {
    this.voiceRssApiKey = process.env.VOICERSS_API_KEY;
    this.libreTranslateUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com/translate';
    this.perspectiveApiKey = process.env.PERSPECTIVE_API_KEY;
  }

  // Text-to-Speech with fallback
  async textToSpeech(text, language = 'es', voice = 'female') {
    try {
      // Try Google TTS first
      if (ttsClient) {
        const request = {
          input: { text },
          voice: {
            languageCode: language === 'es' ? 'es-ES' : 'en-US',
            ssmlGender: voice === 'female' ? 'FEMALE' : 'MALE',
            name: language === 'es' ? 'es-ES-Standard-A' : 'en-US-Standard-C'
          },
          audioConfig: { audioEncoding: 'MP3' },
        };

        const [response] = await ttsClient.synthesizeSpeech(request);
        return {
          success: true,
          audioContent: response.audioContent.toString('base64'),
          provider: 'google'
        };
      }
    } catch (error) {
      console.warn('Google TTS failed, trying VoiceRSS:', error.message);
    }

    // Fallback to VoiceRSS
    try {
      if (this.voiceRssApiKey) {
        const voiceCode = language === 'es' ? 'es-es' : 'en-us';
        const genderCode = voice === 'female' ? '' : '&f=1'; // VoiceRSS uses f=1 for male

        const response = await axios.get(
          `https://api.voicerss.org/?key=${this.voiceRssApiKey}&src=${encodeURIComponent(text)}&hl=${voiceCode}&r=0&c=mp3&f=44khz_16bit_stereo${genderCode}`,
          { responseType: 'arraybuffer' }
        );

        return {
          success: true,
          audioContent: Buffer.from(response.data).toString('base64'),
          provider: 'voicerss'
        };
      }
    } catch (error) {
      console.error('VoiceRSS TTS failed:', error.message);
    }

    return { success: false, error: 'All TTS services failed' };
  }

  // Translation with fallback
  async translateText(text, targetLanguage = 'es', sourceLanguage = 'auto') {
    try {
      // Try Google Translate first
      if (translateClient) {
        const [translation] = await translateClient.translate(text, targetLanguage);
        return {
          success: true,
          translatedText: translation,
          provider: 'google'
        };
      }
    } catch (error) {
      console.warn('Google Translate failed, trying LibreTranslate:', error.message);
    }

    // Fallback to LibreTranslate
    try {
      const response = await axios.post(this.libreTranslateUrl, {
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text'
      });

      return {
        success: true,
        translatedText: response.data.translatedText,
        provider: 'libretranslate'
      };
    } catch (error) {
      console.error('LibreTranslate failed:', error.message);
    }

    return { success: false, error: 'All translation services failed' };
  }

  // Content moderation using Perspective API
  async moderateContent(text) {
    if (!this.perspectiveApiKey) {
      return { success: false, error: 'Perspective API key not configured' };
    }

    try {
      const response = await axios.post(
        `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${this.perspectiveApiKey}`,
        {
          comment: { text },
          languages: ['es', 'en'],
          requestedAttributes: {
            TOXICITY: {},
            SEVERE_TOXICITY: {},
            IDENTITY_ATTACK: {},
            INSULT: {},
            PROFANITY: {},
            THREAT: {}
          }
        }
      );

      const scores = response.data.attributeScores;
      const isAppropriate = Object.values(scores).every(attr => attr.summaryScore.value < 0.7);

      return {
        success: true,
        isAppropriate,
        scores: {
          toxicity: scores.TOXICITY.summaryScore.value,
          severeToxicity: scores.SEVERE_TOXICITY.summaryScore.value,
          identityAttack: scores.IDENTITY_ATTACK.summaryScore.value,
          insult: scores.INSULT.summaryScore.value,
          profanity: scores.PROFANITY.summaryScore.value,
          threat: scores.THREAT.summaryScore.value
        }
      };
    } catch (error) {
      console.error('Perspective API failed:', error.message);
      return { success: false, error: 'Content moderation service failed' };
    }
  }

  // Push notifications via Firebase
  async sendPushNotification(token, title, body, data = {}) {
    if (!firebaseApp) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const message = {
        token,
        notification: {
          title,
          body
        },
        data: {
          ...data,
          timestamp: Date.now().toString()
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };

      const response = await admin.messaging().send(message);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Firebase push notification failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Batch push notifications
  async sendBatchPushNotifications(notifications) {
    if (!firebaseApp) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const messages = notifications.map(({ token, title, body, data = {} }) => ({
        token,
        notification: { title, body },
        data: { ...data, timestamp: Date.now().toString() }
      }));

      const response = await admin.messaging().sendAll(messages);
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses
      };
    } catch (error) {
      console.error('Batch push notifications failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Health check for external services
  async healthCheck() {
    const results = {
      googleTTS: false,
      voiceRSS: false,
      googleTranslate: false,
      libreTranslate: false,
      perspectiveAPI: false,
      firebase: false
    };

    // Check Google TTS
    try {
      if (ttsClient) {
        await ttsClient.listVoices();
        results.googleTTS = true;
      }
    } catch (error) {
      console.warn('Google TTS health check failed');
    }

    // Check VoiceRSS
    try {
      if (this.voiceRssApiKey) {
        const response = await axios.get(`https://api.voicerss.org/?key=${this.voiceRssApiKey}&src=test&hl=en-us&r=0&c=mp3&f=44khz_16bit_stereo`, { timeout: 5000 });
        results.voiceRSS = response.status === 200;
      }
    } catch (error) {
      console.warn('VoiceRSS health check failed');
    }

    // Check Google Translate
    try {
      if (translateClient) {
        await translateClient.translate('test', 'es');
        results.googleTranslate = true;
      }
    } catch (error) {
      console.warn('Google Translate health check failed');
    }

    // Check LibreTranslate
    try {
      const response = await axios.post(this.libreTranslateUrl, {
        q: 'test',
        source: 'en',
        target: 'es'
      }, { timeout: 5000 });
      results.libreTranslate = response.status === 200;
    } catch (error) {
      console.warn('LibreTranslate health check failed');
    }

    // Check Perspective API
    try {
      if (this.perspectiveApiKey) {
        const response = await axios.post(
          `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${this.perspectiveApiKey}`,
          { comment: { text: 'test' }, requestedAttributes: { TOXICITY: {} } },
          { timeout: 5000 }
        );
        results.perspectiveAPI = response.status === 200;
      }
    } catch (error) {
      console.warn('Perspective API health check failed');
    }

    // Check Firebase
    try {
      if (firebaseApp) {
        await admin.messaging().send({
          token: 'test',
          notification: { title: 'test', body: 'test' }
        }, true); // dry run
        results.firebase = true;
      }
    } catch (error) {
      console.warn('Firebase health check failed');
    }

    return results;
  }
}

module.exports = ExternalAPIService;
