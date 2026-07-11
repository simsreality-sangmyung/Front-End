export type TwinCategory = '물류센터' | '제조센터';

export type TwinStatus = '정상' | '경고' | '오프라인';

export const TWIN_CATEGORY_OPTIONS: TwinCategory[] = ['물류센터', '제조센터'];

export const TWIN_STATUS_OPTIONS: TwinStatus[] = ['정상', '경고', '오프라인'];

/**
 * UI 표시용 모델. Swagger 목록 응답(AdminDigitalTwinListResponse)에는
 * manager/syncRate/sensorCount/status 필드가 존재하지 않습니다.
 * 해당 필드는 서버 데이터가 아니라, 화면(UI)을 유지하기 위한 더미 값입니다
 * (src/utils/adminItemMapper.ts의 getDummy* 함수 참고).
 */
export interface AdminItem {
  id: number;
  title: string;
  description: string;
  location: string;
  category: TwinCategory;
  /** Swagger 응답에 없는 필드 — 더미 값 */
  manager: string;
  /** Swagger 응답에 없는 필드 — 더미 값 */
  syncRate: number;
  /** Swagger 응답에 없는 필드 — 더미 값 */
  sensorCount: number;
  /** Swagger 응답에 없는 필드 — 더미 값 */
  status: TwinStatus;
  imageFileName: string;
  registeredAt: string;
  viewCount: number;
  executableFileName: string;
}

export interface AdminItemSearchParams {
  keyword?: string;
  registeredAt?: string;
  category?: TwinCategory | 'all';
  status?: TwinStatus | 'all';
  /** 0-based (API 기준) */
  page?: number;
  size?: number;
  sort?: AdminItemSortOption;
}

export interface AdminItemsPageResult {
  items: AdminItem[];
  /** 0-based (API 기준) */
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type AdminItemSortOption = 'newest' | 'oldest' | 'sync-desc' | 'sync-asc';

export const ADMIN_ITEM_SORT_OPTIONS: {
  value: AdminItemSortOption;
  label: string;
}[] = [
  { value: 'newest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'sync-desc', label: '동기화율 높은순' },
  { value: 'sync-asc', label: '동기화율 낮은순' },
];

/**
 * 디지털트윈 등록(POST /api/admin/digital-twins) 요청 입력.
 * 필드명은 Swagger 문서(title/place/description/category/image/executableFile/threeJs/model)를 그대로 따릅니다.
 * "담당자"는 Swagger 등록 API에 없는 필드라 포함하지 않습니다.
 */
export interface CreateAdminItemInput {
  title: string;
  place: string;
  description: string;
  category: TwinCategory;
  imageFile: File | null;
  executableFile: File | null;
  threeJsFile: File | null;
  modelFile: File | null;
}

/**
 * Swagger 등록 API의 category 필드는 boolean 문자열을 기대합니다.
 * 물류센터 → "false", 제조센터 → "true"
 */
export function mapTwinCategoryToApiValue(
  category: TwinCategory,
): 'true' | 'false' {
  return category === '제조센터' ? 'true' : 'false';
}

/**
 * Swagger category 값 → UI TwinCategory.
 * 서버 응답은 문자열("true"/"false"/"1"/"0")뿐 아니라 실제 boolean(true/false)이나
 * number(1/0)로도 내려올 수 있어, 세 가지 타입을 모두 안전하게 처리합니다.
 * - true, "true", 1, "1" → 제조센터
 * - false, "false", 0, "0", null, undefined → 물류센터
 */
export function mapApiValueToTwinCategory(
  value: string | number | boolean | null | undefined,
): TwinCategory {
  if (typeof value === 'boolean') {
    return value ? '제조센터' : '물류센터';
  }
  if (typeof value === 'number') {
    return value === 1 ? '제조센터' : '물류센터';
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' ? '제조센터' : '물류센터';
  }
  return '물류센터';
}

export interface CreateUploadProgress {
  image: number;
  executable: number;
  overall: number;
}

/**
 * 디지털트윈 수정(PUT /api/admin/digital-twins/{id}) 요청 입력.
 * manager/status/syncRate/sensorCount는 Swagger AdminDigitalTwinRequest 스키마에 없어
 * 서버로 전송되지 않습니다(수정 폼 UI는 기존 그대로 유지하되, 값은 저장되지 않습니다).
 */
export interface UpdateAdminItemInput {
  id: number;
  title: string;
  description: string;
  location: string;
  category: TwinCategory;
  /** Swagger 수정 API에 없는 필드 — 서버로 전송되지 않음(더미 값) */
  manager: string;
  /** Swagger 수정 API에 없는 필드 — 서버로 전송되지 않음(더미 값) */
  status: TwinStatus;
  /** Swagger 수정 API에 없는 필드 — 서버로 전송되지 않음(더미 값) */
  syncRate: number;
  /** Swagger 수정 API에 없는 필드 — 서버로 전송되지 않음(더미 값) */
  sensorCount: number;
  imageFile?: File;
  executableFile?: File;
}

export function formatTwinId(id: number): string {
  return `twin-${String(id).padStart(3, '0')}`;
}
