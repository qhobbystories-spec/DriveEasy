# Deploy to Render (Backend) + Vercel (Frontend)

## Architecture

```
Vercel (frontend)          Render (backend)        PlanetScale (MySQL)
┌──────────────┐           ┌──────────────┐        ┌──────────────┐
│  React SPA   │──/api───▶│  Express API  │──────▶│  MySQL 8     │
│  Static HTML │  /socket  │  Socket.IO    │        │  (Prisma)    │
└──────────────┘           └──────────────┘        └──────────────┘
```

## Prerequisites

- GitHub account
- [Render](https://render.com) account (free tier)
- [Vercel](https://vercel.com) account (free tier)
- [PlanetScale](https://planetscale.com) account (free tier) or [Aiven](https://aiven.io) MySQL

---

## Step 1: Set Up MySQL (PlanetScale)

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database → name: `amk-motors`
3. Copy the **connection string** (format: `mysql://user:password@host/amk-motors?sslaccept=strict`)
4. Save it — you'll need it in Step 2

> **Alternative:** Use Aiven free tier MySQL instead. Same connection string format.

---

## Step 2: Deploy Backend to Render

### 2a. Connect Repository

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `amk-backend`
   - **Region:** Oregon (or closest)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm ci && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && node dist/server.js`
   - **Plan:** Free

### 2b. Set Environment Variables

In the Render dashboard → **Environment** tab, add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | *(your PlanetScale connection string)* |
| `JWT_SECRET` | *(click "Generate")* |
| `JWT_REFRESH_SECRET` | *(click "Generate")* |
| `FRONTEND_URL` | `https://your-app.vercel.app` *(update after Step 3)* |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `you@gmail.com` |
| `SMTP_PASS` | `your-app-password` |
| `EMAIL_FROM` | `noreply@amkmotors.com` |

### 2c. Deploy

1. Click **Create Web Service**
2. Wait for first deploy to complete (~3-5 min)
3. Note your backend URL: `https://amk-backend.onrender.com`

### 2d. Verify Backend

```bash
curl https://amk-backend.onrender.com/health
# Should return: {"status":"ok",...}
```

---

## Step 3: Deploy Frontend to Vercel

### 3a. Connect Repository

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repo
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 3b. Set Environment Variables

In the Vercel project → **Settings** → **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://amk-backend.onrender.com` |

### 3c. Deploy

1. Click **Deploy**
2. Wait for build to complete (~1-2 min)
3. Note your frontend URL: `https://your-app.vercel.app`

---

## Step 4: Update Backend CORS

1. Go back to Render → **Environment** tab
2. Update `FRONTEND_URL` to your actual Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Render auto-redeploys on env var change

---

## Step 5: Seed Admin User

Option A — Via Render Shell:
1. Render dashboard → **Shell** tab
2. Run:
   ```bash
   npx prisma migrate deploy
   npm run prisma:seed
   ```

Option B — Add a deploy hook (for CI):
```bash
# Add to build command or run manually after first deploy
```

---

## Step 6: Verify Everything

1. Open `https://your-app.vercel.app`
2. Sign up / log in
3. Browse cars, create a booking
4. Check Socket.IO connects (browser dev tools → Network → WS)
5. Check admin dashboard

---

## Auto-Deploy Setup

### Render (backend)
- Already auto-deploys on push to `main`
- Manual deploy: **Manual Deploy** → **Deploy latest commit**

### Vercel (frontend)
- Already auto-deploys on push to `main`
- Preview deployments: every PR gets a preview URL
- Custom domain: **Settings** → **Domains** → add your domain

---

## Custom Domain Setup

### Vercel
1. **Settings** → **Domains** → add `amkmotors.com`
2. Update DNS:
   - Type `A` → `76.76.21.21`
   - Type `CNAME` → `cname.vercel-dns.com`

### Render
1. **Settings** → **Custom Domains** → add `api.amkmotors.com`
2. Update DNS:
   - Type `CNAME` → `amk-backend.onrender.com`

### Update Environment Variables
- Render: `FRONTEND_URL=https://amkmotors.com`
- Vercel: `VITE_API_URL=https://api.amkmotors.com`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `CORS error` | Ensure `FRONTEND_URL` matches your Vercel domain exactly |
| Socket.IO not connecting | Check `FRONTEND_URL` and that Socket.IO CORS allows your domain |
| `DATABASE_URL` error | Verify PlanetScale connection string, ensure IP allowlist includes Render |
| Build fails on Render | Check build logs, ensure `prisma generate` runs before `build` |
| Vercel 404 on refresh | The `vercel.json` rewrites handle SPA routing |
| Emails not sending | Use Gmail App Password, check spam folder |

---

## Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| Render (backend) | Free | $0/mo |
| Vercel (frontend) | Free | $0/mo |
| PlanetScale (MySQL) | Free | $0/mo |
| **Total** | | **$0/mo** |

> Free tiers have limits: Render spins down after inactivity, Vercel has bandwidth limits, PlanetScale has row read limits. Upgrade as needed.
