
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = BASE_URL;

// Fetch site settings from backend
export const fetchSiteSettings = createAsyncThunk('website/fetchSiteSettings', async () => {
    const response = await axios.get(`${API_URL}/api/site-settings`);
    return response.data;
});

// Save site settings to backend
export const saveSiteSettings = createAsyncThunk('website/saveSiteSettings', async (data) => {
    const response = await axios.put(`${API_URL}/api/site-settings`, data);
    return response.data;
});

// Banners
export const fetchBanners = createAsyncThunk('website/fetchBanners', async () => {
    const response = await axios.get(`${API_URL}/api/website-banners`);
    return response.data;
});

export const fetchSlides = createAsyncThunk('website/fetchSlides', async () => {
    const response = await axios.get(`${API_URL}/api/website-banners/slides`);
    return response.data;
});

export const saveBannerSettings = createAsyncThunk('website/saveBannerSettings', async (data) => {
    const response = await axios.post(`${API_URL}/api/website-banners`, data);
    return response.data;
});

// FAQs
export const fetchFAQs = createAsyncThunk('website/fetchFAQs', async () => {
    const response = await axios.get(`${API_URL}/api/faqs`);
    return response.data;
});

export const addFAQObj = createAsyncThunk('website/addFAQObj', async (data) => {
    const response = await axios.post(`${API_URL}/api/faqs/item`, data);
    return response.data;
});

export const updateFAQObj = createAsyncThunk('website/updateFAQObj', async (data) => {
    const response = await axios.put(`${API_URL}/api/faqs/item/${data.id}`, data);
    return response.data;
});

export const deleteFAQObj = createAsyncThunk('website/deleteFAQObj', async (id) => {
    await axios.delete(`${API_URL}/api/faqs/item/${id}`);
    return id;
});

export const saveFAQBanners = createAsyncThunk('website/saveFAQBanners', async (data) => {
    const response = await axios.post(`${API_URL}/api/faqs/banners`, data);
    return response.data;
});

// Teachers
export const fetchTeachers = createAsyncThunk('website/fetchTeachers', async () => {
    const response = await axios.get(`${API_URL}/api/teachers`);
    return response.data;
});

export const addTeacherObj = createAsyncThunk('website/addTeacherObj', async (data) => {
    const response = await axios.post(`${API_URL}/api/teachers`, data);
    return response.data;
});

export const updateTeacherObj = createAsyncThunk('website/updateTeacherObj', async (data) => {
    const response = await axios.put(`${API_URL}/api/teachers/${data.id}`, data);
    return response.data;
});

export const deleteTeacherObj = createAsyncThunk('website/deleteTeacherObj', async (id) => {
    await axios.delete(`${API_URL}/api/teachers/${id}`);
    return id;
});

// Testimonials
export const fetchTestimonials = createAsyncThunk('website/fetchTestimonials', async () => {
    const response = await axios.get(`${API_URL}/api/testimonials`);
    return response.data;
});

export const addTestimonialObj = createAsyncThunk('website/addTestimonialObj', async (data) => {
    const response = await axios.post(`${API_URL}/api/testimonials/item`, data);
    return response.data;
});

export const updateTestimonialObj = createAsyncThunk('website/updateTestimonialObj', async (data) => {
    const response = await axios.put(`${API_URL}/api/testimonials/item/${data.id}`, data);
    return response.data;
});

export const deleteTestimonialObj = createAsyncThunk('website/deleteTestimonialObj', async (id) => {
    await axios.delete(`${API_URL}/api/testimonials/item/${id}`);
    return id;
});

export const saveTestimonialSettings = createAsyncThunk('website/saveTestimonialSettings', async (data) => {
    const response = await axios.post(`${API_URL}/api/testimonials/settings`, data);
    return response.data;
});

// Gallery
export const fetchGalleryItems = createAsyncThunk('website/fetchGalleryItems', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/gallery`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const addGalleryItemToServer = createAsyncThunk('website/addGalleryItemToServer', async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/gallery`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const deleteGalleryItemFromServer = createAsyncThunk('website/deleteGalleryItemFromServer', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/api/gallery/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

// Top Performers
export const fetchTopPerformers = createAsyncThunk('website/fetchTopPerformers', async () => {
    const response = await axios.get(`${API_URL}/api/top-performers`);
    return response.data;
});

export const addTopPerformerObj = createAsyncThunk('website/addTopPerformerObj', async (data) => {
    const response = await axios.post(`${API_URL}/api/top-performers/item`, data);
    return response.data;
});

export const updateTopPerformerObj = createAsyncThunk('website/updateTopPerformerObj', async (data) => {
    const response = await axios.put(`${API_URL}/api/top-performers/item/${data.id}`, data);
    return response.data;
});

export const deleteTopPerformerObj = createAsyncThunk('website/deleteTopPerformerObj', async (id) => {
    await axios.delete(`${API_URL}/api/top-performers/item/${id}`);
    return id;
});

export const saveTopPerformerSettings = createAsyncThunk('website/saveTopPerformerSettings', async (data) => {
    const response = await axios.post(`${API_URL}/api/top-performers/settings`, data);
    return response.data;
});

// Study Materials
export const fetchStudyMaterials = createAsyncThunk('website/fetchStudyMaterials', async () => {
    const response = await axios.get(`${API_URL}/api/study-materials`);
    return response.data;
});

export const addStudyMaterialToServer = createAsyncThunk('website/addStudyMaterialToServer', async (formData) => {
    const response = await axios.post(`${API_URL}/api/study-materials`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
});

export const updateStudyMaterialToServer = createAsyncThunk('website/updateStudyMaterialToServer', async ({ id, formData }) => {
    const response = await axios.put(`${API_URL}/api/study-materials/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
});

export const deleteStudyMaterialFromServer = createAsyncThunk('website/deleteStudyMaterialFromServer', async (id) => {
    await axios.delete(`${API_URL}/api/study-materials/${id}`);
    return id;
});

export const fetchContactSettings = createAsyncThunk('website/fetchContactSettings', async () => {
    const response = await axios.get(`${API_URL}/api/contact-settings`);
    return response.data;
});

export const updateContactSettingsFromServer = createAsyncThunk('website/updateContactSettings', async (settings) => {
    const response = await axios.put(`${API_URL}/api/contact-settings`, settings);
    return response.data;
});

// Sample Certificates
export const fetchSampleCertificates = createAsyncThunk('website/fetchSampleCertificates', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/sample-certificates`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const addSampleCertificateToServer = createAsyncThunk('website/addSampleCertificateToServer', async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/sample-certificates`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const updateSampleCertificateToServer = createAsyncThunk('website/updateSampleCertificateToServer', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/api/sample-certificates/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const deleteSampleCertificateFromServer = createAsyncThunk('website/deleteSampleCertificateFromServer', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/api/sample-certificates/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

// Affiliations
export const fetchAffiliations = createAsyncThunk('website/fetchAffiliations', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/affiliations`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const addAffiliationToServer = createAsyncThunk('website/addAffiliationToServer', async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/affiliations`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const updateAffiliationToServer = createAsyncThunk('website/updateAffiliationToServer', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/api/affiliations/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const deleteAffiliationFromServer = createAsyncThunk('website/deleteAffiliationFromServer', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/api/affiliations/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

// Posts
export const fetchPosts = createAsyncThunk('website/fetchPosts', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/posts`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const addPostToServer = createAsyncThunk('website/addPostToServer', async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/posts`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const updatePostToServer = createAsyncThunk('website/updatePostToServer', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/api/posts/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const deletePostFromServer = createAsyncThunk('website/deletePostFromServer', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/api/posts/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const fetchJobs = createAsyncThunk('website/fetchJobs', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/jobs`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const addJobToServer = createAsyncThunk('website/addJobToServer', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/jobs`, data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const updateJobToServer = createAsyncThunk('website/updateJobToServer', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/api/jobs/${id}`, data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const deleteJobFromServer = createAsyncThunk('website/deleteJobFromServer', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/api/jobs/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const fetchJobApplications = createAsyncThunk('website/fetchJobApplications', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/job-applications`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const updateJobApplicationStatusToServer = createAsyncThunk('website/updateJobApplicationStatusToServer', async ({ id, status }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/api/job-applications/${id}`, { status });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const fetchEvents = createAsyncThunk('website/fetchEvents', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/events`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const addEventToServer = createAsyncThunk('website/addEventToServer', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/events`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const updateEventToServer = createAsyncThunk('website/updateEventToServer', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/api/events/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const deleteEventFromServer = createAsyncThunk('website/deleteEventFromServer', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/api/events/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const fetchPartners = createAsyncThunk('website/fetchPartners', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/partners`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const addPartnerToServer = createAsyncThunk('website/addPartnerToServer', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/partners`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const updatePartnerToServer = createAsyncThunk('website/updatePartnerToServer', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/api/partners/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const deletePartnerFromServer = createAsyncThunk('website/deletePartnerFromServer', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/api/partners/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

const initialState = {

    events: [],
    slides: [],
    partners: [],
    loading: false,
    banners: [],
    bannerSettings: {
        displayMode: 'banner',
        badgeText: '',
        badgeIcon: '',
        title: '',
        description: '',
        image: ''
    },
    performerSettings: { title: '', description: '' },
    performers: [],
    faqSettings: { title: '', description: '', banner1: '', banner2: '' },
    faqs: [],
    gallery: [],
    posts: [],
    partners: [],
    jobs: [],
    jobApplications: [],
    studyMaterials: [],
    affiliations: [],
    sampleCertificates: [],
    counters: [],
    testimonials: [],
    testimonialSettings: { subtitle: '', title: '' },
    services: [],
    serviceSettings: { title: '', description: '' },
    policies: [
        { id: 'privacy', title: 'Privacy Policy', content: 'Privacy Policy Your privacy policy content here...' },
        { id: 'terms', title: 'Terms & Conditions', content: 'Terms & Conditions Your terms and conditions content here...' },
        { id: 'refund', title: 'Refund Policy', content: 'Refund Policy Your refund policy content here...' }
    ],
    aboutSettings: {
        subtitle: 'Know About Us',
        title: 'Know About Histudy <br /> Learning Platform',
        description: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.',
        image1: '',
        image2: '',
        image3: '',
        feature1Icon: 'Heart',
        feature1Title: 'Flexible Classes',
        feature1Desc: 'It is a long established fact that a reader will be distracted by this on readable content of when looking at its layout.',
        feature2Icon: 'Book',
        feature2Title: 'Learn From Anywhere',
        feature2Desc: 'Sed distinctio repudiandae eos recusandae laborum eaque non eius iure suscipit laborum eaque non eius iure suscipit.'
    },
    siteSettings: {
        headerType: 'logo',
        logo: 'https://mum-objectstore.e2enetworks.net/hdi-multi-tenant/tncdc.in/website/logo/image_6979ce5039f69.png',
        favicon: '',
        playStoreLink: 'https://play.google.com/store/apps/details?id=com.example.app',
        appStoreLink: 'https://www.apple.com/app-store/',
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        marqueeEntries: [
            "Welcome to TamilNadu Career Development Council",
            "Join our courses today!",
            "Join our courses today!",
            "Contact us for more info!"
        ]
    },
    missionVisionSettings: {
        bannerBadgeText: '',
        bannerBadgeIcon: '',
        bannerDesc: '',
        videoImage: '',
        videoUrl: '',
        visionTitle: '',
        visionDesc: '',
        visionImage1: '',
        visionImage2: '',
        visionImage3: '',
        visionFeature1Icon: '',
        visionFeature1Title: '',
        visionFeature1Desc: '',
        visionFeature2Icon: '',
        visionFeature2Title: '',
        visionFeature2Desc: '',
        visionFeature3Icon: '',
        visionFeature3Title: '',
        visionFeature3Desc: '',
        missionTitle: '',
        missionDesc: '',
        missionImage1: '',
        missionImage2: '',
        missionImage3: '',
        missionFeature1Icon: '',
        missionFeature1Title: '',
        missionFeature1Desc: '',
        missionFeature2Icon: '',
        missionFeature2Title: '',
        missionFeature2Desc: '',
        missionFeature3Icon: '',
        missionFeature3Title: '',
        missionFeature3Desc: ''
    },
    socialMediaSettings: {
        facebook: '',
        x: '',
        instagram: '',
        linkedin: '',
        youtube: ''
    },
    mobileBanners: [],
    teachers: [],
    contactSettings: {
        title: 'Histudy Course Contact <br> can join with us',
        phone1: '+444 555 666 777',
        phone2: '+222 222 222 333',
        whatsapp: '',
        email1: 'admin@gmail.com',
        address: '5678 Bangla Main Road, cities 580 <br> GBnagla, example 54786',
        mapIframe: ''
    },
    paymentDetails: []
};

export const fetchMissionVision = createAsyncThunk('website/fetchMissionVision', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/mission-vision`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const updateMissionVision = createAsyncThunk('website/updateMissionVision', async (formData, { rejectWithValue }) => {
    try {
        const data = new FormData();
        
        // Append all text fields
        Object.keys(formData).forEach(key => {
            if (!(formData[key] instanceof File) && key !== 'id' && key !== 'updatedAt') {
                data.append(key, formData[key]);
            }
        });

        // Append file fields
        const fileFields = [
            'videoImageFile', 'visionImage1File', 'visionImage2File', 'visionImage3File',
            'missionImage1File', 'missionImage2File', 'missionImage3File'
        ];
        
        fileFields.forEach(field => {
            if (formData[field] instanceof File) {
                // Map frontend file field names to backend field names
                const backendField = field.replace('File', '');
                data.append(backendField, formData[field]);
            }
        });

        const response = await axios.put(`${BASE_URL}/api/mission-vision`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

const websiteSlice = createSlice({
    name: 'website',
    initialState,
    reducers: {
        
        // Events
        addEvent: (state, action) => {
            state.events.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editEvent: (state, action) => {
            const index = state.events.findIndex(e => e.id === action.payload.id);
            if (index !== -1) {
                state.events[index] = { ...state.events[index], ...action.payload };
            }
        },
        deleteEvent: (state, action) => {
            state.events = state.events.filter(e => e.id !== action.payload);
        },
        // Banners
        addBanner: (state, action) => {
            state.banners.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        deleteBanner: (state, action) => {
            state.banners = state.banners.filter(b => b.id !== action.payload);
        },
        updateBannerSettings: (state, action) => {
            state.bannerSettings = { ...state.bannerSettings, ...action.payload };
        },
        // FAQs
        updateFAQSettings: (state, action) => {
            state.faqSettings = { ...state.faqSettings, ...action.payload };
        },
        addFAQ: (state, action) => {
            state.faqs.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editFAQ: (state, action) => {
            const index = state.faqs.findIndex(f => f.id === action.payload.id);
            if (index !== -1) {
                state.faqs[index] = { ...state.faqs[index], ...action.payload };
            }
        },
        deleteFAQ: (state, action) => {
            state.faqs = state.faqs.filter(f => f.id !== action.payload);
        },
        // Gallery
        addGalleryItem: (state, action) => {
            state.gallery.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editGalleryItem: (state, action) => {
            const index = state.gallery.findIndex(g => g.id === action.payload.id);
            if (index !== -1) {
                state.gallery[index] = { ...state.gallery[index], ...action.payload };
            }
        },
        deleteGalleryItem: (state, action) => {
            state.gallery = state.gallery.filter(g => g.id !== action.payload);
        },
        // Posts (Handled by extraReducers)

        // Partners
        addPartner: (state, action) => {
            state.partners.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editPartner: (state, action) => {
            const index = state.partners.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.partners[index] = { ...state.partners[index], ...action.payload };
            }
        },
        deletePartner: (state, action) => {
            state.partners = state.partners.filter(p => p.id !== action.payload);
        },
        // Jobs
        addJob: (state, action) => {
            state.jobs.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editJob: (state, action) => {
            const index = state.jobs.findIndex(j => j.id === action.payload.id);
            if (index !== -1) {
                state.jobs[index] = { ...state.jobs[index], ...action.payload };
            }
        },
        deleteJob: (state, action) => {
            state.jobs = state.jobs.filter(j => j.id !== action.payload);
        },
        // Study Materials
        addStudyMaterial: (state, action) => {
            state.studyMaterials.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editStudyMaterial: (state, action) => {
            const index = state.studyMaterials.findIndex(m => m.id === action.payload.id);
            if (index !== -1) {
                state.studyMaterials[index] = { ...state.studyMaterials[index], ...action.payload };
            }
        },
        deleteStudyMaterial: (state, action) => {
            state.studyMaterials = state.studyMaterials.filter(s => s.id !== action.payload);
        },
        // Affiliations (Handled by extraReducers)

        // Sample Certificates (Handled by extraReducers for async)

        // Counters
        addCounter: (state, action) => {
            state.counters.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editCounter: (state, action) => {
            const index = state.counters.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.counters[index] = { ...state.counters[index], ...action.payload };
            }
        },
        deleteCounter: (state, action) => {
            state.counters = state.counters.filter(c => c.id !== action.payload);
        },
        // Payment Details
        addPaymentDetail: (state, action) => {
            state.paymentDetails.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editPaymentDetail: (state, action) => {
            const index = state.paymentDetails.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.paymentDetails[index] = { ...state.paymentDetails[index], ...action.payload };
            }
        },
        deletePaymentDetail: (state, action) => {
            state.paymentDetails = state.paymentDetails.filter(p => p.id !== action.payload);
        },
        // Testimonials
        updateTestimonialSettings: (state, action) => {
            state.testimonialSettings = { ...state.testimonialSettings, ...action.payload };
        },
        addTestimonial: (state, action) => {
            state.testimonials.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editTestimonial: (state, action) => {
            const index = state.testimonials.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.testimonials[index] = { ...state.testimonials[index], ...action.payload };
            }
        },
        deleteTestimonial: (state, action) => {
            state.testimonials = state.testimonials.filter(t => t.id !== action.payload);
        },
        // Services
        updateServiceSettings: (state, action) => {
            state.serviceSettings = { ...state.serviceSettings, ...action.payload };
        },
        addService: (state, action) => {
            state.services.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editService: (state, action) => {
            const index = state.services.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.services[index] = { ...state.services[index], ...action.payload };
            }
        },
        deleteService: (state, action) => {
            state.services = state.services.filter(s => s.id !== action.payload);
        },
        // Policies
        updatePolicy: (state, action) => {
            const index = state.policies.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.policies[index] = { ...state.policies[index], ...action.payload };
            }
        },
        updateAboutSettings: (state, action) => {
            state.aboutSettings = { ...state.aboutSettings, ...action.payload };
        },
        updateSiteSettings: (state, action) => {
            state.siteSettings = { ...state.siteSettings, ...action.payload };
        },
        updateMissionVisionSettings: (state, action) => {
            state.missionVisionSettings = { ...state.missionVisionSettings, ...action.payload };
        },
        updateSocialMediaSettings: (state, action) => {
            state.socialMediaSettings = { ...state.socialMediaSettings, ...action.payload };
        },
        addMobileBanner: (state, action) => {
            state.mobileBanners.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editMobileBanner: (state, action) => {
            const index = state.mobileBanners.findIndex(b => b.id === action.payload.id);
            if (index !== -1) {
                state.mobileBanners[index] = { ...state.mobileBanners[index], ...action.payload };
            }
        },
        deleteMobileBanner: (state, action) => {
            state.mobileBanners = state.mobileBanners.filter(b => b.id !== action.payload);
        },
        addTeacher: (state, action) => {
            state.teachers.push({ ...action.payload, id: Date.now(), createdAt: new Date().toLocaleDateString() });
        },
        editTeacher: (state, action) => {
            const index = state.teachers.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.teachers[index] = { ...state.teachers[index], ...action.payload };
            }
        },
        deleteTeacher: (state, action) => {
            state.teachers = state.teachers.filter(t => t.id !== action.payload);
        },
        updateContactSettings: (state, action) => {
            state.contactSettings = { ...state.contactSettings, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSiteSettings.fulfilled, (state, action) => {
                state.siteSettings = { ...state.siteSettings, ...action.payload };
            })
            .addCase(saveSiteSettings.fulfilled, (state, action) => {
                state.siteSettings = { ...state.siteSettings, ...action.payload };
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                if (action.payload && action.payload.length > 0) {
                    state.bannerSettings = { ...state.bannerSettings, ...action.payload[0] };
                }
            })
            .addCase(saveBannerSettings.fulfilled, (state, action) => {
                state.bannerSettings = action.payload;
            })
            .addCase(fetchSlides.fulfilled, (state, action) => {
                state.slides = action.payload;
            })
            .addCase(fetchPartners.fulfilled, (state, action) => {
                state.partners = action.payload;
            })
            .addCase(addPartnerToServer.fulfilled, (state, action) => {
                state.partners.unshift(action.payload);
            })
            .addCase(updatePartnerToServer.fulfilled, (state, action) => {
                const index = state.partners.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.partners[index] = action.payload;
            })
            .addCase(deletePartnerFromServer.fulfilled, (state, action) => {
                state.partners = state.partners.filter(p => p.id !== action.payload);
            })
            .addCase(fetchFAQs.fulfilled, (state, action) => {
                state.faqs = action.payload.faqs;
                if (action.payload.faqBanners) {
                    state.faqSettings = { ...state.faqSettings, ...action.payload.faqBanners };
                }
            })
            .addCase(addFAQObj.fulfilled, (state, action) => {
                state.faqs.push(action.payload);
            })
            .addCase(updateFAQObj.fulfilled, (state, action) => {
                const index = state.faqs.findIndex(f => f.id === action.payload.id);
                if (index !== -1) {
                    state.faqs[index] = action.payload;
                }
            })
            .addCase(deleteFAQObj.fulfilled, (state, action) => {
                state.faqs = state.faqs.filter(f => f.id !== action.payload);
            })
            .addCase(saveFAQBanners.fulfilled, (state, action) => {
                state.faqSettings = { ...state.faqSettings, ...action.payload };
            })
            // Teachers
            .addCase(fetchTeachers.fulfilled, (state, action) => {
                state.teachers = action.payload;
            })
            .addCase(addTeacherObj.fulfilled, (state, action) => {
                state.teachers.push(action.payload);
            })
            .addCase(updateTeacherObj.fulfilled, (state, action) => {
                const index = state.teachers.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.teachers[index] = action.payload;
                }
            })
            .addCase(deleteTeacherObj.fulfilled, (state, action) => {
                state.teachers = state.teachers.filter(t => t.id !== action.payload);
            })
            // Testimonials
            .addCase(fetchTestimonials.fulfilled, (state, action) => {
                state.testimonials = action.payload.testimonials;
                if (action.payload.settings) {
                    state.testimonialSettings = action.payload.settings;
                }
            })
            .addCase(addTestimonialObj.fulfilled, (state, action) => {
                state.testimonials.push(action.payload);
            })
            .addCase(updateTestimonialObj.fulfilled, (state, action) => {
                const index = state.testimonials.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.testimonials[index] = action.payload;
                }
            })
            .addCase(deleteTestimonialObj.fulfilled, (state, action) => {
                state.testimonials = state.testimonials.filter(t => t.id !== action.payload);
            })
            .addCase(saveTestimonialSettings.fulfilled, (state, action) => {
                state.testimonialSettings = action.payload;
            })
            // Mission & Vision
            .addCase(fetchMissionVision.fulfilled, (state, action) => {
                state.missionVisionSettings = action.payload;
            })
            .addCase(updateMissionVision.fulfilled, (state, action) => {
                state.missionVisionSettings = action.payload;
            })
            // Gallery
            .addCase(fetchGalleryItems.fulfilled, (state, action) => {
                state.gallery = action.payload;
            })
            .addCase(addGalleryItemToServer.fulfilled, (state, action) => {
                state.gallery.unshift(action.payload);
            })
            // Top Performers
            .addCase(fetchTopPerformers.fulfilled, (state, action) => {
                state.performers = action.payload.performers;
                state.performerSettings = action.payload.settings;
            })
            .addCase(addTopPerformerObj.fulfilled, (state, action) => {
                state.performers.unshift(action.payload);
            })
            .addCase(updateTopPerformerObj.fulfilled, (state, action) => {
                const index = state.performers.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.performers[index] = action.payload;
                }
            })
            .addCase(deleteTopPerformerObj.fulfilled, (state, action) => {
                state.performers = state.performers.filter(p => p.id !== action.payload);
            })
            .addCase(saveTopPerformerSettings.fulfilled, (state, action) => {
                state.performerSettings = action.payload;
            })
            // Study Materials
            .addCase(fetchStudyMaterials.fulfilled, (state, action) => {
                state.studyMaterials = action.payload;
            })
            .addCase(addStudyMaterialToServer.fulfilled, (state, action) => {
                state.studyMaterials.unshift(action.payload);
            })
            .addCase(updateStudyMaterialToServer.fulfilled, (state, action) => {
                const index = state.studyMaterials.findIndex(m => m.id === action.payload.id);
                if (index !== -1) {
                    state.studyMaterials[index] = action.payload;
                }
            })
            .addCase(deleteStudyMaterialFromServer.fulfilled, (state, action) => {
                state.studyMaterials = state.studyMaterials.filter(m => m.id !== action.payload);
            })
            // Contact Settings
            .addCase(fetchContactSettings.fulfilled, (state, action) => {
                state.contactSettings = { ...state.contactSettings, ...action.payload };
            })
            .addCase(updateContactSettingsFromServer.fulfilled, (state, action) => {
                state.contactSettings = { ...state.contactSettings, ...action.payload };
            })
            // Sample Certificates
            .addCase(fetchSampleCertificates.fulfilled, (state, action) => {
                state.sampleCertificates = action.payload;
            })
            .addCase(addSampleCertificateToServer.fulfilled, (state, action) => {
                state.sampleCertificates.unshift(action.payload);
            })
            .addCase(updateSampleCertificateToServer.fulfilled, (state, action) => {
                const index = state.sampleCertificates.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.sampleCertificates[index] = action.payload;
                }
            })
            .addCase(deleteSampleCertificateFromServer.fulfilled, (state, action) => {
                state.sampleCertificates = state.sampleCertificates.filter(s => s.id !== action.payload);
            })
            // Affiliations
            .addCase(fetchAffiliations.fulfilled, (state, action) => {
                state.affiliations = action.payload;
            })
            .addCase(addAffiliationToServer.fulfilled, (state, action) => {
                state.affiliations.unshift(action.payload);
            })
            .addCase(updateAffiliationToServer.fulfilled, (state, action) => {
                const index = state.affiliations.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.affiliations[index] = action.payload;
                }
            })
            .addCase(deleteAffiliationFromServer.fulfilled, (state, action) => {
                state.affiliations = state.affiliations.filter(a => a.id !== action.payload);
            })
            // Jobs
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.jobs = action.payload;
            })
            .addCase(addJobToServer.fulfilled, (state, action) => {
                state.jobs.unshift(action.payload);
            })
            .addCase(updateJobToServer.fulfilled, (state, action) => {
                const index = state.jobs.findIndex(j => j.id === action.payload.id);
                if (index !== -1) {
                    state.jobs[index] = action.payload;
                }
            })
            .addCase(deleteJobFromServer.fulfilled, (state, action) => {
                state.jobs = state.jobs.filter(j => j.id !== action.payload);
            })

            // Job Applications
            .addCase(fetchJobApplications.fulfilled, (state, action) => {
                state.jobApplications = action.payload;
            })
            .addCase(updateJobApplicationStatusToServer.fulfilled, (state, action) => {
                const index = state.jobApplications.findIndex(j => j.id === action.payload.id);
                if (index !== -1) {
                    state.jobApplications[index] = action.payload;
                }
            })

            // Posts
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts = action.payload;
            })
            .addCase(addPostToServer.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
            })
            .addCase(updatePostToServer.fulfilled, (state, action) => {
                const index = state.posts.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(deletePostFromServer.fulfilled, (state, action) => {
                state.posts = state.posts.filter(p => p.id !== action.payload);
            })
            // Events
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.events = action.payload;
            })
            .addCase(addEventToServer.fulfilled, (state, action) => {
                state.events.unshift(action.payload);
            })
            .addCase(updateEventToServer.fulfilled, (state, action) => {
                const index = state.events.findIndex(e => e.id === action.payload.id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })
            .addCase(deleteEventFromServer.fulfilled, (state, action) => {
                state.events = state.events.filter(e => e.id !== action.payload);
            });



    }
});
 

export const {
    addEvent, editEvent, deleteEvent,
    addBanner, deleteBanner, updateBannerSettings,
    updateFAQSettings, addFAQ, editFAQ, deleteFAQ,
    addGalleryItem, editGalleryItem, deleteGalleryItem,
    addPost, editPost, deletePost,
    addPartner, editPartner, deletePartner,
    addJob, editJob, deleteJob,
    addStudyMaterial, editStudyMaterial, deleteStudyMaterial,
    addAffiliation, editAffiliation, deleteAffiliation,


    addCounter, editCounter, deleteCounter,
    addPaymentDetail, editPaymentDetail, deletePaymentDetail,
    updateTestimonialSettings, addTestimonial, editTestimonial, deleteTestimonial,
    updateServiceSettings, addService, editService, deleteService,
    updatePolicy, updateAboutSettings, updateSiteSettings, updateMissionVisionSettings, updateSocialMediaSettings,
    addMobileBanner, editMobileBanner, deleteMobileBanner,
    addTeacher, editTeacher, deleteTeacher,
    updateContactSettings
} = websiteSlice.actions;

export default websiteSlice.reducer;
