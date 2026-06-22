import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <main>
      <h1>SimsReality</h1>
      <Link to="/sso">로그인</Link>
    </main>
  );
}

export default LandingPage;
