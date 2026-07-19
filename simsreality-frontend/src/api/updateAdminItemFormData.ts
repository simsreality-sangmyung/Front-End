import {
  mapTwinCategoryToApiValue,
  type UpdateAdminItemInput,
} from '../types/adminItem';

/**
 * 디지털트윈 수정(PUT /api/admin/digital-twins/{id}) 요청 FormData 생성.
 * 파일(썸네일 image/실행파일/threeJs/3D model)은 새로 선택했을 때만 전송하며,
 * 생략하면 서버가 기존 파일을 그대로 유지합니다(replaceIfPresent).
 *
 * managerId는 담당자를 실제로 변경할 때만 전송합니다(선택하지 않으면 생략).
 * status는 이 스키마에 없어 전송하지 않습니다.
 */
export function buildUpdateAdminItemFormData(
  input: UpdateAdminItemInput,
): FormData {
  const formData = new FormData();

  formData.append('title', input.title);
  formData.append('place', input.location);
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
