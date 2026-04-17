// IndexedDB utility for persisting Supabase auth session
const DB_NAME = 'PilotRecognitionAuth';
const DB_VERSION = 1;
const STORE_NAME = 'authSession';

interface AuthSessionData {
  session: any;
  timestamp: number;
}

export const indexedDB = {
  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = (window as any).indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  },

  async saveSession(session: any): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const data: AuthSessionData = {
          session,
          timestamp: Date.now(),
        };
        const request = store.put(data, 'currentSession');

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          console.log('✅ Session saved to IndexedDB');
          resolve();
        };

        transaction.oncomplete = () => db.close();
      });
    } catch (error) {
      console.error('❌ Error saving session to IndexedDB:', error);
    }
  },

  async getSession(): Promise<any | null> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get('currentSession');

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const data = request.result as AuthSessionData | undefined;
          if (data && data.session) {
            console.log('✅ Session restored from IndexedDB');
            resolve(data.session);
          } else {
            console.log('⚠️ No session found in IndexedDB');
            resolve(null);
          }
        };

        transaction.oncomplete = () => db.close();
      });
    } catch (error) {
      console.error('❌ Error getting session from IndexedDB:', error);
      return null;
    }
  },

  async getSessionWithVerification(supabaseClient: any): Promise<any | null> {
    try {
      const session = await this.getSession();
      if (!session) return null;

      // Verify user still exists in Supabase auth
      if (session.user?.id) {
        try {
          // First, try to get the current session from Supabase to verify it's still valid
          const { data: { session: currentSession }, error: sessionError } = await supabaseClient.auth.getSession();
          
          if (sessionError || !currentSession) {
            console.log('⚠️ Session no longer valid in Supabase auth, clearing session');
            await this.clearSession();
            return null;
          }

          // Verify user still exists in profiles table
          const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (profileError || !profile) {
            console.log('⚠️ User no longer exists in database, clearing session');
            await this.clearSession();
            return null;
          }
          console.log('✅ User verified in Supabase auth and database');
        } catch (verifyError) {
          console.error('❌ Error verifying user:', verifyError);
          // If verification fails, clear session to be safe
          await this.clearSession();
          return null;
        }
      }

      return session;
    } catch (error) {
      console.error('❌ Error getting session with verification:', error);
      return null;
    }
  },

  async clearSession(): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete('currentSession');

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          console.log('✅ Session cleared from IndexedDB');
          resolve();
        };

        transaction.oncomplete = () => db.close();
      });
    } catch (error) {
      console.error('❌ Error clearing session from IndexedDB:', error);
    }
  },
};
