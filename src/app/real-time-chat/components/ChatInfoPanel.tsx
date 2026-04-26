'use client';

import React, { useState } from 'react';
import { Hash, Users, FileText, Image as ImageIcon, Link, MessageSquare, Zap, X } from 'lucide-react';
import { ChatChannel } from './chatTypes';
import { toast } from 'sonner';

interface Props {
  channel: ChatChannel;
  onClose?: () => void;
}

const avatarColors: Record<string, string> = {
  AS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  BH: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  CD: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
  DP: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  EW: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400',
  FR: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  GP: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  HW: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
};

const sharedFiles = [
  { id: 'file-001', name: 'rls-policy-diff.png', size: '184 KB', type: 'image' as const, sharedBy: 'Budi Hartono', time: '12 min ago' },
  { id: 'file-002', name: 'coolify-health-check.pdf', size: '42 KB', type: 'pdf' as const, sharedBy: 'Budi Hartono', time: '2 hr ago' },
  { id: 'file-003', name: 'Q1_Surabaya_Pipeline.xlsx', size: '1.2 MB', type: 'doc' as const, sharedBy: 'Farhan Rizki', time: 'Yesterday' },
];

type PanelTab = 'members' | 'files';

export default function ChatInfoPanel({ channel, onClose }: Props) {
  const [tab, setTab] = useState<PanelTab>('members');

  const isDm = channel.type === 'dm';
  const dmMember = channel.members?.[0];

  return (
    <div className="w-64 shrink-0 bg-white dark:bg-gray-900 border-l border-border dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-border dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          {isDm ? (
            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold ${dmMember ? avatarColors[dmMember.avatar] || 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-600'}`}>
                {dmMember?.avatar || '?'}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${channel.online ? 'bg-green-500' : 'bg-slate-300'}`} />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <Hash size={18} className="text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-semibold text-foreground dark:text-white truncate">
              {isDm ? channel.name : `#${channel.name}`}
            </p>
            {isDm ? (
              <p className="text-[11px] text-muted-foreground dark:text-gray-400">
                {dmMember?.role} · {channel.online ? 'Online' : dmMember?.lastSeen}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground dark:text-gray-400">{channel.memberCount} members</p>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Description */}
        {channel.description && (
          <p className="text-[11.5px] text-muted-foreground dark:text-gray-400 leading-relaxed">{channel.description}</p>
        )}

        {/* WA Bridge status */}
        <div className={`flex items-center gap-2 mt-3 px-2.5 py-2 rounded-lg border ${channel.waBridge ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-muted dark:bg-gray-800 border-border dark:border-gray-700'}`}>
          <MessageSquare size={13} className={channel.waBridge ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'} />
          <div className="flex-1">
            <p className={`text-[11.5px] font-medium ${channel.waBridge ? 'text-emerald-800 dark:text-emerald-300' : 'text-muted-foreground dark:text-gray-400'}`}>
              WA Bridge
            </p>
            <p className={`text-[10.5px] ${channel.waBridge ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground dark:text-gray-500'}`}>
              {channel.waBridge ? 'Active — GoWa mirroring on' : 'Inactive'}
            </p>
          </div>
          <span className={`w-2 h-2 rounded-full ${channel.waBridge ? 'bg-emerald-500 animate-pulse-dot' : 'bg-slate-300 dark:bg-gray-600'}`} />
        </div>

        {/* Gotify */}
        <div className="flex items-center gap-2 mt-2 px-2.5 py-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800">
          <Zap size={13} className="text-violet-600 dark:text-violet-400" />
          <div className="flex-1">
            <p className="text-[11.5px] font-medium text-violet-800 dark:text-violet-300">Gotify Push</p>
            <p className="text-[10.5px] text-violet-600 dark:text-violet-400">New messages trigger browser push</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-dot" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border dark:border-gray-700">
        {([
          { key: 'members' as PanelTab, label: 'Members', icon: <Users size={13} /> },
          { key: 'files' as PanelTab, label: 'Files', icon: <FileText size={13} /> },
        ] as const).map((t) => (
          <button
            key={`info-tab-${t.key}`}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-medium border-b-2 transition-colors duration-150 ${
              tab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground dark:hover:text-white'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {tab === 'members' && (
          <div className="py-2">
            {(channel.members || []).map((m) => (
              <div
                key={`info-member-${m.id}`}
                className="flex items-center gap-2.5 px-4 py-2 hover:bg-muted/40 dark:hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer"
              >
                <div className="relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold ${avatarColors[m.avatar] || 'bg-slate-100 text-slate-600'}`}>
                    {m.avatar}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-gray-900 ${m.online ? 'bg-green-500' : 'bg-slate-300 dark:bg-gray-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-medium text-foreground dark:text-white truncate">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground dark:text-gray-400">{m.role}</p>
                </div>
                {m.online && (
                  <span className="text-[10px] text-green-600 dark:text-green-400 font-medium shrink-0">Online</span>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'files' && (
          <div className="py-2">
            {sharedFiles.map((f) => (
              <div
                key={`info-file-${f.id}`}
                className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-muted/40 dark:hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer group"
                onClick={() => toast.info(`Opening ${f.name}`)}
              >
                <div className="w-8 h-8 rounded-lg bg-muted dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-150">
                  {f.type === 'image' ? (
                    <ImageIcon size={14} className="text-muted-foreground group-hover:text-primary" />
                  ) : f.type === 'pdf' ? (
                    <FileText size={14} className="text-red-500" />
                  ) : (
                    <FileText size={14} className="text-teal-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-foreground dark:text-white truncate">{f.name}</p>
                  <p className="text-[10.5px] text-muted-foreground dark:text-gray-400">{f.size} · {f.sharedBy}</p>
                  <p className="text-[10px] text-muted-foreground dark:text-gray-500">{f.time}</p>
                </div>
              </div>
            ))}
            <div className="px-4 py-3 border-t border-border dark:border-gray-700 mt-2">
              <button
                onClick={() => toast.info('Opening full document storage')}
                className="w-full flex items-center justify-center gap-1.5 text-[12px] text-primary font-medium hover:text-primary/80 transition-colors duration-150"
              >
                <Link size={12} />
                View all files in Docs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}