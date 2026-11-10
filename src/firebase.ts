import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);

// Lazy singletons for Auth and Firestore to prevent synchronous execution on initial bundle load
let _auth: any = null;
let _googleProvider: any = null;

export async function getAuthInstance() {
  if (!_auth) {
    const { getAuth, GoogleAuthProvider } = await import('firebase/auth');
    _auth = getAuth(app);
    _googleProvider = new GoogleAuthProvider();
  }
  return { auth: _auth, googleProvider: _googleProvider };
}

let _db: any = null;
export async function getDb() {
  if (!_db) {
    const { getFirestore } = await import('firebase/firestore');
    _db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
  return _db;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
