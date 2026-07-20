/**
 * 허용 확장자 — Backend/Three.js 협의 후 이 배열만 수정하면 됩니다.
 */
export const MODEL_FILE_EXTENSIONS = ['fbx'] as const;

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

/** 디지털트윈 등록 API(executableFile 필드) 허용 확장자 */
export const REGISTER_EXECUTABLE_EXTENSIONS = ['zip', '7z'] as const;

function getExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() ?? '';
}

export function isValidImageFile(file: File): boolean {
  return IMAGE_EXTENSIONS.includes(getExtension(file.name));
}

export function isValidModelFile(file: File): boolean {
  return MODEL_FILE_EXTENSIONS.includes(
    getExtension(file.name) as (typeof MODEL_FILE_EXTENSIONS)[number],
  );
}

/** 디지털트윈 등록 API — executableFile 필드 검증 (.zip, .7z) */
export function isValidRegisterExecutableFile(file: File): boolean {
  return REGISTER_EXECUTABLE_EXTENSIONS.includes(
    getExtension(file.name) as (typeof REGISTER_EXECUTABLE_EXTENSIONS)[number],
  );
}

export const IMAGE_ACCEPT = '.jpg,.jpeg,.png,image/jpeg,image/png';

export const MODEL_FILE_ACCEPT = MODEL_FILE_EXTENSIONS.map((ext) => `.${ext}`).join(
  ',',
);

/** 디지털트윈 등록 API — executableFile 필드 accept */
export const REGISTER_EXECUTABLE_ACCEPT = REGISTER_EXECUTABLE_EXTENSIONS.map(
  (ext) => `.${ext}`,
).join(',');

export function getModelFileExtensionLabel(): string {
  return MODEL_FILE_EXTENSIONS.join(', .');
}

export function getImageExtensionLabel(): string {
  return IMAGE_EXTENSIONS.join(', ');
}

export function getRegisterExecutableExtensionLabel(): string {
  return REGISTER_EXECUTABLE_EXTENSIONS.join(', .');
}
