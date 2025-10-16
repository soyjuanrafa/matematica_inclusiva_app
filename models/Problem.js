const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  operation: {
    type: String,
    required: true,
    enum: ['addition', 'subtraction', 'multiplication', 'division']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  num1: {
    type: Number,
    required: true
  },
  num2: {
    type: Number,
    required: true
  },
  answer: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for problem text
problemSchema.virtual('problemText').get(function() {
  const symbols = {
    addition: '+',
    subtraction: '-',
    multiplication: '×',
    division: '÷'
  };
  return `${this.num1} ${symbols[this.operation]} ${this.num2}`;
});

// Ensure virtual fields are serialized
problemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Problem', problemSchema);
