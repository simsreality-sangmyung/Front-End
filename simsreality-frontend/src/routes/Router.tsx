import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPage from '../pages/AdminPage';
import DashboardPage from '../pages/DashboardPage';
import LandingPage from '../pages/LandingPage';
import MyTwinsPage from '../pages/MyTwinsPage';
import SettingsPage from '../pages/SettingsPage';
import UserManagementPage from '../pages/UserManagementPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminPage /> },
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
    // 사용자용 화면(다른 팀원 개발 예정)의 임시 준비중 페이지.
    // 관리자 Sidebar 없이 독립된 화면이라 AdminLayout 밖에 둡니다.
    path: '/my-twins',
    element: <MyTwinsPage />,
  },
  {
    // 메인 랜딩페이지(다른 팀원 개발 예정)의 임시 준비중 페이지.
    // 관리자 Sidebar 없이 독립된 화면이라 AdminLayout 밖에 둡니다.
    path: '/landing',
    element: <LandingPage />,
  },
]);

export default router;
