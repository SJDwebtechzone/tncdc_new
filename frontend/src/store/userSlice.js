import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/users`;

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add user');
    }
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update user');
    }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.unshift(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const idx = state.users.findIndex(u => u.id === action.payload.id);
                if (idx !== -1) state.users[idx] = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u.id !== action.payload);
            });
    }
});

export default userSlice.reducer;
