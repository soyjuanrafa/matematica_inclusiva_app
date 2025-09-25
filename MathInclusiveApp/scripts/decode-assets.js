const fs = require('fs');
const path = require('path');

const files = [
  'assets/icon.png',
  'assets/splash.png',
  'assets/adaptive-icon.png',
  'assets/favicon.png',
  'assets/logo.png',
  'assets/avatar-placeholder.png',
  'assets/character-square.png',
  'assets/medal.png'
];

for (const rel of files) {
  const p = path.join(__dirname, '..', rel);
  try {
    if (!fs.existsSync(p)) {
      console.debug('Missing file (skipping):', p);
      continue;
    }
    const txt = fs.readFileSync(p, 'utf8').trim();
    // simple heuristic: if it looks like base64 (starts with iVBOR for common PNGs)
    if (/^[A-Za-z0-9+/=\r\n]+$/.test(txt) && txt.length > 50) {
      const buf = Buffer.from(txt, 'base64');
      // quick check: PNG header 89 50 4E 47
      if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
        fs.writeFileSync(p, buf);
        console.debug('Decoded base64 -> binary for', rel);
        continue;
      }
    }
    console.debug('No base64 content detected (left untouched):', rel);
  } catch (e) {
    console.error('Error processing', rel, e.message);
  }
}
