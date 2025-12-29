# Authentication Flow - Code Comments Summary

This document explains what each key file does in the authentication flow.

---

## Flow Diagram

```┌────────────────┐
│  User clicks   │
│   "Login"      │
└───────┬────────┘
        │
        ↓ (Frontend redirects to backend)
┌────────────────┐
│   Backend      │
│  /auth/google  │
└───────┬────────┘
        │
        ↓ (Google OAuth flow)
┌────────────────┐
│     Google     │
│  Auth Screen   │
└───────┬────────┘
        │
        ↓ (User authenticates)
┌────────────────┐
│    Backend     │
│   Callback     │
│ (Set Cookie)   │
└───────┬────────┘
        │
        ↓ (Redirect to frontend)
┌────────────────┐
│  /auth/success │ ← AuthSuccess.tsx
└───────┬────────┘
        │
        ↓ (Call /api/auth/me)
┌────────────────┐
│    Backend     │
│ Verify Session │
└───────┬────────┘
        │
        ├─→ ✅ Authenticated ──→ /apps/kanban (Dashboard)
        │
        └─→ ❌ Not Authenticated ──→ /auth/error
```

---

## File-by-File Breakdown

### 1. **src/guards/google/GoogleAuthContext.tsx**

**Purpose:** Manages authentication state for the entire app

**Key Methods:**

```typescript
// Redirects user to backend OAuth endpoint
loginWithGoogle() {
  window.location.href = `${BACKEND_URL}/auth/google`;
}

// Called by AuthSuccess to verify authentication
// NO token parameter - uses cookies!
async handleAuthCallback() {
  const response = await axios.get('/api/auth/me', {
    withCredentials: true  // Sends session cookie
  });
  // If success, store user in state
  // If fail, return false
}

// Check if current session is still valid
async checkAuth() {
  // Same as handleAuthCallback but can be called anytime
}

// Clear session on backend
async logout() {
  await axios.post('/api/auth/logout', {}, {
    withCredentials: true
  });
}
```

**Important:**

- NO localStorage usage
- NO manual token handling
- Everything uses cookies (withCredentials: true)

---

### 2. **src/views/authentication/AuthSuccess.tsx**

**Purpose:** Logic handler after OAuth redirect (NOT a static page)

**Flow:**

1. Component mounts (user just redirected from backend)
2. Call `handleAuthCallback()` → calls `/api/auth/me`
3. If authenticated → redirect to dashboard
4. If not → redirect to error page

**Why this exists:**

- Can't trust redirect blindly
- Need to verify session with backend
- Provides loading state during verification

**Code:**

```typescript
useEffect(() => {
  const isAuthenticated = await handleAuthCallback();
  
  if (isAuthenticated) {
    navigate('/apps/kanban'); // Dashboard
  } else {
    navigate('/auth/error');
  }
}, []);
```

---

### 3. **src/views/authentication/AuthError.tsx**

**Purpose:** User-friendly error page

**Shown when:**

- User denies Google permissions
- Backend auth fails
- Session validation fails

**Features:**

- Clear error message
- "Try Again" button
- "Go Home" button

---

### 4. **src/routes/Router.tsx**

**Purpose:** Defines all application routes

**Key Routes:**

```typescript
// Protected routes (require auth)
{
  path: '/',
  element: <AuthGuard><FullLayout /></AuthGuard>,
  children: [
    { path: '/apps/kanban', element: <KanbanPage /> }
  ]
}

// Auth logic routes (no guard)
{
  path: '/auth',
  element: <BlankLayout />,
  children: [
    { path: 'success', element: <AuthSuccess /> },  // OAuth callback
    { path: 'error', element: <AuthError /> }        // Auth failed
  ]
}

// Guest routes (login page, etc.)
{
  path: '/auth',
  element: <GuestGuard><BlankLayout /></GuestGuard>,
  children: [
    { path: 'login', element: <Login /> }
  ]
}
```

**Important:**

- `/auth/success` and `/auth/error` have NO guard
- They handle auth logic themselves
- Other routes protected by AuthGuard

---

### 5. **src/utils/axios.js**

**Purpose:** HTTP client configured for Laravel Sanctum

**Key Configuration:**

```javascript
const axiosServices = axios.create({
  baseURL: `${ENV.API_BASE_URL}/api`,
  withCredentials: true,  // ← CRITICAL: Enables cookies!
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});
```

**Why `withCredentials: true`?**

- Tells browser to send HTTP-only cookies with every request
- Required for Laravel Sanctum session-based auth
- Without this, cookies won't be sent → auth fails

**Response Interceptor:**

```javascript
// Auto-redirect on 401 (session expired)
if (error.response?.status === 401) {
  window.location.href = '/auth/login';
}
```

---

### 6. **src/views/authentication/authForms/AuthSocialButtons.tsx**

**Purpose:** Login button component

**Code:**

```typescript
const handleLoginGoogle = async () => {
  await loginWithGoogle();  // Redirects to backend
};

return (
  <CustomSocialButton onClick={handleLoginGoogle}>
    Sign in with Google
  </CustomSocialButton>
);
```

**Important:**

- Just calls `loginWithGoogle()`
- NO Google SDK
- NO token handling
- Simple redirect

---

## What Each Component Does

| Component | What It Does | When Used ||-----------|-------------|-----------|
| **GoogleAuthContext** | Manages auth state | Throughout app |
| **AuthSuccess** | Validates auth after OAuth | After backend redirects |
| **AuthError** | Shows error message | When auth fails |
| **axios.js** | HTTP client with cookies | All API calls |
| **Router** | Defines routes | App navigation |
| **AuthSocialButtons** | Login button | Login page |
| **AuthGuard** | Protects routes | Wraps protected pages |
| **GuestGuard** | Guest-only routes | Login/register pages |

---

## Data Flow

### Login Flow

```User → AuthSocialButtons.tsx
       ↓ onClick
       loginWithGoogle() in GoogleAuthContext.tsx
       ↓ window.location.href
       Backend /auth/google
       ↓ OAuth + session creation
       Backend redirects to /auth/success
       ↓
       AuthSuccess.tsx mounts
       ↓ useEffect
       handleAuthCallback() in GoogleAuthContext.tsx
       ↓ axios.get with withCredentials
       /api/auth/me
       ↓ 200 OK with user data
       Store user in context
       ↓
       Navigate to /apps/kanban
```

### Protected Route Access

```User navigates to /apps/kanban
       ↓
       AuthGuard checks isAuthenticated
       ↓ (from GoogleAuthContext)
       if (isAuthenticated) → show page
       if (!isAuthenticated) → redirect to /auth/login
```

### Logout Flow

```User clicks logout
       ↓
       logout() in GoogleAuthContext.tsx
       ↓ axios.post with withCredentials
       /api/auth/logout
       ↓ Backend clears session
       Clear state in context
       ↓
       Navigate to /auth/login
```

---

## Common Patterns

### Every API Call Uses Cookies

```typescript
// ✅ Good: Using configured axios instance
import axiosServices from 'src/utils/axios';
const response = await axiosServices.get('/auth/me');

// ✅ Good: Direct axios with withCredentials
const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
  withCredentials: true
});

// ❌ Bad: No withCredentials
const response = await axios.get(`${BACKEND_URL}/api/auth/me`);
```

### State Management

```typescript
// ✅ Good: Using context
const { user, isAuthenticated } = useAuth();

// ❌ Bad: Using localStorage
const user = JSON.parse(localStorage.getItem('user'));
```

### Route Protection

```typescript
// ✅ Good: Using guards
<AuthGuard>
  <ProtectedPage />
</AuthGuard>

// ❌ Bad: Manual checking
const ProtectedPage = () => {
  if (!user) return <Navigate to="/auth/login" />;
  // ...
}
```

---

## Testing the Flow

### Step-by-Step Test

1. **Start on login page** (`/auth/login`)
   - Should see "Sign in with Google" button

2. **Click login button**
   - Should redirect to: `${BACKEND_URL}/auth/google`
   - Then to Google consent screen

3. **Complete Google auth**
   - Should redirect back to backend
   - Then to: `${FRONTEND_URL}/auth/success`

4. **On AuthSuccess page**
   - Should see "Verifying authentication..."
   - Should call `/api/auth/me` (check Network tab)
   - Should auto-redirect to `/apps/kanban`

5. **On dashboard**
   - Should see user data
   - Check Application → Cookies in DevTools
   - Should see session cookie

6. **Refresh page**
   - Should stay logged in (cookie persists)
   - AuthGuard checks session automatically

7. **Click logout**
   - Should call `/api/auth/logout`
   - Should redirect to `/auth/login`
   - Cookie should be cleared

---

## Key Takeaways

✅ **Frontend Role:**

- Redirect to backend for OAuth
- Validate session with `/api/auth/me`
- Display UI based on auth state
- Send cookies with every request

✅ **Backend Role:**

- Handle Google OAuth
- Create session cookies
- Validate sessions
- Provide `/api/auth/me` endpoint

❌ **Frontend Does NOT:**

- Handle Google tokens
- Store tokens in localStorage
- Manage sessions manually
- Call Google API directly

---

For more details, see **AUTHENTICATION_FLOW.md**
