import { Save } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import {
  TWIN_CATEGORY_OPTIONS,
  TWIN_STATUS_OPTIONS,
  type AdminItem,
  type AdminTwinDetail,
  type TwinCategory,
  type TwinStatus,
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
import { useTwinDetail } from '../../hooks/useTwinDetail';
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
    imageFile: File | null;
    executableFile: File | null;
    threeJsFile: File | null;
    modelFile: File | null;
  }) => void;
  onCancel: () => void;
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

function EditFormHeader() {
  return (
    <div className="mb-5 pb-4" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
      <p className="text-[#00d4ff] text-[10px] tracking-[0.2em] font-['JetBrains_Mono',monospace] mb-1">
        // EDIT TWIN
      </p>
      <h2 className="text-lg font-bold text-white">트윈 수정</h2>
    </div>
  );
}

function AdminEditForm({
  item,
  isSubmitting,
  onSubmit,
  onCancel,
}: AdminEditFormProps) {
  const { data: detail, isLoading } = useTwinDetail(item.id);

  if (isLoading) {
    return (
      <section className="px-7 py-6 font-['Rajdhani',sans-serif]">
        <EditFormHeader />
        <p className="py-8 text-center text-sm text-white/40 font-['JetBrains_Mono',monospace]">
          상세 정보를 불러오는 중...
        </p>
      </section>
    );
  }

  return (
    <EditFormFields
      item={item}
      detail={detail ?? null}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}

interface EditFormFieldsProps extends AdminEditFormProps {
  detail: AdminTwinDetail | null;
}

function EditFormFields({
  item,
  detail,
  isSubmitting,
  onSubmit,
  onCancel,
}: EditFormFieldsProps) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(detail?.description ?? '');
  const [location, setLocation] = useState(item.location);
  const [category, setCategory] = useState<TwinCategory>(item.category);
  const [managerId, setManagerId] = useState<number | null>(item.managerId);
  // 상태는 API 응답에 없는 mock 필드라 제출해도 서버에 저장되지 않습니다.
  const [status, setStatus] = useState<TwinStatus>(item.status);
  // 파일은 새로 교체할 때만 선택. 미선택 시 서버가 기존 파일을 유지한다.
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [executableFile, setExecutableFile] = useState<File | null>(null);
  const [threeJsFile, setThreeJsFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
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
    if (imageFile && !isValidImageFile(imageFile)) {
      setError(`대표 이미지는 ${getImageExtensionLabel()} 파일만 업로드할 수 있습니다.`);
      return;
    }
    if (executableFile && !isValidRegisterExecutableFile(executableFile)) {
      setError(`실행파일은 .${getRegisterExecutableExtensionLabel()} 형식만 업로드할 수 있습니다.`);
      return;
    }
    if (threeJsFile && !isValidThreeJsFile(threeJsFile)) {
      setError(`Three.js 구성 파일은 .${getRegisterThreeJsExtensionLabel()} 형식만 업로드할 수 있습니다.`);
      return;
    }
    if (modelFile && !isValidModelFile(modelFile)) {
      setError(`3D 모델링 파일은 .${getModelFileExtensionLabel()} 형식만 업로드할 수 있습니다.`);
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
      imageFile,
      executableFile,
      threeJsFile,
      modelFile,
    });
  };

  const renderFileState = (newFile: File | null, currentName: string | null) => {
    if (newFile) {
      return (
        <span className="block mt-1.5 text-xs text-[#00ff88] font-['JetBrains_Mono',monospace]">
          새 파일: {newFile.name}
        </span>
      );
    }
    return (
      <span className="block mt-1.5 text-xs text-white/30 font-['JetBrains_Mono',monospace]">
        현재: {currentName ?? '없음'}
        {currentName ? ' (선택 안 하면 유지)' : ''}
      </span>
    );
  };

  return (
    <section className="px-7 py-6 font-['Rajdhani',sans-serif]">
      <EditFormHeader />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <label className="block">
            <span className={LABEL_CLASS}>트윈 이름</span>
            <input
              className={INPUT_CLASS}
              style={INPUT_STYLE}
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="트윈 이름을 입력하세요"
              disabled={isSubmitting}
            />
          </label>

          <label className="block">
            <span className={LABEL_CLASS}>유형</span>
            <select
              className={INPUT_CLASS}
              style={SELECT_STYLE}
              value={category}
              onChange={(event) => setCategory(event.target.value as TwinCategory)}
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

          <label className="block">
            <span className={LABEL_CLASS}>위치</span>
            <input
              className={INPUT_CLASS}
              style={INPUT_STYLE}
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="위치를 입력하세요"
              disabled={isSubmitting}
            />
          </label>

          {/* 등록일자는 읽기 전용이며 제출 payload에 포함되지 않습니다. */}
          <label className="block">
            <span className={LABEL_CLASS}>등록일자</span>
            <input
              className={`${INPUT_CLASS} font-['JetBrains_Mono',monospace] text-white/50`}
              style={INPUT_STYLE}
              type="text"
              value={item.registeredAt}
              disabled
              readOnly
            />
          </label>

          <label className="block">
            <span className={LABEL_CLASS}>상태</span>
            <select
              className={INPUT_CLASS}
              style={SELECT_STYLE}
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

          <div className="col-span-2 pt-1">
            <p className="text-[10px] tracking-[0.15em] text-white/30 font-['JetBrains_Mono',monospace] mb-2">
              // 파일 교체 (선택 안 하면 기존 파일 유지)
            </p>
          </div>

          <label className="block col-span-2">
            <span className={LABEL_CLASS}>썸네일 이미지</span>
            <input
              className={FILE_INPUT_CLASS}
              type="file"
              accept={IMAGE_ACCEPT}
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              disabled={isSubmitting}
            />
            {renderFileState(imageFile, detail?.imageFileName ?? null)}
          </label>

          <label className="block col-span-2">
            <span className={LABEL_CLASS}>3D 모델링 파일</span>
            <input
              className={FILE_INPUT_CLASS}
              type="file"
              accept={MODEL_FILE_ACCEPT}
              onChange={(event) => setModelFile(event.target.files?.[0] ?? null)}
              disabled={isSubmitting}
            />
            {renderFileState(modelFile, detail?.modelFileName ?? null)}
          </label>

          <label className="block col-span-2">
            <span className={LABEL_CLASS}>실행파일</span>
            <input
              className={FILE_INPUT_CLASS}
              type="file"
              accept={REGISTER_EXECUTABLE_ACCEPT}
              onChange={(event) => setExecutableFile(event.target.files?.[0] ?? null)}
              disabled={isSubmitting}
            />
            {renderFileState(executableFile, detail?.executableFileName ?? null)}
          </label>

          <label className="block col-span-2">
            <span className={LABEL_CLASS}>Three.js 구성 파일</span>
            <input
              className={FILE_INPUT_CLASS}
              type="file"
              accept={REGISTER_THREEJS_ACCEPT}
              onChange={(event) => setThreeJsFile(event.target.files?.[0] ?? null)}
              disabled={isSubmitting}
            />
            {renderFileState(threeJsFile, null)}
          </label>
        </div>

        {error && <p className="mb-4 text-sm text-[#ff4466]">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={onCancel}
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
            <Save className="w-4 h-4" />
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminEditForm;
