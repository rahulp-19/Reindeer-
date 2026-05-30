import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import { db, FieldValue, storage } from '../config/firebaseAdmin.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { validate } from '../utils/validators.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 700 } });
router.use(authenticate, requireAdmin);

router.get('/stats', async (_req, res, next) => {
  try {
    const [users, videos, payments] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('videos').count().get(),
      db.collection('payments').orderBy('createdAt', 'desc').limit(50).get()
    ]);
    const revenue = payments.docs.reduce((sum, doc) => sum + Number(doc.data().amount || 0), 0);
    res.json({ success: true, stats: { users: users.data().count, videos: videos.data().count, recentRevenue: revenue, payments: payments.docs.map((doc) => ({ id: doc.id, ...doc.data() })) } });
  } catch (error) { next(error); }
});

router.post('/videos', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
  body('title').trim().isLength({ min: 2 }), body('category').trim().notEmpty(), validate, async (req, res, next) => {
  try {
    const bucket = storage.bucket();
    const basePath = `videos/${Date.now()}-${req.body.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
    let videoUrl = req.body.videoUrl;
    let thumbnail = req.body.thumbnail;

    if (req.files?.video?.[0]) {
      const file = bucket.file(`${basePath}/source.mp4`);
      await file.save(req.files.video[0].buffer, { contentType: req.files.video[0].mimetype, resumable: false });
      [videoUrl] = await file.getSignedUrl({ action: 'read', expires: '03-01-2035' });
    }
    if (req.files?.thumbnail?.[0]) {
      const file = bucket.file(`${basePath}/thumbnail.jpg`);
      await file.save(req.files.thumbnail[0].buffer, { contentType: req.files.thumbnail[0].mimetype, resumable: false });
      [thumbnail] = await file.getSignedUrl({ action: 'read', expires: '03-01-2035' });
    }

    const payload = {
      title: req.body.title,
      description: req.body.description || '',
      thumbnail,
      videoUrl,
      category: req.body.category,
      tags: (req.body.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
      uploadDate: FieldValue.serverTimestamp(),
      previewDuration: Number(req.body.previewDuration || process.env.DEFAULT_PREVIEW_SECONDS || 90),
      premiumOnly: req.body.premiumOnly === 'true' || req.body.premiumOnly === true,
      status: req.body.status || 'published'
    };
    const doc = await db.collection('videos').add(payload);
    res.status(201).json({ success: true, id: doc.id, video: payload });
  } catch (error) { next(error); }
});

router.put('/videos/:id', async (req, res, next) => {
  try {
    await db.collection('videos').doc(req.params.id).set({ ...req.body, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.delete('/videos/:id', async (req, res, next) => {
  try {
    await db.collection('videos').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) { next(error); }
});

router.post('/categories', async (req, res, next) => {
  try { const doc = await db.collection('categories').add({ ...req.body, enabled: req.body.enabled !== false, createdAt: FieldValue.serverTimestamp() }); res.status(201).json({ success: true, id: doc.id }); } catch (error) { next(error); }
});

router.post('/plans', async (req, res, next) => {
  try { const doc = await db.collection('subscriptions').add({ ...req.body, type: 'plan', updatedAt: FieldValue.serverTimestamp() }); res.status(201).json({ success: true, id: doc.id }); } catch (error) { next(error); }
});

router.post('/announcements', async (req, res, next) => {
  try { const doc = await db.collection('announcements').add({ ...req.body, active: req.body.active !== false, createdAt: FieldValue.serverTimestamp() }); res.status(201).json({ success: true, id: doc.id }); } catch (error) { next(error); }
});

router.get('/users', async (_req, res, next) => {
  try { const snap = await db.collection('users').orderBy('createdAt', 'desc').limit(100).get(); res.json({ success: true, users: snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) }); } catch (error) { next(error); }
});

router.patch('/users/:id/role', body('role').isIn(['admin', 'user']), validate, async (req, res, next) => {
  try { await db.collection('users').doc(req.params.id).set({ role: req.body.role, updatedAt: FieldValue.serverTimestamp() }, { merge: true }); res.json({ success: true }); } catch (error) { next(error); }
});

router.use((_req, _res, next) => next(new AppError('Admin route not found.', 404)));
export default router;
