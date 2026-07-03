import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

export const fetchWeekOffDays = createAsyncThunk(
    'attendance/fetchWeekOffDays',
    async () => {
        const response = await axios.get(`${API_URL}/attendance-settings`);
        return response.data.weekOffDays;
    }
);

export const saveWeekOffDays = createAsyncThunk(
    'attendance/saveWeekOffDays',
    async (weekOffDays) => {
        const response = await axios.put(`${API_URL}/attendance-settings`, { weekOffDays });
        return response.data.weekOffDays;
    }
);

// Leaves Actions
export const fetchLeaves = createAsyncThunk(
    'attendance/fetchLeaves',
    async () => {
        const response = await axios.get(`${API_URL}/leaves`);
        return response.data;
    }
);

export const createLeave = createAsyncThunk(
    'attendance/createLeave',
    async (leaveData) => {
        const response = await axios.post(`${API_URL}/leaves`, leaveData);
        return response.data;
    }
);

export const removeLeave = createAsyncThunk(
    'attendance/removeLeave',
    async (id) => {
        await axios.delete(`${API_URL}/leaves/${id}`);
        return id;
    }
);

// Student Attendance Actions
export const fetchStudentAttendance = createAsyncThunk(
    'attendance/fetchStudentAttendance',
    async ({ batch, date }) => {
        const response = await axios.get(`${API_URL}/student-attendance/students?batch=${batch}&date=${date}`);
        return response.data;
    }
);

export const submitStudentAttendance = createAsyncThunk(
    'attendance/submitStudentAttendance',
    async (attendanceData) => {
        const response = await axios.post(`${API_URL}/student-attendance/bulk`, attendanceData);
        return response.data;
    }
);

export const fetchStudentAttendanceReport = createAsyncThunk(
    'attendance/fetchStudentAttendanceReport',
    async (params) => {
        const queryParams = new URLSearchParams(params).toString();
        const response = await axios.get(`${API_URL}/student-attendance/report?${queryParams}`);
        return response.data;
    }
);

const initialState = {
    holidays: [],
    leaves: [],
    attendanceRecords: [],
    studentAttendanceRecords: [], // for the currently selected batch/date
    studentAttendanceReport: [], // for reporting
    weekOffDays: ['Saturday', 'Sunday'],
    loading: false,
    error: null
};

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        addHoliday: (state, action) => {
            state.holidays.push({ ...action.payload, id: Date.now() });
        },
        deleteHoliday: (state, action) => {
            state.holidays = state.holidays.filter(h => h.id !== action.payload);
        },
        updateWeekOff: (state, action) => {
            state.weekOffDays = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeekOffDays.fulfilled, (state, action) => {
                state.weekOffDays = action.payload;
            })
            .addCase(saveWeekOffDays.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveWeekOffDays.fulfilled, (state, action) => {
                state.weekOffDays = action.payload;
                state.loading = false;
            })
            .addCase(saveWeekOffDays.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Leaves extraReducers
            .addCase(fetchLeaves.fulfilled, (state, action) => {
                state.leaves = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(createLeave.fulfilled, (state, action) => {
                state.leaves.unshift(action.payload);
            })
            .addCase(removeLeave.fulfilled, (state, action) => {
                state.leaves = state.leaves.filter(l => l.id !== action.payload);
            })
            // Student Attendance extraReducers
            .addCase(fetchStudentAttendance.pending, (state) => {
                state.loading = true;
                state.studentAttendanceRecords = [];
            })
            .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
                state.loading = false;
                state.studentAttendanceRecords = action.payload;
            })
            .addCase(fetchStudentAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(submitStudentAttendance.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitStudentAttendance.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(submitStudentAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchStudentAttendanceReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStudentAttendanceReport.fulfilled, (state, action) => {
                state.loading = false;
                state.studentAttendanceReport = action.payload;
            })
            .addCase(fetchStudentAttendanceReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { addHoliday, deleteHoliday, updateWeekOff } = attendanceSlice.actions;
export default attendanceSlice.reducer;
