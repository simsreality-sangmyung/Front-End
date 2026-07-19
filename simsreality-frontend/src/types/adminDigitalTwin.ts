import type { AccountRole } from './account';

/**
 * 분류 값 — 서버 응답이 문자열("true"/"false"/"1"/"0") 또는
 * 실제 boolean/number(true/false, 1/0)로 내려올 수 있어 모두 허용합니다.
 * false/0 = 물류센터, true/1 = 제조센터
 */
export type AdminDigitalTwinCategoryValue = string | number | boolean;

/**
 * 디지털트윈 관리 목록/검색 응답 항목 (curl로 실제 확인됨).
 * createdBy는 제거되었고 managerId/managerName/managerRole이 추가되었습니다.
 */
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
  managerId: number | null;
  managerName: string | null;
  managerRole: AccountRole | null;
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

/** 등록 응답 — POST 요청에 managerId가 추가되었고, 응답에 managerRole이 추가되었습니다. */
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
  managerRole: AccountRole | null;
}

/** 수정 응답 — PUT 요청에 managerId가 추가되었고, 응답에 managerRole이 추가되었습니다. */
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
  managerRole: AccountRole | null;
}

/** API 공통 응답 포맷 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
