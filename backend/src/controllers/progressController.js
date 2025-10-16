const { Progress, Lesson, User, Reward, UserReward } = require('../models');
const { checkRewardEligibility } = require('../services/rewardService');

/**
 * Obtener progreso del usuario autenticado
 */
const getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const progress = await Progress.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'topic', 'difficulty_level', 'thumbnail_url']
        }
      ],
      order: [['updated_at', 'DESC']]
    });

    // Calcular estadísticas
    const stats = {
      total_lessons_attempted: progress.length,
      lessons_completed: progress.filter(p => p.completed).length,
      average_score: progress.length > 0 
        ? Math.round(progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length)
        : 0,
      total_time_spent: progress.reduce((sum, p) => sum + (p.time_spent || 0), 0)
    };

    res.status(200).json({
      success: true,
      data: {
        progress,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear o actualizar progreso de una lección
 */
const createOrUpdateProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { lesson_id, score, time_spent } = req.body;

    // Verificar que la lección existe
    const lesson = await Lesson.findByPk(lesson_id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lección no encontrada'
      });
    }

    // Buscar progreso existente
    let progress = await Progress.findOne({
      where: {
        user_id: userId,
        lesson_id
      }
    });

    const completed = score >= 70; // 70% o más se considera completado

    if (progress) {
      // Actualizar progreso existente
      progress.score = Math.max(progress.score || 0, score); // Mantener el mejor score
      progress.attempts += 1;
      progress.time_spent = (progress.time_spent || 0) + (time_spent || 0);
      progress.completed = completed;
      
      if (completed && !progress.completed_at) {
        progress.completed_at = new Date();
      }

      await progress.save();
    } else {
      // Crear nuevo progreso
      progress = await Progress.create({
        user_id: userId,
        lesson_id,
        score,
        attempts: 1,
        time_spent: time_spent || 0,
        completed,
        completed_at: completed ? new Date() : null
      });
    }

    // Verificar si el usuario ganó alguna recompensa
    const newRewards = await checkRewardEligibility(userId);

    res.status(progress.attempts === 1 ? 201 : 200).json({
      success: true,
      message: progress.attempts === 1 ? 'Progreso creado' : 'Progreso actualizado',
      data: {
        progress,
        newRewards
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener progreso de una lección específica
 */
const getLessonProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.params;

    const progress = await Progress.findOne({
      where: {
        user_id: userId,
        lesson_id: lessonId
      },
      include: [
        {
          model: Lesson,
          as: 'lesson'
        }
      ]
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró progreso para esta lección'
      });
    }

    res.status(200).json({
      success: true,
      data: { progress }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProgress,
  createOrUpdateProgress,
  getLessonProgress
};
