import React, { useState } from 'react';
import {
    User, MapPin, School, Phone, Clock, Award, Upload, Plus, Trash2, Plane, FileText, CheckCircle2, Loader2
} from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';

interface FoundationalVerificationPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

interface LogEntry {
    id: string;
    aircraftType: string;
    hours: string;
    descriptionTags: string[];
}

export const FoundationalVerificationPage: React.FC<FoundationalVerificationPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const { currentUser, refreshUserProfile } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Identity
    const [wingMentorId, setPilotRecognitionId] = useState('');
    const [fullName, setFullName] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);

    // Personal
    const [address, setAddress] = useState('');
    const [flightSchool, setFlightSchool] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    // Pilot Credentials (Licenses)
    const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);

    // Flight Experience
    const [totalHours, setTotalHours] = useState('');
    const [logEntries, setLogEntries] = useState<LogEntry[]>([
        { id: '1', aircraftType: '', hours: '', descriptionTags: [] }
    ]);

    const credentialOptions = [
        { id: 'student', label: 'Student Pilot License (SPL)' },
        { id: 'ppl', label: 'Private Pilot License (PPL)' },
        { id: 'cpl', label: 'Commercial Pilot License (CPL)' },
        { id: 'ir', label: 'Instrument Rating (IR)' },
        { id: 'atpl', label: 'Airline Transport Pilot License (ATPL)' },
        { id: 'cfi', label: 'Certified Flight Instructor (CFI)' },
    ];

    const descriptionTagOptions = [
        { id: 'DUAL', label: 'DUAL' },
        { id: 'PIC', label: 'PIC' },
        { id: 'XC', label: 'XC' },
        { id: 'LCL', label: 'LCL' }, // Local?
        { id: 'ME', label: 'ME' },   // Multi-Engine
        { id: 'IR', label: 'IR' },   // Instrument
        { id: 'INST', label: 'INSTRUCTED' }, // Instructed (as instructor) or Received Instruction? "Flight Instructed" usually means giving instruction.
    ];

    const aircraftTypes = [
        'Cessna 172', 'Cessna 152', 'Piper PA-28', 'Diamond DA40', 'Diamond DA42', 'Cirrus SR22', 'Other'
    ];

    const toggleCredential = (id: string) => {
        setSelectedCredentials(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const updateLogEntry = (id: string, field: keyof LogEntry, value: any) => {
        setLogEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, [field]: value } : entry
        ));
    };

    const toggleLogTag = (entryId: string, tag: string) => {
        setLogEntries(prev => prev.map(entry => {
            if (entry.id !== entryId) return entry;
            const newTags = entry.descriptionTags.includes(tag)
                ? entry.descriptionTags.filter(t => t !== tag)
                : [...entry.descriptionTags, tag];
            return { ...entry, descriptionTags: newTags };
        }));
    };

    const addLogEntry = () => {
        const newId = (logEntries.length + 1).toString();
        setLogEntries([...logEntries, { id: newId, aircraftType: '', hours: '', descriptionTags: [] }]);
    };

    const removeLogEntry = (id: string) => {
        setLogEntries(prev => prev.filter(e => e.id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            <div className="pt-32 pb-12 px-6">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-12 relative z-20">
                        <img
                            src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                            alt="PilotRecognition Logo"
                            className="mx-auto w-64 h-auto object-contain mb-2"
                        />
                        <p className="text-sm font-bold uppercase text-blue-700 mb-4">
                            Foundational Program Verification
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">Verify Your Eligibility</h1>
                        <p className="max-w-xl mx-auto text-slate-600">
                            Please complete your profile details and verify your flight experience to access the Foundational Program.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
                        <form className="space-y-12">

                            {/* Section 1: Identity & Photo */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Identity Verification</h2>

                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    {/* Photo Upload */}
                                    <div className="w-full md:w-1/3 flex flex-col items-center gap-3">
                                        <div className="w-40 h-40 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer relative overflow-hidden group">
                                            {photo ? (
                                                <img src={URL.createObjectURL(photo)} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 mb-2" />
                                                    <span className="text-xs font-bold uppercase">Upload Photo</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => e.target.files?.[0] && setPhoto(e.target.files[0])}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500 text-center">Recent passport-style photo</span>
                                    </div>

                                    {/* Fields */}
                                    <div className="w-full md:w-2/3 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase">PilotRecognition Account ID</label>
                                            <input
                                                type="text"
                                                value={wingMentorId}
                                                onChange={(e) => setPilotRecognitionId(e.target.value)}
                                                placeholder="WM-XXXX-XXXX"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase">Full Name</label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="As per license"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Contact & School */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Contact & Training Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase">Flight School Address</label>
                                        <div className="relative">
                                            <School className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                                            <textarea
                                                value={flightSchool}
                                                onChange={(e) => setFlightSchool(e.target.value)}
                                                placeholder="Institution Name and Full Address..."
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] font-medium"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase">Contact Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="tel"
                                                value={contactNumber}
                                                onChange={(e) => setContactNumber(e.target.value)}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase">Personal Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="City, Country"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Pilot Credentials */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Pilot Credentials</h2>
                                <h3 className="text-sm font-bold text-slate-500 uppercase">Licenses & Ratings Held</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {credentialOptions.map(option => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => toggleCredential(option.id)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${selectedCredentials.includes(option.id)
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm'
                                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
                                                }`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <Award className={`w-5 h-5 ${selectedCredentials.includes(option.id) ? 'text-blue-500' : 'text-slate-400'}`} />
                                                {option.label}
                                            </span>
                                            {selectedCredentials.includes(option.id) && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section 4: Flight Experience Logbook */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <h2 className="text-xl font-bold text-slate-900">Recent Flight Experience</h2>
                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-bold text-blue-700">Total Hours:</span>
                                        <input
                                            type="number"
                                            value={totalHours}
                                            onChange={(e) => setTotalHours(e.target.value)}
                                            placeholder="0"
                                            className="w-16 bg-transparent border-b border-blue-200 text-center font-bold focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <p className="text-sm text-slate-500">
                                    Please log your <strong>last 5 flights</strong> or key recent experience.
                                </p>

                                <div className="space-y-4">
                                    {logEntries.map((entry, index) => (
                                        <div key={entry.id} className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 relative group hover:border-blue-200 transition-colors">
                                            {/* Remove Button */}
                                            {logEntries.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLogEntry(entry.id)}
                                                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                                {/* Aircraft Type */}
                                                <div className="md:col-span-4 space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Aircraft Type</label>
                                                    <div className="relative">
                                                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <select
                                                            value={entry.aircraftType}
                                                            onChange={(e) => updateLogEntry(entry.id, 'aircraftType', e.target.value)}
                                                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                                                        >
                                                            <option value="" disabled>Select Type</option>
                                                            {aircraftTypes.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Hours */}
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={entry.hours}
                                                            onChange={(e) => updateLogEntry(entry.id, 'hours', e.target.value)}
                                                            placeholder="1.5"
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Description Tags */}
                                                <div className="md:col-span-6 space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Flight Description</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {descriptionTagOptions.map(tag => (
                                                            <button
                                                                key={tag.id}
                                                                type="button"
                                                                onClick={() => toggleLogTag(entry.id, tag.id)}
                                                                className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${entry.descriptionTags.includes(tag.id)
                                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                                                    }`}
                                                            >
                                                                {tag.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={addLogEntry}
                                        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Flight Entry
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-8 flex justify-end gap-4 border-t border-slate-100 mt-8">
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        if (!currentUser?.uid) {
                                            setSubmitError('You must be logged in to submit verification.');
                                            return;
                                        }
                                        setIsSubmitting(true);
                                        setSubmitError(null);
                                        try {
                                            let photoUrl = '';
                                            if (photo) {
                                                const fileExt = photo.name.split('.').pop();
                                                const filePath = `${currentUser.uid}/verification-${Date.now()}.${fileExt}`;
                                                const { error: uploadError } = await supabase.storage
                                                    .from('profile pics')
                                                    .upload(filePath, photo);
                                                if (uploadError) throw uploadError;
                                                const { data: { publicUrl } } = supabase.storage
                                                    .from('profile pics')
                                                    .getPublicUrl(filePath);
                                                photoUrl = publicUrl;
                                            }

                                            const { data: existingProfile } = await supabase
                                                .from('profiles')
                                                .select('enrolled_programs')
                                                .eq('id', currentUser.uid)
                                                .maybeSingle();

                                            const currentPrograms = existingProfile?.enrolled_programs || [];
                                            const updatedPrograms = currentPrograms.includes('Foundational')
                                                ? currentPrograms
                                                : [...currentPrograms, 'Foundational'];

                                            const { error: updateError } = await supabase
                                                .from('profiles')
                                                .update({
                                                    pilot_id: wingMentorId || null,
                                                    full_name: fullName || null,
                                                    profile_image_url: photoUrl || undefined,
                                                    address: address || null,
                                                    flight_school: flightSchool || null,
                                                    contact_number: contactNumber || null,
                                                    licenses: selectedCredentials.length > 0 ? selectedCredentials : null,
                                                    total_flight_hours: totalHours ? parseFloat(totalHours) : null,
                                                    flight_log: logEntries.length > 0 ? JSON.stringify(logEntries) : null,
                                                    enrolled_programs: updatedPrograms,
                                                })
                                                .eq('id', currentUser.uid);

                                            if (updateError) {
                                                console.error('Profile update error details:', updateError);
                                                throw updateError;
                                            }
                                            await supabase.from('notifications').insert({
                                                user_id: currentUser.uid,
                                                title: 'Congratulations!',
                                                message: 'You have now been enrolled in the Foundation Program. Welcome aboard!',
                                                type: 'success',
                                                is_read: false,
                                            });
                                            sessionStorage.setItem('enrollmentSuccess', 'true');
                                            onNavigate('home');
                                        } catch (err: any) {
                                            console.error('Verification submission error:', err);
                                            setSubmitError(err?.message || 'Failed to submit verification. Please try again.');
                                        } finally {
                                            setIsSubmitting(false);
                                        }
                                    }}
                                    className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                    {isSubmitting ? 'Processing...' : 'Submit for Verification'}
                                </button>
                            </div>
                            {submitError && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                                    {submitError}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
