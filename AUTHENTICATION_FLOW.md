# Authentication Flow Documentation

## Overview

This application uses **backend-driven Google OAuth** with **Laravel Sanctum** for session management. The frontend does NOT handle Google tokens directly - all OAuth logic is managed by the Laravel backend.

---

## Architecture

```┌─────────────┐     ┌──────────────┐     ┌────────────┐
│   Frontend  │────>│    Backend   │────>│   Google   │
│   (React)   │<────│   (Laravel)  │<────│   OAuth    │
└─────────────┘     └──────────────┘     └────────────┘
     Cookie              Session              Token
     Based               Cookie              Handling
```

**Key Principle:** Frontend uses HTTP-only cookies, backend manages tokens.

---

## Authentication Flow

### 1. **Login Initiation**

**Location:** `src/views/authentication/authForms/AuthSocialButtons.tsx`

```User clicks "Sign in with Google"
     ↓
loginWithGoogle() is called
     ↓
window.location.href = `${BACKEND_URL}/auth/google`
     ↓
Full page redirect to backend
```

**Important:**

- NO Google SDK in frontend
- NO token handling in frontend
- Pure redirect to backend endpoint

---

### 2. **Backend OAuth Flow**

```Backend /auth/google endpoint
     ↓
Redirect to Google OAuth consent screen
     ↓
User authenticates with Google
     ↓
Google redirects back to backend callback
     ↓
Backend exchanges code for user data
     ↓
Backend creates session (Laravel Sanctum)
     ↓
Backend sets HTTP-only session cookie
     ↓
Backend redirects to: frontend/auth/success
```

**Backend must redirect to:** `${FRONTEND_URL}/auth/success`

---

### 3. **Auth Success Handler**

**Location:** `src/views/authentication/AuthSuccess.tsx`

```Component mounts
     ↓
Call /api/auth/me with credentials (cookie auto-sent)
     ↓
Backend validates session cookie
     ↓
IF authenticated:
  - Store user in context
  - Redirect to /apps/kanban
     ↓
IF NOT authenticated:
  - Redirect to /auth/error
```

**Key Points:**

- This is a logic-only component (minimal UI)
- Calls backend to verify authentication
- Does NOT trust redirect blindly
- Waits for backend confirmation

---

### 4. **Error Handling**

**Location:** `src/views/authentication/AuthError.tsx`

Displayed when:

- User denies Google permissions
- Backend authentication fails
- Session validation fails

**Features:**

- Clear error message
- "Try Again" button → redirects to `/auth/login`
- "Go Home" button → redirects to `/`

---

## Authentication Context

**Location:** `src/guards/google/GoogleAuthContext.tsx`

### Key Functions

#### `loginWithGoogle()`

```typescript
// Redirect to backend OAuth endpoint
window.location.href = `${BACKEND_URL}/auth/google`;
```

#### `handleAuthCallback()`

```typescript
// Called by AuthSuccess component
// Verifies authentication with backend
const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
  withCredentials: true, // Send session cookie
});
```

#### `checkAuth()`

```typescript
// Verify current session is still valid
const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
  withCredentials: true,
});
```

#### `logout()`

```typescript
// Clear session on backend
await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
  withCredentials: true,
});
```

---

## Axios Configuration

**Location:** `src/utils/axios.js`

```javascript
const axiosServices = axios.create({
  baseURL: `${ENV.API_BASE_URL}/api`,
  withCredentials: true, // CRITICAL: Enables cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});
```

**Why `withCredentials: true`?**

- Allows browser to send HTTP-only cookies with requests
- Required for Laravel Sanctum session-based auth
- Security: Cookies cannot be accessed by JavaScript (XSS protection)

---

## Routing

**Location:** `src/routes/Router.tsx`

```typescript
// Protected routes (require authentication)
{
  path: '/',
  element: <AuthGuard><FullLayout /></AuthGuard>,
  children: [
    { path: '/apps/kanban', element: <KanbanPage /> },
    // ... other protected routes
  ]
}

// Auth routes (no guard, for login flow)
{
  path: '/auth',
  element: <BlankLayout />,
  children: [
    { path: 'success', element: <AuthSuccess /> },
    { path: 'error', element: <AuthError /> },
  ]
}

// Guest routes (only accessible when NOT logged in)
{
  path: '/auth',
  element: <GuestGuard><BlankLayout /></GuestGuard>,
  children: [
    { path: 'login', element: <Login /> },
  ]
}
```

---

## Backend Requirements

### Required Endpoints

#### 1. `GET /auth/google`

- Initiates Google OAuth flow
- Redirects user to Google consent screen
- **NOT an API endpoint** - web route

#### 2. `GET /auth/google/callback` (internal)

- Handles Google OAuth callback
- Exchanges code for user data
- Creates Laravel Sanctum session
- Sets HTTP-only cookie
- **Redirects to:** `${FRONTEND_URL}/auth/success`

#### 3. `GET /api/auth/me`

- Returns authenticated user data
- Validates session cookie
- **Response format:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "picture": "https://..."
    }
  }
}
```

#### 4. `POST /api/auth/logout`

- Invalidates session
- Clears session cookie
- **Response format:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Laravel Sanctum Configuration

### Backend Setup (Laravel)

```php
// config/cors.php
'paths' => ['api/*', 'auth/*'],
'allowed_origins' => [env('FRONTEND_URL')],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true, // IMPORTANT!
```

```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 
    'localhost,localhost:3000,localhost:5173,127.0.0.1'
)),
```

```env
# .env
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
```

---

## Security Features

### 1. **HTTP-Only Cookies**

- Cookies cannot be accessed by JavaScript
- Protection against XSS attacks
- Browser automatically sends with requests

### 2. **CORS Configuration**

- Strict origin validation
- `withCredentials` enabled
- Protected API endpoints

### 3. **No Token Exposure**

- Google tokens never reach frontend
- Laravel Sanctum tokens never exposed to JavaScript
- All sensitive data stays on backend

### 4. **Session Validation**

- Every protected API call validates session
- Automatic logout on invalid session (401 response)
- No client-side session storage

---

## Common Issues & Solutions

### Issue 1: "Authentication failed" immediately after login

**Cause:** CORS not configured correctly

**Solution:**

```php
// Laravel: config/cors.php
'supports_credentials' => true,
'allowed_origins' => [env('FRONTEND_URL')],
```

### Issue 2: Cookies not being sent

**Cause:** `withCredentials` not set or domain mismatch

**Solution:**

- Ensure `withCredentials: true` in all axios calls
- Check `SANCTUM_STATEFUL_DOMAINS` matches frontend domain
- Verify `SESSION_DOMAIN` is set correctly

### Issue 3: 401 Unauthorized on /api/auth/me

**Cause:** Session cookie not present or invalid

**Solution:**

- Check browser dev tools → Application → Cookies
- Verify session cookie exists
- Ensure cookie domain matches
- Check backend session driver is working

### Issue 4: Redirect loop between /auth/success and /auth/error

**Cause:** Backend not setting session correctly

**Solution:**

- Verify backend creates session after OAuth
- Check `/api/auth/me` endpoint returns user data
- Confirm session cookie is HTTP-only and secure flags are correct

---

## Testing Authentication Flow

### 1. **Test Login Flow**

```p
1. Click "Sign in with Google"
2. Check redirect to backend /auth/google
3. Complete Google OAuth
4. Should land on /auth/success (briefly)
5. Should redirect to /apps/kanban
```

### 2. **Test Session Validation**

```p
1. After login, check browser cookies
2. Cookie name: usually "laravel_session"
3. Flags: HttpOnly, Secure (if HTTPS), SameSite
```

### 3. **Test Protected Routes**

```p
1. Navigate to /apps/kanban
2. Should show dashboard (if authenticated)
3. Should redirect to /auth/login (if not)
```

### 4. **Test Logout**

```p
1. Click logout
2. Session cookie should be cleared
3. Redirect to /auth/login
4. Try accessing /apps/kanban → should redirect to login
```

---

## Development vs Production

### Development (.env.local)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_URL=http://localhost:5173
```

### Production (.env.production)

```env
VITE_API_BASE_URL=https://api.task.zainzo.com
VITE_APP_URL=https://task.zainzo.com
```

**Note:** Ensure backend .env has matching FRONTEND_URL

---

## Summary

✅ **Do:**

- Use `withCredentials: true` for all API calls
- Redirect to backend for OAuth
- Validate authentication with `/api/auth/me`
- Handle errors gracefully

❌ **Don't:**

- Handle Google tokens in frontend
- Store tokens in localStorage
- Trust redirect URLs without verification
- Skip session validation

---

## File Reference

| File | Purpose |p
|------|---------|
| `GoogleAuthContext.tsx` | Auth state management |
| `AuthSuccess.tsx` | OAuth callback handler |
| `AuthError.tsx` | Error display |
| `axios.js` | HTTP client with cookies |
| `Router.tsx` | Route definitions |
| `AuthGuard.tsx` | Protected route wrapper |
| `GuestGuard.tsx` | Guest-only route wrapper |

---

## Support

If authentication still fails after following this guide:

1. Check browser console for errors
2. Check network tab for failed API calls
3. Verify backend Laravel logs
4. Ensure CORS and Sanctum are configured correctly
5. Test `/api/auth/me` endpoint directly
