import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type userInfo = Record<string, any> | null;
type serverCfg = Record<string, any> | null;

interface AuthState {
    loggedIn: boolean;
    userInfo: userInfo;
    serverCfg: serverCfg;
}

interface LoginPayload {
    userInfo: userInfo;
    serverCfg: serverCfg;
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loggedIn: false,
        userInfo: null,
        serverCfg: null,
    } as AuthState,
    reducers: {
        login: (state, action: PayloadAction<LoginPayload>) => {
            state.loggedIn = true;
            state.userInfo = action.payload.userInfo;
            state.serverCfg = action.payload.serverCfg;
        },
        logout: (state) => {
            state.loggedIn = false;
            state.userInfo = null;
            state.serverCfg = null;
        }
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
