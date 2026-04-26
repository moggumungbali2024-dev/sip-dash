'use client';

import React from 'react';
import {
  CheckCircle2,
  PlusCircle,
  ArrowRightCircle,
  AlertTriangle,
  MessageCircle,
  Upload,
  UserPlus,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { ActivityItem, ActivityType } from './activityTypes';
import EmptyState from '@/components/ui/EmptyState';

interface Props {
  activities: ActivityItem[];
}

const typeConfig: Record<ActivityType, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
  task_completed: { icon: <CheckCircle2 size={14} />, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Completed' },
  task_created: { icon: <PlusCircle size={14} />, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Created' },
  task_updated: { icon: <ArrowRightCircle size={14} />, color: 'text-amber-600', bgColor: 'bg-amber-100', label: 'Updated' },
  task_assigned: { icon: <UserPlus size={14} />, color: 'text-violet-600', bgColor: 'bg-violet-100', label: 'Assigned' },
  task_overdue: { icon: <AlertTriangle size={14} />, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Overdue' },
  comment_added: { icon: <MessageCircle size={14} />, color: 'text-slate-600', bgColor: 'bg-slate-100', label: 'Comment' },
  file_uploaded: { icon: <Upload size={14} />, color: 'text-teal-600', bgColor: 'bg-teal-100', label: 'File' },
  status_changed: { icon: <ArrowRightCircle size={14} />, color: 'text-amber-600', bgColor: 'bg-amber-100', label: 'Status' },
  wa_sent: { icon: <MessageSquare size={14} />, color: 'text-emerald-600', bgColor: 'bg-emerald-100', label: 'WA Sent' },
  chat_message: { icon: <MessageCircle size={14} />, color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Chat' },
};

const avatarColors: Record<string, string> = {
  AS: 'bg-blue-100 text-blue-700',
  BH: 'bg-violet-100 text-violet-700',
  CD: 'bg-pink-100 text-pink-700',
  DP: 'bg-amber-100 text-amber-700',
  EW: 'bg-teal-100 text-teal-700',
  FR: 'bg-orange-100 text-orange-700',
  GP: 'bg-green-100 text-green-700',
  HW: 'bg-indigo-100 text-indigo-700',
};

function formatRelativeTime(ts: string) {
  const now = new Date('2026-04-26T09:29:08');
  const t = new Date(ts);
  const diff = Math.round((now.getTime() - t.getTime()) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  const hrs = Math.floor(diff / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ActivityTimeline({ activities }: Props) {
  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card">
        <EmptyState
          icon={Zap}
          title="No activity matches your filters"
          description="Try selecting a different team member or activity type to see their actions."
          action={{ label: 'Show All Activity', onClick: () => {} }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-dot" />
          <h3 className="text-[13.5px] font-semibold text-foreground dark:text-white">Live Activity Feed</h3>
          <span className="text-[11px] text-muted-foreground bg-muted dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {activities.length} events
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">Today, Apr 26</span>
      </div>

      {/* Timeline */}
      <div className="divide-y divide-border dark:divide-gray-700 max-h-[600px] overflow-y-auto scrollbar-thin">
        {activities.map((act) => {
          const cfg = typeConfig[act.type];
          return (
            <div
              key={act.id}
              className={`flex gap-3.5 px-5 py-3.5 hover:bg-muted/30 dark:hover:bg-gray-800/40 transition-colors duration-150 animate-slide-up ${
                act.type === 'task_overdue' ? 'bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold ${avatarColors[act.actor.avatar] || 'bg-slate-100 text-slate-600'}`}>
                  {act.actor.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center ${cfg.bgColor} ${cfg.color} border border-white dark:border-gray-900`}
                  style={{ width: 16, height: 16 }}>
                  {cfg.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-foreground dark:text-white leading-snug">
                      <span className="font-semibold">{act.actor.name}</span>
                      {' '}
                      <span className="text-muted-foreground">{act.description}</span>
                      {act.taskRef && (
                        <>
                          {' '}
                          <span className="font-medium text-primary truncate">
                            "{act.taskRef.title}"
                          </span>
                        </>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {act.project && (
                        <span className="text-[10px] bg-muted dark:bg-gray-800 text-muted-foreground px-1.5 py-0.5 rounded">
                          {act.project}
                        </span>
                      )}
                      {act.meta?.comment && (
                        <span className="text-[11px] text-muted-foreground italic truncate max-w-[280px]">
                          "{act.meta.comment}"
                        </span>
                      )}
                      {act.meta?.files && (
                        <span className="text-[11px] text-teal-600 truncate max-w-[200px]">
                          📎 {act.meta.files}
                        </span>
                      )}
                      {act.meta?.channel && (
                        <span className="text-[11px] text-indigo-600">{act.meta.channel}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums shrink-0 mt-0.5">
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>

                {/* WA / Gotify badges */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  {act.waSent && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                      <MessageSquare size={9} />
                      WA Sent
                    </span>
                  )}
                  {act.gotifyPushed && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-violet-700 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded-full">
                      <Zap size={9} />
                      Gotify Push
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}