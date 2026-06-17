const express = require('express');
const { prisma } = require('../db');
const router = express.Router();
const multer = require('multer');
const { supabase } = require('../supabase');
const path = require('path');
const xlsx = require('xlsx');
const axios = require('axios');

// Helper to parse questions from buffer and save to DB
const saveQuestionsFromBuffer = async (buffer, subjectId, language, examType) => {
    try {
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const questions = [];
        
        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet);
            
            data.forEach(row => {
                const questionText = row.Question || row.question || row.text || row.Name;
                if (questionText) {
                    questions.push({
                        subjectId: parseInt(subjectId),
                        text: questionText.toString(),
                        imageUrl: row.Image || row.imageUrl || row.image || null,
                        language: language || 'english',
                        examType: examType || 'Both',
                        optionA: (row['Option A'] || row.optionA || row.a || '').toString(),
                        optionB: (row['Option B'] || row.optionB || row.b || '').toString(),
                        optionC: (row['Option C'] || row.optionC || row.c || '').toString(),
                        optionD: (row['Option D'] || row.optionD || row.d || '').toString(),
                        answer: (row['Correct Answer'] || row.answer || row.correct_answer || '').toString()
                    });
                }
            });
        });

        if (questions.length > 0) {
            // Clear existing questions for this subject/lang/type to avoid duplicates during migration
            await prisma.question.deleteMany({
                where: {
                    subjectId: parseInt(subjectId),
                    language: language || 'english',
                    examType: examType || 'Both'
                }
            });
            
            await prisma.question.createMany({
                data: questions
            });
        }
        return questions.length;
    } catch (err) {
        console.error('Error parsing questions:', err);
        return 0;
    }
};

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

// GET all subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await prisma.subject.findMany({
            include: { 
                questionBanks: true,
                _count: {
                    select: { questions: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/subjects/:id - Get a single subject
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await prisma.subject.findUnique({
            where: { id: parseInt(id) },
            include: { questionBanks: true }
        });
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create subject with question banks
router.post('/', upload.array('files'), async (req, res) => {
    try {
        const { name } = req.body;
        const questionBanksData = JSON.parse(req.body.questionBanks || '[]');
        const files = req.files || [];

        console.log('Creating Subject:', name);
        console.log('Question Banks Data:', questionBanksData);
        console.log('Files received:', files.length);

        let totalQuestions = 0;

        // Calculate total questions from files
        files.forEach(file => {
            try {
                console.log(`--- Parsing file: ${file.originalname} ---`);
                const workbook = xlsx.read(file.buffer, { type: 'buffer' });
                console.log(`Sheets found: ${workbook.SheetNames.join(', ')}`);
                
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
                    console.log(`Sheet "${sheetName}" row count (with header): ${data.length}`);
                    
                    // Filter out rows that are completely empty
                    const nonEmptyRows = data.filter(row => row && row.length > 0 && row.some(cell => cell !== null && cell !== ''));
                    console.log(`Sheet "${sheetName}" non-empty row count: ${nonEmptyRows.length}`);
                    
                    if (nonEmptyRows.length > 1) {
                        // Subtract 1 for header row
                        totalQuestions += (nonEmptyRows.length - 1);
                    } else if (nonEmptyRows.length === 1) {
                        // Maybe only header, but if it has many columns and looks like data, maybe no header?
                        // For now, let's assume if only 1 row, it's either header or 1 question.
                        // Standard template usually has header.
                        console.log(`Only 1 non-empty row found in sheet ${sheetName}, skipping as header.`);
                    }
                });
            } catch (parseError) {
                console.error(`Error parsing file ${file.originalname}:`, parseError);
            }
        });

        console.log('Calculated Total Questions:', totalQuestions);

        // 1. Create Subject
        const subject = await prisma.subject.create({
            data: { 
                name,
                totalQuestions: totalQuestions
            }
        });

        // 2. Upload Files and Create Question Banks
        const qbPromises = questionBanksData.map(async (qb, index) => {
            let fileUrl = '';
            let fileQuestionCount = 0;
            const file = files[index];

            if (file) {
                // Count questions for this specific file
                try {
                    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
                    workbook.SheetNames.forEach(sheetName => {
                        const worksheet = workbook.Sheets[sheetName];
                        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
                        const nonEmptyRows = data.filter(row => row && row.length > 0 && row.some(cell => cell !== null && cell !== ''));
                        if (nonEmptyRows.length > 1) {
                            fileQuestionCount += (nonEmptyRows.length - 1);
                        }
                    });
                } catch (parseError) {
                    console.error(`Error parsing file ${file.originalname} for individual count:`, parseError);
                }

                const fileName = `excel/${Date.now()}-${file.originalname}`;
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
                
                fileUrl = publicUrl;
            }

            await prisma.questionBank.create({
                data: {
                    subjectId: subject.id,
                    language: qb.language,
                    examType: qb.examType,
                    fileUrl: fileUrl,
                    questionCount: fileQuestionCount
                }
            });

            // Save individual questions to DB
            if (file) {
                await saveQuestionsFromBuffer(file.buffer, subject.id, qb.language, qb.examType);
            }
        });

        await Promise.all(qbPromises);

        // Fetch the complete subject with its question banks
        const fullSubject = await prisma.subject.findUnique({
            where: { id: subject.id },
            include: { questionBanks: true }
        });

        res.status(201).json(fullSubject);
    } catch (error) {
        console.error('POST /api/subjects error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/subjects/:id/recount - Add new question bank files and update count
router.patch('/:id/recount', upload.array('files'), async (req, res) => {
    try {
        const { id } = req.params;
        const files = req.files || [];
        const questionBanksData = JSON.parse(req.body.questionBanks || '[]');

        console.log(`[RECOUNT] Subject ${id}, Files: ${files.length}, QBs: ${questionBanksData.length}`);

        // Fetch current subject to get existing totalQuestions
        const currentSubject = await prisma.subject.findUnique({ where: { id: parseInt(id) } });
        if (!currentSubject) return res.status(404).json({ error: 'Subject not found' });

        let newQuestions = 0;

        // 1. Count questions from newly uploaded files
        files.forEach(file => {
            try {
                console.log(`[RECOUNT] Parsing: ${file.originalname}`);
                const workbook = xlsx.read(file.buffer, { type: 'buffer' });
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
                    const nonEmptyRows = data.filter(row => row && row.length > 0 && row.some(cell => cell !== null && cell !== ''));
                    if (nonEmptyRows.length > 1) {
                        newQuestions += (nonEmptyRows.length - 1);
                    }
                    console.log(`[RECOUNT] Sheet "${sheetName}" new questions: ${nonEmptyRows.length > 1 ? nonEmptyRows.length - 1 : 0}`);
                });
            } catch (e) {
                console.error('[RECOUNT] Parse error:', e);
            }
        });

        // 2. Upload files to Supabase and create QuestionBank records
        const qbPromises = files.map(async (file, index) => {
            const qbMeta = questionBanksData[index] || {};
            let fileUrl = '';
            let fileQuestionCount = 0;

            // Count questions for this specific file
            try {
                const workbook = xlsx.read(file.buffer, { type: 'buffer' });
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
                    const nonEmptyRows = data.filter(row => row && row.length > 0 && row.some(cell => cell !== null && cell !== ''));
                    if (nonEmptyRows.length > 1) {
                        fileQuestionCount += (nonEmptyRows.length - 1);
                    }
                });
            } catch (parseError) {
                console.error(`Error parsing file ${file.originalname} for individual count:`, parseError);
            }

            const fileName = `excel/${Date.now()}-${file.originalname}`;
            const { error } = await supabase.storage
                .from('Images')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (!error) {
                const { data: { publicUrl } } = supabase.storage
                    .from('Images')
                    .getPublicUrl(fileName);
                fileUrl = publicUrl;
            } else {
                console.error('[RECOUNT] Supabase upload error:', error);
            }

            await prisma.questionBank.create({
                data: {
                    subjectId: parseInt(id),
                    language: qbMeta.language || '',
                    examType: qbMeta.examType || 'Both',
                    fileUrl,
                    questionCount: fileQuestionCount
                }
            });

            await saveQuestionsFromBuffer(file.buffer, parseInt(id), qbMeta.language || 'english', qbMeta.examType || 'Both');
        });

        await Promise.all(qbPromises);

        // 3. Accumulate: existing count + new questions from uploaded files
        const updatedTotal = (currentSubject.totalQuestions || 0) + newQuestions;
        console.log(`[RECOUNT] Existing: ${currentSubject.totalQuestions}, New: ${newQuestions}, Total: ${updatedTotal}`);

        const updated = await prisma.subject.update({
            where: { id: parseInt(id) },
            data: { totalQuestions: updatedTotal },
            include: { questionBanks: true }
        });

        res.json(updated);
    } catch (error) {
        console.error('PATCH /api/subjects/:id/recount error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/subjects/:id - Update subject (manual count or status)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, totalQuestions, status } = req.body;
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (totalQuestions !== undefined) updateData.totalQuestions = parseInt(totalQuestions);
        if (status !== undefined) updateData.status = status;

        const updated = await prisma.subject.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: { questionBanks: true }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/subjects/:id/sync - Sync questions from one exam type to another
router.post('/:id/sync', async (req, res) => {
    try {
        const { id } = req.params;
        const { language, fromType, toType } = req.body;

        if (!language || !fromType || !toType) {
            return res.status(400).json({ error: 'Missing language, fromType, or toType' });
        }

        // Find the source question bank
        const sourceQB = await prisma.questionBank.findFirst({
            where: { 
                subjectId: parseInt(id),
                language: language,
                examType: fromType
            }
        });

        if (!sourceQB) {
            return res.status(404).json({ error: `Source question bank (${fromType}) for ${language} not found` });
        }

        // Use upsert to update existing or create new target QB
        // But since we can't easily upsert with language/type/subjectId as unique combo (unless defined in schema)
        // we'll check first.
        const targetQB = await prisma.questionBank.findFirst({
            where: {
                subjectId: parseInt(id),
                language: language,
                examType: toType
            }
        });

        if (targetQB) {
            // Update existing
            await prisma.questionBank.update({
                where: { id: targetQB.id },
                data: {
                    fileUrl: sourceQB.fileUrl,
                    questionCount: sourceQB.questionCount
                }
            });
        } else {
            // Create new
            await prisma.questionBank.create({
                data: {
                    subjectId: parseInt(id),
                    language: language,
                    examType: toType,
                    fileUrl: sourceQB.fileUrl,
                    questionCount: sourceQB.questionCount
                }
            });
        }

        // Sync questions in DB if they exist for source
        // First delete target questions for this type to avoid duplicates
        await prisma.question.deleteMany({
            where: {
                subjectId: parseInt(id),
                examType: toType
            }
        });

        const sourceQuestions = await prisma.question.findMany({
            where: {
                subjectId: parseInt(id),
                examType: fromType
            }
        });

        if (sourceQuestions.length > 0) {
            const newQuestions = sourceQuestions.map(q => {
                const { id, createdAt, updatedAt, ...qData } = q;
                return { ...qData, examType: toType };
            });
            await prisma.question.createMany({ data: newQuestions });
        }

        // Recalculate total subject count
        const allQBs = await prisma.questionBank.findMany({
            where: { subjectId: parseInt(id) }
        });
        const totalCount = allQBs.reduce((sum, qb) => sum + (qb.questionCount || 0), 0);
        
        const updatedSubject = await prisma.subject.update({
            where: { id: parseInt(id) },
            data: { totalQuestions: totalCount },
            include: { questionBanks: true }
        });

        res.json(updatedSubject);
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/subjects/:id/questions - Get all questions for a subject
router.get('/:id/questions', async (req, res) => {
    try {
        const { id } = req.params;
        const questions = await prisma.question.findMany({
            where: { subjectId: parseInt(id) },
            orderBy: { createdAt: 'asc' }
        });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/subjects/:id/questions - Add a single question
router.post('/:id/questions', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        let imageUrl = null;

        if (req.file) {
            const fileName = `questions/${Date.now()}-${req.file.originalname}`;
            const { error } = await supabase.storage
                .from('Images')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (!error) {
                const { data: { publicUrl } } = supabase.storage
                    .from('Images')
                    .getPublicUrl(fileName);
                imageUrl = publicUrl;
            } else {
                console.error('Supabase upload error for question image POST:', error);
            }
        }

        const question = await prisma.question.create({
            data: {
                ...req.body,
                subjectId: parseInt(id),
                ...(imageUrl && { imageUrl })
            }
        });
        
        const subject = await prisma.subject.findUnique({ where: { id: parseInt(id) } });
        await prisma.subject.update({
            where: { id: parseInt(id) },
            data: { totalQuestions: (subject.totalQuestions || 0) + 1 }
        });

        res.status(201).json(question);
    } catch (error) {
        console.error('POST /api/subjects/:id/questions error:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/questions/:id - Update a question
router.put('/questions/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        let imageUrl = null;

        if (req.file) {
            const fileName = `questions/${Date.now()}-${req.file.originalname}`;
            const { error } = await supabase.storage
                .from('Images')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (!error) {
                const { data: { publicUrl } } = supabase.storage
                    .from('Images')
                    .getPublicUrl(fileName);
                imageUrl = publicUrl;
            } else {
                console.error('Supabase upload error for question image PUT:', error);
            }
        }

        const updateData = { ...req.body };
        if (imageUrl) {
            updateData.imageUrl = imageUrl;
        }

        const updated = await prisma.question.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json(updated);
    } catch (error) {
        console.error('PUT /api/subjects/questions/:id error:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/questions/:id - Delete a single question
router.delete('/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.question.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/subjects/:id/questions/batch - Delete multiple questions
router.post('/:id/questions/batch-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        await prisma.question.deleteMany({
            where: { id: { in: ids } }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/subjects/:id/questions/export - Export questions to Excel
router.get('/:id/questions/export', async (req, res) => {
    try {
        const { id } = req.params;
        const questions = await prisma.question.findMany({
            where: { subjectId: parseInt(id) },
            orderBy: { createdAt: 'asc' }
        });

        const subject = await prisma.subject.findUnique({
            where: { id: parseInt(id) }
        });

        // Prepare data for Excel
        const data = questions.map((q, idx) => ({
            'S.No': idx + 1,
            'Question': q.text,
            'Option A': q.optionA,
            'Option B': q.optionB,
            'Option C': q.optionC,
            'Option D': q.optionD,
            'Correct Answer': q.answer,
            'Exam Type': q.examType,
            'Language': q.language
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Questions');

        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        const fileName = `${subject?.name || 'Subject'}_Questions_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/subjects/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.subject.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET samples
router.get('/samples/:lang', (req, res) => {
    const { lang } = req.params;
    const fileName = `${lang}_sample.xlsx`;
    const filePath = path.join(__dirname, '../uploads/samples', fileName);
    
    // Check if file exists, if not serve a default or error
    res.download(filePath, fileName, (err) => {
        if (err) {
            res.status(404).json({ error: 'Sample file not found' });
        }
    });
});

module.exports = router;
