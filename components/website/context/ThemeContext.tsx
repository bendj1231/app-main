import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
    isAutoMode: boolean;
    resetToAutoTheme: () => void;
};

const THEME_KEY = 'theme';
const THEME_MANUAL_KEY = 'theme-manual-override';

function isAfter6PM(): boolean {
    const hour = new Date().getHours();
    return hour >= 18;
}

function getAutoTheme(): boolean {
    return isAfter6PM();
}

function getInitialTheme(): boolean {
    const saved = localStorage.getItem(THEME_KEY);
    const manualOverride = localStorage.getItem(THEME_MANUAL_KEY) === 'true';

    if (manualOverride && saved) {
        return saved === 'dark';
    }

    // Auto: after 6pm dark, otherwise light
    return getAutoTheme();
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);
    const [isAutoMode, setIsAutoMode] = useState(
        () => localStorage.getItem(THEME_MANUAL_KEY) !== 'true'
    );

    useEffect(() => {
        console.log('[ThemeContext] isDarkMode changed:', isDarkMode);
        localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        console.log('[ThemeContext] toggleTheme called. current isDarkMode:', isDarkMode);
        setIsAutoMode(false);
        localStorage.setItem(THEME_MANUAL_KEY, 'true');
        setIsDarkMode(prev => {
            const next = !prev;
            console.log('[ThemeContext] toggling theme to:', next ? 'dark' : 'light');
            return next;
        });
    };

    const resetToAutoTheme = () => {
        console.log('[ThemeContext] resetToAutoTheme called');
        setIsAutoMode(true);
        localStorage.removeItem(THEME_MANUAL_KEY);
        const autoDark = getAutoTheme();
        setIsDarkMode(autoDark);
        console.log('[ThemeContext] auto theme set to:', autoDark ? 'dark' : 'light');
    };

    // Auto-switch on hour change when in auto mode
    useEffect(() => {
        if (!isAutoMode) return;

        const checkHour = () => {
            const shouldBeDark = getAutoTheme();
            setIsDarkMode(prev => {
                if (prev !== shouldBeDark) {
                    console.log('[ThemeContext] auto hour-change:', shouldBeDark ? 'dark' : 'light');
                    return shouldBeDark;
                }
                return prev;
            });
        };

        // Check every minute
        const interval = setInterval(checkHour, 60000);
        return () => clearInterval(interval);
    }, [isAutoMode]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isAutoMode, resetToAutoTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
