# Zainzo Task V3 - Frontend Application

Project frontend untuk aplikasi Zainzo Task menggunakan React, TypeScript, dan Vite.

## ✨ Teknologi

- ⚛️ React 18
- 📘 TypeScript
- ⚡ Vite
- 🎨 Material-UI
- 🔐 Google OAuth 2.0 (Client-side)
- 📋 Kanban Board

## 🏗️ Struktur Project

```
├── src/
│   ├── guards/
│   │   ├── google/
│   │   │   └── GoogleAuthContext.tsx  # Auth context
│   │   └── authGuard/
│   │       ├── AuthGuard.tsx
│   │       ├── GuestGuard.tsx
│   │       └── UseAuth.tsx
│   ├── views/
│   │   ├── apps/
│   │   │   └── kanban/            # Kanban board
│   │   └── authentication/
│   │       ├── AuthCallback.tsx
│   │       └── authForms/
│   ├── components/
│   ├── layouts/
│   └── theme/
```

## 🚀 Installation & Running

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

## 📦 Tech Stack

- React 18 + TypeScript
- Vite
- Material-UI (MUI)
- React Router
- Redux Toolkit
- Axios
- Google OAuth 2.0

## 🎯 Features

- [x] Modern UI dengan Material-UI
- [x] Kanban Board
- [x] Google OAuth Authentication
- [x] Protected Routes
- [x] Responsive Design
- [x] Multi-language Support (i18n)
- [x] Dark/Light Theme

## 📝 Notes

- Project ini adalah frontend-only
- Backend terpisah (PHP dengan phpMyAdmin)
- Siap untuk integrasi dengan REST API

---

**Version:** 3.0.0 (Frontend Only)
**Updated:** December 2025
