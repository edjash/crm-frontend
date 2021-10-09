import React, { createContext, useContext } from 'react';
import { IToastConfig } from './Toast';

interface AppContext {
  loggedIn: boolean;
  showToast: (cfg: IToastConfig) => void;
  hideToast: () => void;
  setLoginStatus: (loggedIn: boolean, accessToken: string) => void;
}

const appCtx = createContext({} as AppContext);
export const AppContextProvider = appCtx.Provider;
export const useAppContext = () => useContext(appCtx);
export default AppContext;
