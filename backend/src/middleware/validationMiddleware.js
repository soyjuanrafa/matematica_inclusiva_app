/**
 * Middleware para validar request body usando schemas de Joi
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Retornar todos los errores, no solo el primero
      stripUnknown: true  // Eliminar campos no definidos en schema
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      });
    }

    // Reemplazar req.body con el valor validado y sanitizado
    req.body = value;
    next();
  };
};

/**
 * Middleware para validar query parameters
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación en query parameters',
        errors
      });
    }

    req.query = value;
    next();
  };
};

/**
 * Middleware para validar params de ruta
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación en parámetros de ruta',
        errors
      });
    }

    req.params = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams
};
