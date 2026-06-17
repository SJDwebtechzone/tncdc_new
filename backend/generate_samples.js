/**
 * Generates english_sample.xlsx and tamil_sample.xlsx in uploads/samples/
 * Run once: node generate_samples.js
 */
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, 'uploads/samples');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// --- English Sample ---
const englishData = [
    ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Explanation'],
    ['What is the capital of India?', 'Mumbai', 'Delhi', 'Kolkata', 'Chennai', 'B', 'New Delhi is the capital of India.'],
    ['Which planet is closest to the Sun?', 'Earth', 'Venus', 'Mercury', 'Mars', 'C', 'Mercury is the closest planet to the Sun.'],
    ['How many days are in a leap year?', '365', '364', '366', '367', 'C', 'A leap year has 366 days.'],
];

const englishWs = xlsx.utils.aoa_to_sheet(englishData);
const englishWb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(englishWb, englishWs, 'Questions');

// Set column widths for readability
englishWs['!cols'] = [
    { wch: 45 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 40 }
];

xlsx.writeFile(englishWb, path.join(outputDir, 'english_sample.xlsx'));
console.log('✅ english_sample.xlsx created');

// --- Tamil Sample ---
const tamilData = [
    ['கேள்வி (Question)', 'விருப்பம் A', 'விருப்பம் B', 'விருப்பம் C', 'விருப்பம் D', 'சரியான விடை (Correct Answer)', 'விளக்கம் (Explanation)'],
    ['இந்தியாவின் தலைநகரம் எது?', 'மும்பை', 'டெல்லி', 'கொல்கத்தா', 'சென்னை', 'B', 'புது தில்லி இந்தியாவின் தலைநகரம்.'],
    ['சூரியனுக்கு மிக அருகில் உள்ள கோள் எது?', 'பூமி', 'வீனஸ்', 'புதன்', 'செவ்வாய்', 'C', 'புதன் கிரகம் சூரியனுக்கு மிக அருகில் உள்ளது.'],
    ['ஒரு லீப் ஆண்டில் எத்தனை நாட்கள் உள்ளன?', '365', '364', '366', '367', 'C', 'ஒரு லீப் ஆண்டில் 366 நாட்கள் உள்ளன.'],
];

const tamilWs = xlsx.utils.aoa_to_sheet(tamilData);
const tamilWb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(tamilWb, tamilWs, 'Questions');

tamilWs['!cols'] = [
    { wch: 45 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 40 }
];

xlsx.writeFile(tamilWb, path.join(outputDir, 'tamil_sample.xlsx'));
console.log('✅ tamil_sample.xlsx created');

console.log('\nSample files are ready in:', outputDir);
