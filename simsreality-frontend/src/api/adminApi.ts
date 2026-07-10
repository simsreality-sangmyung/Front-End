import client from './client';
import { buildCreateAdminItemFormData } from './createAdminItemFormData';
import {
  addMockAdminItem,
  deleteMockAdminItem,
  getMockAdminItems,
  updateMockAdminItem,
} from '../mocks/adminItemStore';
import {
  formatTwinId,
  type AdminItem,
  type AdminItemSearchParams,
  type CreateAdminItemInput,
  type CreateUploadProgress,
  type UpdateAdminItemInput,
} from '../types/adminItem';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function filterItems(
  items: AdminItem[],
  params: AdminItemSearchParams,
): AdminItem[] {
  const keyword = params.keyword?.trim().toLowerCase();
  const registeredAt = params.registeredAt?.trim();
  const category = params.category;
  const status = params.status;

  return items.filter((item) => {
    if (keyword) {
      const haystack = [
        item.title,
        item.location,
        item.manager,
        formatTwinId(item.id),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(keyword)) {
        return false;
      }
    }
    if (registeredAt && item.registeredAt !== registeredAt) {
      return false;
    }
    if (category && category !== 'all' && item.category !== category) {
      return false;
    }
    if (status && status !== 'all' && item.status !== status) {
      return false;
    }
    return true;
  });
}

async function simulateFileUpload(
  onProgress: (progress: number) => void,
): Promise<void> {
  const steps = 10;
  for (let step = 1; step <= steps; step += 1) {
    await delay(120);
    onProgress(Math.round((step / steps) * 100));
  }
}

function formatToday(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function updateProgress(
  onProgress: (progress: CreateUploadProgress) => void,
  partial: Partial<CreateUploadProgress>,
  current: CreateUploadProgress,
) {
  const next = { ...current, ...partial };
  next.overall = Math.round((next.image + next.executable) / 2);
  onProgress(next);
  return next;
}

export async function fetchAdminItems(
  params: AdminItemSearchParams = {},
): Promise<AdminItem[]> {
  await delay(400);
  return filterItems(getMockAdminItems(), params);
}

export interface CreateDigitalTwinResponse {
  message?: string;
  [key: string]: unknown;
}

/**
 * Swagger: POST /api/admin/digital-twins (multipart/form-data)
 * 백엔드 서버: http://101.79.21.134:8283
 */
export async function createDigitalTwin(
  formData: FormData,
  onUploadProgress?: (percent: number) => void,
): Promise<CreateDigitalTwinResponse> {
  const response = await client.post<CreateDigitalTwinResponse>(
    '/api/admin/digital-twins',
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
  return response.data;
}

export async function createAdminItem(
  input: CreateAdminItemInput,
  onProgress: (percent: number) => void,
): Promise<AdminItem> {
  onProgress(0);

  const formData = buildCreateAdminItemFormData(input);
  await createDigitalTwin(formData, onProgress);

  onProgress(100);

  // 목록 조회는 별도 mock 데이터 소스를 사용하므로, 등록 직후 화면에도 즉시
  // 반영되도록 동일한 항목을 로컬 mock 목록에도 추가합니다. (백엔드 저장 로직과는 무관)
  return addMockAdminItem({
    title: input.title,
    location: input.place || '-',
    category: input.category,
    manager: '-',
    syncRate: 100,
    sensorCount: 0,
    status: '정상',
    description: input.description,
    imageFileName: input.imageFile?.name ?? '-',
    executableFileName:
      input.modelFile?.name ??
      input.executableFile?.name ??
      input.threeJsFile?.name ??
      '-',
    registeredAt: formatToday(),
  });
}

export async function updateAdminItem(
  input: UpdateAdminItemInput,
  onProgress: (progress: CreateUploadProgress) => void,
): Promise<AdminItem> {
  const hasImageUpload = Boolean(input.imageFile);
  const hasExecutableUpload = Boolean(input.executableFile);

  if (hasImageUpload || hasExecutableUpload) {
    let progress: CreateUploadProgress = {
      image: hasImageUpload ? 0 : 100,
      executable: hasExecutableUpload ? 0 : 100,
      overall: 0,
    };
    progress.overall = Math.round((progress.image + progress.executable) / 2);
    onProgress(progress);

    if (input.imageFile) {
      await simulateFileUpload((imageProgress) => {
        progress = updateProgress(onProgress, { image: imageProgress }, progress);
      });
    }

    if (input.executableFile) {
      await simulateFileUpload((executableProgress) => {
        progress = updateProgress(
          onProgress,
          { executable: executableProgress },
          progress,
        );
      });
    }
  } else {
    await delay(300);
  }

  const updates: Partial<AdminItem> = {
    title: input.title,
    description: input.description,
    location: input.location,
    category: input.category,
    manager: input.manager,
    status: input.status,
    syncRate: input.syncRate,
    sensorCount: input.sensorCount,
  };

  if (input.imageFile) {
    updates.imageFileName = input.imageFile.name;
  }
  if (input.executableFile) {
    updates.executableFileName = input.executableFile.name;
  }

  const updated = updateMockAdminItem(input.id, updates);
  if (!updated) {
    throw new Error('항목을 찾을 수 없습니다.');
  }

  return updated;
}

export async function deleteAdminItem(id: number): Promise<void> {
  await delay(300);
  const deleted = deleteMockAdminItem(id);
  if (!deleted) {
    throw new Error('항목을 찾을 수 없습니다.');
  }
}

export const adminItemsQueryKey = (params: AdminItemSearchParams) =>
  ['adminItems', params] as const;
