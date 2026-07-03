import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/staff-salary`;

export const fetchStaffSalaries = createAsyncThunk(
    'staffSalary/fetchAll',
    async (filters, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, { params: filters });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch salaries');
        }
    }
);

export const calculateSalaryPreview = createAsyncThunk(
    'staffSalary/preview',
    async (params, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/preview`, { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to calculate preview');
        }
    }
);

export const saveStaffSalary = createAsyncThunk(
    'staffSalary/save',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to save salary');
        }
    }
);

export const deleteStaffSalary = createAsyncThunk(
    'staffSalary/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete salary');
        }
    }
);

const staffSalarySlice = createSlice({
    name: 'staffSalary',
    initialState: {
        records: [],
        preview: null,
        status: 'idle',
        error: null
    },
    reducers: {
        resetPreview: (state) => {
            state.preview = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaffSalaries.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStaffSalaries.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.records = action.payload;
            })
            .addCase(calculateSalaryPreview.fulfilled, (state, action) => {
                state.preview = action.payload;
            })
            .addCase(calculateSalaryPreview.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(saveStaffSalary.fulfilled, (state, action) => {
                state.records.unshift(action.payload);
            })
            .addCase(deleteStaffSalary.fulfilled, (state, action) => {
                state.records = state.records.filter(r => r.id !== action.payload);
            })
            .addCase(fetchStaffSalaries.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetPreview } = staffSalarySlice.actions;
export default staffSalarySlice.reducer;
