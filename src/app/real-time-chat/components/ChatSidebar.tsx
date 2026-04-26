'use client';

import React, { useState } from 'react';
import { Hash, Plus, Search, ChevronDown, ChevronRight, X } from 'lucide-react';
import { ChatChannel } from './chatTypes';
import { toast } from 'sonner';

interface Props {
  channels: ChatChannel[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose?: () => void;
}

function formatTime(ts?: string) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date('2026-04-26T09:29:08');
  const diff = Math.round((now.getTime() - d.getTime()) / 60000);
  if (diff < 60) return `${diff}m`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h`;
  return `${Math.floor(diff / 1440)}d`;
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

export default function ChatSidebar({ channels, activeId, onSelect, onClose }: Props) {
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);
  const [search, setSearch] = useState('');

  const groupChannels = channels.filter((c) => c.type === 'channel');
  const dmChannels = channels.filter((c) => c.type === 'dm');

  const filteredChannels = groupChannels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredDms = dmChannels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-64 shrink-0 bg-white dark:bg-gray-900 border-r border-border dark:border-gray-700 flex flex-col h-full">
      {/* Search + close */}
      <div className="p-3 border-b border-border dark:border-gray-700 flex items-center gap-2">
        <div className="flex items-center gap-2 bg-muted dark:bg-gray-800 rounded-lg px-2.5 py-1.5 flex-1">
          <Search size={12} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels..."
            className="bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground flex-1 dark:text-white"
          />
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {/* Channels section */}
        <div className="mb-1">
          <button
            onClick={() => setChannelsOpen((p) => !p)}
            className="w-full flex items-center gap-1.5 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
          >
            {channelsOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            Channels
            <span className="ml-auto text-[10px] bg-muted dark:bg-gray-800 px-1.5 rounded-full text-muted-foreground">
              {groupChannels.reduce((s, c) => s + c.unreadCount, 0) > 0
                ? groupChannels.reduce((s, c) => s + c.unreadCount, 0)
                : ''}
            </span>
          </button>

          {channelsOpen && (
            <div className="mt-0.5">
              {filteredChannels.map((ch) => (
                <button
                  key={`ch-item-${ch.id}`}
                  onClick={() => onSelect(ch.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-all duration-150 group ${
                    activeId === ch.id
                      ? 'bg-primary/10 dark:bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:bg-muted dark:hover:bg-gray-800 hover:text-foreground dark:hover:text-white'
                  }`}
                >
                  <Hash size={13} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[13px] truncate ${ch.unreadCount > 0 ? 'font-semibold text-foreground dark:text-white' : ''}`}>
                        {ch.name}
                      </span>
                      {ch.lastMessageTime && (
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatTime(ch.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    {ch.lastMessage && (
                      <p className="text-[11px] text-muted-foreground truncate">{ch.lastMessage}</p>
                    )}
                  </div>
                  {ch.unreadCount > 0 && (
                    <span className="ml-1 bg-primary text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center shrink-0 tabular-nums">
                      {ch.unreadCount}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={() => toast.info('Add channel feature coming soon')}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
              >
                <Plus size={12} />
                Add channel
              </button>
            </div>
          )}
        </div>

        {/* DMs section */}
        <div className="mt-3">
          <button
            onClick={() => setDmsOpen((p) => !p)}
            className="w-full flex items-center gap-1.5 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
          >
            {dmsOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            Direct Messages
          </button>

          {dmsOpen && (
            <div className="mt-0.5">
              {filteredDms.map((dm) => {
                const member = dm.members?.[0];
                return (
                  <button
                    key={`dm-item-${dm.id}`}
                    onClick={() => onSelect(dm.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-all duration-150 ${
                      activeId === dm.id
                        ? 'bg-primary/10 dark:bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-muted dark:hover:bg-gray-800 hover:text-foreground dark:hover:text-white'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold ${member ? avatarColors[member.avatar] || 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-600'}`}>
                        {member?.avatar || '?'}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-gray-900 ${dm.online ? 'bg-green-500' : 'bg-slate-300'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[13px] truncate ${dm.unreadCount > 0 ? 'font-semibold text-foreground dark:text-white' : ''}`}>
                          {dm.name}
                        </span>
                        {dm.lastMessageTime && (
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {formatTime(dm.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      {dm.lastMessage && (
                        <p className="text-[11px] text-muted-foreground truncate">{dm.lastMessage}</p>
                      )}
                    </div>
                    {dm.unreadCount > 0 && (
                      <span className="ml-1 bg-primary text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                        {dm.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => toast.info('New message feature coming soon')}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
              >
                <Plus size={12} />
                New message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}