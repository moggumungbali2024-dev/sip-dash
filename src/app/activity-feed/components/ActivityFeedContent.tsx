'use client';

import React, { useState } from 'react';
import ActivitySummaryCards from './ActivitySummaryCards';
import ActivityTimeline from './ActivityTimeline';
import ActivityMemberFilter from './ActivityMemberFilter';
import { mockActivities } from './activityMockData';
import { ActivityItem } from './activityTypes';

const allMembers = [
  { id: 'member-001', name: 'Andi Susanto', avatar: 'AS' },
  { id: 'member-002', name: 'Budi Hartono', avatar: 'BH' },
  { id: 'member-003', name: 'Citra Dewi', avatar: 'CD' },
  { id: 'member-004', name: 'Dimas Pratama', avatar: 'DP' },
  { id: 'member-005', name: 'Eka Wulandari', avatar: 'EW' },
  { id: 'member-006', name: 'Farhan Rizki', avatar: 'FR' },
  { id: 'member-007', name: 'Gita Permata', avatar: 'GP' },
  { id: 'member-008', name: 'Hendra Wijaya', avatar: 'HW' },
];

export default function ActivityFeedContent() {
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered: ActivityItem[] = mockActivities.filter((a) => {
    if (selectedMember !== 'all' && a.actor.id !== selectedMember) return false;
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Summary cards */}
      <ActivitySummaryCards />

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <ActivityMemberFilter
          members={allMembers}
          selected={selectedMember}
          onChange={setSelectedMember}
        />
        <div className="flex items-center gap-1.5 ml-auto">
          {[
            { value: 'all', label: 'All Activity' },
            { value: 'task_completed', label: 'Completions' },
            { value: 'task_overdue', label: 'Overdue' },
            { value: 'wa_sent', label: 'WA Sent' },
            { value: 'file_uploaded', label: 'Files' },
          ].map((opt) => (
            <button
              key={`type-filter-${opt.value}`}
              onClick={() => setTypeFilter(opt.value)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-all duration-150 ${
                typeFilter === opt.value
                  ? 'bg-primary text-white border-primary' :'bg-white text-muted-foreground border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ActivityTimeline activities={filtered} />
        </div>
        <div className="xl:col-span-1">
          <ActivitySidePanel />
        </div>
      </div>
    </div>
  );
}

function ActivitySidePanel() {
  const memberActivity = [
    { id: 'member-001', name: 'Andi Susanto', avatar: 'AS', actionsToday: 4, lastSeen: '9 min ago', online: true },
    { id: 'member-002', name: 'Budi Hartono', avatar: 'BH', actionsToday: 3, lastSeen: '4 min ago', online: true },
    { id: 'member-003', name: 'Citra Dewi', avatar: 'CD', actionsToday: 2, lastSeen: '11 min ago', online: true },
    { id: 'member-004', name: 'Dimas Pratama', avatar: 'DP', actionsToday: 2, lastSeen: '22 min ago', online: false },
    { id: 'member-005', name: 'Eka Wulandari', avatar: 'EW', actionsToday: 2, lastSeen: '35 min ago', online: false },
    { id: 'member-006', name: 'Farhan Rizki', avatar: 'FR', actionsToday: 1, lastSeen: '47 min ago', online: false },
    { id: 'member-007', name: 'Gita Permata', avatar: 'GP', actionsToday: 2, lastSeen: '1 hr ago', online: false },
    { id: 'member-008', name: 'Hendra Wijaya', avatar: 'HW', actionsToday: 1, lastSeen: '2 hr ago', online: false },
  ];

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

  return (
    <div className="bg-white border border-border rounded-xl shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-foreground">Team Activity Today</h3>
        <span className="text-[11px] text-muted-foreground">Apr 26</span>
      </div>
      <div className="divide-y divide-border">
        {memberActivity.map((m) => (
          <div key={`side-member-${m.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors duration-150">
            <div className="relative">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold ${avatarColors[m.avatar]}`}>
                {m.avatar}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${m.online ? 'bg-green-500' : 'bg-slate-300'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-medium text-foreground truncate">{m.name}</p>
              <p className="text-[11px] text-muted-foreground">{m.lastSeen}</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-semibold text-foreground tabular-nums">{m.actionsToday}</p>
              <p className="text-[10px] text-muted-foreground">actions</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}