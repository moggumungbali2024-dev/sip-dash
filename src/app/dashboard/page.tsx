'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useApp } from '@/lib/AppContext';
import {
  CheckSquare, Clock, AlertTriangle, Users, TrendingUp,
  MessageSquare, Activity, ArrowUpRight, Circle,
} from 'lucide-react';
import Link from 'next/link';

const statusConfig: Record<string, { label: string; className: string }> = {
  todo: { label: 'To Do', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  review: { label: 'Review', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  done: { label: 'Done', className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
};

const priorityConfig: Record<string, { className: string }> = {
  high: { className: 'text-red-500' },
  medium: { className: 'text-amber-500' },
  low: { className: 'text-slate-400' },
};

const recentTasks = [
  { id: 't1', title: 'Revisi desain landing page', assignee: 'Citra Dewi', avatar: 'CD', status: 'in_progress', priority: 'high', due: 'Hari ini' },
  { id: 't2', title: 'Setup Supabase RLS policies', assignee: 'Andi Susanto', avatar: 'AS', status: 'review', priority: 'high', due: 'Besok' },
  { id: 't3', title: 'Testing integrasi GoWa', assignee: 'Budi Hartono', avatar: 'BH', status: 'in_progress', priority: 'medium', due: '28 Apr' },
  { id: 't4', title: 'Dokumentasi API endpoint', assignee: 'Dimas Pratama', avatar: 'DP', status: 'todo', priority: 'low', due: '30 Apr' },
  { id: 't5', title: 'Optimasi query database', assignee: 'Farhan Rizki', avatar: 'FR', status: 'todo', priority: 'medium', due: '1 Mei' },
];

const recentActivity = [
  { id: 'a1', actor: 'Eka Wulandari', avatar: 'EW', action: 'menyelesaikan task', target: 'Setup Gotify server', time: '9 menit lalu', color: 'bg-teal-100 text-teal-700' },
  { id: 'a2', actor: 'Budi Hartono', avatar: 'BH', action: 'mengirim WA reminder ke', target: 'Dimas Pratama', time: '22 menit lalu', color: 'bg-violet-100 text-violet-700' },
  { id: 'a3', actor: 'Citra Dewi', avatar: 'CD', action: 'mengupload file ke', target: 'Dokumen Desain', time: '41 menit lalu', color: 'bg-pink-100 text-pink-700' },
  { id: 'a4', actor: 'Andi Susanto', avatar: 'AS', action: 'membuat task baru', target: 'Integrasi Stripe', time: '1 jam lalu', color: 'bg-blue-100 text-blue-700' },
];

export default function DashboardPage() {
  const { t } = useApp();

  const statCards = [
    { id: 'stat-tasks-active', label: t.dashboard.activeTasks, value: '24', change: '+3 this week', trend: 'up', icon: <CheckSquare size={18} />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { id: 'stat-tasks-overdue', label: t.dashboard.overdueTasks, value: '5', change: '2 critical', trend: 'down', icon: <AlertTriangle size={18} />, color: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
    { id: 'stat-team-online', label: t.dashboard.teamOnline, value: '6 / 8', change: '3 active now', trend: 'up', icon: <Users size={18} />, color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
    { id: 'stat-completion', label: t.dashboard.completionRate, value: '78%', change: '+5% vs last week', trend: 'up', icon: <TrendingUp size={18} />, color: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' },
  ];

  const quickLinks = [
    { href: '/task-management', label: t.nav.taskManagement, icon: <CheckSquare size={16} />, desc: '24 tasks aktif' },
    { href: '/activity-feed', label: t.nav.activityFeed, icon: <Activity size={16} />, desc: '18 aktivitas hari ini' },
    { href: '/real-time-chat', label: t.nav.realTimeChat, icon: <MessageSquare size={16} />, desc: '7 pesan belum dibaca' },
    { href: '/calendar', label: t.nav.calendar, icon: <Clock size={16} />, desc: '3 jadwal minggu ini' },
  ];

  return (
    <AppLayout title={t.dashboard.title} subtitle={t.dashboard.subtitle}>
      <div className="p-4 md:p-6 max-w-screen-2xl mx-auto space-y-5 md:space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
          {statCards.map((card) => (
            <div key={card.id} className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl p-3 md:p-4 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
                <span className={`text-[10px] md:text-[11px] font-medium px-1.5 md:px-2 py-0.5 rounded-full ${card.trend === 'up' ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {card.change}
                </span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white tabular-nums">{card.value}</p>
              <p className="text-[11px] md:text-[12px] text-muted-foreground mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 md:gap-6">
          {/* Recent Tasks */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
            <div className="px-4 md:px-5 py-3.5 border-b border-border dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-[13.5px] font-semibold text-foreground dark:text-white">{t.dashboard.recentTasks}</h2>
              <Link href="/task-management" className="flex items-center gap-1 text-[12px] text-primary hover:underline font-medium">
                Lihat semua <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-border dark:divide-gray-700">
              {recentTasks.map((task) => {
                const status = statusConfig[task.status];
                const priority = priorityConfig[task.priority];
                return (
                  <div key={task.id} className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-muted/30 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <Circle size={8} className={`shrink-0 ${priority.className} fill-current`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-foreground dark:text-white truncate">{task.title}</p>
                      <p className="text-[11px] text-muted-foreground">{task.assignee} · Due {task.due}</p>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
              <div className="px-4 py-3.5 border-b border-border dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-[13.5px] font-semibold text-foreground dark:text-white">{t.dashboard.recentActivity}</h2>
                <Link href="/activity-feed" className="flex items-center gap-1 text-[12px] text-primary hover:underline font-medium">
                  Semua <ArrowUpRight size={13} />
                </Link>
              </div>
              <div className="divide-y divide-border dark:divide-gray-700">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${item.color}`}>
                      {item.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-foreground dark:text-white leading-snug">
                        <span className="font-medium">{item.actor}</span>{' '}
                        <span className="text-muted-foreground">{item.action}</span>{' '}
                        <span className="font-medium">{item.target}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
              <div className="px-4 py-3.5 border-b border-border dark:border-gray-700">
                <h2 className="text-[13.5px] font-semibold text-foreground dark:text-white">{t.dashboard.quickAccess}</h2>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex flex-col gap-1.5 p-3 rounded-lg border border-border dark:border-gray-700 hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/30 transition-all duration-150 group"
                  >
                    <span className="text-muted-foreground group-hover:text-primary transition-colors duration-150">{link.icon}</span>
                    <p className="text-[12px] font-medium text-foreground dark:text-white">{link.label}</p>
                    <p className="text-[11px] text-muted-foreground">{link.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
