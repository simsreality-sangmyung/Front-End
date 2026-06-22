import { createBrowserRouter } from 'react-router-dom';
import ErrorFallback from './ErrorFallback';
import LandingPage from './pages/LandingPage';
import SsoPage from './pages/SsoPage';

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
]);

export default Router;
