import { ArrowLeft, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/twinDesignSystem.css';
import './MyTwinsPage.css';

/**
 * "내 디지털트윈" 준비중 임시 페이지 (/my-twins).
 *
 * 실제 사용자용 디지털트윈 화면(카드/통계/검색/목록)은 다른 팀원이 별도로 개발할
 * 예정입니다. 그 화면이 완성되면 이 컴포넌트를 실제 화면 컴포넌트로 교체하면 되고,
 * 라우트 경로(/my-twins)와 진입점(Sidebar의 "사용자 화면으로" 링크)은 그대로 유지됩니다.
 */
function MyTwinsPage() {
  return (
    <main className="my-twins-page">
      <div className="my-twins-page__card twin-card">
        <span className="my-twins-page__icon">
          <Box size={22} strokeWidth={2} />
        </span>
        <p className="my-twins-page__eyebrow">// MY DIGITAL TWINS</p>
        <h1 className="my-twins-page__title">내 디지털트윈</h1>
        <p className="my-twins-page__message">
          사용자용 디지털트윈 화면은 준비 중입니다.
        </p>
        <p className="my-twins-page__submessage">
          실제 사용자 화면 개발 완료 후 이 경로에 연결될 예정입니다.
        </p>
        <Link to="/" className="twin-btn twin-btn--primary my-twins-page__back-btn">
          <ArrowLeft size={14} strokeWidth={2.5} />
          관리자 페이지로 돌아가기
        </Link>
      </div>
    </main>
  );
}

export default MyTwinsPage;
