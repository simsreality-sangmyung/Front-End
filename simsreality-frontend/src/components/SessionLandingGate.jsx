import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { hasAppEntered } from '../navigation/sessionEntry';

const PUBLIC_PATHS = new Set(['/', '/auth/callback']);

function SessionLandingGate() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (PUBLIC_PATHS.has(location.pathname)) return;
    if (hasAppEntered()) return;
    navigate('/', { replace: true });
  }, [location.pathname, navigate]);

  return null;
}

export default SessionLandingGate;
