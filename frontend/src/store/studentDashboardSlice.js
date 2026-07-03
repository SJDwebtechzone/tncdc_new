import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/student-dashboard`;

// Fetch student's enrolled courses, fees, attendance
export const fetchStudentDashboard = createAsyncThunk(
    'studentDashboard/fetch',
    async (email, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/me?email=${encodeURIComponent(email)}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch student dashboard');
        }
    }
);

// Fetch course resources (videos, notes) for a specific course
export const fetchCourseResources = createAsyncThunk(
    'studentDashboard/fetchResources',
    async (courseName, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/course-resources/${encodeURIComponent(courseName)}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch course resources');
        }
    }
);

const studentDashboardSlice = createSlice({
    name: 'studentDashboard',
    initialState: {
        enrolledCourses: [],
        summary: null,
        resources: {},
        loading: false,
        resourcesLoading: false,
        error: null,
    },
    reducers: {
        clearStudentDashboard: (state) => {
            state.enrolledCourses = [];
            state.summary = null;
            state.resources = {};
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.enrolledCourses = action.payload.enrolledCourses || [];
                state.summary = action.payload.summary || null;
            })
            .addCase(fetchStudentDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCourseResources.pending, (state) => {
                state.resourcesLoading = true;
            })
            .addCase(fetchCourseResources.fulfilled, (state, action) => {
                state.resourcesLoading = false;
                // Store resources keyed by course name
                if (action.payload.courseTitle) {
                    state.resources[action.payload.courseTitle] = action.payload;
                }
            })
            .addCase(fetchCourseResources.rejected, (state) => {
                state.resourcesLoading = false;
            });
    }
});

export const { clearStudentDashboard } = studentDashboardSlice.actions;
export default studentDashboardSlice.reducer;
