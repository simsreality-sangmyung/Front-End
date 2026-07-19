import type { AccountRole } from './account';

export type TwinCategory = '물류센터' | '제조센터';

export type TwinStatus = '정상' | '경고' | '오프라인';

export const TWIN_CATEGORY_OPTIONS: TwinCategory[] = ['물류센터', '제조센터'];

export const TWIN_STATUS_OPTIONS: TwinStatus[] = ['정상', '경고', '오프라인'];

/**
 * UI 표시용 모델.
 * managerId/managerName/managerRole은 목록/검색 API 응답의 실제 값입니다(curl로 확인됨).
 * status는 API 응답에 해당 필드가 없어, id 기반으로 클라이언트에서 결정적으로 생성한
 * mock 값입니다(src/utils/adminItemMapper.ts의 getDummyStatus 참고). 트윈 수정 모달의
 * "상태" select는 Figma UI 유지를 위해 남겨두지만, 서버로는 전송되지 않습니다.
 */
export interface AdminItem {
  id: number;
  title: string;
  description: string;
  location: string;
  category: TwinCategory;
  /** API 응답의 실제 값 — 담당자가 없으면 null */
  managerId: number | null;
  /** API 응답의 실제 값 — 담당자가 없으면 '-' */
  managerName: string;
  /** API 응답의 실제 값 */
  managerRole: AccountRole | null;
  /** mock 값 — API 응답에 없는 필드 (코드 주석 참고, 화면 노출 없음) */
  status: TwinStatus;
  imageFileName: string;
  registeredAt: string;
  viewCount: number;
  executableFileName: string;
}

/**
 * 검색 조건 — keyword 하나로 제목/장소/담당자명/ID/유형을 통합 검색합니다 (BE OR 처리).
 */
export interface AdminItemSearchParams {
  keyword?: string;
  category?: TwinCategory | 'all';
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

/**
 * 서버가 등록일(createdAt)·트윈 이름(title) 정렬을 지원합니다(sort 파라미터).
 */
export type AdminItemSortOption =
  | 'newest'
  | 'oldest'
  | 'name-asc'
  | 'name-desc';

export const ADMIN_ITEM_SORT_OPTIONS: {
  value: AdminItemSortOption;
  label: string;
}[] = [
  { value: 'newest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
];

/**
 * 디지털트윈 등록(POST /api/admin/digital-twins) 요청 입력.
 * managerId가 새로 추가되었습니다. 담당자를 선택하지 않으면 전송하지 않습니다
 * (임의의 더미 값을 보내지 않기 위함).
 */
export interface CreateAdminItemInput {
  title: string;
  place: string;
  description: string;
  category: TwinCategory;
  managerId: number | null;
  imageFile: File | null;
  executableFile: File | null;
  threeJsFile: File | null;
  modelFile: File | null;
}

/**
 * category 필드는 boolean 문자열을 기대합니다.
 * 물류센터 → "false", 제조센터 → "true"
 */
export function mapTwinCategoryToApiValue(
  category: TwinCategory,
): 'true' | 'false' {
  return category === '제조센터' ? 'true' : 'false';
}

/**
 * category 값 → UI TwinCategory.
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
 * managerId가 새로 추가되었습니다. 목록 응답의 managerId로 현재 담당자를 기본
 * 선택하며, "선택 안 함"으로 두면 managerId를 전송하지 않습니다.
 * 트윈 수정 모달에서는 이미지/실행파일 업로드를 지원하지 않습니다(Figma 기준).
 * status는 API 스키마에 없어 서버로 전송되지 않습니다(mock 값, Figma UI 유지 목적).
 */
export interface UpdateAdminItemInput {
  id: number;
  title: string;
  description: string;
  location: string;
  category: TwinCategory;
  managerId: number | null;
  /** API 스키마에 없는 필드 — 서버로 전송되지 않음(mock 값) */
  status: TwinStatus;
  /** 파일은 새로 선택했을 때만 전송하며, 생략하면 서버가 기존 파일을 유지합니다. */
  imageFile?: File | null;
  executableFile?: File | null;
  threeJsFile?: File | null;
  modelFile?: File | null;
}

/**
 * 수정 모달용 상세 (GET /api/digital-twins/{id}).
 * 목록 응답에 없는 설명·현재 파일명을 채우기 위해 사용합니다.
 */
export interface AdminTwinDetail {
  description: string;
  imageFileName: string | null;
  modelFileName: string | null;
  executableFileName: string | null;
}

export function formatTwinId(id: number): string {
  return `twin-${String(id).padStart(3, '0')}`;
}
