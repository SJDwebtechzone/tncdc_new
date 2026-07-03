import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/batches`;

export const fetchBatches = createAsyncThunk('batches/fetchBatches', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const addBatch = createAsyncThunk('batches/addBatch', async (newBatch) => {
    const response = await axios.post(API_URL, newBatch);
    return response.data;
});

export const updateBatch = createAsyncThunk('batches/updateBatch', async (updatedBatch) => {
    const response = await axios.put(`${API_URL}/${updatedBatch.id}`, updatedBatch);
    return response.data;
});

export const deleteBatch = createAsyncThunk('batches/deleteBatch', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

const batchSlice = createSlice({
    name: 'batches',
    initialState: {
        batches: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBatches.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBatches.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.batches = action.payload;
            })
            .addCase(fetchBatches.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addBatch.fulfilled, (state, action) => {
                state.batches.unshift(action.payload);
            })
            .addCase(updateBatch.fulfilled, (state, action) => {
                const index = state.batches.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.batches[index] = action.payload;
                }
            })
            .addCase(deleteBatch.fulfilled, (state, action) => {
                state.batches = state.batches.filter(b => b.id !== action.payload);
            });
    }
});

export default batchSlice.reducer;
