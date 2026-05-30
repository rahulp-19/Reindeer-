import { Router } from 'express';
import { db } from '../config/firebaseAdmin.js';
const router = Router();
router.get('/', async (_req, res, next) => {
  try {
    const snap = await db.collection('subscriptions').where('type', '==', 'plan').orderBy('sortOrder').get();
    const plans = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((plan) => plan.enabled !== false);
    res.json({ success: true, plans });
  } catch (error) { next(error); }
});
export default router;
