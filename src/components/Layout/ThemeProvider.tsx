import React, { createContext, useContext, useEffect, useState } from 'react';
import { trainingStorage } from '../../services/storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('system');

    // Initial load
    useEffect(() => {
        const profile = trainingStorage.getUserProfile();
        if (profile?.theme) {
            setThemeState(profile.theme);
        }
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        // Also update storage immediately for sync
        const profile = trainingStorage.getUserProfile() || {
            id: 'temp-guest',
            name: 'Guest',
            role: 'user',
            weight: 0,
            height: 0,
            theme: 'system'
        };
        trainingStorage.saveUserProfile({ ...profile, theme: newTheme });
    };

    // Apply theme
    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
            root.setAttribute('data-theme', systemTheme);
        } else {
            root.classList.add(theme);
            root.setAttribute('data-theme', theme);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
