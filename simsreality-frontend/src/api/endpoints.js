export const AUTH_ENDPOINTS = {
  LOGIN: (provider) => `/auth/login/${provider}`,
  SIGNUP: (provider) => `/auth/signup/${provider}`,
  CALLBACK: '/auth/callback',
  ME: '/auth/me',
  LOGOUT: '/auth/logout',
};
