import { createBrowserRouter, Navigate } from 'react-router-dom';
import ErrorFallback from '../ErrorFallback';
import RootLayout from '../components/RootLayout';
import LandingPage from '../pages/LandingPage';
import SsoPage from '../pages/SsoPage';
import OAuthCallbackPage from '../pages/OAuthCallbackPage';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPage from '../pages/AdminPage';
import DashboardPage from '../pages/DashboardPage';
import MyTwinsPage from '../pages/MyTwinsPage';
import SettingsPage from '../pages/SettingsPage';
import UserManagementPage from '../pages/UserManagementPage';

const router = createBrowserRouter([
  // 사용자 진입 화면 (랜딩/로그인/OAuth 콜백)
  // 메인(대시보드) 화면은 다른 팀이 기본 도메인(digital-twin.p-e.kr)에서 구현한다.
  {
    element: <RootLayout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'sso',
        element: <SsoPage />,
      },
      {
        path: 'auth/callback',
        element: <OAuthCallbackPage />,
      },
    ],
  },
  // 관리자 화면 (사이드바 레이아웃)
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        path: 'admin',
        element: <AdminPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UserManagementPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    // 사용자용 화면(다른 팀 개발)의 임시 준비중 페이지.
    path: '/my-twins',
    element: <MyTwinsPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
