'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslations, Translations } from './i18n';
import { supabase } from './supabaseClient';

type Theme = 'light' | 'dark';

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  theme: Theme;
  toggleTheme: () => void;
  notificationCount: number;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
  currentUser: { id: string; name: string; avatar: string } | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id');
  const [theme, setTheme] = useState<Theme>('light');
  const [notificationCount, setNotificationCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; avatar: string } | null>(null);

  // Default hardcoded user for the frontend until full Auth is built
  const DEFAULT_USER_ID = 'member-001';

  useEffect(() => {
    const savedLang = localStorage.getItem('teamflow-lang') as Language | null;
    const savedTheme = localStorage.getItem('teamflow-theme') as Theme | null;
    if (savedLang) setLanguageState(savedLang);
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }

    // Auth simulation
    setCurrentUser({ id: DEFAULT_USER_ID, name: 'Andi Susanto', avatar: 'AS' });

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', DEFAULT_USER_ID)
          .eq('is_read', false);
        if (count !== null) setNotificationCount(count);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };
    fetchNotifications();

    // Supabase Realtime subscription
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${DEFAULT_USER_ID}` },
        (payload) => {
          setNotificationCount((prev) => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${DEFAULT_USER_ID}` },
        (payload) => {
          if (payload.new.is_read) {
            setNotificationCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('teamflow-lang', lang);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('teamflow-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  const t = getTranslations(language);

  return (
    <AppContext.Provider value={{ language, setLanguage, t, theme, toggleTheme, notificationCount, setNotificationCount, currentUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
