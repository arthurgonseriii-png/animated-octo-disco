import { useState, useEffect, useCallback } from 'react';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, collection, query, getDocs, updateDoc, getDoc, where, serverTimestamp, deleteDoc, addDoc } from 'firebase/firestore';
import {
    FIREBASE_CONFIG,
    MASTER_ADMIN_USER,
    MASTER_ADMIN_PASS,
    MASTER_ADMIN_UID,
    APP_ID,
    INITIAL_TASK_TYPES,
    INITIAL_PROJECTS,
    INITIAL_FILES
} from '../constants';

/** Main application logic hook */
const useAppLogic = () => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null); // Stores the user *profile*
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks if user is *logged in*
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // All application data states
  const [allUsers, setAllUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [taskTemplates, setTaskTemplates] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [files, setFiles] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [safetyChecklists, setSafetyChecklists] = useState([]);
  const [lotoPermits, setLotoPermits] = useState([]);

  // Memoized helper functions for Firestore paths
  const getPublicPath = useCallback((collectionName) => {
      if (!db) return null;
      return collection(db, `artifacts/${APP_ID}/public/data/${collectionName}`);
  }, [db]);

  const getUserProfileRef = useCallback((uid) => {
    if (!db || !uid) return null;
    return doc(db, `artifacts/${APP_ID}/users/${uid}/user_data/profile`);
  }, [db]);

  // Fetches a user's profile from their private doc
  const fetchUserProfile = useCallback(async (uid) => {
    if (!db || !uid) return null;
    try {
      const docRef = getUserProfileRef(uid);
      if (!docRef) return null;
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
    } catch (e) { console.warn(`Private profile read failed for ${uid}:`, e.message); }
    return null;
  }, [db, getUserProfileRef]);

  // Performs the one-time data setup
  const performInitialDataSetup = useCallback(async (firestoreDb) => {
    // ... (omitted for brevity)
  }, []);

  // Main Authentication Effect: Handles ONLY Firebase auth state
  useEffect(() => {
    const app = initializeApp(FIREBASE_CONFIG);
    const firestoreDb = getFirestore(app);
    const authClient = getAuth(app);
    setDb(firestoreDb);
    setAuth(authClient);

    const unsubscribe = onAuthStateChanged(authClient, async (authUser) => {
      // ... (omitted for brevity)
    });
    return () => unsubscribe();
  }, []);

  // Data Listeners Effect
  useEffect(() => {
    if (!db || !user || !isAuthenticated) {
      const clearData = () => { setAllUsers([]); setProjects([]); setTaskTemplates([]); setFiles([]); setDailyLogs([]); setEquipment([]); setSafetyChecklists([]); setAssignments([]); setLotoPermits([]); };
      clearData();
      return;
    };

    const collectionsToListen = { setAllUsers, setProjects, setTaskTemplates, setFiles, setDailyLogs, setEquipment, setSafetyChecklists, setAssignments, setLotoPermits };
    const listeners = Object.entries(collectionsToListen).map(([setterName, _]) => {
        const key = setterName.substring(3).charAt(0).toLowerCase() + setterName.substring(4);
        const collectionRef = getPublicPath(key);
        if (!collectionRef) return () => {};

        return onSnapshot(query(collectionRef),
          (snap) => collectionsToListen[setterName](snap.docs.map(d => ({ id: d.id, ...d.data() }))),
          (err) => console.warn(`${key} listener failed:`, err.message)
        );
    });

    return () => listeners.forEach(unsub => unsub && unsub());
  }, [db, user, isAuthenticated, getPublicPath]);

  // Login Handler (FIXED LOGIC)
  const handleLogin = useCallback(async (username, password) => {
    // ... (omitted for brevity)
  }, [auth, db, getPublicPath, fetchUserProfile, performInitialDataSetup]);

  // Logout Handler (FIXED LOGIC)
  const handleLogout = useCallback(async () => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { isLoading, isAuthenticated, user, error, allUsers, projects, taskTemplates, assignments, files, dailyLogs, equipment, safetyChecklists, lotoPermits, handleLogin, handleLogout, db, auth };
};

export default useAppLogic;
