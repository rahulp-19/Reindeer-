import { Router } from 'express';
import { db } from '../config/firebaseAdmin.js';
const router = Router();
router.get('/', async (_req, res, next) => {
  try {
    const snap = await db.collection('categories').where('enabled', '==', true).orderBy('name').get();
    res.json({ success: true, categories: snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
  } catch (error) { next(error); }
});
export default router;
