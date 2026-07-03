import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/staff-attendance`;

export const fetchStaffAttendance = createAsyncThunk('staffAttendance/fetchBatch', async (filters = {}) => {
    const { userId, month, year, date } = filters;
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    if (date) params.append('date', date);
    
    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
});

export const markIndividualAttendance = createAsyncThunk('staffAttendance/markIndividual', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to mark attendance');
    }
});

export const markBulkAttendance = createAsyncThunk('staffAttendance/markBulk', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/bulk`, data);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to mark bulk attendance');
    }
});

export const deleteAttendanceRecord = createAsyncThunk('staffAttendance/delete', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

const staffAttendanceSlice = createSlice({
    name: 'staffAttendance',
    initialState: {
        records: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaffAttendance.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchStaffAttendance.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records = action.payload;
            })
            .addCase(fetchStaffAttendance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(markBulkAttendance.fulfilled, (state) => {
                state.status = 'idle'; // Trigger re-fetch
            })
            .addCase(markIndividualAttendance.fulfilled, (state) => {
                state.status = 'idle'; // Trigger re-fetch
            })
            .addCase(deleteAttendanceRecord.fulfilled, (state, action) => {
                state.records = state.records.filter(r => r.id !== action.payload);
            });
    }
});

export default staffAttendanceSlice.reducer;
