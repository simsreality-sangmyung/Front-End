import { type FormEvent, useState } from 'react';
import { USER_ROLE_OPTIONS, type User, type UserRole } from '../../types/user';

interface UserEditFormProps {
  user: User;
  isSubmitting: boolean;
  submitError?: string | null;
  onSubmit: (input: { id: number; name: string; role: UserRole }) => void;
  onCancel: () => void;
}

function UserEditForm({
  user,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: UserEditFormProps) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('이름을 입력해주세요.');
      return;
    }

    onSubmit({ id: user.id, name: trimmedName, role });
  };

  return (
    <section className="twin-form twin-form--in-modal">
      <h2>사용자 수정</h2>

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
            <input className="twin-control" type="text" value={user.email} disabled />
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
            {isSubmitting ? '수정 중...' : '수정'}
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

export default UserEditForm;
