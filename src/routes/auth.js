import { Router } from 'express';
import { body } from 'express-validator';
import { auth, db, FieldValue } from '../config/firebaseAdmin.js';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate, signSession } from '../middleware/auth.js';
import { validate } from '../utils/validators.js';

const router = Router();

router.post('/session', body('idToken').isString().notEmpty(), validate, async (req, res, next) => {
  try {
    const decoded = await auth.verifyIdToken(req.body.idToken, true);
    const userRecord = await auth.getUser(decoded.uid);
    const ref = db.collection('users').doc(decoded.uid);
    const existing = await ref.get();
    const profile = {
      uid: decoded.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || req.body.displayName || '',
      photoURL: userRecord.photoURL || '',
      role: existing.exists ? existing.data().role : 'user',
      emailVerified: userRecord.emailVerified,
      updatedAt: FieldValue.serverTimestamp(),
      lastLoginAt: FieldValue.serverTimestamp()
    };
    if (!existing.exists) profile.createdAt = FieldValue.serverTimestamp();
    await ref.set(profile, { merge: true });
    res.json({ success: true, token: signSession(profile), user: profile });
  } catch (error) {
    next(new AppError('Unable to create session.', 401, error.message));
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    await auth.revokeRefreshTokens(req.user.uid);
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
