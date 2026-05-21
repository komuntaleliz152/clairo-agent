import os
from typing import Any, Dict, Optional

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

security = HTTPBearer(auto_error=False)
_jwks_client: Optional[PyJWKClient] = None


def _auth_disabled() -> bool:
    return os.getenv("DISABLE_AUTH", "").lower() in ("1", "true", "yes")


def _get_issuer() -> Optional[str]:
    issuer = os.getenv("CLERK_ISSUER", "").strip()
    if issuer.endswith("/"):
        issuer = issuer[:-1]
    return issuer or None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    issuer = _get_issuer()
    if not issuer:
        raise HTTPException(
            status_code=503,
            detail="CLERK_ISSUER is not configured on the backend",
        )
    if _jwks_client is None:
        _jwks_client = PyJWKClient(f"{issuer}/.well-known/jwks.json")
    return _jwks_client


def verify_clerk_token(token: str) -> Dict[str, Any]:
    issuer = _get_issuer()
    if not issuer:
        raise HTTPException(status_code=503, detail="Auth is not configured")

    try:
        signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=issuer,
            options={"verify_aud": False},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please sign in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")


async def require_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Dict[str, Any]:
    if _auth_disabled():
        return {"sub": "dev-user", "dev_mode": True}

    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=401,
            detail="Sign in required. No authorization token provided.",
        )

    return verify_clerk_token(credentials.credentials)
