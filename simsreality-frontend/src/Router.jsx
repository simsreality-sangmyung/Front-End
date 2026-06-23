import { createBrowserRouter } from 'react-router-dom';
import ErrorFallback from './ErrorFallback';
import LandingPage from './pages/LandingPage';
import SsoPage from './pages/SsoPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/sso',
    element: <SsoPage />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/auth/callback',
    element: <OAuthCallbackPage />,
    errorElement: <ErrorFallback />,
  },
]);

export default Router;
