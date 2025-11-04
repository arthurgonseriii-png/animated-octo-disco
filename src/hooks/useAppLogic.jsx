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
    if (!firestoreDb) return false;
    try {
      const setupFlagRef = doc(firestoreDb, `artifacts/${APP_ID}/public/data/setup_status/initial_data`);
      const setupDoc = await getDoc(setupFlagRef);
      if (setupDoc.exists()) return true; // Setup already done

      const masterAdminProfile = {
        uid: MASTER_ADMIN_UID,
        username: MASTER_ADMIN_USER, // Uses the new email
        name: 'Arthur Gonser III',
        email: MASTER_ADMIN_USER, // Uses the new email
        role: 'MasterAdmin',
        phone: '555-123-0001',
        address: 'Tatum, TX',
        passwordHash: MASTER_ADMIN_PASS,
        created: serverTimestamp(),
      };
      // Create the private profile doc
      const userProfileDocRef = doc(firestoreDb, `artifacts/${APP_ID}/users/${MASTER_ADMIN_UID}/user_data/profile`);
      await setDoc(userProfileDocRef, masterAdminProfile);

      // Create the public lookup doc
      const publicUserCollection = collection(firestoreDb, `artifacts/${APP_ID}/public/data/users`);
      await setDoc(doc(publicUserCollection, MASTER_ADMIN_UID), masterAdminProfile);

      // Populate all other initial data
      const collectionsToPopulate = [
        { data: INITIAL_PROJECTS, name: 'projects' },
        { data: INITIAL_TASK_TYPES, name: 'taskTemplates' },
        { data: INITIAL_FILES, name: 'files' },
      ];
      for (const { data, name } of collectionsToPopulate) {
        const collectionRef = collection(firestoreDb, `artifacts/${APP_ID}/public/data/${name}`);
        for (const item of data) {
          await setDoc(doc(collectionRef, item.id), { ...item, created: serverTimestamp() });
        }
      }

      await setDoc(setupFlagRef, { complete: true, timestamp: serverTimestamp() });
      console.log("Initial data setup complete.");
      return true;
    } catch (e) {
      console.error("Initial data setup failed:", e);
      return false;
    }
  }, []); // Removed getPublicPath dependency

  // Main Authentication Effect: Handles ONLY Firebase auth state
  useEffect(() => {
    const app = initializeApp(FIREBASE_CONFIG);
    const firestoreDb = getFirestore(app);
    const authClient = getAuth(app);
    setDb(firestoreDb);
    setAuth(authClient);

    // This listener just manages the base *anonymous* session
    const unsubscribe = onAuthStateChanged(authClient, async (authUser) => {
      if (authUser && !authUser.isAnonymous) {
        // A real user is logged in (e.g., from a previous session), but we manage state manually.
        // Force them out to the login screen.
        await signOut(authClient);
      } else if (!authUser) {
        // No user at all, establish a new anonymous session
        try {
          await signInAnonymously(authClient);
        }
        catch (e) { console.error("Anonymous sign-in failed:", e); setError("Could not establish a secure session."); }
      }
      // At this point, we are always anonymously signed in.
      setIsLoading(false); // Show login page
    });
    return () => unsubscribe();
  }, []);

  // Data Listeners Effect
  useEffect(() => {
    // Only listen if we have a DB and a *real, authenticated* user profile
    if (!db || !user || !isAuthenticated) {
      const clearData = () => { setAllUsers([]); setProjects([]); setTaskTemplates([]); setFiles([]); setDailyLogs([]); setEquipment([]); setSafetyChecklists([]); setAssignments([]); };
      clearData();
      return;
    };

    // User is authenticated with a real role (Admin, MasterAdmin, User), attach all listeners.
    const collectionsToListen = { setAllUsers, setProjects, setTaskTemplates, setFiles, setDailyLogs, setEquipment, setSafetyChecklists, setAssignments };
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
    if (!auth || !db) {
        setError("Authentication service not ready.");
        return;
    }
    setError(null);
    setIsLoading(true);

    try {
      // 1. Check for Master Admin credentials *first*.
      if (username === MASTER_ADMIN_USER && password === MASTER_ADMIN_PASS) {
          // This is the Master Admin.
          // We must ensure their data exists, as this might be the first-ever login.
          await performInitialDataSetup(db);
          // Now, fetch their profile.
          const profile = await fetchUserProfile(MASTER_ADMIN_UID);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          } else {
            setError("Master Admin profile not found. Setup failed.");
          }
          setIsLoading(false);
          return;
      }

      // 2. If not Master Admin, check the database for other users.
      const usersCollectionRef = getPublicPath('users');
      if (!usersCollectionRef) {
          setError("Database connection error.");
          setIsLoading(false);
          return;
      }
      const q = query(usersCollectionRef, where('username', '==', username));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        if (userData.passwordHash === password) {
          // Found user, fetch their full profile and set state
          const profile = await fetchUserProfile(userData.uid);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          } else {
              setError("User profile data is missing.");
          }
          setIsLoading(false);
          return;
        }
      }

      setError("Invalid username or password.");
    } catch (e) {
      console.error("Login failed:", e);
      setError(`Login process failed: ${e.message}`);
    }
    setIsLoading(false); // Ensure loading is turned off on failure
  }, [auth, db, getPublicPath, fetchUserProfile, performInitialDataSetup]);

  // Logout Handler (FIXED LOGIC)
  const handleLogout = useCallback(async () => {
    // We don't need to call signOut(auth). We just clear the *local* React state.
    // This immediately shows the AuthPage without a "blink" or reload.
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { isLoading, isAuthenticated, user, error, allUsers, projects, taskTemplates, assignments, files, dailyLogs, equipment, safetyChecklists, handleLogin, handleLogout, db, auth };
};

export default useAppLogic;
