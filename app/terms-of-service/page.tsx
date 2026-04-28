import React from 'react';
import { TopNavbar } from '../../components/website/components/TopNavbar';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServicePageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export default function TermsOfServicePage({ onBack, onNavigate, onLogin }: TermsOfServicePageProps) {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />
            
            <div className="pt-32 pb-12 px-6 max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl mb-8"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-8">
                    Terms of Service
                </h1>
                <p className="text-sm text-slate-500 mb-8">Last updated: April 2024</p>

                <div className="space-y-8 text-slate-700">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing and using the PilotRecognition platform, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Account Registration</h2>
                        <p className="mb-4">To use certain features of the platform, you must register for an account. You agree to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain and update your account information</li>
                            <li>Keep your password secure and confidential</li>
                            <li>Notify us immediately of unauthorized access</li>
                            <li>Accept responsibility for all activities under your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Conduct</h2>
                        <p className="mb-4">You agree not to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Use the platform for any illegal purpose</li>
                            <li>Impersonate any person or entity</li>
                            <li>Interfere with or disrupt the platform</li>
                            <li>Upload malicious code or viruses</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Post false or misleading information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. PilotRecognition Profile</h2>
                        <p className="mb-4">By creating a PilotRecognition Profile, you agree to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide accurate and verifiable information</li>
                            <li>Allow verification of your credentials and certifications</li>
                            <li>Accept that your recognition score is based on objective criteria</li>
                            <li>Understand that false information may result in account termination</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Foundation Program</h2>
                        <p className="mb-4">Participants in the Foundation Program agree to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Complete all required modules and assessments</li>
                            <li>Adhere to program guidelines and standards</li>
                            <li>Maintain professional conduct throughout the program</li>
                            <li>Complete the required 50 hours of mentorship</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property</h2>
                        <p>All content, features, and functionality of the PilotRecognition platform are owned by WM Pilot Group and are protected by international copyright, trademark, and other intellectual property laws.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h2>
                        <p>PilotRecognition shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Termination</h2>
                        <p>We reserve the right to terminate or suspend your account at any time for violation of these Terms of Service or for any other reason at our sole discretion.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Governing Law</h2>
                        <p>These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which WM Pilot Group is registered.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Contact Us</h2>
                        <p>If you have any questions about these Terms of Service, please contact us at:</p>
                        <p className="mt-2">legal@pilotrecognition.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
