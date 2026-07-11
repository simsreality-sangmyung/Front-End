import { useState } from 'react';
import SettingsRow from './SettingsRow';
import type { MemberMeResponse } from '../../types/member';

interface ProfileFieldsProps {
  profile: MemberMeResponse;
}

/**
 * GET /api/members/me 응답의 name/email로 입력의 초기값을 채웁니다.
 * (부모에서 profile이 준비되기 전/실패 시에는 key가 바뀌지 않아 이 컴포넌트가
 * 다시 마운트되지 않으므로, 마운트 시 1회만 초기화되는 useState로 충분합니다.)
 * 소속 기관은 Swagger 응답에 없는 필드라 기존 더미 값을 그대로 사용합니다.
 */
function ProfileFields({ profile }: ProfileFieldsProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [organization, setOrganization] = useState('HN Inc.');

  return (
    <>
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
    </>
  );
}

export default ProfileFields;
