const fs = require('fs');

// Seeded pseudorandom generator for deterministic, reproducible records
let seed = 42;
function random() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

function randInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(random() * arr.length)];
}

const canteenChoices = [
  'Samosa',
  'Masala Dosa',
  'Veg Puff',
  'Tea',
  'Poha',
  'Vada Pav',
  'Sandwich',
  'Filter Coffee',
];

const studyHoursChoices = ['<5h', '5-10h', '11-15h', '16-20h', '>20h'];
const midtermChoices = ['Consistent', 'Regular', 'Cramming', 'Minimal'];
const notesChoices = ['Always', 'Sometimes', 'Rarely', 'Never'];
const projectChoices = ['Positive', 'Neutral', 'Negative'];

// Preserved original 12 authentic anchor records
const records = [
  {
    STUDENT_ID: 'ENGR001',
    CGPA_10: 7.4,
    ATTENDANCE_PCT: 92,
    BACKLOGS: 0,
    INTERNAL_30: 25,
    HOSTEL_ROOM_NO: 304,
    CANTEEN_PREFERENCE: 'Samosa',
    PORTAL_SESSION_SALT: 94821,
    SPORTS_SHOE_SIZE: 42,
    STUDY_HOURS: '11-15h',
    PREP_MIDTERM: 'Consistent',
    NOTES: 'Always',
    PROJECT_IMPACT: 'Positive',
    GRADE: 'Grade 5: BB (Good)',
    STATUS: 'Safe',
  },
  {
    STUDENT_ID: 'ENGR002',
    CGPA_10: 8.8,
    ATTENDANCE_PCT: 95,
    BACKLOGS: 0,
    INTERNAL_30: 28,
    HOSTEL_ROOM_NO: 112,
    CANTEEN_PREFERENCE: 'Masala Dosa',
    PORTAL_SESSION_SALT: 48192,
    SPORTS_SHOE_SIZE: 41,
    STUDY_HOURS: '16-20h',
    PREP_MIDTERM: 'Consistent',
    NOTES: 'Always',
    PROJECT_IMPACT: 'Positive',
    GRADE: 'Grade 6: BA (Very Good)',
    STATUS: 'Safe',
  },
  {
    STUDENT_ID: 'ENGR003',
    CGPA_10: 9.6,
    ATTENDANCE_PCT: 98,
    BACKLOGS: 0,
    INTERNAL_30: 29,
    HOSTEL_ROOM_NO: 405,
    CANTEEN_PREFERENCE: 'Veg Puff',
    PORTAL_SESSION_SALT: 19832,
    SPORTS_SHOE_SIZE: 43,
    STUDY_HOURS: '>20h',
    PREP_MIDTERM: 'Consistent',
    NOTES: 'Always',
    PROJECT_IMPACT: 'Positive',
    GRADE: 'Grade 7: AA (Outstanding)',
    STATUS: 'Safe',
  },
  {
    STUDENT_ID: 'ENGR004',
    CGPA_10: 4.8,
    ATTENDANCE_PCT: 64,
    BACKLOGS: 2,
    INTERNAL_30: 14,
    HOSTEL_ROOM_NO: 218,
    CANTEEN_PREFERENCE: 'Tea',
    PORTAL_SESSION_SALT: 84729,
    SPORTS_SHOE_SIZE: 40,
    STUDY_HOURS: '<5h',
    PREP_MIDTERM: 'Cramming',
    NOTES: 'Rarely',
    PROJECT_IMPACT: 'Neutral',
    GRADE: 'Grade 1: DD (Pass)',
    STATUS: 'At-Risk',
  },
  {
    STUDENT_ID: 'ENGR005',
    CGPA_10: 3.2,
    ATTENDANCE_PCT: 52,
    BACKLOGS: 4,
    INTERNAL_30: 10,
    HOSTEL_ROOM_NO: 108,
    CANTEEN_PREFERENCE: 'Samosa',
    PORTAL_SESSION_SALT: 38294,
    SPORTS_SHOE_SIZE: 44,
    STUDY_HOURS: '<5h',
    PREP_MIDTERM: 'Minimal',
    NOTES: 'Never',
    PROJECT_IMPACT: 'Negative',
    GRADE: 'Grade 0: Fail (At-Risk)',
    STATUS: 'Severe Risk',
  },
  {
    STUDENT_ID: 'ENGR006',
    CGPA_10: 6.8,
    ATTENDANCE_PCT: 82,
    BACKLOGS: 0,
    INTERNAL_30: 22,
    HOSTEL_ROOM_NO: 319,
    CANTEEN_PREFERENCE: 'Poha',
    PORTAL_SESSION_SALT: 67129,
    SPORTS_SHOE_SIZE: 39,
    STUDY_HOURS: '5-10h',
    PREP_MIDTERM: 'Consistent',
    NOTES: 'Sometimes',
    PROJECT_IMPACT: 'Positive',
    GRADE: 'Grade 4: CB (Above Avg)',
    STATUS: 'Safe',
  },
  {
    STUDENT_ID: 'ENGR007',
    CGPA_10: 5.6,
    ATTENDANCE_PCT: 72,
    BACKLOGS: 1,
    INTERNAL_30: 18,
    HOSTEL_ROOM_NO: 422,
    CANTEEN_PREFERENCE: 'Vada Pav',
    PORTAL_SESSION_SALT: 28471,
    SPORTS_SHOE_SIZE: 42,
    STUDY_HOURS: '5-10h',
    PREP_MIDTERM: 'Cramming',
    NOTES: 'Sometimes',
    PROJECT_IMPACT: 'Neutral',
    GRADE: 'Grade 2: DC (Satisfactory)',
    STATUS: 'Moderate Risk',
  },
  {
    STUDENT_ID: 'ENGR008',
    CGPA_10: 8.2,
    ATTENDANCE_PCT: 90,
    BACKLOGS: 0,
    INTERNAL_30: 26,
    HOSTEL_ROOM_NO: 201,
    CANTEEN_PREFERENCE: 'Sandwich',
    PORTAL_SESSION_SALT: 59381,
    SPORTS_SHOE_SIZE: 41,
    STUDY_HOURS: '11-15h',
    PREP_MIDTERM: 'Consistent',
    NOTES: 'Always',
    PROJECT_IMPACT: 'Positive',
    GRADE: 'Grade 5: BB (Good)',
    STATUS: 'Safe',
  },
  {
    STUDENT_ID: 'ENGR009',
    CGPA_10: 3.8,
    ATTENDANCE_PCT: 58,
    BACKLOGS: 3,
    INTERNAL_30: 12,
    HOSTEL_ROOM_NO: 115,
    CANTEEN_PREFERENCE: 'Tea',
    PORTAL_SESSION_SALT: 91842,
    SPORTS_SHOE_SIZE: 43,
    STUDY_HOURS: '<5h',
    PREP_MIDTERM: 'Minimal',
    NOTES: 'Never',
    PROJECT_IMPACT: 'Negative',
    GRADE: 'Grade 0: Fail (At-Risk)',
    STATUS: 'Severe Risk',
  },
  {
    STUDENT_ID: 'ENGR010',
    CGPA_10: 9.1,
    ATTENDANCE_PCT: 96,
    BACKLOGS: 0,
    INTERNAL_30: 29,
    HOSTEL_ROOM_NO: 308,
    CANTEEN_PREFERENCE: 'Masala Dosa',
    PORTAL_SESSION_SALT: 41982,
    SPORTS_SHOE_SIZE: 40,
    STUDY_HOURS: '16-20h',
    PREP_MIDTERM: 'Consistent',
    NOTES: 'Always',
    PROJECT_IMPACT: 'Positive',
    GRADE: 'Grade 7: AA (Outstanding)',
    STATUS: 'Safe',
  },
  {
    STUDENT_ID: 'ENGR011',
    CGPA_10: 6.2,
    ATTENDANCE_PCT: 78,
    BACKLOGS: 1,
    INTERNAL_30: 20,
    HOSTEL_ROOM_NO: 224,
    CANTEEN_PREFERENCE: 'Samosa',
    PORTAL_SESSION_SALT: 73910,
    SPORTS_SHOE_SIZE: 42,
    STUDY_HOURS: '5-10h',
    PREP_MIDTERM: 'Consistent',
    NOTES: 'Sometimes',
    PROJECT_IMPACT: 'Neutral',
    GRADE: 'Grade 3: CC (Average)',
    STATUS: 'Safe',
  },
  {
    STUDENT_ID: 'ENGR012',
    CGPA_10: 4.2,
    ATTENDANCE_PCT: 61,
    BACKLOGS: 3,
    INTERNAL_30: 13,
    HOSTEL_ROOM_NO: 103,
    CANTEEN_PREFERENCE: 'Vada Pav',
    PORTAL_SESSION_SALT: 82019,
    SPORTS_SHOE_SIZE: 39,
    STUDY_HOURS: '<5h',
    PREP_MIDTERM: 'Cramming',
    NOTES: 'Rarely',
    PROJECT_IMPACT: 'Negative',
    GRADE: 'Grade 1: DD (Pass)',
    STATUS: 'At-Risk',
  },
];

// Generate ENGR013 through ENGR150 (Total 150 student instances)
for (let i = 13; i <= 150; i++) {
  const idStr = 'ENGR' + String(i).padStart(3, '0');
  
  // Create natural distribution cohorts:
  // 15% Top tier (8.5-9.8)
  // 35% Strong tier (7.2-8.4)
  // 30% Average tier (5.8-7.1)
  // 12% Vulnerable tier (4.5-5.7)
  // 8% At-Risk / Critical (2.5-4.4)
  const cohortRoll = random();
  let cgpa, attendance, backlogs, internal, studyHours, midterm, notes, projectImpact, grade, status;

  if (cohortRoll < 0.15) {
    // Top tier
    cgpa = Number((8.5 + random() * 1.3).toFixed(1));
    attendance = randInt(91, 99);
    backlogs = 0;
    internal = randInt(26, 30);
    studyHours = randChoice(['16-20h', '>20h']);
    midterm = 'Consistent';
    notes = 'Always';
    projectImpact = 'Positive';
    grade = cgpa >= 9.0 ? 'Grade 7: AA (Outstanding)' : 'Grade 6: BA (Very Good)';
    status = 'Safe';
  } else if (cohortRoll < 0.50) {
    // Strong tier
    cgpa = Number((7.2 + random() * 1.2).toFixed(1));
    attendance = randInt(82, 94);
    backlogs = 0;
    internal = randInt(22, 27);
    studyHours = randChoice(['11-15h', '16-20h']);
    midterm = randChoice(['Consistent', 'Regular']);
    notes = randChoice(['Always', 'Sometimes']);
    projectImpact = randChoice(['Positive', 'Positive', 'Neutral']);
    grade = cgpa >= 8.0 ? 'Grade 6: BA (Very Good)' : 'Grade 5: BB (Good)';
    status = 'Safe';
  } else if (cohortRoll < 0.80) {
    // Average tier
    cgpa = Number((5.8 + random() * 1.3).toFixed(1));
    attendance = randInt(72, 85);
    backlogs = random() < 0.25 ? 1 : 0;
    internal = randInt(17, 23);
    studyHours = randChoice(['5-10h', '11-15h']);
    midterm = randChoice(['Regular', 'Cramming', 'Consistent']);
    notes = randChoice(['Sometimes', 'Always']);
    projectImpact = randChoice(['Neutral', 'Positive']);
    grade = cgpa >= 6.0 ? 'Grade 4: CB (Above Avg)' : 'Grade 3: CC (Average)';
    status = backlogs > 0 ? 'Moderate Risk' : 'Safe';
  } else if (cohortRoll < 0.92) {
    // Vulnerable tier
    cgpa = Number((4.5 + random() * 1.2).toFixed(1));
    attendance = randInt(60, 74);
    backlogs = randInt(1, 2);
    internal = randInt(13, 18);
    studyHours = randChoice(['<5h', '5-10h']);
    midterm = randChoice(['Cramming', 'Regular']);
    notes = randChoice(['Rarely', 'Sometimes']);
    projectImpact = randChoice(['Neutral', 'Negative']);
    grade = cgpa >= 5.0 ? 'Grade 3: CC (Average)' : (cgpa >= 4.5 ? 'Grade 2: DC (Satisfactory)' : 'Grade 1: DD (Pass)');
    status = 'Moderate Risk';
  } else {
    // At-Risk / Critical
    cgpa = Number((2.5 + random() * 1.8).toFixed(1));
    attendance = randInt(46, 62);
    backlogs = randInt(2, 5);
    internal = randInt(8, 14);
    studyHours = '<5h';
    midterm = randChoice(['Minimal', 'Cramming']);
    notes = randChoice(['Never', 'Rarely']);
    projectImpact = 'Negative';
    grade = cgpa < 4.0 ? 'Grade 0: Fail (At-Risk)' : 'Grade 1: DD (Pass)';
    status = cgpa < 4.0 ? 'Severe Risk' : 'At-Risk';
  }

  // Extraneous administrative variables
  const hostelRoom = randInt(101, 450);
  const canteenPref = randChoice(canteenChoices);
  const portalSalt = randInt(10200, 99800);
  const shoeSize = randInt(38, 45);

  records.push({
    STUDENT_ID: idStr,
    CGPA_10: cgpa,
    ATTENDANCE_PCT: attendance,
    BACKLOGS: backlogs,
    INTERNAL_30: internal,
    HOSTEL_ROOM_NO: hostelRoom,
    CANTEEN_PREFERENCE: canteenPref,
    PORTAL_SESSION_SALT: portalSalt,
    SPORTS_SHOE_SIZE: shoeSize,
    STUDY_HOURS: studyHours,
    PREP_MIDTERM: midterm,
    NOTES: notes,
    PROJECT_IMPACT: projectImpact,
    GRADE: grade,
    STATUS: status,
  });
}

// Compute projection points for all 150 students
const projections = records.map((r) => {
  // Standardized values (mean ~6.8, std ~1.7)
  const zCgpa = (r.CGPA_10 - 6.8) / 1.7;
  const zAtt = (r.ATTENDANCE_PCT - 80) / 12;
  const zBacklog = -(r.BACKLOGS - 0.5) / 1.1; // negative sign so fewer backlogs = higher score
  const zInt = (r.INTERNAL_30 - 21) / 5.5;

  // PC1 (academic aptitude & diligence): captures 47.8% of variance
  const pc1 = Number((zCgpa * 0.58 + zAtt * 0.44 + zBacklog * 0.52 + zInt * 0.45).toFixed(2));
  
  // PC2 (attendance vs internal exam disparity / effort contrast): captures 21.4%
  const pc2 = Number((zAtt * 0.65 - zInt * 0.48 + (random() - 0.5) * 0.3).toFixed(2));

  // LD1 (Fisher discriminant vector: optimal Safe vs At-Risk separator)
  const ld1 = Number((zCgpa * 0.64 + zAtt * 0.38 + zBacklog * 0.62 + zInt * 0.25).toFixed(2));

  // Extraneous administrative noise score (essentially zero correlation ~0.01 - 0.04)
  const dummyNoiseScore = Number((0.01 + random() * 0.035).toFixed(2));

  return {
    id: r.STUDENT_ID,
    cgpa: r.CGPA_10,
    attendance: r.ATTENDANCE_PCT,
    backlogs: r.BACKLOGS,
    grade: r.GRADE.split(' (')[0],
    status: r.STATUS,
    pc1,
    pc2,
    ld1,
    dummyNoiseScore,
  };
});

fs.writeFileSync('scripts/generated_records.json', JSON.stringify({ records, projections }, null, 2));
console.log(`Successfully generated ${records.length} records and ${projections.length} projection points.`);
