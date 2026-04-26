'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useApp } from '@/lib/AppContext';
import { Shield, Plus, Check, ChevronDown, Users, Lock, Eye, EyeOff } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  nameId: string;
  color: string;
  memberCount: number;
  description: string;
  permissions: Record<string, 'full' | 'read' | 'none'>;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const modules = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'tasks', label: 'Task Management' },
  { key: 'activity', label: 'Activity Feed' },
  { key: 'chat', label: 'Real-time Chat' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'documents', label: 'Documents' },
  { key: 'team', label: 'Team Members' },
  { key: 'access', label: 'Access Control' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'settings', label: 'Settings' },
];

const roles: Role[] = [
  {
    id: 'r1', name: 'CEO', nameId: 'CEO', color: 'bg-red-100 text-red-700 border-red-200',
    memberCount: 1, description: 'Full access to all modules',
    permissions: { dashboard: 'full', tasks: 'full', activity: 'full', chat: 'full', calendar: 'full', documents: 'full', team: 'full', access: 'full', notifications: 'full', settings: 'full' },
  },
  {
    id: 'r2', name: 'Manager', nameId: 'Manager', color: 'bg-violet-100 text-violet-700 border-violet-200',
    memberCount: 2, description: 'Manage team and tasks, limited settings',
    permissions: { dashboard: 'full', tasks: 'full', activity: 'full', chat: 'full', calendar: 'full', documents: 'full', team: 'full', access: 'read', notifications: 'full', settings: 'read' },
  },
  {
    id: 'r3', name: 'Supervisor', nameId: 'Supervisor', color: 'bg-blue-100 text-blue-700 border-blue-200',
    memberCount: 3, description: 'Oversee tasks and team activity',
    permissions: { dashboard: 'full', tasks: 'full', activity: 'full', chat: 'full', calendar: 'read', documents: 'read', team: 'read', access: 'none', notifications: 'full', settings: 'none' },
  },
  {
    id: 'r4', name: 'Employee', nameId: 'Karyawan', color: 'bg-green-100 text-green-700 border-green-200',
    memberCount: 5, description: 'Access own tasks and team chat',
    permissions: { dashboard: 'read', tasks: 'read', activity: 'read', chat: 'full', calendar: 'read', documents: 'read', team: 'read', access: 'none', notifications: 'full', settings: 'none' },
  },
  {
    id: 'r5', name: 'Guest', nameId: 'Tamu', color: 'bg-slate-100 text-slate-600 border-slate-200',
    memberCount: 1, description: 'View-only access to selected modules',
    permissions: { dashboard: 'read', tasks: 'none', activity: 'none', chat: 'none', calendar: 'read', documents: 'read', team: 'none', access: 'none', notifications: 'none', settings: 'none' },
  },
];

const members: Member[] = [
  { id: 'm1', name: 'Andi Susanto', avatar: 'AS', avatarColor: 'bg-blue-100 text-blue-700', email: 'andi@teamflow.id', role: 'Manager', status: 'active' },
  { id: 'm2', name: 'Budi Hartono', avatar: 'BH', avatarColor: 'bg-violet-100 text-violet-700', email: 'budi@teamflow.id', role: 'Supervisor', status: 'active' },
  { id: 'm3', name: 'Citra Dewi', avatar: 'CD', avatarColor: 'bg-pink-100 text-pink-700', email: 'citra@teamflow.id', role: 'Employee', status: 'active' },
  { id: 'm4', name: 'Dimas Pratama', avatar: 'DP', avatarColor: 'bg-amber-100 text-amber-700', email: 'dimas@teamflow.id', role: 'Employee', status: 'active' },
  { id: 'm5', name: 'Eka Wulandari', avatar: 'EW', avatarColor: 'bg-teal-100 text-teal-700', email: 'eka@teamflow.id', role: 'Supervisor', status: 'inactive' },
  { id: 'm6', name: 'Farhan Rizki', avatar: 'FR', avatarColor: 'bg-orange-100 text-orange-700', email: 'farhan@teamflow.id', role: 'Employee', status: 'active' },
];

const permissionConfig = {
  full: { label: 'Full', icon: <Check size={12} />, className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  read: { label: 'Read', icon: <Eye size={12} />, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  none: { label: 'None', icon: <EyeOff size={12} />, className: 'bg-slate-100 text-slate-500 dark:bg-gray-700 dark:text-gray-400' },
};

type TabKey = 'roles' | 'members';

export default function AccessControlPage() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>('roles');
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [memberRoles, setMemberRoles] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, m.role]))
  );
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);

  return (
    <AppLayout title={t.accessControl.title} subtitle={t.accessControl.subtitle}>
      <div className="p-4 md:p-6 max-w-screen-2xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border dark:border-gray-700">
          {([
            { key: 'roles' as TabKey, label: t.accessControl.roles, icon: <Shield size={14} /> },
            { key: 'members' as TabKey, label: t.accessControl.members, icon: <Users size={14} /> },
          ] as { key: TabKey; label: string; icon: React.ReactNode }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors duration-150 ${
                activeTab === tab.key
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground dark:hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'roles' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Role list */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13.5px] font-semibold text-foreground dark:text-white">{t.accessControl.roles}</h3>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-[12px] font-medium hover:bg-primary/90 transition-colors duration-150">
                  <Plus size={13} />
                  {t.accessControl.addRole}
                </button>
              </div>
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-150 text-left ${
                    selectedRole.id === role.id
                      ? 'border-primary bg-primary/5 dark:bg-primary/10' :'border-border dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-primary/40 hover:bg-muted/30 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${role.color}`}>
                    <Lock size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-foreground dark:text-white">{role.name}</p>
                    <p className="text-[11.5px] text-muted-foreground">{role.memberCount} anggota</p>
                  </div>
                  {selectedRole.id === role.id && <Check size={14} className="text-primary shrink-0" />}
                </button>
              ))}
            </div>

            {/* Permission matrix */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
                <div className="px-5 py-4 border-b border-border dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-semibold text-foreground dark:text-white">{selectedRole.name}</h3>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{selectedRole.description}</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${selectedRole.color}`}>
                    {selectedRole.memberCount} {t.accessControl.members}
                  </span>
                </div>
                <div className="divide-y divide-border dark:divide-gray-700">
                  {modules.map((mod) => {
                    const perm = selectedRole.permissions[mod.key] as 'full' | 'read' | 'none';
                    const cfg = permissionConfig[perm];
                    return (
                      <div key={mod.key} className="flex items-center justify-between px-5 py-3.5">
                        <span className="text-[13px] text-foreground dark:text-white">{mod.label}</span>
                        <span className={`flex items-center gap-1.5 text-[11.5px] font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-foreground dark:text-white">{t.accessControl.members}</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-[12px] font-medium hover:bg-primary/90 transition-colors duration-150">
                <Plus size={13} />
                {t.accessControl.assignRole}
              </button>
            </div>
            <div className="divide-y divide-border dark:divide-gray-700">
              {members.map((member) => (
                <div key={member.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-muted/20 dark:hover:bg-gray-800/50 transition-colors duration-150">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${member.avatarColor}`}>
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium text-foreground dark:text-white">{member.name}</p>
                    <p className="text-[12px] text-muted-foreground">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${member.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                      {member.status === 'active' ? t.common.active : t.common.inactive}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => setOpenRoleDropdown(openRoleDropdown === member.id ? null : member.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-border dark:border-gray-700 rounded-lg text-[12.5px] text-foreground dark:text-white hover:bg-muted dark:hover:bg-gray-800 transition-colors duration-150"
                      >
                        {memberRoles[member.id]}
                        <ChevronDown size={12} />
                      </button>
                      {openRoleDropdown === member.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl shadow-dropdown py-1 z-20 min-w-[130px]">
                          {roles.map((role) => (
                            <button
                              key={role.id}
                              onClick={() => { setMemberRoles({ ...memberRoles, [member.id]: role.name }); setOpenRoleDropdown(null); }}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-[12.5px] hover:bg-muted dark:hover:bg-gray-700 transition-colors duration-150 ${memberRoles[member.id] === role.name ? 'text-primary font-medium' : 'text-foreground dark:text-white'}`}
                            >
                              {memberRoles[member.id] === role.name && <Check size={12} />}
                              {role.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
