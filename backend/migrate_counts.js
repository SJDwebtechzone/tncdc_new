const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
    try {
        const subjects = await prisma.subject.findMany({
            include: { questionBanks: true }
        });

        for (const subject of subjects) {
            if (subject.questionBanks.length === 1 && subject.totalQuestions > 0) {
                const qb = subject.questionBanks[0];
                if (qb.questionCount === 0) {
                    console.log(`Updating QuestionBank ${qb.id} for Subject "${subject.name}" with ${subject.totalQuestions} questions.`);
                    await prisma.questionBank.update({
                        where: { id: qb.id },
                        data: { questionCount: subject.totalQuestions }
                    });
                }
            } else if (subject.questionBanks.length > 0 && subject.totalQuestions > 0) {
                 // If multiple banks, we don't know which is which without parsing files.
                 // For now, let's just make sure they aren't all zero if totalQuestions is > 0
                 const allZero = subject.questionBanks.every(qb => qb.questionCount === 0);
                 if (allZero) {
                     // Distribute or just set the first one to avoid "0" display? 
                     // Best to set both if we don't know.
                     console.log(`Subject "${subject.name}" has ${subject.questionBanks.length} banks but 0 counts. Setting counts to totalQuestions.`);
                     for (const qb of subject.questionBanks) {
                         await prisma.questionBank.update({
                             where: { id: qb.id },
                             data: { questionCount: subject.totalQuestions }
                         });
                     }
                 }
            }
        }
        console.log('Migration completed.');
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
