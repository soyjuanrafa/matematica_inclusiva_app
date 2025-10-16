const Joi = require('joi');

const createProgressSchema = Joi.object({
  lesson_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID de lección debe ser un número',
      'number.positive': 'El ID de lección debe ser positivo',
      'any.required': 'El ID de lección es requerido'
    }),
  
  score: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .required()
    .messages({
      'number.min': 'El puntaje mínimo es 0',
      'number.max': 'El puntaje máximo es 100',
      'any.required': 'El puntaje es requerido'
    }),
  
  time_spent: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.min': 'El tiempo debe ser positivo'
    })
});

const lessonIdParamSchema = Joi.object({
  lessonId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID de lección debe ser un número',
      'number.positive': 'El ID de lección debe ser positivo',
      'any.required': 'El ID de lección es requerido'
    })
});

module.exports = {
  createProgressSchema,
  lessonIdParamSchema
};
