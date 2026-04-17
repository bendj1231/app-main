import React, { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../../src/lib/firebase';
import { supabase } from '../../../../portal/lib/supabase-auth';

interface AuthBridgeProps {
    children: React.ReactNode;
}

export const AuthBridge: React.FC<AuthBridgeProps> = ({ children }) => {
    const [isSynced, setIsSynced] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If Firebase is disabled (auth is null), skip auth sync
        if (!auth) {
            console.log('Firebase disabled in AuthBridge - skipping auth sync');
            setIsSynced(true);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
            try {
                if (firebaseUser) {
                    // Check if user exists in Supabase
                    const { data: existingProfile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('email', firebaseUser.email)
                        .single();

                    if (!existingProfile) {
                        // Create profile in Supabase if it doesn't exist
                        const { error: insertError } = await supabase
                            .from('profiles')
                            .insert({
                                id: firebaseUser.uid,
                                email: firebaseUser.email,
                                display_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
                                full_name: firebaseUser.displayName || '',
                                role: 'mentee',
                                status: 'active',
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            });

                        if (insertError) {
                            console.error('Error creating Supabase profile:', insertError);
                        }
                    }

                    // Sign in to Supabase using Firebase token
                    const token = await firebaseUser.getIdToken();
                    const { error: signInError } = await supabase.auth.signInWithIdToken({
                        provider: 'firebase',
                        token: token,
                        nonce: ''
                    });

                    if (signInError) {
                        console.error('Error signing in to Supabase:', signInError);
                        // Continue anyway - auth sync is not critical
                    }

                    setIsSynced(true);
                } else {
                    // Don't sign out from Supabase when Firebase is disabled or not in use
                    // This allows Supabase auth to work independently
                    console.log('Firebase user null - not signing out from Supabase');
                    setIsSynced(true);
                }
            } catch (err) {
                console.error('Error syncing auth to Supabase:', err);
                setError('Auth sync failed');
                setIsSynced(true); // Continue even if sync fails
            }
        });

        return () => unsubscribe();
    }, []);

    if (!isSynced) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Syncing authentication...</div>
            </div>
        );
    }

    if (error) {
        console.warn('AuthBridge error:', error);
        // Return children anyway to prevent blank page
        return <>{children}</>;
    }

    return <>{children}</>;
};
