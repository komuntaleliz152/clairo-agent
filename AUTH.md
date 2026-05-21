# Authentication (Clerk)

Clairo uses [Clerk](https://clerk.com) for sign-in with **email** and **Google**. The FastAPI backend verifies Clerk JWTs so only signed-in users can run research.

## 1. Create a Clerk application

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) → **Add application**.
2. Name it **Clairo**.
3. Enable sign-in methods:
   - **Email** (password or email code)
   - **Google** (OAuth)
4. Copy keys from **API Keys**:
   - Publishable key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Secret key → `CLERK_SECRET_KEY`
5. Copy **JWT Issuer** from **API Keys** → **Advanced** → **JWT Issuer**  
   Example: `https://happy-hawk-12.clerk.accounts.dev` → backend `CLERK_ISSUER`

## 2. Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:8001

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

Restart: `npm run dev`

## 3. Backend (`backend/.env`)

```env
CLERK_ISSUER=https://your-instance.clerk.accounts.dev
GROQ_API_KEY=...
```

Install JWT dependency:

```bash
pip install -r requirements.txt
```

Restart: `python main.py`

### Local dev without Clerk (optional)

Only for testing on your machine — **never on Render/production**:

```env
DISABLE_AUTH=true
```

## 4. Vercel + Render

| Where | Variables |
|-------|-----------|
| **Vercel** | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_API_URL` |
| **Render** | `CLERK_ISSUER`, `GROQ_API_KEY`, `FRONTEND_URL` |

In Clerk Dashboard → **Domains**, add:

- `localhost:3000` (development)
- `clairo-research-agent.vercel.app` (production)

## 5. Flow

1. User visits `/` → Clerk middleware redirects to `/sign-in` if logged out.
2. User signs in (email or Google).
3. Frontend calls `getToken()` and sends `Authorization: Bearer <token>` to the API.
4. Backend verifies JWT with Clerk JWKS → runs research.

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Sign in required` | Log in at `/sign-in` |
| `Invalid authentication token` | Check `CLERK_ISSUER` matches Clerk dashboard exactly |
| `CLERK_ISSUER is not configured` | Add issuer to `backend/.env` |
| Redirect loop | Add your URL to Clerk **Domains** |
