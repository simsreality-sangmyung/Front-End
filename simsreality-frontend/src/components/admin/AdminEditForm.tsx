import { type FormEvent, useState } from 'react';
import {
  TWIN_CATEGORY_OPTIONS,
  TWIN_STATUS_OPTIONS,
  type AdminItem,
  type CreateUploadProgress,
  type TwinCategory,
  type TwinStatus,
} from '../../types/adminItem';
import {
  EXECUTABLE_ACCEPT,
  IMAGE_ACCEPT,
  isValidExecutableFile,
  isValidImageFile,
} from '../../utils/fileValidation';
import UploadProgressBar from './UploadProgressBar';

interface AdminEditFormProps {
  item: AdminItem;
  isSubmitting: boolean;
  uploadProgress: CreateUploadProgress | null;
  onSubmit: (input: {
    id: number;
    title: string;
    description: string;
    location: string;
    category: TwinCategory;
    manager: string;
    status: TwinStatus;
    syncRate: number;
    sensorCount: number;
    imageFile?: File;
    executableFile?: File;
  }) => void;
  onCancel: () => void;
}

function AdminEditForm({
  item,
  isSubmitting,
  uploadProgress,
  onSubmit,
  onCancel,
}: AdminEditFormProps) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [location, setLocation] = useState(item.location);
  const [category, setCategory] = useState<TwinCategory>(item.category);
  const [manager, setManager] = useState(item.manager);
  const [status, setStatus] = useState<TwinStatus>(item.status);
  const [syncRate, setSyncRate] = useState(String(item.syncRate));
  const [sensorCount, setSensorCount] = useState(String(item.sensorCount));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [executableFile, setExecutableFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedLocation = location.trim();
    const trimmedManager = manager.trim();
    const parsedSyncRate = Number(syncRate);
    const parsedSensorCount = Number(sensorCount);

    if (!trimmedTitle) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!trimmedLocation) {
      setError('장소 및 건물명을 입력해주세요.');
      return;
    }
    if (!trimmedManager) {
      setError('담당자를 입력해주세요.');
      return;
    }
    if (Number.isNaN(parsedSyncRate) || parsedSyncRate < 0 || parsedSyncRate > 100) {
      setError('동기화율은 0~100 사이의 숫자로 입력해주세요.');
      return;
    }
    if (Number.isNaN(parsedSensorCount) || parsedSensorCount < 0) {
      setError('센서 수는 0 이상의 숫자로 입력해주세요.');
      return;
    }
    if (imageFile && !isValidImageFile(imageFile)) {
      setError('이미지는 jpg, png 파일만 업로드할 수 있습니다.');
      return;
    }
    if (executableFile && !isValidExecutableFile(executableFile)) {
      setError('실행파일은 zip, 7zip 파일만 업로드할 수 있습니다.');
      return;
    }

    onSubmit({
      id: item.id,
      title: trimmedTitle,
      description: trimmedDescription,
      location: trimmedLocation,
      category,
      manager: trimmedManager,
      status,
      syncRate: parsedSyncRate,
      sensorCount: parsedSensorCount,
      imageFile: imageFile ?? undefined,
      executableFile: executableFile ?? undefined,
    });
  };

  return (
    <section className="twin-form twin-form--in-modal">
      <h2>트윈 수정</h2>

      <form onSubmit={handleSubmit}>
        <div className="twin-form__fields">
          <label className="twin-form__field">
            <span className="twin-field-label">제목</span>
            <input
              className="twin-control"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력하세요"
              disabled={isSubmitting}
            />
          </label>

          <label className="twin-form__field">
            <span className="twin-field-label">장소 및 건물명</span>
            <input
              className="twin-control"
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="장소 및 건물명을 입력하세요"
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

          <label className="twin-form__field">
            <span className="twin-field-label">담당자</span>
            <input
              className="twin-control"
              type="text"
              value={manager}
              onChange={(event) => setManager(event.target.value)}
              placeholder="담당자 이름을 입력하세요"
              disabled={isSubmitting}
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

          <label className="twin-form__field">
            <span className="twin-field-label">동기화율 (%)</span>
            <input
              className="twin-control"
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={syncRate}
              onChange={(event) => setSyncRate(event.target.value)}
              disabled={isSubmitting}
            />
          </label>

          <label className="twin-form__field">
            <span className="twin-field-label">센서 수</span>
            <input
              className="twin-control"
              type="number"
              min={0}
              step={1}
              value={sensorCount}
              onChange={(event) => setSensorCount(event.target.value)}
              disabled={isSubmitting}
            />
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

          <label className="twin-form__field">
            <span className="twin-field-label">이미지 (jpg, png)</span>
            <input
              className="twin-form__file-input"
              type="file"
              accept={IMAGE_ACCEPT}
              onChange={(event) =>
                setImageFile(event.target.files?.[0] ?? null)
              }
              disabled={isSubmitting}
            />
            <span className="twin-form__file-name">
              현재 파일: <code>{item.imageFileName}</code>
            </span>
            {imageFile && (
              <span className="twin-form__file-name twin-form__file-name--selected">
                변경 파일: {imageFile.name}
              </span>
            )}
          </label>

          <label className="twin-form__field">
            <span className="twin-field-label">실행파일 (zip, 7zip)</span>
            <input
              className="twin-form__file-input"
              type="file"
              accept={EXECUTABLE_ACCEPT}
              onChange={(event) =>
                setExecutableFile(event.target.files?.[0] ?? null)
              }
              disabled={isSubmitting}
            />
            <span className="twin-form__file-name">
              현재 파일: <code>{item.executableFileName}</code>
            </span>
            {executableFile && (
              <span className="twin-form__file-name twin-form__file-name--selected">
                변경 파일: {executableFile.name}
              </span>
            )}
          </label>
        </div>

        {uploadProgress && (
          <div className="twin-form__progress">
            <UploadProgressBar
              label="이미지 업로드"
              progress={uploadProgress.image}
            />
            <UploadProgressBar
              label="실행파일 업로드"
              progress={uploadProgress.executable}
            />
            <UploadProgressBar
              label="전체 진행률"
              progress={uploadProgress.overall}
            />
          </div>
        )}

        {error && <p className="twin-form__error">{error}</p>}

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

export default AdminEditForm;
