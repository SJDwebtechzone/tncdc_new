import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/enquiries`;

export const fetchEnquiries = createAsyncThunk('students/fetchEnquiries', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch enquiries');
    }
});

export const saveEnquiry = createAsyncThunk('students/saveEnquiry', async (formData, { rejectWithValue }) => {
    try {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                if (key === 'profileImage' || key === 'signature') {
                    if (formData[key] instanceof File) {
                        data.append(key, formData[key]);
                    }
                } else {
                    data.append(key, formData[key]);
                }
            }
        });

        const response = await axios.post(API_URL, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to save enquiry');
    }
});

export const updateEnquiry = createAsyncThunk('students/updateEnquiry', async ({ id, data: formData }, { rejectWithValue }) => {
    try {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                if (key === 'profileImage' || key === 'signature') {
                    if (formData[key] instanceof File) {
                        data.append(key, formData[key]);
                    }
                } else {
                    data.append(key, formData[key]);
                }
            }
        });

        const response = await axios.put(`${API_URL}/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update enquiry');
    }
});

export const deleteEnquiry = createAsyncThunk('students/deleteEnquiry', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete enquiry');
    }
});

export const fetchEnquiryFollowUps = createAsyncThunk('students/fetchEnquiryFollowUps', async (enquiryId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/${enquiryId}/followups`);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch follow-ups');
    }
});

export const saveEnquiryFollowUp = createAsyncThunk('students/saveEnquiryFollowUp', async ({ enquiryId, data }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/${enquiryId}/followups`, data);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to save follow-up');
    }
});

export const fetchAllFollowUps = createAsyncThunk('students/fetchAllFollowUps', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch all follow-ups');
    }
});

export const assignEnquiry = createAsyncThunk('students/assignEnquiry', async ({ enquiryId, assignedTo }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${enquiryId}`, { assignedTo });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to assign enquiry');
    }
});

const initialState = {
    students: [],
    enquiries: [],
    followUps: [],
    notifications: [],
    popups: [],
    loading: false,
    error: null
};

const studentSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        addStudent: (state, action) => {
            state.students.push(action.payload);
        },
        updateStudent: (state, action) => {
            const index = state.students.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.students[index] = action.payload;
            }
        },
        deleteStudent: (state, action) => {
            state.students = state.students.filter(s => s.id !== action.payload);
        },
        addFollowUp: (state, action) => {
            if (!state.followUps) state.followUps = [];
            state.followUps.push({ ...action.payload, id: Date.now(), status: "Pending" });
        },
        addNotification: (state, action) => {
            if (!state.notifications) state.notifications = [];
            state.notifications.push({ ...action.payload, id: Date.now(), created: new Date().toLocaleDateString() });
        },
        deleteNotification: (state, action) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
        addPopup: (state, action) => {
            if (!state.popups) state.popups = [];
            state.popups.push({ ...action.payload, id: Date.now(), created: new Date().toLocaleDateString() });
        },
        deletePopup: (state, action) => {
            state.popups = state.popups.filter(p => p.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEnquiries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnquiries.fulfilled, (state, action) => {
                state.loading = false;
                state.enquiries = action.payload;
            })
            .addCase(fetchEnquiries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(saveEnquiry.fulfilled, (state, action) => {
                state.enquiries.unshift(action.payload);
            })
            .addCase(updateEnquiry.fulfilled, (state, action) => {
                const index = state.enquiries.findIndex(e => e.id === action.payload.id);
                if (index !== -1) {
                    state.enquiries[index] = action.payload;
                }
            })
            .addCase(deleteEnquiry.fulfilled, (state, action) => {
                state.enquiries = state.enquiries.filter(e => e.id !== action.payload);
            })
            .addCase(fetchEnquiryFollowUps.fulfilled, (state, action) => {
                // Ensure we don't overwrite followUps for other enquiries accidentally if needed globally,
                // but for now, we'll store the active enquiry's followups here
                state.followUps = action.payload; 
            })
            .addCase(saveEnquiryFollowUp.fulfilled, (state, action) => {
                if (!state.followUps) state.followUps = [];
                state.followUps.unshift(action.payload); // Add new follow-up to the beginning
                
                // Optionally update the enquiry status in the state
                const response = action.payload.studentResponse;
                state.enquiries = state.enquiries.map(e => {
                    if (e.id == action.payload.enquiryId) {
                        let newStatus = e.status;
                        if (response === 'Interested' || response === 'Call Back Later') {
                            newStatus = 'Pending';
                        } else if (response === 'Not Interested') {
                            newStatus = 'Lost';
                        }
                        return { ...e, status: newStatus, followUps: [action.payload] };
                    }
                    return e;
                });
            })
            .addCase(fetchAllFollowUps.fulfilled, (state, action) => {
                state.followUps = action.payload;
            })
            .addCase(assignEnquiry.fulfilled, (state, action) => {
                state.enquiries = state.enquiries.map(e => 
                    e.id == action.payload.id ? { ...e, assignedTo: action.payload.assignedTo } : e
                );
            });
    }
});

export const { addStudent, updateStudent, deleteStudent, addFollowUp, addNotification, deleteNotification, addPopup, deletePopup } = studentSlice.actions;
export default studentSlice.reducer;
