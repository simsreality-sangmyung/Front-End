import { Outlet } from 'react-router-dom';
import SessionLandingGate from './SessionLandingGate';

function RootLayout() {
  return (
    <>
      <SessionLandingGate />
      <Outlet />
    </>
  );
}

export default RootLayout;
