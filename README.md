# Shillong Morning Teer — secured Firebase + Vercel build

This build uses **Firebase Firestore** for persistent data and **Vercel** for the website/API deployment. The public browser never receives Firebase Admin credentials; all database access goes through the secured Express API in `server.ts`.

## Daily behavior

- F/R and S/R are updated manually from Admin.
- A new result document is created every new **IST** day with F/R = `X` and S/R = `X`.
- Yesterday's result automatically appears under Previous Results because the previous date stays stored in Firestore.
- Common Numbers are cryptographically randomly generated once per day and stored in Firestore. Admin can override them.
- Daily Dream Numbers are cryptographically randomly generated once per day and stored in Firestore. Admin can override today's values.
- Vercel Cron calls `/api/cron/daily` at **18:30 UTC**, which is **12:00 AM IST**.
- Every public daily API also runs an idempotent date check, so a missed cron cannot leave the site stuck on yesterday's state.

## Security changes

- No hard-coded admin email/password is displayed in the UI.
- No default production password exists in source code.
- Admin passwords are salted and PBKDF2-hashed before being stored in Firestore.
- Admin sessions use signed `HttpOnly`, `SameSite=Strict`, `Secure` cookies in production instead of `localStorage` tokens.
- State-changing API calls perform same-origin checks.
- Login throttling, security headers, input limits, validation, and admin audit logs are enabled.
- Firebase Admin credentials stay server-side and must never use a `VITE_` prefix.

No website can literally be guaranteed "hack proof". These changes remove the major weaknesses found in the original project and use a safer production architecture.

## 1. Install packages

Open Terminal/PowerShell inside the extracted project folder:

```bash
npm install
npm run lint
npm run build
```

## 2. Create/use your Firebase project

In Firebase Console:

1. Open your Firebase project.
2. Open **Build > Firestore Database** and create the database if it does not already exist.
3. Open **Project settings > Service accounts**.
4. Generate a new private key for the Firebase Admin SDK.
5. Keep that downloaded service-account JSON private. Never upload it to GitHub.

Copy `.env.example` to `.env` for local development and fill in:

```env
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
ADMIN_EMAIL="your-admin-email@example.com"
ADMIN_PASSWORD="your-strong-password"
SESSION_SECRET="a-random-secret-at-least-32-characters-long"
CRON_SECRET="a-different-random-secret-at-least-32-characters"
```

For `FIREBASE_PRIVATE_KEY`, copy the `private_key` value from the service-account JSON. Keeping its `\n` sequences in the environment variable is supported by this project.

## 3. Seed the starter data once

After `.env` is configured:

```bash
npm run seed:firebase
```

The seed is safe to run more than once: it only creates starter documents that do not already exist. It includes the historical results already present in the original project, the dream-number dictionary, sample notices, and historical common-number entries.

You can skip this command if your Firestore already contains the data you want to use.

## 4. Firestore security rules

`firestore.rules` denies direct browser access because this website accesses Firestore only through the server using Firebase Admin SDK.

If this is a **dedicated Firebase project for this website**, you can deploy the included rules with Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

If this Firebase project is shared with another website/app that already uses client-side Firestore, **merge the included rules with your existing rules instead of replacing them blindly**.

## 5. Run locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Admin page:

```text
http://localhost:3000/admin
```

Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your local `.env` for the first login. After the account is created, changing the password in Admin > Security updates the stored Firestore password hash and invalidates the previous session.

## 6. Push to GitHub

`.env` is ignored by Git. Do not force-add it.

```bash
git init
git add .
git commit -m "Use Firebase Firestore and secure admin"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

If the repository already has a remote, use your existing remote rather than adding it again.

## 7. Deploy to Vercel

Install/login if needed:

```bash
npm install -g vercel
vercel login
vercel
```

Add these environment variables to the Vercel project:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `CRON_SECRET`

You can add them in the Vercel dashboard or with the Vercel CLI. Then deploy production:

```bash
vercel --prod
```

The included `vercel.json` schedules the daily endpoint at midnight IST.

## Firestore collections

The backend creates/uses these collections:

- `site_settings`
- `results`
- `common_numbers`
- `daily_dream_numbers`
- `dream_numbers`
- `notices`
- `admin_credentials`
- `admin_audit_logs`

The `results` document ID is the date (`YYYY-MM-DD`). Therefore when midnight IST arrives, the previous day's document remains untouched and automatically becomes a Previous Result while a fresh today's document is created with `X / X`.
