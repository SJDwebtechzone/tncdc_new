import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/roles`;

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const addRole = createAsyncThunk('roles/addRole', async (newRole) => {
    const response = await axios.post(API_URL, newRole);
    return response.data;
});

export const updateRole = createAsyncThunk('roles/updateRole', async (updatedRole) => {
    const response = await axios.put(`${API_URL}/${updatedRole.id}`, updatedRole);
    return response.data;
});

export const deleteRole = createAsyncThunk('roles/deleteRole', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

const roleSlice = createSlice({
    name: 'roles',
    initialState: {
        roles: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.roles = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addRole.fulfilled, (state, action) => {
                state.roles.unshift(action.payload);
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                const index = state.roles.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.roles[index] = action.payload;
                }
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.roles = state.roles.filter(r => r.id !== action.payload);
            });
    }
});

export default roleSlice.reducer;
