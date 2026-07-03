import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/profile`;

// ─── Fetch profile from backend ───────────────────────────────────────────────
export const fetchProfile = createAsyncThunk('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch profile');
  }
});

// ─── Save profile to backend ──────────────────────────────────────────────────
export const saveProfile = createAsyncThunk('profile/save', async (formData, { rejectWithValue }) => {
  try {
    const data = new FormData();

    // Append text fields
    const textFields = [
      'instituteName', 'ownerName', 'designation', 'email', 'dob',
      'mobile', 'alternateMobile', 'address', 'state',
      'city', 'pincode', 'controllerName', 'showController', 'showDirector'
    ];
    textFields.forEach(field => {
      if (formData[field] !== undefined && formData[field] !== null) {
        data.append(field, formData[field]);
      }
    });

    // Append files only if they are File objects (new uploads)
    if (formData.logoFile instanceof File)
      data.append('logo', formData.logoFile);

    if (formData.signatureFile instanceof File)
      data.append('signature', formData.signatureFile);

    if (formData.controllerSignatureFile instanceof File)
      data.append('controllerSignature', formData.controllerSignatureFile);

    const res = await axios.put(API_URL, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to save profile');
  }
});

// ─── Delete a file ────────────────────────────────────────────────────────────
export const deleteProfileFile = createAsyncThunk('profile/deleteFile', async (type, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/file/${type}`);
    return type;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete file');
  }
});

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  // Text fields
  instituteName: '',
  ownerName: '',
  designation: 'DIRECTOR',
  email: '',
  dob: '',
  mobile: '',
  alternateMobile: '',
  address: '',
  state: 'Tamil Nadu',
  city: '',
  pincode: '',
  controllerName: '',
  showController: false,
  showDirector: false,

  // Cloudinary URLs (stored in DB)
  logoUrl: '',
  signatureUrl: '',
  controllerSignatureUrl: '',

  // Local file objects (for new uploads, not persisted)
  logoFile: null,
  signatureFile: null,
  controllerSignatureFile: null,

  // UI state
  loading: false,
  saving: false,
  error: null,
  success: false,
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearProfileStatus: (state) => {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        state.instituteName = data.instituteName || '';
        state.ownerName = data.ownerName || '';
        state.designation = data.designation || 'DIRECTOR';
        state.email = data.email || '';
        state.dob = data.dob || '';
        state.mobile = data.mobile || '';
        state.alternateMobile = data.alternateMobile || '';
        state.address = data.address || '';
        state.state = data.state || 'Tamil Nadu';
        state.city = data.city || '';
        state.pincode = data.pincode || '';
        state.controllerName = data.controllerName || '';
        state.showController = data.showController || false;
        state.showDirector = data.showDirector || false;
        state.logoUrl = data.logoUrl || '';
        state.signatureUrl = data.signatureUrl || '';
        state.controllerSignatureUrl = data.controllerSignatureUrl || '';
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Save
    builder
      .addCase(saveProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.success = true;
        const data = action.payload;
        state.instituteName = data.instituteName || '';
        state.ownerName = data.ownerName || '';
        state.designation = data.designation || 'DIRECTOR';
        state.dob = data.dob || '';
        state.mobile = data.mobile || '';
        state.alternateMobile = data.alternateMobile || '';
        state.address = data.address || '';
        state.state = data.state || 'Tamil Nadu';
        state.city = data.city || '';
        state.pincode = data.pincode || '';
        state.controllerName = data.controllerName || '';
        state.showController = data.showController || false;
        state.showDirector = data.showDirector || false;
        state.logoUrl = data.logoUrl || '';
        state.signatureUrl = data.signatureUrl || '';
        state.controllerSignatureUrl = data.controllerSignatureUrl || '';
        // Clear file objects after successful save
        state.logoFile = null;
        state.signatureFile = null;
        state.controllerSignatureFile = null;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });

    // Delete file
    builder
      .addCase(deleteProfileFile.fulfilled, (state, action) => {
        const type = action.payload;
        if (type === 'logo') state.logoUrl = '';
        if (type === 'signature') state.signatureUrl = '';
        if (type === 'controllerSignature') state.controllerSignatureUrl = '';
      });
  }
});

export const { updateProfile, clearProfileStatus } = profileSlice.actions;
export default profileSlice.reducer;