import { Bell, ChevronRight, Globe, Moon, Save, Shield, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import SettingsRow from '../components/settings/SettingsRow';
import SettingsSection from '../components/settings/SettingsSection';
import SettingsToggle from '../components/settings/SettingsToggle';
import '../styles/twinDesignSystem.css';
import './SettingsPage.css';

function SettingsPage() {
  const [name, setName] = useState('정태웅');
  const [email, setEmail] = useState('taewung.jung@example.com');
  const [organization, setOrganization] = useState('HN Inc.');

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [errorAlerts, setErrorAlerts] = useState(true);

  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionLog, setSessionLog] = useState(true);
  const [apiAccess, setApiAccess] = useState(true);

  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('ko');
  const [timezone, setTimezone] = useState('Asia/Seoul');

  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!showSaved) {
      return;
    }
    const timer = window.setTimeout(() => setShowSaved(false), 2400);
    return () => window.clearTimeout(timer);
  }, [showSaved]);

  const handleSave = () => {
    setShowSaved(true);
  };

  return (
    <main className="admin-page settings-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">// SETTINGS</p>
          <h1>설정</h1>
        </div>
        <button
          type="button"
          className="twin-btn twin-btn--primary admin-page__register-btn"
          onClick={handleSave}
        >
          <Save size={14} strokeWidth={2.5} />
          저장
        </button>
      </header>

      {showSaved ? <p className="settings-page__saved">저장되었습니다.</p> : null}

      <div className="settings-page__sections">
        <SettingsSection icon={User} eyebrow="PROFILE" title="프로필">
          <SettingsRow label="이름">
            <input
              type="text"
              className="twin-control settings-row__input"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </SettingsRow>
          <SettingsRow label="이메일" description="알림 수신에 사용됩니다">
            <input
              type="email"
              className="twin-control settings-row__input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </SettingsRow>
          <SettingsRow label="소속 기관">
            <input
              type="text"
              className="twin-control settings-row__input"
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection icon={Bell} eyebrow="NOTIFICATIONS" title="알림">
          <SettingsRow label="이메일 알림" description="중요 이벤트를 이메일로 수신">
            <SettingsToggle checked={emailAlerts} onChange={setEmailAlerts} label="이메일 알림" />
          </SettingsRow>
          <SettingsRow label="푸시 알림" description="브라우저 푸시 알림">
            <SettingsToggle checked={pushAlerts} onChange={setPushAlerts} label="푸시 알림" />
          </SettingsRow>
          <SettingsRow label="주간 리포트" description="매주 월요일 오전 9시 발송">
            <SettingsToggle checked={weeklyReport} onChange={setWeeklyReport} label="주간 리포트" />
          </SettingsRow>
          <SettingsRow label="오류 알림" description="트윈 오프라인 경고 즉시 알림">
            <SettingsToggle checked={errorAlerts} onChange={setErrorAlerts} label="오류 알림" />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection icon={Shield} eyebrow="SECURITY" title="보안">
          <SettingsRow label="2단계 인증" description="로그인 시 추가 인증 요구">
            <SettingsToggle checked={twoFactor} onChange={setTwoFactor} label="2단계 인증" />
          </SettingsRow>
          <SettingsRow label="세션 로그" description="로그인 기록 보관">
            <SettingsToggle checked={sessionLog} onChange={setSessionLog} label="세션 로그" />
          </SettingsRow>
          <SettingsRow label="API 외부 접근" description="외부 API 키 접근 허용">
            <SettingsToggle checked={apiAccess} onChange={setApiAccess} label="API 외부 접근" />
          </SettingsRow>
          <SettingsRow label="비밀번호 변경">
            <button type="button" className="settings-row__link">
              변경하기
              <ChevronRight size={14} />
            </button>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection icon={Globe} eyebrow="DISPLAY" title="화면 설정">
          <SettingsRow label="다크 모드">
            <SettingsToggle checked={darkMode} onChange={setDarkMode} label="다크 모드" />
          </SettingsRow>
          <SettingsRow label="언어">
            <select
              className="twin-control settings-row__select"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </SettingsRow>
          <SettingsRow label="시간대">
            <select
              className="twin-control settings-row__select"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
            >
              <option value="Asia/Seoul">Asia/Seoul (KST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
            </select>
          </SettingsRow>
          <SettingsRow label="다크 모드 아이콘">
            <Moon size={16} className="settings-row__static-icon" />
          </SettingsRow>
        </SettingsSection>
      </div>
    </main>
  );
}

export default SettingsPage;
