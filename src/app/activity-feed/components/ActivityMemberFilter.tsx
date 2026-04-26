'use client';

import React from 'react';

interface Member {
  id: string;
  name: string;
  avatar: string;
}

interface Props {
  members: Member[];
  selected: string;
  onChange: (id: string) => void;
}

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

export default function ActivityMemberFilter({ members, selected, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onChange('all')}
        className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-all duration-150 ${
          selected === 'all' ?'bg-foreground text-white border-foreground dark:border-gray-500' :'bg-white dark:bg-gray-900 text-muted-foreground dark:text-gray-400 border-border dark:border-gray-700 hover:bg-muted dark:hover:bg-gray-800'
        }`}
      >
        All Members
      </button>
      {members.map((m) => (
        <button
          key={`member-chip-${m.id}`}
          onClick={() => onChange(m.id)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium rounded-lg border transition-all duration-150 ${
            selected === m.id
              ? 'bg-foreground text-white border-foreground dark:border-gray-500'
              : 'bg-white dark:bg-gray-900 text-muted-foreground dark:text-gray-400 border-border dark:border-gray-700 hover:bg-muted dark:hover:bg-gray-800'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold ${selected === m.id ? 'bg-white/20 text-white' : avatarColors[m.avatar]}`}>
            {m.avatar}
          </span>
          <span className="hidden sm:inline">{m.name.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  );
}