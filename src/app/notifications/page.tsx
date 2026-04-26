'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useApp } from '@/lib/AppContext';
import { Bell, CheckSquare, MessageSquare, AlertTriangle, Settings, Users, Check, Trash2,  } from 'lucide-react';

interface Notification {
  id: string;
  type: 'task' | 'mention' | 'system' | 'chat';
  title: string;
  titleId: string;
  body: string;
  bodyId: string;
  time: string;
  read: boolean;
  actor: string;
  actorAvatar: string;
  actorColor: string;
}

const initialNotifications: Notification[] = [
  { id: 'n1', type: 'task', title: 'Task assigned to you', titleId: 'Tugas ditugaskan ke kamu', body: 'Andi Susanto assigned "Setup Supabase RLS" to you', bodyId: 'Andi Susanto menugaskan "Setup Supabase RLS" ke kamu', time: '2 min ago', read: false, actor: 'AS', actorAvatar: 'AS', actorColor: 'bg-blue-100 text-blue-700' },
  { id: 'n2', type: 'mention', title: 'You were mentioned', titleId: 'Kamu disebut', body: 'Budi Hartono mentioned you in #dev-backend: "@Andi please review this PR"', bodyId: 'Budi Hartono menyebut kamu di #dev-backend: "@Andi tolong review PR ini"', time: '15 min ago', read: false, actor: 'BH', actorAvatar: 'BH', actorColor: 'bg-violet-100 text-violet-700' },
  { id: 'n3', type: 'task', title: 'Task deadline approaching', titleId: 'Deadline tugas mendekat', body: '"Revisi Landing Page" is due today at 17:00', bodyId: '"Revisi Landing Page" jatuh tempo hari ini pukul 17:00', time: '30 min ago', read: false, actor: 'CD', actorAvatar: 'CD', actorColor: 'bg-pink-100 text-pink-700' },
  { id: 'n4', type: 'chat', title: 'New message in #general', titleId: 'Pesan baru di #general', body: 'Eka Wulandari: "Meeting sprint planning jam 9 ya semua!"', bodyId: 'Eka Wulandari: "Meeting sprint planning jam 9 ya semua!"', time: '1 h ago', read: true, actor: 'EW', actorAvatar: 'EW', actorColor: 'bg-teal-100 text-teal-700' },
  { id: 'n5', type: 'system', title: 'GoWa connection restored', titleId: 'Koneksi GoWa dipulihkan', body: 'WhatsApp integration is back online and sending reminders', bodyId: 'Integrasi WhatsApp kembali online dan mengirim reminder', time: '2 h ago', read: true, actor: 'SYS', actorAvatar: 'SYS', actorColor: 'bg-green-100 text-green-700' },
  { id: 'n6', type: 'task', title: 'Task completed', titleId: 'Tugas selesai', body: 'Farhan Rizki completed "Optimasi query database"', bodyId: 'Farhan Rizki menyelesaikan "Optimasi query database"', time: '3 h ago', read: true, actor: 'FR', actorAvatar: 'FR', actorColor: 'bg-orange-100 text-orange-700' },
  { id: 'n7', type: 'mention', title: 'You were mentioned', titleId: 'Kamu disebut', body: 'Dimas Pratama mentioned you in task comments', bodyId: 'Dimas Pratama menyebut kamu di komentar tugas', time: '5 h ago', read: true, actor: 'DP', actorAvatar: 'DP', actorColor: 'bg-amber-100 text-amber-700' },
  { id: 'n8', type: 'system', title: 'New team member joined', titleId: 'Anggota tim baru bergabung', body: 'Hendra Wijaya joined TeamFlow as Employee', bodyId: 'Hendra Wijaya bergabung ke TeamFlow sebagai Karyawan', time: '1 d ago', read: true, actor: 'HW', actorAvatar: 'HW', actorColor: 'bg-indigo-100 text-indigo-700' },
  { id: 'n9', type: 'task', title: 'Task overdue', titleId: 'Tugas terlambat', body: '"Dokumentasi API endpoint" is 2 days overdue', bodyId: '"Dokumentasi API endpoint" terlambat 2 hari', time: '1 d ago', read: true, actor: 'DP', actorAvatar: 'DP', actorColor: 'bg-amber-100 text-amber-700' },
  { id: 'n10', type: 'chat', title: 'New DM from Citra', titleId: 'DM baru dari Citra', body: 'Citra Dewi: "Bisa bantu review desain baru?"', bodyId: 'Citra Dewi: "Bisa bantu review desain baru?"', time: '2 d ago', read: true, actor: 'CD', actorAvatar: 'CD', actorColor: 'bg-pink-100 text-pink-700' },
];

const typeConfig = {
  task: { icon: <CheckSquare size={14} />, className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' },
  mention: { icon: <Users size={14} />, className: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400' },
  chat: { icon: <MessageSquare size={14} />, className: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400' },
  system: { icon: <Settings size={14} />, className: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' },
};

type FilterKey = 'all' | 'unread' | 'mention' | 'task' | 'system';

export default function NotificationsPage() {
  const { t, language } = useApp();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: t.notifications.allNotifications },
    { key: 'unread', label: t.notifications.unread },
    { key: 'mention', label: t.notifications.mentions },
    { key: 'task', label: t.notifications.tasks },
    { key: 'system', label: t.notifications.system },
  ];

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'mention') return n.type === 'mention';
    if (activeFilter === 'task') return n.type === 'task';
    if (activeFilter === 'system') return n.type === 'system';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clearAll = () => setNotifications([]);

  return (
    <AppLayout title={t.notifications.title} subtitle={t.notifications.subtitle}>
      <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-foreground dark:text-white" />
            <span className="text-[14px] font-semibold text-foreground dark:text-white">
              {t.notifications.title}
            </span>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-[11px] font-semibold px-2 py-0.5 rounded-full tabular-nums">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border dark:border-gray-700 rounded-lg text-[12.5px] text-foreground dark:text-white hover:bg-muted dark:hover:bg-gray-800 transition-colors duration-150"
              >
                <Check size={13} />
                {t.notifications.markAllRead}
              </button>
            )}
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border dark:border-gray-700 rounded-lg text-[12.5px] text-destructive hover:bg-destructive/5 transition-colors duration-150"
            >
              <Trash2 size={13} />
              {t.notifications.clearAll}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 mb-5 border-b border-border dark:border-gray-700 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border-b-2 transition-colors duration-150 whitespace-nowrap ${
                activeFilter === f.key
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground dark:hover:text-white'
              }`}
            >
              {f.label}
              {f.key === 'unread' && unreadCount > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bell size={48} className="text-muted-foreground/30 mb-4" />
            <p className="text-[14px] font-medium text-foreground dark:text-white mb-1">{t.notifications.noNotifications}</p>
            <p className="text-[13px] text-muted-foreground">{t.notifications.noNotificationsDesc}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((notif) => {
              const cfg = typeConfig[notif.type];
              const title = language === 'id' ? notif.titleId : notif.title;
              const body = language === 'id' ? notif.bodyId : notif.body;
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-150 group ${
                    !notif.read
                      ? 'bg-primary/3 border-primary/20 dark:bg-primary/5 dark:border-primary/20' :'bg-white dark:bg-gray-900 border-border dark:border-gray-700 hover:bg-muted/20 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${notif.actorColor}`}>
                    {notif.actorAvatar === 'SYS' ? <AlertTriangle size={14} /> : notif.actorAvatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-full ${cfg.className}`}>
                            {cfg.icon}
                            {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                          </span>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                          )}
                        </div>
                        <p className="text-[13.5px] font-semibold text-foreground dark:text-white mb-0.5">{title}</p>
                        <p className="text-[12.5px] text-muted-foreground leading-relaxed">{body}</p>
                        <p className="text-[11px] text-muted-foreground mt-1.5">{notif.time}</p>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {!notif.read && (
                          <button
                            onClick={() => markRead(notif.id)}
                            className="w-7 h-7 rounded-lg hover:bg-muted dark:hover:bg-gray-700 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-150"
                            title={t.notifications.markAllRead}
                          >
                            <Check size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotif(notif.id)}
                          className="w-7 h-7 rounded-lg hover:bg-muted dark:hover:bg-gray-700 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors duration-150"
                          title={t.common.delete}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
