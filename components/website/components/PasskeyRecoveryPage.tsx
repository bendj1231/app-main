
import React, { useState, useEffect } from 'react';

interface PasskeyRecoveryPageProps {
    onNavigate: (page: string) => void;
}

export const PasskeyRecoveryPage: React.FC<PasskeyRecoveryPageProps> = ({ onNavigate }) => {
    const [recoveryKey, setRecoveryKey] = useState('');
    const [email, setEmail] = useState('');
    const [copied, setCopied] = useState(false);
    const [retrying, setRetrying] = useState(false);
    const [retryResult, setRetryResult] = useState<'success' | 'cancelled' | null>(null);

    useEffect(() => {
        const key = sessionStorage.getItem('passkey_recovery_key') || '';
        const em = sessionStorage.getItem('passkey_recovery_email') || '';
        setRecoveryKey(key);
        setEmail(em);
    }, []);

    const handleRetryPasskey = async () => {
        setRetrying(true);
        setRetryResult(null);
        try {
            const userId = sessionStorage.getItem('mfb_auth0_id') || email || 'pilot-user';
            const rpId = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname.replace('www.', '');
            const cb = new Uint8Array(32);
            crypto.getRandomValues(cb);
            await navigator.credentials.create({
                publicKey: {
                    challenge: cb.buffer,
                    rp: { name: 'PilotRecognition Wallet', id: rpId },
                    user: { id: new TextEncoder().encode(userId).buffer, name: email || userId, displayName: email || userId },
                    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
                    authenticatorSelection: { userVerification: 'required', residentKey: 'required' },
                    timeout: 60000,
                },
            });
            setRetryResult('success');
            sessionStorage.removeItem('passkey_recovery_key');
            sessionStorage.removeItem('passkey_recovery_email');
            setTimeout(() => onNavigate('platform'), 1500);
        } catch (e: any) {
            setRetryResult('cancelled');
        } finally {
            setRetrying(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(recoveryKey);
        setCopied(true);
    };

    const handleContinue = () => {
        sessionStorage.removeItem('passkey_recovery_key');
        sessionStorage.removeItem('passkey_recovery_email');
        onNavigate('platform');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ width: '100%', maxWidth: '460px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
                    <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#ef4444', margin: '0 0 8px' }}>Passkey Not Saved</h1>
                    <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.45)', margin: 0 }}>
                        You cancelled the browser prompt. Save your backup recovery key before continuing.
                    </p>
                </div>

                {/* Warning */}
<div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.65)', lineHeight: 1.6, margin: 0 }}>
                        Without a passkey or this recovery key, you will <strong style={{ color: '#ef4444' }}>permanently lose access</strong> to your wallet and all credentials stored inside. We cannot recover it for you.
                    </p>
                </div>

                {/* Recovery key box */}
<div style={{ background: '#f8f9fa', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px' }}>
                        Backup Recovery Key {email ? `· ${email}` : ''}
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '0.18em', fontFamily: 'monospace', margin: '0 0 16px', wordBreak: 'break-all', lineHeight: 1.6 }}>
                        {recoveryKey || 'Loading...'}
                    </p>
                    <button
                        onClick={handleCopy}
                        style={{
                            width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                            cursor: 'pointer', fontSize: '14px', fontWeight: 700,
                            background: copied ? 'rgba(74,222,128,0.12)' : '#e2e8f0',
                            color: copied ? '#16a34a' : '#1a1a2e',
                            transition: 'all 0.2s',
                        }}
                    >
                        {copied ? '✓ Copied to clipboard' : 'Copy Recovery Key'}
                    </button>
                </div>

                <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.35)', lineHeight: 1.6, textAlign: 'center', marginBottom: '20px' }}>
                    Paste this into Apple Notes, Google Keep, or your password manager now.
                </p>

                {/* Retry feedback */}
                {retryResult === 'success' && (
                    <p style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700, fontSize: '13px', marginBottom: '12px' }}>
                        ✓ Passkey saved! Redirecting to platform...
                    </p>
                )}
                {retryResult === 'cancelled' && (
                    <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>
                        Cancelled again — copy the recovery key below before continuing.
                    </p>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleRetryPasskey}
                        disabled={retrying || retryResult === 'success'}
                        style={{
                            flex: 1, padding: '12px', borderRadius: '10px',
                            border: '1px solid #e2e8f0', background: 'transparent',
                            color: retrying ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)',
                            fontSize: '13px', fontWeight: 600,
                            cursor: retrying ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {retrying ? 'Waiting for prompt...' : '← Try Passkey Again'}
                    </button>
                    <button
                        disabled={!copied}
                        onClick={handleContinue}
                        style={{
                            flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                            background: copied ? '#dc2626' : 'rgba(255,255,255,0.05)',
                            color: copied ? '#fff' : 'rgba(0,0,0,0.2)',
                            fontSize: '13px', fontWeight: 700,
                            cursor: copied ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                        }}
                    >
                        I've saved it — Continue →
                    </button>
                </div>
            </div>
        </div>
    );
};
