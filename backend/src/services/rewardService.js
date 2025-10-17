const { Reward, UserReward, Progress, sequelize } = require('../models');

/**
 * Verificar si el usuario es elegible para nuevas recompensas
 * @param {number} userId - ID del usuario
 * @returns {Array} - Array de recompensas nuevas ganadas
 */
const checkRewardEligibility = async (userId) => {
  try {
    const newRewards = [];

    // Obtener todas las recompensas disponibles
    const allRewards = await Reward.findAll();

    // Obtener recompensas ya ganadas por el usuario
    const earnedRewards = await UserReward.findAll({
      where: { user_id: userId },
      attributes: ['reward_id']
    });

    const earnedRewardIds = earnedRewards.map(ur => ur.reward_id);

    // Obtener estadísticas del usuario
    const progress = await Progress.findAll({
      where: { user_id: userId }
    });

    const stats = {
      totalLessons: progress.length,
      completedLessons: progress.filter(p => p.completed).length,
      perfectScores: progress.filter(p => p.score === 100).length,
      totalScore: progress.reduce((sum, p) => sum + (p.score || 0), 0)
    };

    // Verificar cada recompensa no ganada
    for (const reward of allRewards) {
      // Si ya la ganó, skip
      if (earnedRewardIds.includes(reward.id)) {
        continue;
      }

      // Verificar elegibilidad según puntos
      if (stats.totalScore >= reward.points_required) {
        // Otorgar recompensa
        await UserReward.create({
          user_id: userId,
          reward_id: reward.id,
          earned_at: new Date()
        });

        newRewards.push(reward);
      }
    }

    return newRewards;
  } catch (error) {
    console.error('Error checking reward eligibility:', error);
    return [];
  }
};

/**
 * Obtener todas las recompensas de un usuario
 */
const getUserRewards = async (userId) => {
  try {
    const userRewards = await UserReward.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Reward,
          as: 'reward'
        }
      ],
      order: [['earned_at', 'DESC']]
    });

    return userRewards;
  } catch (error) {
    console.error('Error getting user rewards:', error);
    throw error;
  }
};

/**
 * Obtener leaderboard de usuarios
 */
const getLeaderboard = async (limit = 10) => {
  try {
    const leaderboard = await sequelize.query(`
      SELECT 
        u.id,
        u.name,
        u.avatar_url,
        COUNT(p.id) FILTER (WHERE p.completed = TRUE) as lessons_completed,
        ROUND(AVG(p.score) FILTER (WHERE p.completed = TRUE))::integer as avg_score,
        COUNT(ur.id) as rewards_count
      FROM users u
      LEFT JOIN progress p ON u.id = p.user_id
      LEFT JOIN user_rewards ur ON u.id = ur.user_id
      GROUP BY u.id, u.name, u.avatar_url
      HAVING COUNT(p.id) FILTER (WHERE p.completed = TRUE) > 0
      ORDER BY lessons_completed DESC, avg_score DESC
      LIMIT $1
    `, {
      bind: [limit],
      type: sequelize.QueryTypes.SELECT
    });

    return leaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

module.exports = {
  checkRewardEligibility,
  getUserRewards,
  getLeaderboard
};
