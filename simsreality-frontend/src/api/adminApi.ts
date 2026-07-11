import client from './client';
import { buildCreateAdminItemFormData } from './createAdminItemFormData';
import { buildUpdateAdminItemFormData } from './updateAdminItemFormData';
import type {
  AdminDigitalTwinResponse,
  ApiResponse,
  PageResponseAdminDigitalTwinListResponse,
} from '../types/adminDigitalTwin';
import {
  type AdminItem,
  type AdminItemSearchParams,
  type AdminItemsPageResult,
  type AdminItemSortOption,
  type CreateAdminItemInput,
  type CreateUploadProgress,
  type UpdateAdminItemInput,
} from '../types/adminItem';
import { mapAdminDigitalTwinToAdminItem } from '../utils/adminItemMapper';

const LIST_ENDPOINT = '/api/admin/digital-twins';
const SEARCH_ENDPOINT = '/api/admin/digital-twins/search';

/**
 * Swagger sort 파라미터는 "property,(asc|desc)" 형식입니다.
 * 목록/검색 응답에는 syncRate 필드가 없어 sync-asc/sync-desc는 서버 정렬 대상이 없으므로
 * createdAt,desc로 대체합니다 (등록일 정렬만 실제로 서버에 반영됩니다).
 */
function mapSortToApi(sort: AdminItemSortOption | undefined): string[] {
  if (sort === 'oldest') {
    return ['createdAt,asc'];
  }
  return ['createdAt,desc'];
}

/**
 * category/status 필터는 Swagger 목록/검색 API에 파라미터가 없어 서버에 전달할 수 없습니다.
 * 따라서 현재 페이지로 반환된 데이터에 한해서만 클라이언트에서 필터링합니다.
 * (status는 서버 데이터가 아니라 더미 값이라, 실제 운영 상태 기준 필터링은 아닙니다.)
 */
function filterFetchedItems(
  items: AdminItem[],
  params: AdminItemSearchParams,
): AdminItem[] {
  const category = params.category;
  const status = params.status;
  return items.filter((item) => {
    if (category && category !== 'all' && item.category !== category) {
      return false;
    }
    if (status && status !== 'all' && item.status !== status) {
      return false;
    }
    return true;
  });
}

async function fetchAdminDigitalTwinPage(
  params: AdminItemSearchParams,
): Promise<PageResponseAdminDigitalTwinListResponse> {
  const page = params.page ?? 0;
  const size = params.size ?? 20;
  const sort = mapSortToApi(params.sort);
  const title = params.keyword?.trim();
  const date = params.registeredAt?.trim();

  const useSearch = Boolean(title || date);
  const endpoint = useSearch ? SEARCH_ENDPOINT : LIST_ENDPOINT;

  const queryParams: Record<string, string | number | string[]> = {
    page,
    size,
    sort,
  };
  if (useSearch) {
    if (title) {
      queryParams.title = title;
    }
    if (date) {
      queryParams.date = date;
    }
  }

  const response = await client.get<
    ApiResponse<PageResponseAdminDigitalTwinListResponse>
  >(endpoint, { params: queryParams });

  return response.data.data;
}

/**
 * Swagger: GET /api/admin/digital-twins (또는 title/date 조건이 있으면 /search)
 */
export async function fetchAdminItems(
  params: AdminItemSearchParams = {},
): Promise<AdminItemsPageResult> {
  const pageData = await fetchAdminDigitalTwinPage(params);
  const items = filterFetchedItems(
    pageData.content.map(mapAdminDigitalTwinToAdminItem),
    params,
  );

  return {
    items,
    page: pageData.page,
    size: pageData.size,
    totalElements: pageData.totalElements,
    totalPages: pageData.totalPages,
  };
}

/**
 * 통계 카드용 — 전용 stats API가 없어 넓은 페이지(최대 1000건)를 조회해 집계합니다.
 * totalElements는 서버가 반환하는 정확한 전체 개수를 그대로 사용합니다.
 */
export async function fetchAdminItemsForStats(): Promise<{
  totalElements: number;
  items: AdminItem[];
}> {
  const pageData = await fetchAdminDigitalTwinPage({
    page: 0,
    size: 1000,
    sort: 'newest',
  });
  return {
    totalElements: pageData.totalElements,
    items: pageData.content.map(mapAdminDigitalTwinToAdminItem),
  };
}

/**
 * Swagger: POST /api/admin/digital-twins (multipart/form-data)
 */
export async function createDigitalTwin(
  formData: FormData,
  onUploadProgress?: (percent: number) => void,
): Promise<AdminDigitalTwinResponse> {
  const response = await client.post<ApiResponse<AdminDigitalTwinResponse>>(
    LIST_ENDPOINT,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 0,
      onUploadProgress: (event) => {
        if (!onUploadProgress) {
          return;
        }
        const total = event.total ?? event.loaded;
        const percent = total > 0 ? Math.round((event.loaded / total) * 100) : 0;
        onUploadProgress(percent);
      },
    },
  );
  return response.data.data;
}

export async function createAdminItem(
  input: CreateAdminItemInput,
  onProgress: (percent: number) => void,
): Promise<void> {
  onProgress(0);

  const formData = buildCreateAdminItemFormData(input);
  await createDigitalTwin(formData, onProgress);

  onProgress(100);
  // 목록은 서버 재조회(invalidate)로 갱신되므로, 여기서 로컬 mock에 항목을 추가하는
  // 하이브리드 로직은 사용하지 않습니다.
}

/**
 * Swagger: PUT /api/admin/digital-twins/{id} (multipart/form-data)
 * 파일 필드를 생략하면 서버가 기존 파일을 유지합니다.
 * axios의 onUploadProgress는 요청 전체 진행률만 제공하므로, 기존 UI의
 * 이미지/실행파일 두 개의 진행바에는 동일한 값을 반영합니다.
 */
export async function updateAdminItem(
  input: UpdateAdminItemInput,
  onProgress: (progress: CreateUploadProgress) => void,
): Promise<void> {
  const formData = buildUpdateAdminItemFormData(input);

  onProgress({ image: 0, executable: 0, overall: 0 });

  await client.put(`${LIST_ENDPOINT}/${input.id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
    onUploadProgress: (event) => {
      const total = event.total ?? event.loaded;
      const percent = total > 0 ? Math.round((event.loaded / total) * 100) : 0;
      onProgress({ image: percent, executable: percent, overall: percent });
    },
  });

  onProgress({ image: 100, executable: 100, overall: 100 });
}

/**
 * Swagger: DELETE /api/admin/digital-twins/{id}
 */
export async function deleteAdminItem(id: number): Promise<void> {
  await client.delete(`${LIST_ENDPOINT}/${id}`);
}

export const adminItemsQueryKey = (params: AdminItemSearchParams) =>
  ['adminItems', params] as const;

export const adminItemsStatsQueryKey = ['adminItems', 'stats'] as const;
