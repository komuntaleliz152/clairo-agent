# Deploy Clairo (Vercel + Render)

## 1. Deploy backend (Render — free tier)

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Blueprint**.
3. Connect the repo. Set **Root Directory** to `backend` if not auto-detected.
4. Add environment variable:
   - `GROQ_API_KEY` = your key from https://console.groq.com/
5. Deploy. Copy your service URL, e.g. `https://clairo-research-api.onrender.com`.

**Manual deploy (no Blueprint):** New **Web Service** → Python → Root `backend` → Build: `pip install -r requirements.txt` → Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

> Free Render services sleep after ~15 min idle; first request may take 30–60s to wake.

## 2. Set up Clerk (authentication)

See **[AUTH.md](./AUTH.md)** for full steps. You need:

- Clerk app with Email + Google enabled
- `CLERK_ISSUER` on Render
- Clerk keys on Vercel (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)

## 3. Connect Vercel frontend

1. Open [vercel.com](https://vercel.com) → your **clairo-research-agent** project.
2. **Settings** → **Environment Variables**.
3. Add:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR-RENDER-URL.onrender.com
   ```
   (no trailing slash)
4. **Deployments** → redeploy **Production**.

## 4. Verify

- Backend: `https://YOUR-RENDER-URL.onrender.com/health` → `"status": "healthy"`
- Frontend: run a research topic on the live Vercel URL.

## Local dev

| Service  | Command | URL |
|----------|---------|-----|
| Backend  | `cd backend` → `.\start.ps1` or `python main.py` | http://localhost:8001 |
| Frontend | `cd frontend` → `npm run dev` | http://localhost:3000 |

`frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```
