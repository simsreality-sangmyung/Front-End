import { ArrowLeft, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/twinDesignSystem.css';
import './LandingPage.css';

/**
 * 메인 랜딩페이지 준비중 임시 페이지 (/landing).
 *
 * 실제 랜딩페이지(카드/목록/슬라이더/검색 등)는 다른 팀원이 별도로 개발할 예정입니다.
 * 그 화면이 완성되면 이 컴포넌트를 실제 화면 컴포넌트로 교체하면 되고, 라우트
 * 경로(/landing)와 진입점(Sidebar 로고 옆 지구본 아이콘 링크)은 그대로 유지됩니다.
 */
function LandingPage() {
  return (
    <main className="landing-page">
      <div className="landing-page__card twin-card">
        <span className="landing-page__icon">
          <Globe size={22} strokeWidth={2} />
        </span>
        <p className="landing-page__eyebrow">// DIGITAL TWIN PLATFORM</p>
        <h1 className="landing-page__title">DIGITAL TWIN PLATFORM</h1>
        <p className="landing-page__message">
          메인 랜딩페이지는 현재 개발 중입니다.
        </p>
        <p className="landing-page__submessage">
          실제 랜딩페이지 개발 완료 후 이 경로에 연결될 예정입니다.
        </p>
        <Link to="/" className="twin-btn twin-btn--primary landing-page__back-btn">
          <ArrowLeft size={14} strokeWidth={2.5} />
          관리자 페이지로 돌아가기
        </Link>
      </div>
    </main>
  );
}

export default LandingPage;
