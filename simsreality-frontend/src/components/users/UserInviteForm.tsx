import { type FormEvent, useState } from 'react';
import { USER_ROLE_OPTIONS, type UserRole } from '../../types/user';

interface UserInviteFormProps {
  isSubmitting: boolean;
  submitError?: string | null;
  onSubmit: (input: {
    name: string;
    email: string;
    role: UserRole;
  }) => void;
  onCancel: () => void;
}

function UserInviteForm({
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: UserInviteFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(USER_ROLE_OPTIONS[0]);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('올바른 이메일을 입력해주세요.');
      return;
    }

    onSubmit({ name: trimmedName, email: trimmedEmail, role });
  };

  return (
    <section className="twin-form twin-form--in-modal">
      <div className="twin-form__header">
        <h2>사용자 초대</h2>
        <p className="twin-form__description">
          새로운 사용자를 초대하면 승인 대기 상태로 등록됩니다.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="twin-form__fields">
          <label className="twin-form__field">
            <span className="twin-field-label">이름</span>
            <input
              className="twin-control"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="이름을 입력하세요"
              disabled={isSubmitting}
            />
          </label>

          <label className="twin-form__field">
            <span className="twin-field-label">이메일</span>
            <input
              className="twin-control"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력하세요"
              disabled={isSubmitting}
            />
          </label>

          <label className="twin-form__field">
            <span className="twin-field-label">역할</span>
            <select
              className="twin-control"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              disabled={isSubmitting}
            >
              {USER_ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="twin-form__error">{error}</p>}
        {submitError && <p className="twin-form__error">{submitError}</p>}

        <div className="twin-form__actions">
          <button
            type="submit"
            className="twin-btn twin-btn--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '초대 중...' : '초대'}
          </button>
          <button
            type="button"
            className="twin-btn twin-btn--ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </button>
        </div>
      </form>
    </section>
  );
}

export default UserInviteForm;
