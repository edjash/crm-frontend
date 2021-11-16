import { createContext, useContext } from 'react';
import { ToastConfig } from './Toast';

interface AppContext {
  loggedIn: boolean;
  showToast: (cfg: ToastConfig) => void;
  hideToast: () => void;
  setLoginStatus: (loggedIn: boolean, accessToken: string) => void;
}

const appCtx = createContext({} as AppContext);
export const AppContextProvider = appCtx.Provider;
export const useAppContext = () => useContext(appCtx);
export default AppContext;
