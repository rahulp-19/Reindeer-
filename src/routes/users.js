import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { db } from '../config/firebaseAdmin.js';
const router = Router();
router.get('/dashboard', authenticate, async (req, res, next) => {
  try {
    const history = await db.collection('users').doc(req.user.uid).collection('watchHistory').orderBy('watchedAt', 'desc').limit(12).get();
    res.json({
      success: true,
      profile: req.user,
      watchHistory: history.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    });
  } catch (error) { next(error); }
});
export default router;
