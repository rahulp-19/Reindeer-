import jwt from 'jsonwebtoken';
import { auth, db } from '../config/firebaseAdmin.js';
import { AppError } from './errorHandler.js';

export function signSession(user) {
  return jwt.sign(
    {
      uid: user.uid,
      email: user.email,
      role: user.role || 'user',
      emailVerified: Boolean(user.emailVerified)
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d', issuer: 'streamvault-api' }
  );
}

async function hydrateUser(uid, decoded = {}) {
  const userDoc = await db.collection('users').doc(uid).get();
  const user = userDoc.exists ? userDoc.data() : {};
  return {
    uid,
    email: decoded.email || user.email,
    role: user.role || decoded.role || 'user',
    emailVerified: decoded.email_verified ?? decoded.emailVerified ?? user.emailVerified ?? false,
    subscription: user.subscription || null
  };
}

export async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new AppError('Authentication token required.', 401);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'streamvault-api' });
      req.user = await hydrateUser(decoded.uid, decoded);
      return next();
    } catch (_jwtError) {
      const firebaseDecoded = await auth.verifyIdToken(token, true);
      req.user = await hydrateUser(firebaseDecoded.uid, firebaseDecoded);
      return next();
    }
  } catch (error) {
    next(error.statusCode ? error : new AppError('Invalid or expired authentication token.', 401));
  }
}

export function requireAdmin(req, _res, next) {
  if (req.user?.role !== 'admin') return next(new AppError('Admin privileges required.', 403));
  next();
}

export function requireVerifiedEmail(req, _res, next) {
  if (!req.user?.emailVerified) return next(new AppError('Email verification required.', 403));
  next();
}
