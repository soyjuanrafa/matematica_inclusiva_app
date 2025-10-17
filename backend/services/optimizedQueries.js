const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL

class OptimizedQueries {
  constructor(db) {
    this.db = db;
  }

  // Cached user statistics
  async getUserStats(userId) {
    const cacheKey = `user_stats_${userId}`;
    let stats = cache.get(cacheKey);

    if (!stats) {
      const query = `
        SELECT
          u.username,
          u.email,
          u.created_at,
          COUNT(l.id) as lessons_completed,
          SUM(l.points) as total_points,
          MAX(l.completed_at) as last_activity,
          AVG(l.score) as average_score,
          COUNT(CASE WHEN l.completed_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as weekly_lessons
        FROM users u
        LEFT JOIN lesson_progress l ON u.id = l.user_id
        WHERE u.id = $1
        GROUP BY u.id, u.username, u.email, u.created_at
      `;

      const result = await this.db.query(query, [userId]);
      stats = result.rows[0];
      cache.set(cacheKey, stats);
    }

    return stats;
  }

  // Paginated leaderboard with caching
  async getLeaderboard(page = 1, limit = 10) {
    const cacheKey = `leaderboard_${page}_${limit}`;
    let leaderboard = cache.get(cacheKey);

    if (!leaderboard) {
      const offset = (page - 1) * limit;
      const query = `
        SELECT
          u.username,
          SUM(lp.points) as total_points,
          COUNT(lp.id) as lessons_completed,
          RANK() OVER (ORDER BY SUM(lp.points) DESC) as rank
        FROM users u
        LEFT JOIN lesson_progress lp ON u.id = lp.user_id
        GROUP BY u.id, u.username
        ORDER BY total_points DESC
        LIMIT $1 OFFSET $2
      `;

      const result = await this.db.query(query, [limit, offset]);
      leaderboard = result.rows;
      cache.set(cacheKey, leaderboard);
    }

    return leaderboard;
  }

  // Optimized streak calculation
  async getUserStreak(userId) {
    const cacheKey = `streak_${userId}`;
    let streak = cache.get(cacheKey);

    if (!streak) {
      const query = `
        WITH daily_progress AS (
          SELECT
            DATE(completed_at) as completion_date,
            ROW_NUMBER() OVER (ORDER BY DATE(completed_at) DESC) as day_rank
          FROM lesson_progress
          WHERE user_id = $1 AND completed_at IS NOT NULL
          GROUP BY DATE(completed_at)
          ORDER BY completion_date DESC
        ),
        streak_calc AS (
          SELECT
            completion_date,
            day_rank,
            completion_date - INTERVAL '1 day' * (day_rank - 1) as expected_date
          FROM daily_progress
        )
        SELECT COUNT(*) as current_streak
        FROM streak_calc
        WHERE completion_date = expected_date
          AND completion_date >= CURRENT_DATE - INTERVAL '30 days'
      `;

      const result = await this.db.query(query, [userId]);
      streak = result.rows[0].current_streak;
      cache.set(cacheKey, streak);
    }

    return streak;
  }

  // Full-text search for lessons
  async searchLessons(searchTerm, page = 1, limit = 20) {
    const cacheKey = `search_${searchTerm}_${page}_${limit}`;
    let results = cache.get(cacheKey);

    if (!results) {
      const offset = (page - 1) * limit;
      const query = `
        SELECT
          l.id,
          l.title,
          l.description,
          l.category,
          l.difficulty,
          l.points,
          ts_rank_cd(to_tsvector('spanish', l.title || ' ' || l.description), plainto_tsquery('spanish', $1)) as relevance
        FROM lessons l
        WHERE to_tsvector('spanish', l.title || ' ' || l.description) @@ plainto_tsquery('spanish', $1)
        ORDER BY relevance DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await this.db.query(query, [searchTerm, limit, offset]);
      results = result.rows;
      cache.set(cacheKey, results);
    }

    return results;
  }

  // Batch insert for lesson progress (for bulk operations)
  async batchInsertProgress(progressData) {
    const query = `
      INSERT INTO lesson_progress (user_id, lesson_id, score, points, completed_at)
      VALUES ${progressData.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(', ')}
      ON CONFLICT (user_id, lesson_id) DO UPDATE SET
        score = EXCLUDED.score,
        points = EXCLUDED.points,
        completed_at = EXCLUDED.completed_at
    `;

    const values = progressData.flatMap(item => [
      item.userId,
      item.lessonId,
      item.score,
      item.points,
      item.completedAt
    ]);

    await this.db.query(query, values);

    // Invalidate related caches
    progressData.forEach(item => {
      cache.del(`user_stats_${item.userId}`);
      cache.del(`streak_${item.userId}`);
    });
  }

  // Get user achievements with pagination
  async getUserAchievements(userId, page = 1, limit = 10) {
    const cacheKey = `achievements_${userId}_${page}_${limit}`;
    let achievements = cache.get(cacheKey);

    if (!achievements) {
      const offset = (page - 1) * limit;
      const query = `
        SELECT
          a.id,
          a.name,
          a.description,
          a.icon,
          a.points,
          ua.unlocked_at
        FROM achievements a
        JOIN user_achievements ua ON a.id = ua.achievement_id
        WHERE ua.user_id = $1
        ORDER BY ua.unlocked_at DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await this.db.query(query, [userId, limit, offset]);
      achievements = result.rows;
      cache.set(cacheKey, achievements);
    }

    return achievements;
  }

  // Clear cache for a specific user (useful after updates)
  clearUserCache(userId) {
    const keys = cache.keys();
    keys.forEach(key => {
      if (key.includes(`_${userId}`) || key.includes(`_${userId}_`)) {
        cache.del(key);
      }
    });
  }

  // Get cache stats
  getCacheStats() {
    return {
      keys: cache.keys().length,
      hits: cache.getStats().hits,
      misses: cache.getStats().misses,
      hitRate: cache.getStats().hits / (cache.getStats().hits + cache.getStats().misses) * 100
    };
  }
}

module.exports = OptimizedQueries;
