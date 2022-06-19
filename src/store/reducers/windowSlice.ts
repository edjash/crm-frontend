import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type windowId = string;

export interface WindowTabObject {
    image?: string;
    text?: string;
    windowId: windowId;
    minimized?: boolean;
}

type windowList = Record<windowId, WindowTabObject>;

interface WindowOpenState {
    list: windowList;
    active: windowId | null;
}

export const windowSlice = createSlice({
    name: 'window',
    initialState: {
        list: {},
        active: null,
    } as WindowOpenState,
    reducers: {
        windowOpened: (state, action: PayloadAction<WindowTabObject>) => {
            state.list = {
                ...state.list,
                [action.payload.windowId]: action.payload
            };
            state.active = action.payload.windowId;
        },
        windowClosed: (state, action: PayloadAction<windowId>) => {
            const newList: windowList = {};
            for (let wid in state.list) {
                if (wid !== action.payload) {
                    newList[wid] = state.list[wid];
                }
            }
            state.list = newList;
        },
        windowMinimized: (state, action: PayloadAction<windowId>) => {
            if (action.payload in state.list) {
                state.list[action.payload].minimized = true;
            }
            if (state.active === action.payload) {
                state.active = null;
            }
        },
        windowActivated: (state, action: PayloadAction<windowId>) => {
            if (action.payload in state.list) {
                state.list[action.payload].minimized = false;
                state.active = action.payload;
            }
        },
    },
});

export const { windowOpened, windowClosed, windowMinimized, windowActivated } = windowSlice.actions;
export default windowSlice.reducer;
