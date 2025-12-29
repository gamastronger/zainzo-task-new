// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
import AuthGuard from 'src/guards/authGuard/AuthGuard';
import GuestGuard from 'src/guards/authGuard/GuestGaurd';

/* ****Pages***** */
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const KanbanPage = Loadable(lazy(() => import('../views/apps/kanban')));
const ZainzoBook = Loadable(lazy(() => import('../views/zainzo-products/ZainzoBook')));
const ZainzoContact = Loadable(lazy(() => import('../views/zainzo-products/ZainzoContact')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
const AuthCallback = Loadable(lazy(() => import('../views/authentication/AuthCallback')));
const AuthSuccess = Loadable(lazy(() => import('../views/authentication/AuthSuccess')));
const AuthError = Loadable(lazy(() => import('../views/authentication/AuthError')));

const Router = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <FullLayout />
      </AuthGuard>
    ),
    children: [
      { path: '/', element: <Navigate to="/apps/kanban" /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/apps/kanban', exact: true, element: <KanbanPage /> },
      { path: '/zainzo-book', exact: true, element: <ZainzoBook /> },
      { path: '/zainzo-contact', exact: true, element: <ZainzoContact /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: (
      <GuestGuard>
        <BlankLayout />
      </GuestGuard>
    ),
    children: [
      { path: 'login', element: <Login /> },
      { path: 'login2', element: <Login2 /> },
      { path: 'register', element: <Register /> },
      { path: 'register2', element: <Register2 /> },
      { path: 'callback', element: <AuthCallback /> }, // Legacy callback (can be removed if not used)
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />, // No GuestGuard - these routes handle auth logic
    children: [
      { path: 'success', element: <AuthSuccess /> }, // Backend redirects here after OAuth
      { path: 'error', element: <AuthError /> }, // Auth failure page
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
