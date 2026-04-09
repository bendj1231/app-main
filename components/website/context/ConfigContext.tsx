
import React, { createContext, useContext, useState, useEffect } from 'react';
import { IMAGES } from '../constants'; // Import images from centralized file

type Config = {
    heroVideoUrl: string;
    images: typeof IMAGES;
};

type ConfigContextType = {
    config: Config;
    updateConfig: (key: keyof Config, value: any) => void;
    resetConfig: () => void;
};

const DEFAULT_CONFIG: Config = {
    heroVideoUrl: IMAGES.HERO_VIDEO,
    images: IMAGES
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<Config>(() => {
        const saved = localStorage.getItem('site_config');
        return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    });

    useEffect(() => {
        localStorage.setItem('site_config', JSON.stringify(config));
    }, [config]);

    const updateConfig = (key: keyof Config, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const resetConfig = () => {
        setConfig(DEFAULT_CONFIG);
    };

    return (
        <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) throw new Error('useConfig must be used within a ConfigProvider');
    return context;
};
