const logger = require('../utils/logger');

const errorHandler = (error, req, res, next) => {
  logger.error(`Error: ${error.message}`);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;