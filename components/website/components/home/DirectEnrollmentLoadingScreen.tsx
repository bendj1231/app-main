import React from 'react';

export const DirectEnrollmentLoadingScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
            <div className="text-white text-center">
                <div className="mb-8">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                </div>
                <h2 className="text-2xl font-bold mb-4">Directing to Enrollment Page</h2>
                <p className="text-slate-400">Please wait while we take you directly to the Foundation Program enrollment...</p>
            </div>
        </div>
    );
};
