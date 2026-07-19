const SESSION_ENTRY_KEY = 'app-entered';

export const markAppEntered = () => sessionStorage.setItem(SESSION_ENTRY_KEY, '1');

export const clearAppEntered = () => sessionStorage.removeItem(SESSION_ENTRY_KEY);

export const hasAppEntered = () => Boolean(sessionStorage.getItem(SESSION_ENTRY_KEY));
