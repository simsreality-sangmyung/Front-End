import { type FormEvent, useState } from 'react';
import {
  TWIN_CATEGORY_OPTIONS,
  TWIN_STATUS_OPTIONS,
  type AdminItem,
  type TwinCategory,
  type TwinStatus,
} from '../../types/adminItem';
import ManagerSelectField from './ManagerSelectField';

interface AdminEditFormProps {
  item: AdminItem;
  isSubmitting: boolean;
  onSubmit: (input: {
    id: number;
    title: string;
    description: string;
    location: string;
    category: TwinCategory;
    managerId: number | null;
    status: TwinStatus;
  }) => void;
  onCancel: () => void;
}

function AdminEditForm({
  item,
  isSubmitting,
  onSubmit,
  onCancel,
}: AdminEditFormProps) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [location, setLocation] = useState(item.location);
  const [category, setCategory] = useState<TwinCategory>(item.category);
  // 목록 응답의 managerId로 현재 담당자를 기본 선택합니다.
  const [managerId, setManagerId] = useState<number | null>(item.managerId);
  // 상태는 API 응답에 없는 필드라 mock 값으로 채워져 있습니다
  // (src/types/adminItem.ts, adminItemMapper.ts 참고). 입력 UI는 Figma와 동일하게
  // 유지하지만, 제출해도 서버에는 저장되지 않습니다.
  const [status, setStatus] = useState<TwinStatus>(item.status);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedLocation = location.trim();

    if (!trimmedTitle) {
      setError('트윈 이름을 입력해주세요.');
      return;
    }
    if (!trimmedLocation) {
      setError('위치를 입력해주세요.');
      return;
    }

    onSubmit({
      id: item.id,
      title: trimmedTitle,
      description: trimmedDescription,
      location: trimmedLocation,
      category,
      managerId,
      status,
    });
  };

  return (
    <section className="twin-form twin-form--in-modal">
      <h2>트윈 수정</h2>

      <form onSubmit={handleSubmit}>
        <div className="twin-form__fields">
          <label className="twin-form__field">
            <span className="twin-field-label">트윈 이름</span>
            <input
              className="twin-control"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="트윈 이름을 입력하세요"
              disabled={isSubmitting}
            />
          </label>

          <label className="twin-form__field">
            <span className="twin-field-label">유형</span>
            <select
              className="twin-control"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as TwinCategory)
              }
              disabled={isSubmitting}
            >
              {TWIN_CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <ManagerSelectField
            managerId={managerId}
            onChange={setManagerId}
            disabled={isSubmitting}
          />

          <label className="twin-form__field">
            <span className="twin-field-label">위치</span>
            <input
              className="twin-control"
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="위치를 입력하세요"
              disabled={isSubmitting}
            />
          </label>

          {/* 등록일자는 서버가 생성하는 값으로 읽기 전용이며, 제출 payload에 포함되지 않습니다. */}
          <label className="twin-form__field">
            <span className="twin-field-label">등록일자</span>
            <input
              className="twin-control"
              type="text"
              value={item.registeredAt}
              disabled
              readOnly
            />
          </label>

          <label className="twin-form__field">
            <span className="twin-field-label">상태</span>
            <select
              className="twin-control"
              value={status}
              onChange={(event) => setStatus(event.target.value as TwinStatus)}
              disabled={isSubmitting}
            >
              {TWIN_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="twin-form__field twin-form__field--full">
            <span className="twin-field-label">설명</span>
            <textarea
              className="twin-control twin-control--textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="설명을 입력하세요"
              rows={4}
              disabled={isSubmitting}
            />
          </label>
        </div>

        {error && <p className="twin-form__error">{error}</p>}

        <div className="twin-form__actions">
          <button
            type="submit"
            className="twin-btn twin-btn--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '저장'}
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

export default AdminEditForm;
