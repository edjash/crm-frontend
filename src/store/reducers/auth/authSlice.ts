import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type userInfo = Record<string, string> | null;

interface AuthState {
    loggedIn: boolean;
    userInfo: userInfo;
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loggedIn: false,
        userInfo: null,
    } as AuthState,
    reducers: {
        login: (state, action: PayloadAction<userInfo>) => {
            state.loggedIn = true;
            state.userInfo = action.payload;
        },
        logout: (state) => {
            state.loggedIn = false;
        }
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
