// Stub Firebase module — app uses Supabase instead
export const db: any = null;
export const app = null;
export const auth = null;

// Firestore stubs
export const doc = (...args: any[]): any => null;
export const getDoc = (...args: any[]): any => Promise.resolve({ exists: () => false, data: () => null });
export const setDoc = (...args: any[]): any => Promise.resolve();
export const collection = (...args: any[]): any => null;
export const query = (...args: any[]): any => null;
export const where = (...args: any[]): any => null;
export const getDocs = (...args: any[]): any => Promise.resolve({ docs: [], empty: true });
export const onSnapshot = (...args: any[]): any => () => {};
export const serverTimestamp = (): any => new Date().toISOString();
export const addDoc = (...args: any[]): any => Promise.resolve({ id: 'stub-id' });
export const deleteDoc = (...args: any[]): any => Promise.resolve();
export const orderBy = (...args: any[]): any => null;
export const limit = (...args: any[]): any => null;
export const updateDoc = (...args: any[]): any => Promise.resolve();
export const arrayUnion = (...args: any[]): any => null;
export const Timestamp = { now: () => new Date().toISOString(), fromDate: (d: Date) => d.toISOString() };

// Auth stubs
export const onAuthStateChanged = (...args: any[]): any => () => {};
