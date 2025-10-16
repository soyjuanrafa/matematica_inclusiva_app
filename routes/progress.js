const express = require('express');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user progress summary
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total progress count
    const totalProgress = await Progress.countDocuments({ user: userId });

    // Get success rate
    const correctProgress = await Progress.countDocuments({ user: userId, isCorrect: true });
    const successRate = totalProgress > 0 ? (correctProgress / totalProgress) * 100 : 0;

    // Get recent progress (last 10)
    const recentProgress = await Progress.find({ user: userId })
      .populate('problem')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get progress by difficulty
    const difficultyStats = await Progress.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: 'problems',
          localField: 'problem',
          foreignField: '_id',
          as: 'problem'
        }
      },
      { $unwind: '$problem' },
      {
        $group: {
          _id: '$problem.difficulty',
          total: { $sum: 1 },
          correct: { $sum: { $cond: ['$isCorrect', 1, 0] } }
        }
      }
    ]);

    // Get progress by operation
    const operationStats = await Progress.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: 'problems',
          localField: 'problem',
          foreignField: '_id',
          as: 'problem'
        }
      },
      { $unwind: '$problem' },
      {
        $group: {
          _id: '$problem.operation',
          total: { $sum: 1 },
          correct: { $sum: { $cond: ['$isCorrect', 1, 0] } }
        }
      }
    ]);

    // Calculate streaks
    const allProgress = await Progress.find({ user: userId })
      .sort({ createdAt: 1 });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (const p of allProgress) {
      if (p.isCorrect) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Current streak (from the end)
    for (let i = allProgress.length - 1; i >= 0; i--) {
      if (allProgress[i].isCorrect) {
        currentStreak++;
      } else {
        break;
      }
    }

    res.json({
      summary: {
        totalProblems: totalProgress,
        correctAnswers: correctProgress,
        successRate: Math.round(successRate * 100) / 100,
        currentStreak,
        longestStreak
      },
      recentProgress: recentProgress.map(p => ({
        id: p._id,
        problemText: p.problem.problemText,
        operation: p.problem.operation,
        difficulty: p.problem.difficulty,
        isCorrect: p.isCorrect,
        timeTaken: p.timeTaken,
        createdAt: p.createdAt
      })),
      difficultyStats: difficultyStats.map(stat => ({
        difficulty: stat._id,
        total: stat.total,
        correct: stat.correct,
        successRate: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
      })),
      operationStats: operationStats.map(stat => ({
        operation: stat._id,
        total: stat.total,
        correct: stat.correct,
        successRate: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
      }))
    });
  } catch (error) {
    console.error('Progress summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get progress timeline (daily stats)
router.get('/timeline', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const timeline = await Progress.aggregate([
      { $match: { user: userId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          total: { $sum: 1 },
          correct: { $sum: { $cond: ['$isCorrect', 1, 0] } },
          totalTime: { $sum: '$timeTaken' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      timeline: timeline.map(day => ({
        date: day._id,
        totalProblems: day.total,
        correctAnswers: day.correct,
        successRate: day.total > 0 ? Math.round((day.correct / day.total) * 100) : 0,
        averageTime: day.total > 0 ? Math.round((day.totalTime / day.total) * 100) / 100 : 0
      }))
    });
  } catch (error) {
    console.error('Progress timeline error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete progress entry (for testing/admin purposes)
router.delete('/:id', auth, async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!progress) {
      return res.status(404).json({ error: 'Progress entry not found' });
    }

    res.json({ message: 'Progress entry deleted successfully' });
  } catch (error) {
    console.error('Delete progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
