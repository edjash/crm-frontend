import { createContext, useContext } from 'react';

interface AppContext {
  loggedIn: boolean;
}

const appCtx = createContext({} as AppContext);
export const AppContextProvider = appCtx.Provider;
export const useAppContext = () => useContext(appCtx);
export default AppContext;
