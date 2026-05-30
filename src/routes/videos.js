import { Router } from 'express';
import { body, query } from 'express-validator';
import { db, FieldValue } from '../config/firebaseAdmin.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { isSubscriber, validate } from '../utils/validators.js';

const router = Router();

router.get('/', query('q').optional().trim(), query('category').optional().trim(), async (req, res, next) => {
  try {
    let ref = db.collection('videos').where('status', '==', 'published').orderBy('uploadDate', 'desc').limit(40);
    if (req.query.category) ref = db.collection('videos').where('status', '==', 'published').where('category', '==', req.query.category).limit(40);
    const snap = await ref.get();
    let videos = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (req.query.q) {
      const term = req.query.q.toLowerCase();
      videos = videos.filter((video) => [video.title, video.description, ...(video.tags || [])].join(' ').toLowerCase().includes(term));
    }
    res.json({ success: true, videos });
  } catch (error) {
    next(error);
  }
});

router.get('/suggestions', query('q').trim().notEmpty(), validate, async (req, res, next) => {
  try {
    const term = req.query.q.toLowerCase();
    const snap = await db.collection('videos').where('status', '==', 'published').limit(25).get();
    const suggestions = snap.docs
      .map((doc) => ({ id: doc.id, title: doc.data().title, category: doc.data().category }))
      .filter((video) => video.title.toLowerCase().includes(term))
      .slice(0, 8);
    res.json({ success: true, suggestions });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const doc = await db.collection('videos').doc(req.params.id).get();
    if (!doc.exists) throw new AppError('Video not found.', 404);
    res.json({ success: true, video: { id: doc.id, ...doc.data() } });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/history', authenticate, body('progress').isFloat({ min: 0 }), validate, async (req, res, next) => {
  try {
    await db.collection('users').doc(req.user.uid).collection('watchHistory').doc(req.params.id).set({
      videoId: req.params.id,
      progress: Number(req.body.progress),
      watchedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/stream-token', authenticate, async (req, res, next) => {
  try {
    const video = await db.collection('videos').doc(req.params.id).get();
    if (!video.exists) throw new AppError('Video not found.', 404);
    const data = video.data();
    const premiumRequired = Boolean(data.premiumOnly);
    const allowed = !premiumRequired || isSubscriber(req.user);
    res.json({
      success: true,
      allowed,
      previewDuration: allowed ? null : Number(data.previewDuration || process.env.DEFAULT_PREVIEW_SECONDS || 90),
      streamUrl: data.videoUrl,
      reason: allowed ? 'subscriber_or_free' : 'preview_only'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
