
import React from 'react';
import { ConfigProvider } from './context/ConfigContext';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './components/LandingPage';
import '@fortawesome/fontawesome-free/css/all.min.css';

// This container wraps the website components with their required contexts
// and ensures they are isolated from the main app's contexts if necessary.
// It also imports FontAwesome styles required by the website components.

export const WebsiteContainer: React.FC = () => {
    return (
        <ConfigProvider>
            <ThemeProvider>
                <div className="website-root font-sans text-base antialiased">
                    {/* The website expects certain global styles or reset, but we try to scope them via the root div if possible.
                However, existing styles might bleed. We might need to handle specific conflicts.
                For now, we just mount the LandingPage.
             */}
                    <LandingPage
                        onGoToProgramDetail={() => { }}
                        onGoToGapPage={() => { }}
                        onGoToOperatingHandbook={() => { }}
                        onGoToBlackBox={() => { }}
                        onGoToExaminationTerminal={() => { }}
                        onGoToEnrollment={() => { }}
                        onGoToHub={() => { }}
                    // Add dummy handlers for now, or route them to actual app routes if they exist
                    />
                </div>
            </ThemeProvider>
        </ConfigProvider>
    );
};
