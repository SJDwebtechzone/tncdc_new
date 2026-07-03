import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@/config';

export const fetchUpcomingInstallments = createAsyncThunk(
    'fees/fetchUpcomingInstallments',
    async () => {
        const response = await axios.get(`${API_URL}/installments/upcoming/all`);
        return response.data;
    }
);

export const fetchPaidInstallments = createAsyncThunk(
    'fees/fetchPaidInstallments',
    async () => {
        const response = await axios.get(`${API_URL}/installments/paid/all`);
        return response.data;
    }
);

const initialState = {
    transactions: [],
    upcomingInstallments: [],
    paidInstallments: [],
    loading: false,
    error: null
};

const feeSlice = createSlice({
    name: 'fees',
    initialState,
    reducers: {
        addTransaction: (state, action) => {
            state.transactions.push({ ...action.payload, id: Date.now() });
        }
    },
    extraReducers: (builder) => {
        builder
            // Upcoming
            .addCase(fetchUpcomingInstallments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUpcomingInstallments.fulfilled, (state, action) => {
                state.loading = false;
                state.upcomingInstallments = action.payload;
            })
            .addCase(fetchUpcomingInstallments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Paid
            .addCase(fetchPaidInstallments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPaidInstallments.fulfilled, (state, action) => {
                state.loading = false;
                state.paidInstallments = action.payload;
            })
            .addCase(fetchPaidInstallments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { addTransaction } = feeSlice.actions;
export default feeSlice.reducer;
