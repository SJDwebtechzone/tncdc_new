/**
 * Quick test: verifies that xlsx parsing counts rows correctly.
 * Usage: node test_xlsx_parse.js path/to/file.xlsx
 */
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
    console.error('Usage: node test_xlsx_parse.js <path-to-xlsx>');
    process.exit(1);
}

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

const buffer = fs.readFileSync(filePath);
console.log(`File: ${path.basename(filePath)}, Size: ${buffer.length} bytes`);

const workbook = xlsx.read(buffer, { type: 'buffer' });
console.log(`Sheets: ${workbook.SheetNames.join(', ')}`);

let total = 0;
workbook.SheetNames.forEach(sheetName => {
    const ws = workbook.Sheets[sheetName];
    const allRows = xlsx.utils.sheet_to_json(ws, { header: 1 });
    const nonEmpty = allRows.filter(row => row && row.length > 0 && row.some(c => c !== null && c !== ''));
    const questions = nonEmpty.length > 1 ? nonEmpty.length - 1 : 0;
    console.log(`Sheet "${sheetName}": ${allRows.length} total rows, ${nonEmpty.length} non-empty, ${questions} questions (header excluded)`);
    total += questions;
});

console.log(`\n✅ Total Questions: ${total}`);
