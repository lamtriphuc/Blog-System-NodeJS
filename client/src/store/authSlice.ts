import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface User {
    id: number;
    email: string;
    username: string;
    avatarUrl: string;
    bio: string;
    createdAt: Date;
    role: number;
}

interface AuthState {
    user: User | null;
}

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
