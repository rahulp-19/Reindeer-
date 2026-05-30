# Deployment Guide

1. Create a Firebase project and enable Authentication with Email/Password.
2. Create Firestore and Firebase Storage in production mode.
3. Copy `firestore.rules` and `storage.rules` into the Firebase console or deploy with Firebase CLI.
4. Create a Firebase Admin service account and add the values to `.env` using `.env.example`.
5. Create Stripe, Razorpay, PayPal, and UPI credentials. Add webhook URLs:
   - Stripe: `https://your-domain.com/api/payments/webhooks/stripe`
   - Razorpay/PayPal: configure equivalent provider webhooks and extend `src/routes/payments.js` as needed.
6. Install and start the app:
   ```bash
   npm install
   npm start
   ```
7. Serve behind HTTPS with a reverse proxy such as Nginx or deploy to Render, Railway, Fly.io, Cloud Run, or Firebase Hosting + Cloud Run.
8. Set `NODE_ENV=production`, a strong `JWT_SECRET`, exact `CORS_ORIGINS`, and production payment keys.
9. Seed initial documents for categories, subscription plans, and an admin user role in Firestore.
10. Open `/admin` as an admin user to upload videos, manage plans, create announcements, and view revenue analytics.
