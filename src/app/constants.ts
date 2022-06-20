export const APP_URL = process.env.REACT_APP_URL ?? '';
export const SERVER_URL = process.env.REACT_APP_SERVER_URL ?? '';
export const APP_TITLE = process.env.REACT_APP_TITLE ?? '';
export const APP_MODE = process.env.NODE_ENV ?? 'production';

export const EVENTS = {
    AUTH_LOGOUT: 'AUTH.LOGOUT',
    AUTH_TIMEOUT: 'AUTH.TIMEOUT',
    AUTH_LOGIN: 'AUTH.LOGIN',
    NAV_TOGGLECLICK: 'NAV.TOGGLECLICK',
    CONTACTS_REFRESH: 'CONTACTS.REFRESH',
    CONTACTS_NEW: 'CONTACTS.NEW',
    COMPANIES_REFRESH: 'COMPANIES.REFRESH',
    COMPANIES_NEW: 'COMPANIES.NEW',
    TOAST: 'TOAST',
    GRID_CHECKALL: 'GRID.CHECKALL',
    DIALOG_OPEN: 'DIALOG.OPEN',
    DIALOG_CLOSE: 'DIALOG.CLOSE',
    THEME_TOGGLE: 'THEME.TOGGLE',
    WINDOW_RESTORE: 'WINDOW.RESTORE',
    WINDOW_CLOSE: 'WINDOW.CLOSE',
};

