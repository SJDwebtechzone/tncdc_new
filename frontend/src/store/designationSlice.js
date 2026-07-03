import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/designations`;

export const fetchDesignations = createAsyncThunk('designations/fetchDesignations', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const addDesignation = createAsyncThunk('designations/addDesignation', async (newDesignation) => {
    const response = await axios.post(API_URL, newDesignation);
    return response.data;
});

export const updateDesignation = createAsyncThunk('designations/updateDesignation', async (updatedDesignation) => {
    const response = await axios.put(`${API_URL}/${updatedDesignation.id}`, updatedDesignation);
    return response.data;
});

export const deleteDesignation = createAsyncThunk('designations/deleteDesignation', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

const designationSlice = createSlice({
    name: 'designations',
    initialState: {
        designations: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDesignations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDesignations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.designations = action.payload;
            })
            .addCase(fetchDesignations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addDesignation.fulfilled, (state, action) => {
                state.designations.unshift(action.payload);
            })
            .addCase(updateDesignation.fulfilled, (state, action) => {
                const index = state.designations.findIndex(d => d.id === action.payload.id);
                if (index !== -1) {
                    state.designations[index] = action.payload;
                }
            })
            .addCase(deleteDesignation.fulfilled, (state, action) => {
                state.designations = state.designations.filter(d => d.id !== action.payload);
            });
    }
});

export default designationSlice.reducer;
