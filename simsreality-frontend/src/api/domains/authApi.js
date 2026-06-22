import apiBuilder from '../apiBuilder';
import { AUTH_ENDPOINTS } from '../endpoints';

/** @param {'naver' | 'kakao' | 'google'} provider */
export const getSsoLoginUrlApi = (provider) =>
  apiBuilder(AUTH_ENDPOINTS.LOGIN(provider), 'GET');

/** @param {'naver' | 'kakao' | 'google'} provider */
export const getSsoSignupUrlApi = (provider) =>
  apiBuilder(AUTH_ENDPOINTS.SIGNUP(provider), 'GET');

export const postAuthCallbackApi = () =>
  apiBuilder(AUTH_ENDPOINTS.CALLBACK, 'POST');

export const getAuthMeApi = () => apiBuilder(AUTH_ENDPOINTS.ME, 'GET');

export const postAuthLogoutApi = () =>
  apiBuilder(AUTH_ENDPOINTS.LOGOUT, 'POST');
