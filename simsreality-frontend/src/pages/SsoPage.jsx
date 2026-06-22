import { Link } from 'react-router-dom';

const SSO_PROVIDER_URL = import.meta.env.VITE_SSO_URL ?? '';

function SsoPage() {
  const handleSsoLogin = () => {
    if (SSO_PROVIDER_URL) {
      window.location.href = SSO_PROVIDER_URL;
      return;
    }

    alert('SSO 연동 URL이 설정되지 않았습니다. VITE_SSO_URL 환경 변수를 확인해 주세요.');
  };

  return (
    <main>
      <Link to="/">홈</Link>
      <h1>로그인</h1>
      <button type="button" onClick={handleSsoLogin}>
        SSO 로그인
      </button>
    </main>
  );
}

export default SsoPage;
