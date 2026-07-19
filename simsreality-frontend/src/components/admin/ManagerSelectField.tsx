import { useManagerOptions } from '../../hooks/useManagerOptions';

interface ManagerSelectFieldProps {
  managerId: number | null;
  onChange: (managerId: number | null) => void;
  disabled?: boolean;
  helperText?: string;
}

/**
 * 담당자(managerId) 선택 필드.
 * 별도 담당자 전용 API가 없어 GET /api/admin/accounts 목록을 재사용합니다.
 * "선택 안 함"을 유지하면 managerId를 서버로 전송하지 않습니다.
 */
function ManagerSelectField({
  managerId,
  onChange,
  disabled,
  helperText,
}: ManagerSelectFieldProps) {
  const { data: managerOptions = [], isLoading, isError } = useManagerOptions();

  return (
    <label className="block">
      <span className="block text-xs text-white/40 mb-1.5 font-['JetBrains_Mono',monospace]">
        담당자
      </span>
      <select
        className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-[#00d4ff]/50 transition-colors disabled:opacity-50"
        style={{ background: '#0a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}
        value={managerId !== null ? String(managerId) : ''}
        onChange={(event) =>
          onChange(event.target.value ? Number(event.target.value) : null)
        }
        disabled={disabled || isLoading}
      >
        <option value="">담당자 선택 안 함</option>
        {managerOptions.map((manager) => (
          <option key={manager.id} value={manager.id}>
            {`${manager.name} (${manager.email}, ID: ${manager.id})`}
          </option>
        ))}
      </select>
      {isError && (
        <span className="block mt-1 text-xs text-[#ff4466]/80">
          담당자 목록을 불러오지 못했습니다.
        </span>
      )}
      {helperText && (
        <span className="block mt-1 text-xs text-white/30">{helperText}</span>
      )}
    </label>
  );
}

export default ManagerSelectField;
