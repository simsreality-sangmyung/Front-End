import {
  mapTwinCategoryToApiValue,
  type CreateAdminItemInput,
} from '../types/adminItem';

/**
 * 디지털트윈 등록(POST /api/admin/digital-twins) 요청 FormData 생성.
 *
 * - title: string, required
 * - place: string
 * - description: string
 * - category: string, required ("false" | "true")
 * - managerId: number (선택된 경우에만 전송, 임의의 더미 값은 보내지 않음)
 * - image: file
 * - executableFile: file
 * - threeJs: file
 * - model: file
 */
export function buildCreateAdminItemFormData(
  input: CreateAdminItemInput,
): FormData {
  const formData = new FormData();

  formData.append('title', input.title);
  formData.append('place', input.place);
  formData.append('description', input.description);
  formData.append('category', mapTwinCategoryToApiValue(input.category));

  if (input.managerId !== null) {
    formData.append('managerId', String(input.managerId));
  }

  if (input.imageFile) {
    formData.append('image', input.imageFile);
  }
  if (input.executableFile) {
    formData.append('executableFile', input.executableFile);
  }
  if (input.threeJsFile) {
    formData.append('threeJs', input.threeJsFile);
  }
  if (input.modelFile) {
    formData.append('model', input.modelFile);
  }

  return formData;
}
