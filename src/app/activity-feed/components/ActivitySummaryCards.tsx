'use client';

import React from 'react';
import { Users, CheckCircle2, RefreshCw, MessageSquare, AlertTriangle, Zap } from 'lucide-react';
import { mockSummary } from './activityMockData';

export default function ActivitySummaryCards() {
  const cards = [
    {
      id: 'sum-active',
      label: 'Active Members',
      value: mockSummary?.activeMembers,
      total: 8,
      icon: <Users size={16} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-100',
      sub: 'of 8 online today',
    },
    {
      id: 'sum-updated',
      label: 'Tasks Updated',
      value: mockSummary?.tasksUpdated,
      icon: <RefreshCw size={16} />,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-100',
      sub: 'since midnight',
    },
    {
      id: 'sum-done',
      label: 'Completed Today',
      value: mockSummary?.completions,
      icon: <CheckCircle2 size={16} />,
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-100',
      iconBg: 'bg-green-100',
      sub: 'tasks marked Done',
    },
    {
      id: 'sum-wa',
      label: 'WA Reminders Sent',
      value: mockSummary?.waRemindersSent,
      icon: <MessageSquare size={16} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-100',
      sub: 'via GoWa today',
    },
    {
      id: 'sum-overdue',
      label: 'Overdue Alerts',
      value: mockSummary?.overdueAlerts,
      icon: <AlertTriangle size={16} />,
      color: 'text-red-600',
      bg: 'bg-red-50 border-red-200',
      iconBg: 'bg-red-100',
      sub: 'need immediate action',
      alert: true,
    },
    {
      id: 'sum-gotify',
      label: 'Push Notifications',
      value: 12,
      icon: <Zap size={16} />,
      color: 'text-violet-600',
      bg: 'bg-violet-50 border-violet-100',
      iconBg: 'bg-violet-100',
      sub: 'delivered via Gotify',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards?.map((c) => (
        <div
          key={c?.id}
          className={`${c?.bg} border rounded-xl p-4 flex flex-col gap-2 shadow-card`}
        >
          <div className="flex items-center justify-between">
            <div className={`${c?.iconBg} p-1.5 rounded-lg ${c?.color}`}>
              {c?.icon}
            </div>
            {c?.alert && c?.value > 0 && (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse-dot" />
            )}
          </div>
          <div>
            <p className={`text-[28px] font-700 tabular-nums leading-none ${c?.color}`}>{c?.value}</p>
            <p className="text-[12px] font-medium text-foreground dark:text-white mt-1">{c?.label}</p>
            <p className="text-[11px] text-muted-foreground">{c?.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}