const fs = require('fs');

const { records, projections } = JSON.parse(fs.readFileSync('scripts/generated_records.json', 'utf8'));

let tsContent = `import { StudentProjectionPoint } from '../types';

// Raw institutional engineering records extracted from ERP & multi-department databases (150 student instances)
// Combining core academic indicators with campus administrative & survey records
export const sampleCollegeRecords = ${JSON.stringify(records, null, 2)};

// Curated academic feature subset with extraneous administrative variables removed (150 clean instances)
export const cleanCollegeRecords = sampleCollegeRecords.map((r) => {
  const { HOSTEL_ROOM_NO, CANTEEN_PREFERENCE, PORTAL_SESSION_SALT, SPORTS_SHOE_SIZE, ...clean } = r;
  return clean;
});

// Comprehensive 2D PCA & 1D LDA latent space projection coordinates for all 150 students
export const studentProjectionsData: StudentProjectionPoint[] = ${JSON.stringify(projections, null, 2)};
`;

fs.writeFileSync('src/data/sampleRecordsData.ts', tsContent);
console.log('src/data/sampleRecordsData.ts written successfully!');
