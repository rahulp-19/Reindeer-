# StreamVault

StreamVault is a complete full-stack premium video streaming website with a modern orange and black cinematic theme. It includes a responsive frontend, Firebase Authentication, Firestore and Storage integration, JWT-backed Express sessions, role-based admin APIs, configurable preview locking, subscription plans, and multi-provider payment scaffolding.

## Stack

- Frontend: HTML, CSS, JavaScript SPA
- Backend: Node.js and Express.js
- Auth: Firebase Authentication + JWT sessions
- Database: Firestore
- Storage: Firebase Storage
- Security: Helmet, CORS, rate limiting, validation, Firebase security rules
- Payments: Stripe, Razorpay, PayPal, UPI checkout scaffolding

## Pages

1. Home Page
2. Login Page
3. Register Page
4. Forgot Password Page
5. User Dashboard
6. Video Player Page
7. Categories Page
8. Search Results Page
9. Subscription Plans Page
10. Payment Page
11. Announcements Page
12. Admin Dashboard

## Quick Start

```bash
cp .env.example .env
npm install
npm run check
npm start
```

Then open `http://localhost:3000`.

## Firebase Setup

1. Enable Email/Password sign-in in Firebase Authentication.
2. Copy your Firebase web app config into `public/js/firebase-config.js`.
3. Add Firebase Admin credentials to `.env`.
4. Deploy the included `firestore.rules` and `storage.rules`.
5. Seed Firestore using the schema in `docs/firestore-schema.md`.

## Admin Workflow

- Create a normal Firebase user.
- Set `users/{uid}.role` to `admin` in Firestore.
- Login and open `#/admin`.
- Upload, edit, and delete videos through protected `/api/admin/*` routes.
- Manage categories, dynamic subscriptions, announcements, payment logs, revenue analytics, and site statistics.

## Preview System

Every video document supports `previewDuration` and `premiumOnly`. Free users can watch until the countdown expires. The player then pauses, blurs the video, and shows a subscription modal. Users with an active subscription continue without interruption.

## API Overview

- `POST /api/auth/session` verifies Firebase ID tokens and returns a JWT.
- `GET /api/videos` lists published videos.
- `GET /api/videos/:id/stream-token` returns stream access and preview rules.
- `POST /api/videos/:id/history` stores watch progress.
- `GET /api/plans` returns enabled subscription plans.
- `POST /api/payments/checkout` creates Stripe, Razorpay, PayPal, or UPI checkout sessions.
- `POST /api/payments/confirm` validates supported payment confirmations and activates subscriptions.
- `POST /api/payments/webhooks/stripe` validates Stripe webhooks.
- `GET/POST/PUT/DELETE /api/admin/*` protects admin-only operations.

## Production Notes

- Use HTTPS only.
- Use exact CORS origins.
- Keep provider secrets in environment variables.
- Rotate `JWT_SECRET` and payment webhook secrets regularly.
- Replace placeholder legal copy in the Terms and Privacy routes before launch.
- Review `docs/deployment.md` for detailed deployment steps.
