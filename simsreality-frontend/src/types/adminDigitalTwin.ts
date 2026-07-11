/**
 * 분류 값 — 서버 응답이 문자열("true"/"false"/"1"/"0") 또는
 * 실제 boolean/number(true/false, 1/0)로 내려올 수 있어 모두 허용합니다.
 * false/0 = 물류센터, true/1 = 제조센터
 */
export type AdminDigitalTwinCategoryValue = string | number | boolean;

/** Swagger: AdminDigitalTwinListResponse — 디지털트윈 관리 목록/검색 응답 항목 */
export interface AdminDigitalTwinListResponse {
  id: number;
  title: string;
  place: string | null;
  description: string | null;
  category: AdminDigitalTwinCategoryValue;
  imageFileName: string | null;
  createdAt: string;
  viewCount: number;
  executableFileName: string | null;
  threeJs: string | null;
  modelFileName: string | null;
}

/** Swagger: PageResponseAdminDigitalTwinListResponse */
export interface PageResponseAdminDigitalTwinListResponse {
  content: AdminDigitalTwinListResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

/** Swagger: AdminDigitalTwinResponse — 등록 응답 */
export interface AdminDigitalTwinResponse {
  id: number;
  title: string;
  place: string | null;
  description: string | null;
  category: AdminDigitalTwinCategoryValue;
  imageFileName: string | null;
  executableFileName: string | null;
  threeJs: string | null;
  modelFileName: string | null;
  createdAt: string;
}

/** Swagger: AdminDigitalTwinUpdateResponse — 수정 응답 */
export interface AdminDigitalTwinUpdateResponse {
  id: number;
  title: string;
  place: string | null;
  description: string | null;
  category: AdminDigitalTwinCategoryValue;
  imageFileName: string | null;
  executableFileName: string | null;
  threeJs: string | null;
  modelFileName: string | null;
  updatedAt: string;
}

/** API 공통 응답 포맷 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
