import { type FormEvent, useState } from 'react';
import AdminModal from '../admin/AdminModal';
import ManagerSelectField from '../admin/ManagerSelectField';
import UploadProgressBar from '../admin/UploadProgressBar';
import {
  TWIN_CATEGORY_OPTIONS,
  type CreateAdminItemInput,
  type TwinCategory,
} from '../../types/adminItem';
import {
  getImageExtensionLabel,
  getModelFileExtensionLabel,
  getRegisterExecutableExtensionLabel,
  getRegisterThreeJsExtensionLabel,
  IMAGE_ACCEPT,
  isValidImageFile,
  isValidModelFile,
  isValidRegisterExecutableFile,
  isValidThreeJsFile,
  MODEL_FILE_ACCEPT,
  REGISTER_EXECUTABLE_ACCEPT,
  REGISTER_THREEJS_ACCEPT,
} from '../../utils/fileValidation';

interface TwinRegisterModalProps {
  isSubmitting: boolean;
  uploadProgress: number | null;
  submitError: string | null;
  onSubmit: (input: CreateAdminItemInput) => void;
  onClose: () => void;
}

/**
 * 재사용 가능한 "디지털트윈 등록" 팝업.
 * 필드/FormData 키는 POST /api/admin/digital-twins 명세를 그대로 따릅니다.
 * 담당자(managerId)는 별도 담당자 API가 없어 계정 목록(GET /api/admin/accounts)을
 * 재사용해 선택할 수 있게 구성했습니다.
 */
function TwinRegisterModal({
  isSubmitting,
  uploadProgress,
  submitError,
  onSubmit,
  onClose,
}: TwinRegisterModalProps) {
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TwinCategory>(
    TWIN_CATEGORY_OPTIONS[0],
  );
  const [managerId, setManagerId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [executableFile, setExecutableFile] = useState<File | null>(null);
  const [threeJsFile, setThreeJsFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (imageFile && !isValidImageFile(imageFile)) {
      setError(`대표 이미지는 ${getImageExtensionLabel()} 파일만 업로드할 수 있습니다.`);
      return;
    }
    if (executableFile && !isValidRegisterExecutableFile(executableFile)) {
      setError(
        `실행파일은 .${getRegisterExecutableExtensionLabel()} 형식만 업로드할 수 있습니다.`,
      );
      return;
    }
    if (threeJsFile && !isValidThreeJsFile(threeJsFile)) {
      setError(
        `Three.js 구성 파일은 .${getRegisterThreeJsExtensionLabel()} 형식만 업로드할 수 있습니다.`,
      );
      return;
    }
    if (modelFile && !isValidModelFile(modelFile)) {
      setError(
        `3D 모델링 파일은 .${getModelFileExtensionLabel()} 형식만 업로드할 수 있습니다.`,
      );
      return;
    }

    onSubmit({
      title: trimmedTitle,
      place: place.trim(),
      description: description.trim(),
      category,
      managerId,
      imageFile,
      executableFile,
      threeJsFile,
      modelFile,
    });
  };

  const displayError = error || submitError;

  return (
    <AdminModal onClose={onClose} isCloseDisabled={isSubmitting}>
      <section className="twin-form twin-form--in-modal">
        <div className="twin-form__header">
          <h2>디지털트윈 등록</h2>
          <p className="twin-form__description">
            Three.js Viewer에서 사용할 3D 모델링 파일을 서버에 등록합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="twin-form__fields">
            <label className="twin-form__field">
              <span className="twin-field-label">제목</span>
              <input
                className="twin-control"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="디지털트윈 제목을 입력하세요"
                disabled={isSubmitting}
              />
            </label>

            <label className="twin-form__field">
              <span className="twin-field-label">장소 및 건물명</span>
              <input
                className="twin-control"
                type="text"
                value={place}
                onChange={(event) => setPlace(event.target.value)}
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

            <ManagerSelectField
              managerId={managerId}
              onChange={setManagerId}
              disabled={isSubmitting}
            />

            <label className="twin-form__field twin-form__field--full">
              <span className="twin-field-label">설명</span>
              <textarea
                className="twin-control twin-control--textarea"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="설명을 입력하세요"
                rows={3}
                disabled={isSubmitting}
              />
            </label>

            <label className="twin-form__field">
              <span className="twin-field-label">
                대표 이미지 ({getImageExtensionLabel()})
              </span>
              <input
                className="twin-form__file-input"
                type="file"
                accept={IMAGE_ACCEPT}
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] ?? null)
                }
                disabled={isSubmitting}
              />
              {imageFile ? (
                <span className="twin-form__file-name twin-form__file-name--selected">
                  선택된 파일: {imageFile.name}
                </span>
              ) : (
                <span className="twin-form__file-name">선택된 파일 없음</span>
              )}
            </label>

            <label className="twin-form__field">
              <span className="twin-field-label">
                실행파일 (.{getRegisterExecutableExtensionLabel()})
              </span>
              <input
                className="twin-form__file-input"
                type="file"
                accept={REGISTER_EXECUTABLE_ACCEPT}
                onChange={(event) =>
                  setExecutableFile(event.target.files?.[0] ?? null)
                }
                disabled={isSubmitting}
              />
              {executableFile ? (
                <span className="twin-form__file-name twin-form__file-name--selected">
                  선택된 파일: {executableFile.name}
                </span>
              ) : (
                <span className="twin-form__file-name">선택된 파일 없음</span>
              )}
            </label>

            <label className="twin-form__field">
              <span className="twin-field-label">
                Three.js 구성 파일 (.{getRegisterThreeJsExtensionLabel()})
              </span>
              <input
                className="twin-form__file-input"
                type="file"
                accept={REGISTER_THREEJS_ACCEPT}
                onChange={(event) =>
                  setThreeJsFile(event.target.files?.[0] ?? null)
                }
                disabled={isSubmitting}
              />
              {threeJsFile ? (
                <span className="twin-form__file-name twin-form__file-name--selected">
                  선택된 파일: {threeJsFile.name}
                </span>
              ) : (
                <span className="twin-form__file-name">선택된 파일 없음</span>
              )}
            </label>

            <label className="twin-form__field">
              <span className="twin-field-label">
                3D 모델링 파일 (.{getModelFileExtensionLabel()})
              </span>
              <input
                className="twin-form__file-input"
                type="file"
                accept={MODEL_FILE_ACCEPT}
                onChange={(event) =>
                  setModelFile(event.target.files?.[0] ?? null)
                }
                disabled={isSubmitting}
              />
              {modelFile ? (
                <span className="twin-form__file-name twin-form__file-name--selected">
                  선택된 파일: {modelFile.name}
                </span>
              ) : (
                <span className="twin-form__file-name">선택된 파일 없음</span>
              )}
            </label>
          </div>

          {uploadProgress !== null && (
            <div className="twin-form__progress">
              <UploadProgressBar label="업로드 진행률" progress={uploadProgress} />
            </div>
          )}

          {displayError && <p className="twin-form__error">{displayError}</p>}

          <div className="twin-form__actions">
            <button
              type="submit"
              className="twin-btn twin-btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
            <button
              type="button"
              className="twin-btn twin-btn--ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </button>
          </div>
        </form>
      </section>
    </AdminModal>
  );
}

export default TwinRegisterModal;
