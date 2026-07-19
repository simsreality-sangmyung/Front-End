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
  type AdminTwinDetail,
  type CreateAdminItemInput,
  type UpdateAdminItemInput,
} from '../types/adminItem';
import { mapAdminDigitalTwinToAdminItem } from '../utils/adminItemMapper';

const LIST_ENDPOINT = '/api/admin/digital-twins';
const SEARCH_ENDPOINT = '/api/admin/digital-twins/search';

/**
 * Swagger sort 파라미터는 "property,(asc|desc)" 형식입니다.
 * 등록일(createdAt)·트윈 이름(title) 정렬을 지원하며, 정렬 안정화를 위해 id 를 함께 보냅니다.
 */
function mapSortToApi(sort: AdminItemSortOption | undefined): string[] {
  switch (sort) {
    case 'oldest':
      return ['createdAt,asc', 'id,asc'];
    case 'name-asc':
      return ['title,asc', 'id,asc'];
    case 'name-desc':
      return ['title,desc', 'id,desc'];
    case 'newest':
    default:
      return ['createdAt,desc', 'id,desc'];
  }
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
  // 통합 검색: 하나의 keyword 로 제목/장소/담당자명/ID/유형을 OR 검색 (BE 처리)
  if (useSearch && keyword) {
    queryParams.keyword = keyword;
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

interface TwinDetailApiResponse {
  description: string | null;
  imageFileName: string | null;
  modelFileName: string | null;
  executableFileKey: string | null;
}

/**
 * 수정 모달용 상세 조회 (GET /api/digital-twins/{id}).
 * 목록에 없는 설명·현재 파일명을 채우기 위해 사용합니다.
 */
export async function fetchAdminTwinDetail(id: number): Promise<AdminTwinDetail> {
  const response = await client.get<ApiResponse<TwinDetailApiResponse>>(
    `/api/digital-twins/${id}`,
  );
  const detail = response.data.data;
  return {
    description: detail.description ?? '',
    imageFileName: detail.imageFileName ?? null,
    modelFileName: detail.modelFileName ?? null,
    executableFileName: detail.executableFileKey ?? null,
  };
}

export const adminItemsQueryKey = (params: AdminItemSearchParams) =>
  ['adminItems', params] as const;

export const adminItemsStatsQueryKey = ['adminItems', 'stats'] as const;
