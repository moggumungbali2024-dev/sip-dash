'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Search, UserPlus, MoreHorizontal, Mail, Phone, Shield, CheckSquare } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'online' | 'away' | 'offline';
  tasksActive: number;
  tasksCompleted: number;
  joinDate: string;
  avatarColor: string;
}

const members: TeamMember[] = [
  { id: 'm1', name: 'Andi Susanto', avatar: 'AS', role: 'Manager', department: 'Product', email: 'andi@teamflow.id', phone: '+62 812-3456-7890', status: 'online', tasksActive: 6, tasksCompleted: 42, joinDate: 'Jan 2024', avatarColor: 'bg-blue-100 text-blue-700' },
  { id: 'm2', name: 'Budi Hartono', avatar: 'BH', role: 'Backend Dev', department: 'Engineering', email: 'budi@teamflow.id', phone: '+62 813-2345-6789', status: 'online', tasksActive: 4, tasksCompleted: 38, joinDate: 'Feb 2024', avatarColor: 'bg-violet-100 text-violet-700' },
  { id: 'm3', name: 'Citra Dewi', avatar: 'CD', role: 'UI/UX Designer', department: 'Design', email: 'citra@teamflow.id', phone: '+62 814-3456-7891', status: 'online', tasksActive: 3, tasksCompleted: 29, joinDate: 'Feb 2024', avatarColor: 'bg-pink-100 text-pink-700' },
  { id: 'm4', name: 'Dimas Pratama', avatar: 'DP', role: 'Frontend Dev', department: 'Engineering', email: 'dimas@teamflow.id', phone: '+62 815-4567-8902', status: 'away', tasksActive: 5, tasksCompleted: 31, joinDate: 'Mar 2024', avatarColor: 'bg-amber-100 text-amber-700' },
  { id: 'm5', name: 'Eka Wulandari', avatar: 'EW', role: 'QA Engineer', department: 'Engineering', email: 'eka@teamflow.id', phone: '+62 816-5678-9013', status: 'online', tasksActive: 2, tasksCompleted: 25, joinDate: 'Mar 2024', avatarColor: 'bg-teal-100 text-teal-700' },
  { id: 'm6', name: 'Farhan Rizki', avatar: 'FR', role: 'DevOps', department: 'Infrastructure', email: 'farhan@teamflow.id', phone: '+62 817-6789-0124', status: 'offline', tasksActive: 3, tasksCompleted: 19, joinDate: 'Apr 2024', avatarColor: 'bg-orange-100 text-orange-700' },
  { id: 'm7', name: 'Gita Permata', avatar: 'GP', role: 'Product Analyst', department: 'Product', email: 'gita@teamflow.id', phone: '+62 818-7890-1235', status: 'offline', tasksActive: 2, tasksCompleted: 22, joinDate: 'Apr 2024', avatarColor: 'bg-green-100 text-green-700' },
  { id: 'm8', name: 'Hendra Wijaya', avatar: 'HW', role: 'Backend Dev', department: 'Engineering', email: 'hendra@teamflow.id', phone: '+62 819-8901-2346', status: 'offline', tasksActive: 1, tasksCompleted: 15, joinDate: 'May 2024', avatarColor: 'bg-indigo-100 text-indigo-700' },
];

const statusConfig = {
  online: { label: 'Online', dot: 'bg-green-500' },
  away: { label: 'Away', dot: 'bg-amber-400' },
  offline: { label: 'Offline', dot: 'bg-slate-300' },
};

const roleColors: Record<string, string> = {
  Manager: 'bg-blue-100 text-blue-700',
  'Backend Dev': 'bg-violet-100 text-violet-700',
  'UI/UX Designer': 'bg-pink-100 text-pink-700',
  'Frontend Dev': 'bg-amber-100 text-amber-700',
  'QA Engineer': 'bg-teal-100 text-teal-700',
  DevOps: 'bg-orange-100 text-orange-700',
  'Product Analyst': 'bg-green-100 text-green-700',
};

export default function TeamPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const departments = ['all', ...Array.from(new Set(members.map((m) => m.department)))];

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'all' || m.department === deptFilter;
    return matchSearch && matchDept;
  });

  const onlineCount = members.filter((m) => m.status === 'online').length;

  return (
    <AppLayout title="Team Members" subtitle={`${members.length} anggota tim · ${onlineCount} online sekarang`}>
      <div className="p-6 max-w-screen-2xl mx-auto space-y-5">

        {/* Summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Anggota', value: members.length, color: 'text-foreground' },
            { label: 'Online', value: members.filter(m => m.status === 'online').length, color: 'text-green-600' },
            { label: 'Departemen', value: departments.length - 1, color: 'text-foreground' },
            { label: 'Task Aktif', value: members.reduce((s, m) => s + m.tasksActive, 0), color: 'text-primary' },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl p-4 shadow-card">
              <p className={`text-2xl font-bold tabular-nums ${s.color} dark:text-white`}>{s.value}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters + invite */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari anggota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-[13px] border border-border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-all duration-150 ${deptFilter === dept ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-900 text-muted-foreground dark:text-gray-400 border-border dark:border-gray-700 hover:bg-muted dark:hover:bg-gray-800 hover:text-foreground dark:hover:text-white'}`}
              >
                {dept === 'all' ? 'Semua' : dept}
              </button>
            ))}
          </div>
          <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-[13px] font-medium hover:bg-primary/90 transition-colors duration-150">
            <UserPlus size={15} />
            Undang Anggota
          </button>
        </div>

        {/* Members grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((member) => {
            const status = statusConfig[member.status];
            const roleColor = roleColors[member.role] ?? 'bg-slate-100 text-slate-600';
            return (
              <div key={member.id} className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold ${member.avatarColor}`}>
                        {member.avatar}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${status.dot}`} />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-semibold text-foreground dark:text-white">{member.name}</p>
                      <p className="text-[11px] text-muted-foreground">{member.department}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors duration-150"
                    >
                      <MoreHorizontal size={15} />
                    </button>
                    {openMenu === member.id && (
                      <div className="absolute right-0 top-7 bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-dropdown z-10 py-1 w-36 animate-fade-in">
                        {['Lihat Profil', 'Kirim Pesan', 'Assign Task', 'Hapus Anggota'].map((action) => (
                          <button
                            key={action}
                            onClick={() => setOpenMenu(null)}
                            className={`w-full text-left px-3 py-2 text-[12.5px] hover:bg-muted dark:hover:bg-gray-700 transition-colors duration-100 ${action === 'Hapus Anggota' ? 'text-destructive' : 'text-foreground dark:text-white'}`}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mb-3 ${roleColor}`}>
                  {member.role}
                </span>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
                    <Mail size={12} className="shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
                    <Phone size={12} className="shrink-0" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-border dark:border-gray-700">
                  <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                    <CheckSquare size={12} className="text-primary" />
                    <span><span className="font-semibold text-foreground dark:text-white tabular-nums">{member.tasksActive}</span> aktif</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                    <Shield size={12} className="text-green-500" />
                    <span><span className="font-semibold text-foreground dark:text-white tabular-nums">{member.tasksCompleted}</span> selesai</span>
                  </div>
                  <span className="ml-auto text-[11px] text-muted-foreground">Sejak {member.joinDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
