# Environment Configuration Guide

## 📁 File Structure

```p
.env              → File utama (gunakan ini, jangan commit ke git)
.env.example      → Template/contoh (commit ke git)
.env.local        → Sama dengan .env (backup/alternatif nama)
```

## 🚀 Quick Start

### 1. Setup Environment File

```bash
# Copy .env.example ke .env
cp .env.example .env
```

### 2. Edit File .env

#### Untuk LOCAL Development

Uncomment bagian LOCAL, comment bagian PRODUCTION:

```env
# ============================================
# LOCAL DEVELOPMENT (Uncomment untuk local)
# ============================================
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_URL=http://localhost:5173
VITE_APP_PORT=5173
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# ============================================
# PRODUCTION (Comment untuk local)
# ============================================
# VITE_API_URL=https://api.task.zainzo.com
# VITE_API_BASE_URL=https://api.task.zainzo.com
# ... dst
```

#### Untuk PRODUCTION Deployment

Comment bagian LOCAL, uncomment bagian PRODUCTION:

```env
# ============================================
# LOCAL DEVELOPMENT (Comment untuk production)
# ============================================
# VITE_API_URL=http://localhost:8000
# VITE_API_BASE_URL=http://localhost:8000
# ... dst

# ============================================
# PRODUCTION (Uncomment untuk production)
# ============================================
VITE_API_URL=https://api.task.zainzo.com
VITE_API_BASE_URL=https://api.task.zainzo.com
VITE_APP_URL=https://task.zainzo.com
VITE_APP_PORT=443
VITE_GOOGLE_CLIENT_ID=677524265473-8rr4si61qtkhlo6osb8288ie0006094n.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://task.zainzo.com/auth/callback
```

### 3. Build & Run

```bash
# Development
npm run dev

# Production build
npm run build
```

## 🔍 Cara Kerja

### API URL Structure

```p
ENV.API_BASE_URL = https://api.task.zainzo.com
↓
Axios instances akan add /api prefix:
- axios.js        → https://api.task.zainzo.com/api
- googleTasksApi  → https://api.task.zainzo.com/api
- GoogleAuthContext (OAuth) → https://api.task.zainzo.com/auth/google (no /api)
- GoogleAuthContext (API calls) → https://api.task.zainzo.com/api/auth/me
```

### Endpoint Mapping

| Frontend Call | Actual URL |p
|--------------|------------|
| `/cards` | `https://api.task.zainzo.com/api/cards` |
| `/columns` | `https://api.task.zainzo.com/api/columns` |
| OAuth redirect | `https://api.task.zainzo.com/auth/google` |
| Get user | `https://api.task.zainzo.com/api/auth/me` |

## ✅ Validation

Aplikasi akan otomatis validasi env variables saat start (`main.tsx`).
Jika ada yang kosong, akan muncul error di console:

```p
❌ Environment Configuration Errors:
  - VITE_API_URL is not set in .env file
  - VITE_GOOGLE_CLIENT_ID is not set in .env file
💡 Pastikan file .env sudah dibuat dari .env.example dan diisi dengan benar!
```

## 📝 Important Notes

1. **JANGAN commit file `.env` ke git** (sudah ada di .gitignore)
2. **SELALU update `.env.example`** jika ada variable baru
3. Semua API call **HARUS** menggunakan `ENV` dari `src/config/env.ts`
4. Tidak ada hardcoded URL di source code (kecuali di `env.ts` sebagai fallback)
5. Untuk switch local ↔ production, cukup edit file `.env` saja

## 🔐 Security

File yang di-ignore (tidak commit ke git):

- `.env`
- `.env.local`
- `.env*.local`
- `*.pem`, `*.key`, `*.cert`
- Credential files

File yang di-commit:

- `.env.example` (template tanpa nilai sensitif)
