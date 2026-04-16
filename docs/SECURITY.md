# Security & Token Management

## Overview

This SPA uses a hybrid token strategy optimized for security within browser constraints.

## Token Strategy

### Access Token
- **Storage**: Memory only (not persisted)
- **TTL**: 15 minutes
- **Purpose**: API authentication via Authorization Bearer header
- **Loss**: Lost on page reload → transparent refresh via refresh token
- **Validation**: Checked before API calls; refreshed automatically on 401

### Refresh Token
- **Storage**: localStorage
- **TTL**: 7 days (configurable by backend)
- **Purpose**: Obtain new access tokens
- **Rotation**: Optional backend support recommended

### Session Lifecycle

1. **Login** → OTP verification → Backend issues both tokens → Stored as above
2. **API Call** → Include accessToken in Authorization header
3. **Token Expiring** → Axios interceptor detects 401 → POST /auth/token/refresh with refreshToken
4. **Refresh Succeeds** → New accessToken in memory, original request retried
5. **Refresh Fails** → Clear tokens, redirect to /login
6. **Page Reload** → accessToken lost (memory), but refreshToken in localStorage → Auto-refresh on first API call

## Security Considerations

### Strengths

- **XSS Protection**: Access token in memory survives basic XSS (not in localStorage)
- **CSRF**: Standard SameSite cookies + CORS for API calls
- **Short-lived**: 15m access token limits blast radius of token theft
- **Refresh Isolation**: Refresh logic at axios interceptor level

### Tradeoffs

- **localStorage Risk**: Refresh token in localStorage vulnerable to XSS. **Mitigation**: Keep refresh TTL short (7d), rotate on use if possible
- **Page Reload**: Access token lost, requires refresh token to restore. **Acceptable** since refresh happens transparently
- **Memory Token**: Loss on page reload. **Expected behavior** for SPA with refresh token fallback

### Recommendations for Production

1. **httpOnly Cookies**: If backend supports, use httpOnly cookies for refresh token (requires SameSite=Strict CORS setup)
2. **Token Rotation**: Rotate refresh tokens on use if backend supports
3. **Audit Logging**: Log all token refresh events for anomaly detection
4. **CSP Headers**: Implement Content Security Policy to prevent inline scripts
5. **Refresh Token Expiry**: Keep refresh TTL reasonable (7–14 days max)

## Interceptor Flow

```
API Call
  ↓
[Access token in memory?] 
  ├─ Yes → Add to Authorization header → Send request
  │   ├─ 200 → Return response
  │   ├─ 401 → [Refresh token valid?] 
  │   │   ├─ Yes → POST /auth/token/refresh → Get new access token → Retry original request
  │   │   └─ No → Logout, redirect /login
  │   └─ Other error → Return error
  └─ No → [Refresh token in localStorage?]
      ├─ Yes → Use it to refresh → Continue as above
      └─ No → Redirect /login
```

## Rate Limiting

- Refresh requests throttled to 1 per 5 seconds (prevents refresh storms on network failure)
- 401 responses queued and retried once, then fail

## Testing

```typescript
// Simulate token expiry
localStorage.removeItem('accessTokenExpiresAt');

// Interceptor will detect expired token and auto-refresh
// If no refresh token, redirects to /login
```

## Compliance

This implementation is suitable for:
- Internal business tools (Phase 1)
- PCI-DSS (if no credit card data in localStorage)
- GDPR (tokens cleared on logout)

For high-security applications handling sensitive customer data, upgrade to httpOnly refresh tokens with backend-side session management.
