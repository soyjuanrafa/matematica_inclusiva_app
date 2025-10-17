const express = require('express');
const router = express.Router();
const {
  getUserProgress,
  createOrUpdateProgress,
  getLessonProgress
} = require('../controllers/progressController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { validate, validateParams } = require('../middleware/validationMiddleware');
const { 
  createProgressSchema, 
  lessonIdParamSchema 
} = require('../validators/progressValidator');

/**
 * @route   GET /api/progress
 * @desc    Obtener todo el progreso del usuario autenticado
 * @access  Private
 */
router.get('/', authMiddleware, getUserProgress);

/**
 * @route   POST /api/progress
 * @desc    Crear o actualizar progreso de una lección
 * @access  Private
 */
router.post('/', authMiddleware, validate(createProgressSchema), createOrUpdateProgress);

/**
 * @route   GET /api/progress/lesson/:lessonId
 * @desc    Obtener progreso de una lección específica
 * @access  Private
 */
router.get(
  '/lesson/:lessonId',
  authMiddleware,
  validateParams(lessonIdParamSchema),
  getLessonProgress
);

module.exports = router;
