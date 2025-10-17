const { Lesson, Progress } = require('../models');

/**
 * Obtener todas las lecciones activas
 */
const getAllLessons = async (req, res, next) => {
  try {
    const { topic, difficulty_level, limit = 50, offset = 0 } = req.query;

    const where = { is_active: true };

    if (topic) {
      where.topic = topic;
    }

    if (difficulty_level) {
      where.difficulty_level = parseInt(difficulty_level);
    }

    const lessons = await Lesson.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['order_index', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: {
        lessons: lessons.rows,
        total: lessons.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener lección por ID
 */
const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lección no encontrada'
      });
    }

    // Si hay usuario autenticado, incluir su progreso
    let progress = null;
    if (req.user) {
      progress = await Progress.findOne({
        where: {
          user_id: req.user.id,
          lesson_id: id
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        lesson,
        progress
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear nueva lección (solo para administradores)
 */
const createLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Lección creada exitosamente',
      data: { lesson }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar lección
 */
const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lección no encontrada'
      });
    }

    await lesson.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Lección actualizada exitosamente',
      data: { lesson }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar lección (soft delete - marcar como inactiva)
 */
const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lección no encontrada'
      });
    }

    // Soft delete - marcar como inactiva
    await lesson.update({ is_active: false });

    res.status(200).json({
      success: true,
      message: 'Lección desactivada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
};
