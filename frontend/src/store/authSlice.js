import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/auth`;

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            return response.data.user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || 'Login failed');
        }
    }
);

export const updateProfilePhoto = createAsyncThunk(
    'auth/updateProfilePhoto',
    async ({ userId, file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('profilePhoto', file);
            const response = await axios.put(`${BASE_URL}/api/users/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || 'Failed to update profile photo');
        }
    }
);

export const updateUserDetails = createAsyncThunk(
    'auth/updateUserDetails',
    async ({ userId, details }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/users/${userId}`, details);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || 'Failed to update user details');
        }
    }
);

export const fetchStudentProfile = createAsyncThunk(
    'auth/fetchStudentProfile',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/student-dashboard/profile?email=${email}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch student profile');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
        status: 'idle',
        error: null,
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateProfilePhoto.fulfilled, (state, action) => {
                state.user = { ...state.user, profilePhoto: action.payload.profilePhoto };
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(fetchStudentProfile.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem('user', JSON.stringify(state.user));
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
