/**
 * SSO 인증 URL을 팝업으로 연다.
 * @param {string} url
 * @param {string} [name]
 */
export function openSsoPopup(url, name = 'sso-popup') {
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  return window.open(
    url,
    name,
    `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`,
  );
}
