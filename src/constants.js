// --- CONFIGURATION CONSTANTS (User Provided Keys) ---
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
};

export const MASTER_ADMIN_USER = 'arthur.gonser1@yahoo.com';
export const MASTER_ADMIN_PASS = 'Hollywood1';
export const MASTER_ADMIN_UID = 'MASTER_ADMIN_UID_001';
export const APP_ID = FIREBASE_CONFIG.projectId;

// --- INITIAL DATA STRUCTURES ---
export const INITIAL_TASK_TYPES = [
  {
    id: 'T001',
    name: 'Cable ID & Verification',
    description: 'Trace and verify cable number against drawing.',
    checklist: ['Drawing retrieved', 'Cable tagged', 'Destination verified', 'Database updated'],
    required_files: ['Photo proof'],
    ai_guide: [
      { step: 1, title: 'Retrieve Drawing', details: 'Access the latest approved cable schedule or termination drawing for the cable ID in question.' },
      { step: 2, title: 'Locate Cable (Source)', details: 'Go to the source equipment (e.g., MCC, DCS Cabinet) listed on the drawing. Find the physical cable.' },
      { step: 3, title: 'Verify Source Tag', details: 'Check the physical cable tag against the drawing. Ensure the cable ID, source, and destination info match.' },
      { step: 4, title: 'Locate Cable (Destination)', details: 'Go to the destination equipment (e.g., motor, instrument) listed on the drawing.' },
      { step: 5, title: 'Verify Destination Tag', details: 'Check the physical tag at the destination. Take a clear photo of the tag and the equipment it is connected to.' },
      { step: 6, title: 'Check Status', details: 'Note if the cable is landed (terminated) or just coiled/un-terminated at the location.' },
      { step: 7, title: 'Update System', details: 'Mark all checklist items as complete and upload the verification photos to this task.' }
    ]
  },
  {
    id: 'T002',
    name: 'Termination QC (Motor)',
    description: 'Inspect motor terminal box terminations.',
    checklist: ['Tagging confirmed', 'Torque applied', 'Insulation tested (Megger)', 'Lugs dressed'],
    required_files: ['Photo proof', 'Test Report (PDF)'],
    ai_guide: [
      "Objective: Ensure motor terminations are mechanically and electrically sound.",
      "Step 1: Verify LOTO (Lock-Out/Tag-Out) is in place for the motor.",
      "Step 2: Open the motor terminal box (peckerhead).",
      "Step 3: Verify correct phase connection (A, B, C) and lug tightness using a calibrated torque wrench. Record torque values.",
      "Step 4: Conduct a Megger (insulation resistance) test between phases and from phase to ground. Record values.",
      "Step 5: Ensure lugs are properly dressed, insulated (e.g., with motor boots), and the box is clean.",
      "Step 6: Take a photo of the completed terminations before closing the box.",
      "Step 7: Upload the photo and the test report."
    ]
  },
];
export const INITIAL_PROJECTS = [
  { id: 'P001', name: 'Unit 1 DCS Modernization', status: 'Active', location: 'Vistra Energy, Tatum, TX - Unit 1', lat: 31.8105, lng: -94.4600 },
  { id: 'P002', name: 'Unit 2 Turbine I&C Upgrade', status: 'Active', location: 'Vistra Energy, Tatum, TX - Unit 2', lat: 31.8115, lng: -94.4580 },
];
export const INITIAL_FILES = [
    { id: 'F001', name: 'FCV-101_Termination.jpg', type: 'image/jpeg', url: 'https://placehold.co/100x70/2563EB/FFFFFF?text=FCV-101', lat: 31.8106, lng: -94.4602, floor: 'L4-C1', tags: ['FCV-101', 'Termination'], projectId: 'P001' },
    { id: 'F002', name: 'DCS_Cabinet_Layout.pdf', type: 'application/pdf', url: '#', lat: 31.8105, lng: -94.4601, floor: 'Mezz', tags: ['DCS', 'Cabinet'], projectId: 'P001' },
    { id: 'F003', name: 'Tray_R-202_Photo.jpg', type: 'image/jpeg', url: 'https://placehold.co/100x70/10B981/FFFFFF?text=TRAY', lat: 31.8107, lng: -94.4599, floor: 'L9-H1', tags: ['Cable', 'Tray'], projectId: 'P001' },
];
