import { UploadCloud } from 'lucide-react';
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

const LABEL_CLASS =
  "block text-xs text-white/40 mb-1.5 font-['JetBrains_Mono',monospace]";
const INPUT_CLASS =
  'w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/50 transition-colors disabled:opacity-50';
const INPUT_STYLE = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
};
const SELECT_STYLE = {
  background: '#0a1a2e',
  border: '1px solid rgba(255,255,255,0.1)',
};
const FILE_INPUT_CLASS =
  "w-full text-xs text-white/50 font-['JetBrains_Mono',monospace] file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#00d4ff]/15 file:text-[#00d4ff] file:cursor-pointer hover:file:bg-[#00d4ff]/25 disabled:opacity-50";

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

  const renderFileName = (file: File | null) =>
    file ? (
      <span className="block mt-1.5 text-xs text-[#00ff88] font-['JetBrains_Mono',monospace]">
        선택된 파일: {file.name}
      </span>
    ) : (
      <span className="block mt-1.5 text-xs text-white/25 font-['JetBrains_Mono',monospace]">
        선택된 파일 없음
      </span>
    );

  return (
    <AdminModal onClose={onClose} isCloseDisabled={isSubmitting}>
      <section className="px-7 py-6 font-['Rajdhani',sans-serif]">
        <div
          className="mb-5 pb-4"
          style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}
        >
          <p className="text-[#00d4ff] text-[10px] tracking-[0.2em] font-['JetBrains_Mono',monospace] mb-1">
            // REGISTER TWIN
          </p>
          <h2 className="text-lg font-bold text-white">디지털트윈 등록</h2>
          <p className="text-white/40 text-xs mt-1">
            Three.js Viewer에서 사용할 3D 모델링 파일을 서버에 등록합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <label className="block">
              <span className={LABEL_CLASS}>제목</span>
              <input
                className={INPUT_CLASS}
                style={INPUT_STYLE}
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="디지털트윈 제목을 입력하세요"
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className={LABEL_CLASS}>장소 및 건물명</span>
              <input
                className={INPUT_CLASS}
                style={INPUT_STYLE}
                type="text"
                value={place}
                onChange={(event) => setPlace(event.target.value)}
                placeholder="장소 및 건물명을 입력하세요"
                disabled={isSubmitting}
              />
            </label>

            <label className="block">
              <span className={LABEL_CLASS}>유형</span>
              <select
                className={INPUT_CLASS}
                style={SELECT_STYLE}
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

            <label className="block col-span-2">
              <span className={LABEL_CLASS}>설명</span>
              <textarea
                className={`${INPUT_CLASS} resize-none`}
                style={INPUT_STYLE}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="설명을 입력하세요"
                rows={3}
                disabled={isSubmitting}
              />
            </label>

            <label className="block col-span-2">
              <span className={LABEL_CLASS}>
                대표 이미지 ({getImageExtensionLabel()})
              </span>
              <input
                className={FILE_INPUT_CLASS}
                type="file"
                accept={IMAGE_ACCEPT}
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] ?? null)
                }
                disabled={isSubmitting}
              />
              {renderFileName(imageFile)}
            </label>

            <label className="block col-span-2">
              <span className={LABEL_CLASS}>
                실행파일 (.{getRegisterExecutableExtensionLabel()})
              </span>
              <input
                className={FILE_INPUT_CLASS}
                type="file"
                accept={REGISTER_EXECUTABLE_ACCEPT}
                onChange={(event) =>
                  setExecutableFile(event.target.files?.[0] ?? null)
                }
                disabled={isSubmitting}
              />
              {renderFileName(executableFile)}
            </label>

            <label className="block col-span-2">
              <span className={LABEL_CLASS}>
                Three.js 구성 파일 (.{getRegisterThreeJsExtensionLabel()})
              </span>
              <input
                className={FILE_INPUT_CLASS}
                type="file"
                accept={REGISTER_THREEJS_ACCEPT}
                onChange={(event) =>
                  setThreeJsFile(event.target.files?.[0] ?? null)
                }
                disabled={isSubmitting}
              />
              {renderFileName(threeJsFile)}
            </label>

            <label className="block col-span-2">
              <span className={LABEL_CLASS}>
                3D 모델링 파일 (.{getModelFileExtensionLabel()})
              </span>
              <input
                className={FILE_INPUT_CLASS}
                type="file"
                accept={MODEL_FILE_ACCEPT}
                onChange={(event) =>
                  setModelFile(event.target.files?.[0] ?? null)
                }
                disabled={isSubmitting}
              />
              {renderFileName(modelFile)}
            </label>
          </div>

          {uploadProgress !== null && (
            <div className="mb-4">
              <UploadProgressBar label="업로드 진행률" progress={uploadProgress} />
            </div>
          )}

          {displayError && (
            <p className="mb-4 text-sm text-[#ff4466]">{displayError}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-[#020b18] transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#00d4ff' }}
              disabled={isSubmitting}
            >
              <UploadCloud className="w-4 h-4" />
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </section>
    </AdminModal>
  );
}

export default TwinRegisterModal;
