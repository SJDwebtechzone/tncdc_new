import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/config';

const API_URL = `${BASE_URL}/api/course-categories`;
const AWARD_API_URL = `${BASE_URL}/api/course-award-categories`;
const COURSE_API_URL = `${BASE_URL}/api/courses`;
const EXAM_GRADE_API_URL = `${BASE_URL}/api/exam-grades`;
const LANGUAGE_API_URL = `${BASE_URL}/api/languages`;
const SUBJECT_API_URL = `${BASE_URL}/api/subjects`;
const COURSE_VIDEOS_API_URL = `${BASE_URL}/api/course-videos`;
const COURSE_NOTES_API_URL = `${BASE_URL}/api/course-notes`;
const ONLINE_CLASSES_API_URL = `${BASE_URL}/api/online-classes`;

// ─── Thunks ──────────────────────────────────────────────────────────────────
export const fetchOnlineClassesAsync = createAsyncThunk('courses/fetchOnlineClasses', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(ONLINE_CLASSES_API_URL);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch online classes');
    }
});

export const addOnlineClassAsync = createAsyncThunk('courses/addOnlineClass', async (classData, { rejectWithValue }) => {
    try {
        const res = await axios.post(ONLINE_CLASSES_API_URL, classData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add online class');
    }
});

export const updateOnlineClassAsync = createAsyncThunk('courses/updateOnlineClass', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${ONLINE_CLASSES_API_URL}/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update online class');
    }
});

export const deleteOnlineClassAsync = createAsyncThunk('courses/deleteOnlineClass', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${ONLINE_CLASSES_API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete online class');
    }
});
export const fetchExamGrades = createAsyncThunk('courses/fetchExamGrades', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(EXAM_GRADE_API_URL);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch exam grades');
    }
});

export const addExamGradeAsync = createAsyncThunk('courses/addExamGrade', async (gradeData, { rejectWithValue }) => {
    try {
        const res = await axios.post(EXAM_GRADE_API_URL, gradeData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add exam grade');
    }
});

export const deleteExamGradeAsync = createAsyncThunk('courses/deleteExamGrade', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${EXAM_GRADE_API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete exam grade');
    }
});
export const fetchCategories = createAsyncThunk('courses/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(API_URL);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch categories');
    }
});

export const addCategoryAsync = createAsyncThunk('courses/addCategory', async (categoryData, { rejectWithValue }) => {
    try {
        const data = new FormData();
        data.append('name', categoryData.name);
        data.append('status', categoryData.status);
        if (categoryData.iconFile) {
            data.append('icon', categoryData.iconFile);
        }
        const res = await axios.post(API_URL, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add category');
    }
});

export const deleteCategoryAsync = createAsyncThunk('courses/deleteCategory', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete category');
    }
});

export const updateCategoryAsync = createAsyncThunk('courses/updateCategory', async (categoryData, { rejectWithValue }) => {
    try {
        const data = new FormData();
        if (categoryData.name !== undefined) data.append('name', categoryData.name);
        if (categoryData.status !== undefined) data.append('status', categoryData.status);
        if (categoryData.iconFile) {
            data.append('icon', categoryData.iconFile);
        }
        if (categoryData.count !== undefined) {
            data.append('count', categoryData.count);
        }
        const res = await axios.put(`${API_URL}/${categoryData.id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update category');
    }
});

export const fetchAwardCategories = createAsyncThunk('courses/fetchAwardCategories', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(AWARD_API_URL);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch award categories');
    }
});

export const addAwardCategoryAsync = createAsyncThunk('courses/addAwardCategory', async (categoryData, { rejectWithValue }) => {
    try {
        const res = await axios.post(AWARD_API_URL, categoryData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add award category');
    }
});

export const deleteAwardCategoryAsync = createAsyncThunk('courses/deleteAwardCategory', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${AWARD_API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete award category');
    }
});

export const updateAwardCategoryAsync = createAsyncThunk('courses/updateAwardCategory', async (categoryData, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${AWARD_API_URL}/${categoryData.id}`, categoryData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update award category');
    }
});

// ─── Language Thunks ──────────────────────────────────────────────────────────
export const fetchLanguages = createAsyncThunk('courses/fetchLanguages', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(LANGUAGE_API_URL);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch languages');
    }
});

export const addLanguageAsync = createAsyncThunk('courses/addLanguage', async (languageData, { rejectWithValue }) => {
    try {
        const res = await axios.post(LANGUAGE_API_URL, languageData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add language');
    }
});

export const updateLanguageAsync = createAsyncThunk('courses/updateLanguage', async (languageData, { rejectWithValue }) => {
    try {
        const { id, ...data } = languageData;
        const res = await axios.put(`${LANGUAGE_API_URL}/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update language');
    }
});

export const deleteLanguageAsync = createAsyncThunk('courses/deleteLanguage', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${LANGUAGE_API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete language');
    }
});

// ─── Course Videos Thunks ─────────────────────────────────────────────────────
export const fetchCourseVideosAsync = createAsyncThunk('courses/fetchCourseVideos', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(COURSE_VIDEOS_API_URL);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch course videos');
    }
});

export const addCourseVideoAsync = createAsyncThunk('courses/addCourseVideo', async (videoData, { rejectWithValue }) => {
    try {
        const res = await axios.post(COURSE_VIDEOS_API_URL, videoData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add course video');
    }
});

export const updateCourseVideoAsync = createAsyncThunk('courses/updateCourseVideo', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${COURSE_VIDEOS_API_URL}/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update course video');
    }
});

export const deleteCourseVideoAsync = createAsyncThunk('courses/deleteCourseVideo', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${COURSE_VIDEOS_API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete course video');
    }
});

// ─── Course Notes Thunks ──────────────────────────────────────────────────────
export const fetchCourseNotesAsync = createAsyncThunk('courses/fetchCourseNotes', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(COURSE_NOTES_API_URL);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch course notes');
    }
});

export const addCourseNoteAsync = createAsyncThunk('courses/addCourseNote', async (formData, { rejectWithValue }) => {
    try {
        const res = await axios.post(COURSE_NOTES_API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add course note');
    }
});

export const deleteCourseNoteAsync = createAsyncThunk('courses/deleteCourseNote', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${COURSE_NOTES_API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete course note');
    }
});

// ─── Course Thunks ────────────────────────────────────────────────────────────
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(COURSE_API_URL);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch courses');
    }
});

export const addCourseAsync = createAsyncThunk('courses/addCourse', async (courseData, { rejectWithValue }) => {
    try {
        const data = new FormData();
        Object.keys(courseData).forEach(key => {
            if (key === 'imageFile') {
                if (courseData[key]) data.append('image', courseData[key]);
            } else if (key === 'tags') {
                courseData[key].forEach(tag => data.append('tags', tag));
            } else if (typeof courseData[key] === 'object' && courseData[key] !== null) {
                // Handle nested objects like examFormat if needed, but the backend expects individual fields
                Object.keys(courseData[key]).forEach(subKey => {
                    data.append(subKey, courseData[key][subKey]);
                });
            } else {
                data.append(key, courseData[key]);
            }
        });

        const res = await axios.post(COURSE_API_URL, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Failed to add course');
    }
});

export const updateCourseAsync = createAsyncThunk('courses/updateCourse', async (courseData, { rejectWithValue }) => {
    try {
        const { id, ...dataToUpdate } = courseData;
        console.log('Actual thunk updating ID:', id, 'with:', dataToUpdate);
        const formData = new FormData();

        Object.keys(dataToUpdate).forEach(key => {
            if (key === 'imageFile') {
                if (dataToUpdate[key]) formData.append('image', dataToUpdate[key]);
            } else if (key === 'tags') {
                if (Array.isArray(dataToUpdate[key])) {
                    dataToUpdate[key].forEach(tag => formData.append('tags', tag));
                }
            } else if (typeof dataToUpdate[key] === 'object' && dataToUpdate[key] !== null) {
                // If it's something like examFormat, we skip it here as it should be flat in formData
            } else {
                formData.append(key, dataToUpdate[key]);
            }
        });

        const res = await axios.put(`${COURSE_API_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update course');
    }
});

export const fetchCourseById = createAsyncThunk('courses/fetchCourseById', async (id, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${COURSE_API_URL}/${id}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch course');
    }
});

export const fetchSubjects = createAsyncThunk('courses/fetchSubjects', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(SUBJECT_API_URL);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch subjects');
    }
});

export const fetchCourseWithSubjects = createAsyncThunk('courses/fetchCourseWithSubjects', async (id, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${COURSE_API_URL}/${id}/subjects`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to fetch course subjects');
    }
});

export const updateCourseSubjects = createAsyncThunk('courses/updateCourseSubjects', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${COURSE_API_URL}/${id}/subjects`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update course subjects');
    }
});

export const addCourseSemesterAsync = createAsyncThunk('courses/addCourseSemester', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${COURSE_API_URL}/${id}/semesters`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add course semester');
    }
});

export const updateCourseSemesterAsync = createAsyncThunk('courses/updateCourseSemester', async ({ id, semesterId, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${COURSE_API_URL}/${id}/semesters/${semesterId}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to update course semester');
    }
});

export const deleteCourseSemesterAsync = createAsyncThunk('courses/deleteCourseSemester', async ({ id, semesterId }, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`${COURSE_API_URL}/${id}/semesters/${semesterId}`);
        return { semesterId };
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to delete course semester');
    }
});

export const addSubjectAsync = createAsyncThunk('courses/addSubject', async (subjectData, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('name', subjectData.name);
        formData.append('questionBanks', JSON.stringify(subjectData.questionBanks.map(qb => ({
            language: qb.language,
            examType: qb.examType
        }))));
        
        subjectData.questionBanks.forEach(qb => {
            if (qb.file) {
                formData.append('files', qb.file);
            }
        });

        const res = await axios.post(SUBJECT_API_URL, formData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Failed to add subject');
    }
});

const initialState = {
    courses: [],
    categories: [],
    subjects: [],
    languages: [],
    examGrades: [],
    videos: [],
    notes: [],
    reviews: [],
    awardCategories: [],
    onlineClasses: [],
    currentCourse: null,
    loading: false
};

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        // Courses
        addCourse: (state, action) => {
            state.courses.push({ ...action.payload, id: Date.now() });
        },
        updateCourse: (state, action) => {
            const index = state.courses.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.courses[index] = action.payload;
            }
        },
        toggleCourseStatus: (state, action) => {
            const index = state.courses.findIndex(c => c.id === action.payload);
            if (index !== -1) {
                state.courses[index].status = !state.courses[index].status;
            }
        },
        deleteCourse: (state, action) => {
            state.courses = state.courses.filter(c => c.id !== action.payload);
        },
        // Categories
        addCategory: (state, action) => {
            state.categories.push({ ...action.payload, id: Date.now() });
        },
        updateCategory: (state, action) => {
            const index = state.categories.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        },
        toggleCategoryStatus: (state, action) => {
            const index = state.categories.findIndex(c => c.id === action.payload);
            if (index !== -1) {
                state.categories[index].status = !state.categories[index].status;
            }
        },
        // Award Categories
        addAwardCategory: (state, action) => {
            if (!state.awardCategories) state.awardCategories = [];
            state.awardCategories.push({ ...action.payload, id: Date.now() });
        },
        updateAwardCategory: (state, action) => {
            const index = state.awardCategories.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.awardCategories[index] = action.payload;
            }
        },
        toggleAwardCategoryStatus: (state, action) => {
            const index = state.awardCategories.findIndex(c => c.id === action.payload);
            if (index !== -1) {
                state.awardCategories[index].status = !state.awardCategories[index].status;
            }
        },
        // Subjects
        addSubject: (state, action) => {
            state.subjects.push({ ...action.payload, id: Date.now() });
        },
        deleteSubject: (state, action) => {
            state.subjects = state.subjects.filter(s => s.id !== action.payload);
        },
        // Languages
        addLanguage: (state, action) => {
            state.languages.push({ ...action.payload, id: Date.now() });
        },
        updateLanguage: (state, action) => {
            const index = state.languages.findIndex(l => l.id === action.payload.id);
            if (index !== -1) {
                state.languages[index] = action.payload;
            }
        },
        toggleLanguageStatus: (state, action) => {
            const index = state.languages.findIndex(l => l.id === action.payload);
            if (index !== -1) {
                state.languages[index].status = !state.languages[index].status;
            }
        },
        deleteLanguage: (state, action) => {
            state.languages = state.languages.filter(l => l.id !== action.payload);
        },
        // Exam Grades
        addExamGrade: (state, action) => {
            state.examGrades.push({ ...action.payload, id: Date.now() });
        },
        deleteExamGrade: (state, action) => {
            state.examGrades = state.examGrades.filter(g => g.id !== action.payload);
        },
        // Online Classes
        addOnlineClass: (state, action) => {
            if (!state.onlineClasses) state.onlineClasses = [];
            state.onlineClasses.push({ ...action.payload, id: Date.now() });
        },
        updateOnlineClass: (state, action) => {
            const index = state.onlineClasses.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.onlineClasses[index] = action.payload;
            }
        },
        toggleOnlineClassStatus: (state, action) => {
            const index = state.onlineClasses.findIndex(c => c.id === action.payload);
            if (index !== -1) {
                state.onlineClasses[index].status = !state.onlineClasses[index].status;
            }
        },
        // Reviews
        addReview: (state, action) => {
            if (!state.reviews) state.reviews = [];
            state.reviews.push({ ...action.payload, id: Date.now() });
        },
        // Notes
        updateNote: (state, action) => {
            const index = state.notes.findIndex(n => n.id === action.payload.id);
            if (index !== -1) {
                state.notes[index] = action.payload;
            }
        },
        // Videos
        addVideo: (state, action) => {
            if (!state.videos) state.videos = [];
            state.videos.push({ ...action.payload, id: Date.now() });
        },
        updateVideo: (state, action) => {
            const index = state.videos.findIndex(v => v.id === action.payload.id);
            if (index !== -1) {
                state.videos[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(addCategoryAsync.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c.id !== action.payload);
            })
            .addCase(fetchAwardCategories.fulfilled, (state, action) => {
                state.awardCategories = action.payload;
            })
            .addCase(addAwardCategoryAsync.fulfilled, (state, action) => {
                state.awardCategories.push(action.payload);
            })
            .addCase(deleteAwardCategoryAsync.fulfilled, (state, action) => {
                state.awardCategories = state.awardCategories.filter(c => c.id !== action.payload);
            })
            .addCase(updateCategoryAsync.fulfilled, (state, action) => {
                const index = state.categories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateAwardCategoryAsync.fulfilled, (state, action) => {
                const index = state.awardCategories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.awardCategories[index] = action.payload;
                }
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.courses = action.payload;
            })
            .addCase(addCourseAsync.fulfilled, (state, action) => {
                state.courses.push(action.payload);
            })
            .addCase(updateCourseAsync.fulfilled, (state, action) => {
                const index = state.courses.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.courses[index] = action.payload;
                }
            })
            .addCase(fetchExamGrades.fulfilled, (state, action) => {
                state.examGrades = action.payload;
            })
            .addCase(addExamGradeAsync.fulfilled, (state, action) => {
                state.examGrades.push(action.payload);
            })
            .addCase(deleteExamGradeAsync.fulfilled, (state, action) => {
                state.examGrades = state.examGrades.filter(g => g.id !== action.payload);
            })
            .addCase(fetchLanguages.fulfilled, (state, action) => {
                state.languages = action.payload;
            })
            .addCase(addLanguageAsync.fulfilled, (state, action) => {
                state.languages.push(action.payload);
            })
            .addCase(updateLanguageAsync.fulfilled, (state, action) => {
                const index = state.languages.findIndex(l => l.id === action.payload.id);
                if (index !== -1) {
                    state.languages[index] = action.payload;
                }
            })
            .addCase(deleteLanguageAsync.fulfilled, (state, action) => {
                state.languages = state.languages.filter(l => l.id !== action.payload);
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.subjects = action.payload;
            })
            .addCase(addSubjectAsync.fulfilled, (state, action) => {
                state.subjects.push(action.payload);
            })
            // Course Videos
            .addCase(fetchCourseVideosAsync.fulfilled, (state, action) => {
                state.videos = action.payload;
            })
            .addCase(addCourseVideoAsync.fulfilled, (state, action) => {
                state.videos.unshift(action.payload);
            })
            .addCase(updateCourseVideoAsync.fulfilled, (state, action) => {
                const index = state.videos.findIndex(v => v.id === action.payload.id);
                if (index !== -1) {
                    state.videos[index] = action.payload;
                }
            })
            .addCase(deleteCourseVideoAsync.fulfilled, (state, action) => {
                state.videos = state.videos.filter(v => v.id !== action.payload);
            })
            // Course Notes
            .addCase(fetchCourseNotesAsync.fulfilled, (state, action) => {
                state.notes = action.payload;
            })
            .addCase(addCourseNoteAsync.fulfilled, (state, action) => {
                state.notes.unshift(action.payload);
            })
            .addCase(deleteCourseNoteAsync.fulfilled, (state, action) => {
                state.notes = state.notes.filter(n => n.id !== action.payload);
            })
            .addCase(fetchCourseById.pending, (state) => {
                state.loading = true;
                state.currentCourse = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload;
            })
            .addCase(fetchCourseById.rejected, (state) => {
                state.loading = false;
            })
            // Course Subject & Semester Updates
            .addCase(updateCourseSubjects.fulfilled, (state, action) => {
                if (action.payload.course) {
                    const index = state.courses.findIndex(c => c.id === action.payload.course.id);
                    if (index !== -1) {
                        state.courses[index] = action.payload.course;
                    }
                }
            })
            .addCase(addCourseSemesterAsync.fulfilled, (state, action) => {
                if (action.payload.course) {
                    const index = state.courses.findIndex(c => c.id === action.payload.course.id);
                    if (index !== -1) {
                        state.courses[index] = action.payload.course;
                    }
                }
            })
            .addCase(updateCourseSemesterAsync.fulfilled, (state, action) => {
                if (action.payload.course) {
                    const index = state.courses.findIndex(c => c.id === action.payload.course.id);
                    if (index !== -1) {
                        state.courses[index] = action.payload.course;
                    }
                }
            })
            .addCase(deleteCourseSemesterAsync.fulfilled, (state, action) => {
                if (action.payload.course) {
                    const index = state.courses.findIndex(c => c.id === action.payload.course.id);
                    if (index !== -1) {
                        state.courses[index] = action.payload.course;
                    }
                }
            })
            // Online Classes
            .addCase(fetchOnlineClassesAsync.fulfilled, (state, action) => {
                state.onlineClasses = action.payload;
            })
            .addCase(addOnlineClassAsync.fulfilled, (state, action) => {
                state.onlineClasses.unshift(action.payload);
            })
            .addCase(updateOnlineClassAsync.fulfilled, (state, action) => {
                const index = state.onlineClasses.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.onlineClasses[index] = action.payload;
                }
            })
            .addCase(deleteOnlineClassAsync.fulfilled, (state, action) => {
                state.onlineClasses = state.onlineClasses.filter(c => c.id !== action.payload);
            });
    }
});

export const {
    addCourse, deleteCourse, updateCourse, toggleCourseStatus,
    addCategory, updateCategory, toggleCategoryStatus,
    addAwardCategory, updateAwardCategory, toggleAwardCategoryStatus,
    addSubject, deleteSubject,
    addLanguage, updateLanguage, toggleLanguageStatus, deleteLanguage,
    addExamGrade, deleteExamGrade,
    addOnlineClass, updateOnlineClass, toggleOnlineClassStatus,
    addReview,
    updateNote
} = courseSlice.actions;

export default courseSlice.reducer;
