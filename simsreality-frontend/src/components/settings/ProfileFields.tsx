import SettingsRow from './SettingsRow';
import type { MemberMeResponse } from '../../types/member';

interface ProfileFieldsProps {
  profile: MemberMeResponse;
}

// 본인 프로필 수정 API가 없어 읽기 전용으로 표시합니다.
// (소속 기관은 API 응답에 없는 값이라 기본값을 그대로 노출)
const readonlyClassName =
  "px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/8 text-sm text-white/60 w-48 font-['JetBrains_Mono',monospace] cursor-not-allowed";

const DEFAULT_ORGANIZATION = 'HN Inc.';

function ProfileFields({ profile }: ProfileFieldsProps) {
  return (
    <>
      <SettingsRow label="이름">
        <input
          type="text"
          className={readonlyClassName}
          value={profile.name}
          readOnly
          disabled
        />
      </SettingsRow>
      <SettingsRow label="이메일" description="알림 수신에 사용됩니다">
        <input
          type="email"
          className={readonlyClassName}
          value={profile.email}
          readOnly
          disabled
        />
      </SettingsRow>
      <SettingsRow label="소속 기관">
        <input
          type="text"
          className={readonlyClassName}
          value={DEFAULT_ORGANIZATION}
          readOnly
          disabled
        />
      </SettingsRow>
    </>
  );
}

export default ProfileFields;
