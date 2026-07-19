import {
  mapTwinCategoryToApiValue,
  type UpdateAdminItemInput,
} from '../types/adminItem';

/**
 * 디지털트윈 수정(PUT /api/admin/digital-twins/{id}) 요청 FormData 생성.
 * 트윈 수정 모달은 이미지/실행파일 업로드를 지원하지 않아(Figma 기준) 파일 필드를
 * 보내지 않습니다 — 서버는 파일 필드가 없으면 기존 파일을 유지합니다.
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

  return formData;
}
