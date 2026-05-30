import { validationResult } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';

export function validate(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed.', 422, errors.array()));
  }
  next();
}

export function isSubscriber(user) {
  const expiresAt = user?.subscription?.expiresAt?.toDate?.() || (user?.subscription?.expiresAt ? new Date(user.subscription.expiresAt) : null);
  return user?.subscription?.status === 'active' && expiresAt && expiresAt.getTime() > Date.now();
}

export function cents(amount) {
  return Math.round(Number(amount || 0) * 100);
}
