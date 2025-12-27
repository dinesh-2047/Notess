import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (schema, source = 'body') => (req, res, next) => {
  const payload = req[source];
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    const formattedErrors = parsed.error.errors.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return next(new ApiError(422, 'Validation failed', formattedErrors));
  }

  const target = req[source];
  // Express 5 request properties like query are getter-only; mutate the existing object instead of reassigning
  if (target && typeof target === 'object') {
    Object.keys(target).forEach((key) => delete target[key]);
    Object.assign(target, parsed.data);
  } else {
    req[source] = parsed.data;
  }
  return next();
};
