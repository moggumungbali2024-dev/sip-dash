'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, MessageSquare, Zap, Sun, Moon, Menu, Globe, CheckSquare, Users, Settings, CheckCheck, X, User, LogOut } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMobileMenuToggle?: () => void;
}

const recentNotifications = [
  {
    id: 'n1',
    type: 'task' as const,
    title: 'Tugas ditugaskan ke kamu',
    body: 'Andi Susanto menugaskan "Setup Supabase RLS" ke kamu',
    time: '2 min ago',
    read: false,
    actor: 'AS',
    actorColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  },
  {
    id: 'n2',
    type: 'mention' as const,
    title: 'Kamu disebut di #dev-backend',
    body: 'Budi Hartono: "@Andi please review this PR"',
    time: '15 min ago',
    read: false,
    actor: 'BH',
    actorColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  },
  {
    id: 'n3',
    type: 'task' as const,
    title: 'Deadline tugas mendekat',
    body: '"Revisi Landing Page" jatuh tempo hari ini pukul 17:00',
    time: '30 min ago',
    read: false,
    actor: 'CD',
    actorColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
  },
  {
    id: 'n4',
    type: 'chat' as const,
    title: 'Pesan baru di #general',
    body: 'Eka Wulandari: "Meeting sprint planning jam 9 ya semua!"',
    time: '1 hr ago',
    read: true,
    actor: 'EW',
    actorColor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400',
  },
  {
    id: 'n5',
    type: 'system' as const,
    title: 'GoWa connection restored',
    body: 'WhatsApp integration is back online and sending reminders',
    time: '2 hr ago',
    read: true,
    actor: 'SYS',
    actorColor: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  },
];

const typeIconMap = {
  task: <CheckSquare size={12} />,
  mention: <Users size={12} />,
  chat: <MessageSquare size={12} />,
  system: <Settings size={12} />,
};

export default function Topbar({ title, subtitle, onMobileMenuToggle }: TopbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(recentNotifications);
  const { t, theme, toggleTheme, language, setLanguage } = useApp();
  const router = useRouter();

  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-border dark:border-gray-700 flex items-center gap-3 px-4 md:px-6 shrink-0 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden w-9 h-9 rounded-lg hover:bg-muted dark:hover:bg-gray-800 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[15px] md:text-[17px] font-semibold text-foreground dark:text-white truncate">{title}</h1>
        {subtitle && (
          <p className="text-[11px] md:text-[12px] text-muted-foreground dark:text-gray-400 truncate hidden sm:block">{subtitle}</p>
        )}
      </div>

      {/* Search - hidden on small screens */}
      <div
        className={`hidden md:flex items-center gap-2 bg-muted dark:bg-gray-800 rounded-lg px-3 py-1.5 transition-all duration-200 ${
          searchFocused ? 'ring-2 ring-primary/30 bg-white dark:bg-gray-700' : ''
        }`}
      >
        <Search size={14} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder={t.common.search}
          className="bg-transparent text-[13px] text-foreground dark:text-white placeholder:text-muted-foreground outline-none w-36 lg:w-48"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Gotify status - hidden on small screens */}
      <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-dot" />
        <span className="text-[11px] font-medium text-green-700 dark:text-green-400">{t.common.gotifyLive}</span>
      </div>

      {/* WA status - hidden on small screens */}
      <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
        <MessageSquare size={12} className="text-emerald-600 dark:text-emerald-400" />
        <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">{t.common.waConnected}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Language selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="w-9 h-9 rounded-lg hover:bg-muted dark:hover:bg-gray-800 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
            aria-label="Change language"
          >
            <Globe size={17} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl shadow-dropdown py-1 z-50 min-w-[130px]">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-muted dark:hover:bg-gray-700 transition-colors duration-150 ${
                    language === lang.code ? 'text-primary font-medium' : 'text-foreground dark:text-white'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg hover:bg-muted dark:hover:bg-gray-800 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
          aria-label={t.theme.toggle}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-lg hover:bg-muted dark:hover:bg-gray-800 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] z-50 overflow-hidden animate-fade-in">
              {/* Dropdown header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Bell size={15} className="text-foreground dark:text-white" />
                  <span className="text-[13.5px] font-semibold text-foreground dark:text-white">Notifikasi</span>
                  {unreadCount > 0 && (
                    <span className="bg-primary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 px-2 py-1 text-[11.5px] text-primary hover:bg-primary/10 rounded-lg transition-colors duration-150 font-medium"
                    >
                      <CheckCheck size={12} />
                      Tandai baca
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Notification list */}
              <div className="max-h-[360px] overflow-y-auto scrollbar-thin divide-y divide-border dark:divide-gray-700">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors duration-150 cursor-pointer ${
                      !notif.read
                        ? 'bg-primary/3 dark:bg-primary/8 hover:bg-primary/6 dark:hover:bg-primary/12'
                        : 'hover:bg-muted/50 dark:hover:bg-gray-800/60'
                    }`}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                      );
                      setNotifOpen(false);
                      if (notif.type === 'task') router.push('/task-management');
                      else if (notif.type === 'chat' || notif.type === 'mention') router.push('/real-time-chat');
                      else router.push('/settings');
                    }}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${notif.actorColor}`}>
                      {notif.actor === 'SYS' ? <Settings size={13} /> : notif.actor}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-muted-foreground dark:text-gray-400">
                            {typeIconMap[notif.type]}
                          </span>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                          )}
                        </div>
                        <span className="text-[10.5px] text-muted-foreground dark:text-gray-500 shrink-0 tabular-nums">{notif.time}</span>
                      </div>
                      <p className="text-[12.5px] font-semibold text-foreground dark:text-white leading-snug mb-0.5">{notif.title}</p>
                      <p className="text-[11.5px] text-muted-foreground dark:text-gray-400 leading-relaxed line-clamp-2">{notif.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All */}
              <div className="border-t border-border dark:border-gray-700 p-2.5">
                <Link
                  href="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-[13px] font-semibold text-primary hover:bg-primary/8 dark:hover:bg-primary/15 rounded-xl transition-colors duration-150"
                >
                  <Bell size={14} />
                  Lihat Semua Notifikasi
                </Link>
              </div>
            </div>
          )}
        </div>

        <button
          className="relative w-9 h-9 rounded-lg hover:bg-muted dark:hover:bg-gray-800 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
          title="Quick actions"
          onClick={() => {}}
        >
          <Zap size={18} />
        </button>

        {/* User Profile */}
        <div className="relative ml-1" ref={profileRef}>
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/30 transition-colors duration-150 ring-2 ring-transparent focus-within:ring-primary/50"
          >
            <span className="text-primary text-[11px] font-bold">AS</span>
          </div>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl shadow-dropdown z-50 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-border dark:border-gray-700 bg-muted/30 dark:bg-gray-900/50">
                <p className="text-[13px] font-semibold text-foreground dark:text-white">Andi Susanto</p>
                <p className="text-[11px] text-muted-foreground">Manager</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => { setProfileOpen(false); router.push('/settings'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium text-foreground dark:text-white hover:bg-muted dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <User size={14} className="text-muted-foreground" />
                  Edit Profile
                </button>
                <div className="my-1 border-t border-border dark:border-gray-700" />
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    // Add logout logic here later
                    console.log('logout');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium text-destructive hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}