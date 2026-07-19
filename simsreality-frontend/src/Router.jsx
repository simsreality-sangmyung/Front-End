import { createBrowserRouter, Navigate } from 'react-router-dom';
import ErrorFallback from './ErrorFallback';
import RootLayout from './components/RootLayout';
import LandingPage from './pages/LandingPage';
import MainPage from './pages/MainPage';
import SsoPage from './pages/SsoPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'main',
        element: <MainPage />,
      },
      {
        path: 'sso',
        element: <SsoPage />,
      },
      {
        path: 'auth/callback',
        element: <OAuthCallbackPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
