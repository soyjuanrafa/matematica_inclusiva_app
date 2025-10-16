const express = require('express');
const router = express.Router();
const {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/lessons
 * @desc    Obtener todas las lecciones activas
 * @access  Public (con auth opcional para incluir progreso)
 */
router.get('/', optionalAuth, getAllLessons);

/**
 * @route   GET /api/lessons/:id
 * @desc    Obtener lección por ID
 * @access  Public (con auth opcional para incluir progreso)
 */
router.get('/:id', optionalAuth, getLessonById);

/**
 * @route   POST /api/lessons
 * @desc    Crear nueva lección
 * @access  Private (Admin - TODO: agregar middleware de rol)
 */
router.post('/', authMiddleware, createLesson);

/**
 * @route   PUT /api/lessons/:id
 * @desc    Actualizar lección
 * @access  Private (Admin - TODO: agregar middleware de rol)
 */
router.put('/:id', authMiddleware, updateLesson);

/**
 * @route   DELETE /api/lessons/:id
 * @desc    Eliminar (desactivar) lección
 * @access  Private (Admin - TODO: agregar middleware de rol)
 */
router.delete('/:id', authMiddleware, deleteLesson);

module.exports = router;
