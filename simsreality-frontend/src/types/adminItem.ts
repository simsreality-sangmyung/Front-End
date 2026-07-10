export type TwinCategory = '물류센터' | '제조센터';

export type TwinStatus = '정상' | '경고' | '오프라인';

export const TWIN_CATEGORY_OPTIONS: TwinCategory[] = ['물류센터', '제조센터'];

export const TWIN_STATUS_OPTIONS: TwinStatus[] = ['정상', '경고', '오프라인'];

export interface AdminItem {
  id: number;
  title: string;
  description: string;
  location: string;
  category: TwinCategory;
  manager: string;
  syncRate: number;
  sensorCount: number;
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

export interface CreateUploadProgress {
  image: number;
  executable: number;
  overall: number;
}

export interface UpdateAdminItemInput {
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
}

export function formatTwinId(id: number): string {
  return `twin-${String(id).padStart(3, '0')}`;
}
