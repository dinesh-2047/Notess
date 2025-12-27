import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err instanceof ApiError && err.statusCode ? err.statusCode : err.statusCode || 500;
  const responsePayload = {
    success: false,
    message: err.message || 'Something went wrong',
    errors: err.errors || [],
  };

  if (env.nodeEnv !== 'production' && err.stack) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};
