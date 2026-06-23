import { Link, useNavigate } from 'react-router-dom';
import { postLogoutApi } from '../api/domains/authApi';
import { clearAccessToken, hasAccessToken } from '../api/auth/tokenStore';

function LandingPage() {
  const navigate = useNavigate();
  const loggedIn = hasAccessToken();

  const handleLogout = async () => {
    try {
      // 서버측 refresh 토큰 삭제 + 쿠키 만료. 실패해도 클라이언트 토큰은 정리한다.
      await postLogoutApi().execute();
    } catch {
      // 이미 만료/무효여도 무시하고 진행
    } finally {
      clearAccessToken();
      navigate('/sso', { replace: true });
    }
  };

  return (
    <main>
      <h1>SimsReality</h1>
      {loggedIn ? (
        <button type="button" onClick={handleLogout}>
          로그아웃
        </button>
      ) : (
        <Link to="/sso">로그인</Link>
      )}
    </main>
  );
}

export default LandingPage;
