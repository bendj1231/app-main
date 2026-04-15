import React, { useState } from 'react';
import { Icons } from '../icons';
import { supabase } from '../lib/supabase-auth';
import styles from './ForgotPasswordPage.module.css';

type Step = 'email' | 'success';

interface ForgotPasswordPageProps {
    onBack: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            setSuccessMessage('Password reset link sent to your email. Please check your inbox and click the link to continue.');
            setStep('success');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 'email':
                return (
                    <>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Forgot Your Password?</h2>
                            <p className={styles.formSubtitle}>
                                <strong>Enter your email address below.</strong> We'll send you a secure link to reset your password.
                            </p>
                        </div>
                        <form onSubmit={handleSendCode} className={styles.form}>
                            <div className={styles.accountLabel}>EMAIL ADDRESS</div>
                            <div className={styles.inputGroup}>
                                <div className={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={styles.emailInput}
                                />
                            </div>
                            <div className={styles.buttonGroup}>
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className={styles.backButton}
                                >
                                    Back
                                </button>
                                <button type="submit" disabled={loading} className={styles.submitButton}>
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                    {!loading && <Icons.ArrowRight style={{ width: 18, height: 18 }} />}
                                </button>
                            </div>
                        </form>
                    </>
                );
            case 'success':
                return (
                    <>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Reset Link Sent</h2>
                            <p className={styles.formSubtitle}>
                                <strong>Password reset instructions have been sent to your email.</strong> Please check your inbox and click the secure link to reset your password.
                            </p>
                        </div>
                        <div className={styles.successCheckmark}>
                            ✓ Check your email
                        </div>
                        <div className={styles.tipBox}>
                            <p><strong>Tip:</strong> If you don't see the email within 5 minutes, check your spam folder.</p>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.forgotPasswordContainer}>
            <div className={styles.backgroundGradient1} />
            <div className={styles.backgroundGradient2} />
            <div className={styles.forgotPasswordCard}>
                {/* Left Side (Dark Info Panel) */}
                <div className={styles.infoPanel}>
                    <div className={styles.infoPanelGradient1} />
                    <div className={styles.infoPanelGradient2} />
                    <div className={styles.logo}>
                        <img src="/logo.png" alt="WingMentor Logo" />
                    </div>
                    <div className={styles.pageLabel}>PASSWORD RESET</div>
                    <h2 className={styles.panelTitle}>Account Recovery</h2>
                    <p className={styles.panelDescription}>
                        <strong>Regain access to your WingMentor account.</strong> Enter your email address and we'll send you a secure link to reset your password.
                    </p>
                </div>
                
                {/* Right Side (Form Panel) */}
                <div className={styles.formPanel}>
                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}
                    {successMessage && step !== 'success' && (
                        <div className={styles.successMessage}>
                            {successMessage}
                        </div>
                    )}
                    {renderStepContent()}
                    <div className={styles.contactSection}>
                        <div>Contact Us</div>
                        <div>Phone: <a href="tel:+1234567890">+1 234 567 890</a></div>
                        <div>Email: <a href="mailto:wingmentorprogram@gmail.com">wingmentorprogram@gmail.com</a></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
