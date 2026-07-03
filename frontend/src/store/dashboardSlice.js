import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';
import { API_URL } from '@/config';

// Thunk to fetch data from API
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/dashboard/stats`);
            const dbStats = response.data;
            
            // Return data merging real stats with mock data for other sections
            return {
                stats: {
                    admissions: dbStats.admissions || 0,
                    enquiries: dbStats.enquiries || 0,
                    franchises: dbStats.franchises || 0,
                    courses: dbStats.courses || 0
                },
                topCards: {
                    franchiseAdmission: 0,
                    remainingAdmission: 0,
                    registeredToday: 0
                },
                wallet: {
                    fees: dbStats.fees?.total || 0,
                    expense: 0,
                    profit: 0,
                    credits: 0
                },
                fees: {
                    total: dbStats.fees?.total || 0,
                    paid: dbStats.fees?.paid || 0,
                    pending: dbStats.fees?.pending || 0
                },
                examRequests: {
                    total: 0,
                    pending: 0,
                    approved: 0
                },
                certificates: {
                    total: 0,
                    pending: 0,
                    approved: 0
                },
                enquiryStatus: {
                    total: 0,
                    pending: 0,
                    today: 0
                },
                upcomingInstallments: dbStats.upcomingInstallments || [],
                paidInstallments: dbStats.paidInstallments || []
            };
        } catch (error) {
            console.error("Error fetching dashboard API:", error);
            throw error;
        }
    }
);

const initialState = {
    data: {
        stats: { admissions: 0, enquiries: 0, franchises: 0, courses: 0 },
        topCards: { franchiseAdmission: 0, remainingAdmission: 0, registeredToday: 0 },
        wallet: { fees: 0, expense: 0, profit: 0, credits: 0 },
        fees: { total: 0, pending: 0, paid: 0 },
        examRequests: { total: 0, pending: 0, approved: 0 },
        certificates: { total: 0, pending: 0, approved: 0 },
        enquiryStatus: { total: 0, pending: 0, today: 0 },
        upcomingInstallments: [],
        paidInstallments: []
    },
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default dashboardSlice.reducer;
