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
  type UpdateAdminItemInput,
} from '../types/adminItem';
import { mapAdminDigitalTwinToAdminItem } from '../utils/adminItemMapper';

const LIST_ENDPOINT = '/api/admin/digital-twins';
const SEARCH_ENDPOINT = '/api/admin/digital-twins/search';

/**
 * Swagger sort 파라미터는 "property,(asc|desc)" 형식입니다.
 * AdminItemSortOption은 서버가 실제로 지원하는 newest/oldest(createdAt 기준)만 남겨
 * 두었습니다 — 그 외 정렬 옵션은 서버가 지원하지 않아 제공하지 않습니다
 * (등록일순으로 몰래 대체하지 않습니다).
 */
function mapSortToApi(sort: AdminItemSortOption | undefined): string[] {
  if (sort === 'oldest') {
    return ['createdAt,asc'];
  }
  return ['createdAt,desc'];
}

/**
 * category 필터는 Swagger 목록/검색 API에 파라미터가 없어 서버에 전달할 수 없습니다.
 * 따라서 현재 페이지로 반환된 데이터에 한해서만 클라이언트에서 필터링합니다.
 */
function filterFetchedItems(
  items: AdminItem[],
  params: AdminItemSearchParams,
): AdminItem[] {
  const category = params.category;
  return items.filter((item) => {
    if (category && category !== 'all' && item.category !== category) {
      return false;
    }
    return true;
  });
}

/**
 * 검색 조건은 title/id/managerName 중 하나입니다 (date는 제거됨).
 * searchField로 선택된 항목 하나만 파라미터로 보냅니다 (여러 조건을 동시에 보내지 않음).
 */
function buildTwinSearchParam(
  searchField: AdminItemSearchParams['searchField'],
  keyword: string,
): Record<string, string> {
  if (searchField === 'id') {
    return { id: keyword };
  }
  if (searchField === 'managerName') {
    return { managerName: keyword };
  }
  return { title: keyword };
}

async function fetchAdminDigitalTwinPage(
  params: AdminItemSearchParams,
): Promise<PageResponseAdminDigitalTwinListResponse> {
  const page = params.page ?? 0;
  const size = params.size ?? 20;
  const sort = mapSortToApi(params.sort);
  const keyword = params.keyword?.trim();

  const useSearch = Boolean(keyword);
  const endpoint = useSearch ? SEARCH_ENDPOINT : LIST_ENDPOINT;

  const queryParams: Record<string, string | number | string[]> = {
    page,
    size,
    sort,
  };
  if (useSearch && keyword) {
    Object.assign(
      queryParams,
      buildTwinSearchParam(params.searchField ?? 'title', keyword),
    );
  }

  const response = await client.get<
    ApiResponse<PageResponseAdminDigitalTwinListResponse>
  >(endpoint, { params: queryParams });

  return response.data.data;
}

/**
 * Swagger: GET /api/admin/digital-twins (또는 title/id/managerName 조건이 있으면 /search)
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
 * 트윈 수정 모달은 파일 업로드를 지원하지 않으므로(Figma 기준) 진행률 콜백 없이
 * 단순 요청/응답으로 처리합니다. 파일 필드가 없으면 서버가 기존 파일을 유지합니다.
 */
export async function updateAdminItem(
  input: UpdateAdminItemInput,
): Promise<void> {
  const formData = buildUpdateAdminItemFormData(input);

  await client.put(`${LIST_ENDPOINT}/${input.id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
  });
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
