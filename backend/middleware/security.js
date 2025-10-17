const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const helmet = require('helmet');

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Logging middleware for suspicious activities
const securityLogger = (req, res, next) => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /--/i,
    /#/i,
  ];

  const logSuspicious = (message) => {
    console.log(`[SECURITY ALERT] ${new Date().toISOString()} - ${req.ip} - ${req.method} ${req.path} - ${message}`);
  };

  // Check for suspicious patterns in request body
  if (req.body) {
    const bodyString = JSON.stringify(req.body);
    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(bodyString)) {
        logSuspicious(`Suspicious pattern detected in body: ${pattern}`);
      }
    });
  }

  // Check for suspicious patterns in query parameters
  if (req.query) {
    const queryString = JSON.stringify(req.query);
    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(queryString)) {
        logSuspicious(`Suspicious pattern detected in query: ${pattern}`);
      }
    });
  }

  next();
};

// Input validation and sanitization
const validateInput = (req, res, next) => {
  // Basic email validation
  if (req.body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Password strength validation
  if (req.body.password && req.body.password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  // Username validation
  if (req.body.username && !/^[a-zA-Z0-9_]{3,20}$/.test(req.body.username)) {
    return res.status(400).json({ error: 'Username must be 3-20 characters, alphanumeric or underscore only' });
  }

  next();
};

module.exports = {
  generalLimiter,
  loginLimiter,
  securityLogger,
  validateInput,
  setupSecurity: (app) => {
    // Set security headers
    app.use(helmet());

    // Rate limiting
    app.use('/api/', generalLimiter);
    app.use('/api/auth/login', loginLimiter);

    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());

    // Data sanitization against XSS
    app.use(xss());

    // Prevent parameter pollution
    app.use(hpp());

    // Custom security logging
    app.use(securityLogger);

    // Input validation
    app.use(validateInput);
  }
};
