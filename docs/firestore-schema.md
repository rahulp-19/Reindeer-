# StreamVault Firestore Schema

## `users/{uid}`
- `uid`, `email`, `displayName`, `photoURL`
- `role`: `admin` or `user`
- `emailVerified`: boolean
- `subscription`: `{ planId, name, status, provider, paymentId, startedAt, expiresAt }`
- `createdAt`, `updatedAt`, `lastLoginAt`
- Subcollection `watchHistory/{videoId}`: `videoId`, `progress`, `watchedAt`

## `videos/{videoId}`
- `title`, `description`, `thumbnail`, `videoUrl`
- `category`, `tags[]`, `uploadDate`
- `previewDuration`: seconds
- `premiumOnly`: boolean
- `status`: `published`, `draft`, or `archived`

## `subscriptions/{planId}`
- `type`: `plan`
- `name`: Weekly, Monthly, Yearly, or custom
- `price`, `currency`, `durationDays`
- `enabled`, `sortOrder`, `features[]`, `updatedAt`

## `payments/{paymentId}`
- `uid`, `planId`, `provider`
- `amount`, `currency`, `status`
- `fraudSignals`, `createdAt`, `webhookEventId`

## `categories/{categoryId}`
- `name`, `slug`, `description`, `enabled`, `createdAt`

## `announcements/{announcementId}`
- `title`, `body`, `severity`, `active`, `createdAt`, `expiresAt`
