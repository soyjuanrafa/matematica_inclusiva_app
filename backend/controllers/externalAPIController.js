const ExternalAPIService = require('../services/externalAPIService');

class ExternalAPIController {
  constructor() {
    this.externalService = new ExternalAPIService();
  }

  // Text-to-Speech endpoint
  async textToSpeech(req, res) {
    try {
      const { text, language = 'es', voice = 'female' } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text is required' });
      }

      if (text.length > 5000) {
        return res.status(400).json({ error: 'Text too long (max 5000 characters)' });
      }

      const result = await this.externalService.textToSpeech(text, language, voice);

      if (result.success) {
        res.json({
          success: true,
          audioContent: result.audioContent,
          provider: result.provider,
          language,
          voice
        });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('TTS Controller Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Translation endpoint
  async translate(req, res) {
    try {
      const { text, targetLanguage = 'es', sourceLanguage = 'auto' } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text is required' });
      }

      if (text.length > 5000) {
        return res.status(400).json({ error: 'Text too long (max 5000 characters)' });
      }

      const result = await this.externalService.translateText(text, targetLanguage, sourceLanguage);

      if (result.success) {
        res.json({
          success: true,
          originalText: text,
          translatedText: result.translatedText,
          sourceLanguage: sourceLanguage === 'auto' ? 'detected' : sourceLanguage,
          targetLanguage,
          provider: result.provider
        });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Translation Controller Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Content moderation endpoint
  async moderateContent(req, res) {
    try {
      const { text } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text is required' });
      }

      if (text.length > 30000) {
        return res.status(400).json({ error: 'Text too long (max 30000 characters)' });
      }

      const result = await this.externalService.moderateContent(text);

      if (result.success) {
        res.json({
          success: true,
          isAppropriate: result.isAppropriate,
          scores: result.scores,
          textLength: text.length
        });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Moderation Controller Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Push notification endpoint
  async sendPushNotification(req, res) {
    try {
      const { token, title, body, data = {} } = req.body;

      if (!token || !title || !body) {
        return res.status(400).json({ error: 'Token, title, and body are required' });
      }

      const result = await this.externalService.sendPushNotification(token, title, body, data);

      if (result.success) {
        res.json({
          success: true,
          messageId: result.messageId,
          message: 'Push notification sent successfully'
        });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Push Notification Controller Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Batch push notifications endpoint
  async sendBatchPushNotifications(req, res) {
    try {
      const { notifications } = req.body;

      if (!Array.isArray(notifications) || notifications.length === 0) {
        return res.status(400).json({ error: 'Notifications array is required' });
      }

      if (notifications.length > 500) {
        return res.status(400).json({ error: 'Too many notifications (max 500)' });
      }

      // Validate each notification
      for (let i = 0; i < notifications.length; i++) {
        const { token, title, body } = notifications[i];
        if (!token || !title || !body) {
          return res.status(400).json({ error: `Notification ${i + 1}: token, title, and body are required` });
        }
      }

      const result = await this.externalService.sendBatchPushNotifications(notifications);

      if (result.success) {
        res.json({
          success: true,
          successCount: result.successCount,
          failureCount: result.failureCount,
          message: `Sent ${result.successCount} notifications successfully`
        });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Batch Push Notification Controller Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Health check endpoint
  async healthCheck(req, res) {
    try {
      const healthResults = await this.externalService.healthCheck();

      const overallHealth = Object.values(healthResults).some(status => status);

      res.json({
        success: true,
        overallHealth,
        services: healthResults,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Health Check Controller Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Combined TTS and Translation endpoint (for educational content)
  async createAudioLesson(req, res) {
    try {
      const { text, targetLanguage = 'es', voice = 'female', translateFirst = true } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text is required' });
      }

      let finalText = text;
      let translationResult = null;

      // Translate if requested
      if (translateFirst && targetLanguage !== 'en') {
        const translation = await this.externalService.translateText(text, targetLanguage, 'en');
        if (translation.success) {
          finalText = translation.translatedText;
          translationResult = translation;
        } else {
          return res.status(500).json({ error: 'Translation failed: ' + translation.error });
        }
      }

      // Generate audio
      const ttsResult = await this.externalService.textToSpeech(finalText, targetLanguage, voice);

      if (ttsResult.success) {
        res.json({
          success: true,
          audioContent: ttsResult.audioContent,
          provider: ttsResult.provider,
          originalText: text,
          finalText,
          targetLanguage,
          voice,
          translated: translateFirst,
          translationProvider: translationResult?.provider
        });
      } else {
        res.status(500).json({ error: 'TTS failed: ' + ttsResult.error });
      }
    } catch (error) {
      console.error('Create Audio Lesson Controller Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ExternalAPIController;
