import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfigured } from './firebase';

export interface FirestoreCredentialPayload {
  profile_id: string;
  auth0_id: string;
  credential_type: string;
  issuer_did: string;
  subject_did: string;
  credential_offer_url: string;
  credential_jwt?: string;
  source_provider: string;
  total_hours: number;
  status: string;
  metadata?: Record<string, unknown>;
}

export async function writeCredentialToFirestore(
  payload: FirestoreCredentialPayload
): Promise<{ success: boolean; docId?: string; error?: string }> {
  if (!firebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const credRef = doc(collection(db, 'pilot_credentials'));
    await setDoc(credRef, {
      ...payload,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return { success: true, docId: credRef.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Firestore] write failed:', message);
    return { success: false, error: message };
  }
}
