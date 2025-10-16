const express = require('express');
const Problem = require('../models/Problem');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');
const { generateProblem, getAdaptiveDifficulty, calculateSuccessRate } = require('../utils/mathUtils');

const router = express.Router();

// Get a new problem for the user
router.get('/generate', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Calculate success rate and adaptive difficulty
    const successRate = await calculateSuccessRate(userId);
    const adaptiveDifficulty = getAdaptiveDifficulty(req.user.level, successRate);

    // Generate problem
    const problemData = generateProblem(adaptiveDifficulty);

    // Save problem to database
    const problem = new Problem(problemData);
    await problem.save();

    res.json({
      problem: {
        id: problem._id,
        problemText: problem.problemText,
        operation: problem.operation,
        difficulty: problem.difficulty
      }
    });
  } catch (error) {
    console.error('Problem generation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit answer for a problem
router.post('/:id/answer', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, timeTaken } = req.body;

    if (typeof answer !== 'number' || typeof timeTaken !== 'number') {
      return res.status(400).json({ error: 'Invalid answer or time taken' });
    }

    // Find the problem
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Check if user already answered this problem
    const existingProgress = await Progress.findOne({
      user: req.user._id,
      problem: id
    });

    if (existingProgress) {
      return res.status(400).json({ error: 'Problem already answered' });
    }

    // Validate answer
    const isCorrect = answer === problem.answer;

    // Save progress
    const progress = new Progress({
      user: req.user._id,
      problem: id,
      userAnswer: answer,
      isCorrect,
      timeTaken
    });

    await progress.save();

    // Update user level if needed (simple logic: promote after 5 consecutive correct answers)
    if (isCorrect) {
      const recentProgress = await Progress.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5);

      const allCorrect = recentProgress.every(p => p.isCorrect);
      if (allCorrect && recentProgress.length === 5) {
        const newLevel = getAdaptiveDifficulty(req.user.level, 1.0);
        if (newLevel !== req.user.level) {
          req.user.level = newLevel;
          await req.user.save();
        }
      }
    }

    res.json({
      isCorrect,
      correctAnswer: problem.answer,
      userLevel: req.user.level,
      message: isCorrect ? 'Correct!' : 'Incorrect, try again!'
    });
  } catch (error) {
    console.error('Answer submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get problem history for user
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const progress = await Progress.find({ user: req.user._id })
      .populate('problem')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Progress.countDocuments({ user: req.user._id });

    res.json({
      problems: progress.map(p => ({
        id: p._id,
        problemText: p.problem.problemText,
        operation: p.problem.operation,
        difficulty: p.problem.difficulty,
        userAnswer: p.userAnswer,
        correctAnswer: p.problem.answer,
        isCorrect: p.isCorrect,
        timeTaken: p.timeTaken,
        createdAt: p.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const totalProblems = await Progress.countDocuments({ user: userId });
    const correctAnswers = await Progress.countDocuments({ user: userId, isCorrect: true });
    const successRate = totalProblems > 0 ? (correctAnswers / totalProblems) * 100 : 0;

    // Average time per problem
    const progressWithTime = await Progress.find({ user: userId });
    const totalTime = progressWithTime.reduce((sum, p) => sum + p.timeTaken, 0);
    const averageTime = totalProblems > 0 ? totalTime / totalProblems : 0;

    // Problems by operation
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

    res.json({
      totalProblems,
      correctAnswers,
      successRate: Math.round(successRate * 100) / 100,
      averageTime: Math.round(averageTime * 100) / 100,
      operationStats: operationStats.map(stat => ({
        operation: stat._id,
        total: stat.total,
        correct: stat.correct,
        successRate: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
      })),
      currentLevel: req.user.level
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
