import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/payment-details`;

export const fetchPaymentDetails = createAsyncThunk(
    'paymentDetails/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch payment details');
        }
    }
);

export const createPaymentDetail = createAsyncThunk(
    'paymentDetails/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create payment detail');
        }
    }
);

export const updatePaymentDetail = createAsyncThunk(
    'paymentDetails/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update payment detail');
        }
    }
);

export const deletePaymentDetail = createAsyncThunk(
    'paymentDetails/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete payment detail');
        }
    }
);

const paymentDetailSlice = createSlice({
    name: 'paymentDetails',
    initialState: {
        details: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.details = action.payload;
            })
            .addCase(fetchPaymentDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createPaymentDetail.fulfilled, (state, action) => {
                state.details.unshift(action.payload);
            })
            .addCase(updatePaymentDetail.fulfilled, (state, action) => {
                const index = state.details.findIndex(d => d.id === action.payload.id);
                if (index !== -1) {
                    state.details[index] = action.payload;
                }
            })
            .addCase(deletePaymentDetail.fulfilled, (state, action) => {
                state.details = state.details.filter(d => d.id !== action.payload);
            });
    }
});

export default paymentDetailSlice.reducer;
