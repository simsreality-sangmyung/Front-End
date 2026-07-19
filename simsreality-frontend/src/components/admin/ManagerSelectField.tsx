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
    <label className="twin-form__field">
      <span className="twin-field-label">담당자</span>
      <select
        className="twin-control"
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
        <span className="twin-form__file-name">
          담당자 목록을 불러오지 못했습니다.
        </span>
      )}
      {helperText && <span className="twin-form__file-name">{helperText}</span>}
    </label>
  );
}

export default ManagerSelectField;
