const Problem = require('../models/Problem');

// Difficulty ranges for numbers
const DIFFICULTY_RANGES = {
  beginner: { min: 1, max: 10 },
  intermediate: { min: 10, max: 50 },
  advanced: { min: 50, max: 100 }
};

// Operations and their functions
const OPERATIONS = {
  addition: (a, b) => a + b,
  subtraction: (a, b) => a - b,
  multiplication: (a, b) => a * b,
  division: (a, b) => a / b
};

// Generate a random number within range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a math problem
function generateProblem(difficulty = 'beginner', operation = null) {
  const range = DIFFICULTY_RANGES[difficulty];
  if (!range) throw new Error('Invalid difficulty level');

  // Select random operation if not specified
  const operations = operation ? [operation] : Object.keys(OPERATIONS);
  const selectedOperation = operations[Math.floor(Math.random() * operations.length)];

  let num1, num2, answer;

  do {
    num1 = getRandomNumber(range.min, range.max);
    num2 = getRandomNumber(range.min, range.max);

    // Ensure positive results for subtraction and valid division
    if (selectedOperation === 'subtraction') {
      if (num1 < num2) [num1, num2] = [num2, num1]; // Swap to ensure positive result
    } else if (selectedOperation === 'division') {
      num2 = getRandomNumber(1, range.max); // Avoid division by zero
      num1 = num2 * getRandomNumber(1, Math.floor(range.max / num2)); // Ensure integer result
    }

    answer = OPERATIONS[selectedOperation](num1, num2);
  } while (!Number.isInteger(answer) || answer < 0); // Ensure integer positive results

  return {
    operation: selectedOperation,
    difficulty,
    num1,
    num2,
    answer
  };
}

// Get adaptive difficulty based on user performance
function getAdaptiveDifficulty(userLevel, successRate) {
  if (successRate >= 0.8) {
    // High success rate, increase difficulty
    if (userLevel === 'beginner') return 'intermediate';
    if (userLevel === 'intermediate') return 'advanced';
    return 'advanced';
  } else if (successRate <= 0.5) {
    // Low success rate, decrease difficulty
    if (userLevel === 'advanced') return 'intermediate';
    if (userLevel === 'intermediate') return 'beginner';
    return 'beginner';
  }
  return userLevel;
}

// Calculate success rate from recent progress
async function calculateSuccessRate(userId, limit = 10) {
  const Progress = require('../models/Progress');

  const recentProgress = await Progress.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  if (recentProgress.length === 0) return 0;

  const correctAnswers = recentProgress.filter(p => p.isCorrect).length;
  return correctAnswers / recentProgress.length;
}

module.exports = {
  generateProblem,
  getAdaptiveDifficulty,
  calculateSuccessRate,
  DIFFICULTY_RANGES,
  OPERATIONS
};
