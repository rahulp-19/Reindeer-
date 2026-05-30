import { Router } from 'express';
import { db } from '../config/firebaseAdmin.js';
const router = Router();
router.get('/', async (_req, res, next) => {
  try {
    const snap = await db.collection('announcements').where('active', '==', true).orderBy('createdAt', 'desc').limit(10).get();
    res.json({ success: true, announcements: snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
  } catch (error) { next(error); }
});
export default router;
