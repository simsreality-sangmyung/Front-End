import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminPage from '../pages/AdminPage';
import DashboardPage from '../pages/DashboardPage';
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
]);

export default router;
