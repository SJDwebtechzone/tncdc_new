import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/admissions`;

export const fetchAdmissions = createAsyncThunk('admissions/fetchAdmissions', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch admissions');
    }
});

export const createAdmission = createAsyncThunk('admissions/createAdmission', async (admissionData, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, admissionData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to create admission');
    }
});

export const updateAdmission = createAsyncThunk('admissions/updateAdmission', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update admission');
    }
});

const initialState = {
    admissions: [],
    loading: false,
    error: null
};

const admissionSlice = createSlice({
    name: 'admissions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdmissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.admissions = action.payload;
            })
            .addCase(fetchAdmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createAdmission.fulfilled, (state, action) => {
                state.admissions.unshift(action.payload);
            })
            .addCase(updateAdmission.fulfilled, (state, action) => {
                const index = state.admissions.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.admissions[index] = action.payload;
                }
            });
    }
});

export default admissionSlice.reducer;
