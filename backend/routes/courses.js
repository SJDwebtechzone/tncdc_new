const express = require('express');
const router = express.Router();
const { prisma } = require('../db');
const multer = require('multer');
const { supabase, deleteFromSupabase } = require('../supabase');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Helper for Supabase Upload
async function uploadToSupabase(file, folder = 'courses') {
    if (!file) return null;
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
        .from('Images')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('Images')
        .getPublicUrl(fileName);

    return publicUrl;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const generateCourseCode = (title, courseType) => {
    // Determine type prefix
    let typePrefix = 'C';
    if (courseType === 'Single') typePrefix = 'S';
    else if (courseType === 'Multiple Exam') typePrefix = 'M';
    else if (courseType === 'Typing') typePrefix = 'T';

    // Extract initials from title
    const initials = (title || '')
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(word => word[0].toUpperCase())
        .join('');

    const prefix = `${typePrefix}${initials}`;
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    return `${prefix}-${random}`;
};

// ─── GET /api/courses ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                category: true,
                awardCategory: true,
                courseSubjects: { include: { subject: true } },
                semesters: {
                    include: {
                        subjects: {
                            include: { subject: true },
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { order: 'asc' }
                },
                _count: { select: { courseSubjects: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(courses);
    } catch (err) {
        console.error('GET /api/courses error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/courses/:id ────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const course = await prisma.course.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true,
                awardCategory: true,
                courseSubjects: { include: { subject: true } },
                semesters: {
                    include: {
                        subjects: {
                            include: { subject: true },
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { order: 'asc' }
                },
                onlineClasses: {
                    where: { status: true },
                    orderBy: { date: 'asc' }
                }
            }
        });
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        console.error('GET /api/courses/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const {
            title, awardCategoryId, certificateType, preposition, courseType,
            categoryId, mrp, price, duration, durationUnit, previewVideoUrl,
            totalLectures, practicalExam, objectiveExam, description, syllabus,
            tags, isPopular, isRecommended, isMRPVisible, hideExamResult, status,
            rating, likes, views
        } = req.body;

        const imageUrl = await uploadToSupabase(req.file, 'courses');

        // Generate a unique course code based on title
        const courseCode = generateCourseCode(title, courseType);

        const course = await prisma.course.create({
            data: {
                title: title || '',
                courseCode,
                awardCategoryId: parseInt(awardCategoryId) || 0,
                certificateType: certificateType || 'Certificate',
                preposition: preposition || 'In',
                courseType: courseType || 'Single',
                categoryId: parseInt(categoryId) || 0,
                mrp: mrp ? parseFloat(mrp) : null,
                price: price ? parseFloat(price) : null,
                duration: duration || '',
                durationUnit: durationUnit || 'Months',
                imageUrl,
                previewVideoUrl: previewVideoUrl || '',
                totalLectures: totalLectures ? parseInt(totalLectures) : null,
                practicalExam: practicalExam === 'true' || practicalExam === true,
                objectiveExam: objectiveExam === 'true' || objectiveExam === true,
                description: description || '',
                syllabus: syllabus || '',
                tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
                isPopular: isPopular === 'true' || isPopular === true,
                isRecommended: isRecommended === 'true' || isRecommended === true,
                isMRPVisible: isMRPVisible === 'true' || isMRPVisible === true,
                hideExamResult: hideExamResult === 'true' || hideExamResult === true,
                status: status === 'true' || status === true || status === undefined,
                rating: rating ? parseFloat(rating) : 0,
                likes: likes ? parseInt(likes) : 0,
                views: views ? parseInt(views) : 0
            },
            include: {
                category: true,
                awardCategory: true,
                courseSubjects: { include: { subject: true } },
                semesters: {
                    include: {
                        subjects: {
                            include: {
                                subject: true
                            }
                        }
                    }
                }
            }
        });

        res.status(201).json(course);
    } catch (err) {
        console.error('POST /api/courses error details:', {
            message: err.message,
            stack: err.stack,
            body: req.body
        });
        res.status(500).json({
            error: err.message,
            details: err.code === 'P2002' ? 'Course code already exists or unique constraint failed' : err.message
        });
    }
});

// ─── PUT /api/courses/:id ─────────────────────────────────────────────────────
router.put('/:id', upload.single('image'), async (req, res) => {
    console.log('Backend received PUT for ID:', req.params.id, 'Body keys:', Object.keys(req.body));
    try {
        const { id } = req.params;
        const b = req.body;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: 'Invalid Course ID' });
        }

        // Construct update object explicitly with correct types
        const updateData = {};

        if (b.title !== undefined) updateData.title = b.title;
        if (b.awardCategoryId !== undefined) updateData.awardCategoryId = parseInt(b.awardCategoryId) || 0;
        if (b.certificateType !== undefined) updateData.certificateType = b.certificateType;
        if (b.preposition !== undefined) updateData.preposition = b.preposition;
        if (b.courseType !== undefined) updateData.courseType = b.courseType;
        if (b.categoryId !== undefined) updateData.categoryId = parseInt(b.categoryId) || 0;

        // Handle numeric fields safely
        if (b.mrp !== undefined) {
            const val = parseFloat(b.mrp);
            updateData.mrp = isNaN(val) ? null : val;
        }
        if (b.price !== undefined) {
            const val = parseFloat(b.price);
            updateData.price = isNaN(val) ? null : val;
        }

        if (b.duration !== undefined) updateData.duration = b.duration;
        if (b.durationUnit !== undefined) updateData.durationUnit = b.durationUnit;
        if (b.previewVideoUrl !== undefined) updateData.previewVideoUrl = b.previewVideoUrl;

        if (b.totalLectures !== undefined) {
            const val = parseInt(b.totalLectures);
            updateData.totalLectures = isNaN(val) ? null : val;
        }

        if (b.description !== undefined) updateData.description = b.description;
        if (b.syllabus !== undefined) updateData.syllabus = b.syllabus;

        // Tags
        if (b.tags !== undefined) {
            updateData.tags = Array.isArray(b.tags) ? b.tags : (b.tags ? [b.tags] : []);
        }

        // Booleans
        const boolFields = ['practicalExam', 'objectiveExam', 'isPopular', 'isRecommended', 'isMRPVisible', 'hideExamResult', 'status'];

        boolFields.forEach(field => {
            if (b[field] !== undefined) {
                updateData[field] = b[field] === 'true' || b[field] === true;
            }
        });

        if (b.rating !== undefined) updateData.rating = parseFloat(b.rating) || 0;
        if (b.likes !== undefined) updateData.likes = parseInt(b.likes) || 0;
        if (b.views !== undefined) updateData.views = parseInt(b.views) || 0;

        if (req.file) {
            updateData.imageUrl = await uploadToSupabase(req.file, 'courses');
        }

        const course = await prisma.course.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                category: true,
                awardCategory: true,
                courseSubjects: { include: { subject: true } },
                semesters: {
                    include: {
                        subjects: {
                            include: {
                                subject: true
                            }
                        }
                    }
                }
            }
        });

        res.json(course);
    } catch (err) {
        console.error('PUT /api/courses/:id error details:', {
            message: err.message,
            stack: err.stack,
            body: req.body,
            params: req.params
        });
        res.status(500).json({
            error: err.message,
            details: 'Update failed: ' + err.message
        });
    }
});

// ─── GET /api/courses/:id/subjects ──────────────────────────────────────────
router.get('/:id/subjects', async (req, res) => {
    try {
        const { id } = req.params;
        const course = await prisma.course.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true,
                semesters: {
                    include: {
                        subjects: {
                            include: { subject: true },
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { order: 'asc' }
                },
                courseSubjects: {
                    include: { subject: true },
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        console.error('GET /api/courses/:id/subjects error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/courses/:id/subjects ──────────────────────────────────────────
router.put('/:id/subjects', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            subjects, // Array of { subjectId: number, order: number }
            examConfig // { totalMarks, objectiveMarks, practicalMarks, totalQuestions, marksPerQuestion, examTiming, passingPercentage }
        } = req.body;

        const courseId = parseInt(id);

        // 1. Update Course Exam Config
        await prisma.course.update({
            where: { id: courseId },
            data: {
                totalMarks: parseInt(examConfig.totalMarks),
                objectiveMarks: parseInt(examConfig.objectiveMarks),
                practicalMarks: parseInt(examConfig.practicalMarks),
                totalQuestions: parseInt(examConfig.totalQuestions),
                marksPerQuestion: parseFloat(examConfig.marksPerQuestion),
                examTiming: parseInt(examConfig.examTiming),
                passingPercentage: parseInt(examConfig.passingPercentage)
            }
        });

        // 2. Transaction for Batch Updating Subjects
        await prisma.$transaction([
            // Delete all existing associations
            prisma.courseSubject.deleteMany({
                where: { courseId: courseId }
            }),
            // Re-create them from the new list
            prisma.courseSubject.createMany({
                data: (subjects || []).map(s => ({
                    courseId: courseId,
                    subjectId: parseInt(s.subjectId),
                    order: parseInt(s.order) || 1
                }))
            })
        ]);

        const fullCourse = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                category: true,
                awardCategory: true,
                courseSubjects: { include: { subject: true } },
                semesters: {
                    include: {
                        subjects: {
                            include: {
                                subject: true
                            }
                        }
                    }
                }
            }
        });

        res.json({ success: true, message: 'Course subjects and configuration updated successfully', course: fullCourse });
    } catch (err) {
        console.error('PUT /api/courses/:id/subjects error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/courses/:id/semesters ──────────────────────────────────────────
router.post('/:id/semesters', async (req, res) => {
    try {
        const { id } = req.params;
        const courseId = parseInt(id);
        const { name, subjects } = req.body;

        // subjects: array of { subjectId, order, totalMarks, objectiveMarks, practicalMarks, totalQuestions, marksPerQuestion, examTiming, passingPercentage }

        // Find max order for this course's semesters to append at the end
        const existingSemesters = await prisma.courseSemester.findMany({
            where: { courseId }
        });
        const maxOrder = existingSemesters.reduce((max, s) => Math.max(max, s.order), 0);

        // Transaction for inserting semester and its subjects
        const newSemester = await prisma.$transaction(async (tx) => {
            const semester = await tx.courseSemester.create({
                data: {
                    name,
                    courseId,
                    order: maxOrder + 1
                }
            });

            if (subjects && subjects.length > 0) {
                await tx.courseSubject.createMany({
                    data: subjects.map(s => ({
                        courseId,
                        semesterId: semester.id,
                        subjectId: parseInt(s.subjectId),
                        order: parseInt(s.order) || 1,
                        totalMarks: parseInt(s.totalMarks) || 100,
                        objectiveMarks: parseInt(s.objectiveMarks) || 50,
                        practicalMarks: parseInt(s.practicalMarks) || 50,
                        totalQuestions: parseInt(s.totalQuestions) || 0,
                        marksPerQuestion: parseFloat(s.marksPerQuestion) || 0,
                        examTiming: parseInt(s.examTiming) || 0,
                        passingPercentage: parseInt(s.passingPercentage) || 35
                    }))
                });
            }

            return semester;
        });

        const fullCourse = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                category: true,
                awardCategory: true,
                courseSubjects: { include: { subject: true } },
                semesters: {
                    include: {
                        subjects: {
                            include: {
                                subject: true
                            }
                        }
                    }
                }
            }
        });

        res.json({ success: true, semester: newSemester, course: fullCourse });
    } catch (err) {
        console.error('POST /api/courses/:id/semesters error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT /api/courses/:id/semesters/:semesterId ──────────────────────────────────────────
router.put('/:id/semesters/:semesterId', async (req, res) => {
    try {
        const { id, semesterId } = req.params;
        const courseId = parseInt(id);
        const semId = parseInt(semesterId);
        const { name, subjects } = req.body;

        const updatedSemester = await prisma.$transaction(async (tx) => {
            // Update semester name
            const semester = await tx.courseSemester.update({
                where: { id: semId },
                data: { name }
            });

            // Delete existing subjects for this semester
            await tx.courseSubject.deleteMany({
                where: { semesterId: semId, courseId }
            });

            // Re-create subjects
            if (subjects && subjects.length > 0) {
                await tx.courseSubject.createMany({
                    data: subjects.map(s => ({
                        courseId,
                        semesterId: semId,
                        subjectId: parseInt(s.subjectId),
                        order: parseInt(s.order) || 1,
                        totalMarks: parseInt(s.totalMarks) || 100,
                        objectiveMarks: parseInt(s.objectiveMarks) || 50,
                        practicalMarks: parseInt(s.practicalMarks) || 50,
                        totalQuestions: parseInt(s.totalQuestions) || 0,
                        marksPerQuestion: parseFloat(s.marksPerQuestion) || 0,
                        examTiming: parseInt(s.examTiming) || 0,
                        passingPercentage: parseInt(s.passingPercentage) || 35
                    }))
                });
            }

            return semester;
        });

        const fullCourse = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                category: true,
                awardCategory: true,
                courseSubjects: { include: { subject: true } },
                semesters: {
                    include: {
                        subjects: {
                            include: {
                                subject: true
                            }
                        }
                    }
                }
            }
        });

        res.json({ success: true, semester: updatedSemester, course: fullCourse });
    } catch (err) {
        console.error('PUT /api/courses/:id/semesters/:semesterId error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/courses/:id/semesters/:semesterId ──────────────────────────────────────────
router.delete('/:id/semesters/:semesterId', async (req, res) => {
    try {
        const { id, semesterId } = req.params;
        const courseId = parseInt(id);
        
        await prisma.courseSemester.delete({
            where: { id: parseInt(semesterId) }
        });

        const fullCourse = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                category: true,
                awardCategory: true,
                courseSubjects: { include: { subject: true } },
                semesters: {
                    include: {
                        subjects: {
                            include: {
                                subject: true
                            }
                        }
                    }
                }
            }
        });

        res.json({ success: true, course: fullCourse });
    } catch (err) {
        console.error('DELETE semester error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE /api/courses/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });

        if (course?.imageUrl) {
            await deleteFromSupabase(course.imageUrl);
        }

        await prisma.course.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/courses/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
