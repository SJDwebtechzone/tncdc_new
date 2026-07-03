import { configureStore, createSlice } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';
import studentReducer from './studentSlice';
import courseReducer from './courseSlice';
import batchReducer from './batchSlice';
import feeReducer from './feeSlice';
import profileReducer from './profileSlice';
import attendanceReducer from './attendanceSlice';
import websiteReducer from './websiteSlice';
import roleReducer from './roleSlice';
import designationReducer from './designationSlice';
import userReducer from './userSlice';
import authReducer from './authSlice';
import admissionReducer from './admissionSlice';
import studentDashboardReducer from './studentDashboardSlice';
import staffAttendanceReducer from './staffAttendanceSlice';
import staffSalaryReducer from './staffSalarySlice';
import paymentDetailReducer from './paymentDetailSlice';

const initialAppState = {
    courses: [],
    categories: [],
    events: [],
    posts: [],
};

const appSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        setData: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setData } = appSlice.actions;

const rootReducer = combineReducers({
    app: appSlice.reducer,
    dashboard: dashboardReducer,
    students: studentReducer,
    courses: courseReducer,
    batches: batchReducer,
    fees: feeReducer,
    profile: profileReducer,
    attendance: attendanceReducer,
    website: websiteReducer,
    roles: roleReducer,
    designations: designationReducer,
    users: userReducer,
    auth: authReducer,
    admissions: admissionReducer,
    studentDashboard: studentDashboardReducer,
    staffAttendance: staffAttendanceReducer,
    staffSalary: staffSalaryReducer,
    paymentDetails: paymentDetailReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['website', 'auth']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);