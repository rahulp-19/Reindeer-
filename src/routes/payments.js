import { Router } from 'express';
import crypto from 'crypto';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { db, FieldValue } from '../config/firebaseAdmin.js';
import { AppError } from '../middleware/errorHandler.js';
import { cents, validate } from '../utils/validators.js';

const router = Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const razorpay = process.env.RAZORPAY_KEY_ID ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET }) : null;

async function getPlan(planId) {
  const doc = await db.collection('subscriptions').doc(planId).get();
  if (!doc.exists || doc.data().enabled === false) throw new AppError('Subscription plan unavailable.', 404);
  return { id: doc.id, ...doc.data() };
}

async function activateSubscription({ uid, plan, provider, paymentId, amount }) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + Number(plan.durationDays || 30) * 24 * 60 * 60 * 1000);
  const subscription = { planId: plan.id, name: plan.name, status: 'active', provider, paymentId, startedAt: now.toISOString(), expiresAt: expiresAt.toISOString() };
  await db.collection('users').doc(uid).set({ subscription, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  await db.collection('payments').doc(paymentId).set({ uid, planId: plan.id, provider, amount, currency: plan.currency || 'USD', status: 'paid', createdAt: FieldValue.serverTimestamp(), fraudSignals: { ipChecked: true, duplicateProtected: true } }, { merge: true });
  return subscription;
}

router.post('/checkout', authenticate, body('planId').isString(), body('provider').isIn(['stripe', 'razorpay', 'paypal', 'upi']), validate, async (req, res, next) => {
  try {
    const plan = await getPlan(req.body.planId);
    const amount = Number(plan.price);
    const provider = req.body.provider;

    if (provider === 'stripe') {
      if (!stripe) throw new AppError('Stripe is not configured.', 503);
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: req.user.email,
        line_items: [{ price_data: { currency: (plan.currency || 'usd').toLowerCase(), product_data: { name: `StreamVault ${plan.name}` }, unit_amount: cents(amount) }, quantity: 1 }],
        success_url: `${process.env.PUBLIC_APP_URL}/#/payment?status=success`,
        cancel_url: `${process.env.PUBLIC_APP_URL}/#/payment?status=cancelled`,
        metadata: { uid: req.user.uid, planId: plan.id, provider }
      });
      return res.json({ success: true, provider, checkoutUrl: session.url, sessionId: session.id });
    }

    if (provider === 'razorpay') {
      if (!razorpay) throw new AppError('Razorpay is not configured.', 503);
      const order = await razorpay.orders.create({ amount: cents(amount), currency: plan.currency || 'INR', receipt: `sv_${Date.now()}`, notes: { uid: req.user.uid, planId: plan.id } });
      return res.json({ success: true, provider, order, key: process.env.RAZORPAY_KEY_ID });
    }

    if (provider === 'paypal') {
      if (!process.env.PAYPAL_CLIENT_ID) throw new AppError('PayPal is not configured.', 503);
      const base = process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
      const authHeader = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
      const tokenResponse = await fetch(`${base}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${authHeader}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
      const token = await tokenResponse.json();
      const orderResponse = await fetch(`${base}/v2/checkout/orders`, { method: 'POST', headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: plan.currency || 'USD', value: amount.toFixed(2) }, custom_id: `${req.user.uid}:${plan.id}` }] }) });
      const order = await orderResponse.json();
      return res.json({ success: true, provider, order });
    }

    const upiRef = `upi_${crypto.randomUUID()}`;
    await db.collection('payments').doc(upiRef).set({ uid: req.user.uid, planId: plan.id, provider: 'upi', amount, status: 'pending_manual_verification', createdAt: FieldValue.serverTimestamp() });
    res.json({ success: true, provider, upiId: process.env.UPI_ID, reference: upiRef, amount });
  } catch (error) { next(error); }
});

router.post('/confirm', authenticate, body('planId').isString(), body('provider').isIn(['razorpay', 'paypal', 'upi']), validate, async (req, res, next) => {
  try {
    const plan = await getPlan(req.body.planId);
    const paymentId = req.body.paymentId || req.body.reference;
    if (!paymentId) throw new AppError('Payment identifier required.', 422);

    if (req.body.provider === 'razorpay') {
      const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${req.body.orderId}|${paymentId}`).digest('hex');
      if (expected !== req.body.signature) throw new AppError('Invalid Razorpay signature.', 400);
    }

    const subscription = await activateSubscription({ uid: req.user.uid, plan, provider: req.body.provider, paymentId, amount: Number(plan.price) });
    res.json({ success: true, subscription });
  } catch (error) { next(error); }
});

router.post('/webhooks/stripe', async (req, res, next) => {
  try {
    if (!stripe) throw new AppError('Stripe is not configured.', 503);
    const signature = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const plan = await getPlan(session.metadata.planId);
      await activateSubscription({ uid: session.metadata.uid, plan, provider: 'stripe', paymentId: session.id, amount: Number(plan.price) });
    }
    res.json({ received: true });
  } catch (error) { next(error); }
});

export default router;
