import { type FormEvent, useState } from 'react';
import {
  USER_PLAN_OPTIONS,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
  type User,
  type UserPlan,
  type UserRole,
  type UserStatus,
} from '../../types/user';

interface UserEditFormProps {
  user: User;
  isSubmitting: boolean;
  onSubmit: (input: {
    id: number;
    role: UserRole;
    plan: UserPlan;
    status: UserStatus;
  }) => void;
  onCancel: () => void;
}

function UserEditForm({
  user,
  isSubmitting,
  onSubmit,
  onCancel,
}: UserEditFormProps) {
  const [role, setRole] = useState<UserRole>(user.role);
  const [plan, setPlan] = useState<UserPlan>(user.plan);
  const [status, setStatus] = useState<UserStatus>(user.status);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ id: user.id, role, plan, status });
  };

  return (
    <section className="twin-form twin-form--in-modal">
      <h2>사용자 수정</h2>

      <form onSubmit={handleSubmit}>
        <div className="twin-form__fields">
          <label className="twin-form__field">
            <span className="twin-field-label">이름</span>
            <input className="twin-control" type="text" value={user.name} disabled />
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

          <label className="twin-form__field">
            <span className="twin-field-label">플랜</span>
            <select
              className="twin-control"
              value={plan}
              onChange={(event) => setPlan(event.target.value as UserPlan)}
              disabled={isSubmitting}
            >
              {USER_PLAN_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="twin-form__field">
            <span className="twin-field-label">상태</span>
            <select
              className="twin-control"
              value={status}
              onChange={(event) => setStatus(event.target.value as UserStatus)}
              disabled={isSubmitting}
            >
              {USER_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

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
