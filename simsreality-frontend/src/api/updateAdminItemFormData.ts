import {
  mapTwinCategoryToApiValue,
  type UpdateAdminItemInput,
} from '../types/adminItem';

/**
 * 디지털트윈 수정(PUT /api/admin/digital-twins/{id}) 요청 FormData 생성.
 * Swagger AdminDigitalTwinRequest 필드명과 동일하게 맞춥니다.
 * 파일 필드를 생략하면 서버가 기존 파일을 유지합니다.
 *
 * manager/status/syncRate/sensorCount는 이 스키마에 없어 전송하지 않습니다.
 */
export function buildUpdateAdminItemFormData(
  input: UpdateAdminItemInput,
): FormData {
  const formData = new FormData();

  formData.append('title', input.title);
  formData.append('place', input.location);
  formData.append('description', input.description);
  formData.append('category', mapTwinCategoryToApiValue(input.category));

  if (input.imageFile) {
    formData.append('image', input.imageFile);
  }
  if (input.executableFile) {
    formData.append('executableFile', input.executableFile);
  }

  return formData;
}
