'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useApp } from '@/lib/AppContext';
import { Shield, Plus, Check, ChevronDown, Users, Lock, Eye, EyeOff, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';

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

const initialRoles: Role[] = [
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

];

const initialMembers: Member[] = [
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
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [memberRoles, setMemberRoles] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, m.role]))
  );
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states for Role Modal
  const [roleFormName, setRoleFormName] = useState('');
  const [roleFormDesc, setRoleFormDesc] = useState('');
  const [roleFormPerms, setRoleFormPerms] = useState<Record<string, 'full' | 'read' | 'none'>>({});

  // Form states for Assign Modal
  const [assignFormMemberId, setAssignFormMemberId] = useState('');
  const [assignFormRoleId, setAssignFormRoleId] = useState('');

  const handleOpenRoleModal = (edit: boolean) => {
    setIsEditMode(edit);
    if (edit) {
      setRoleFormName(selectedRole.name);
      setRoleFormDesc(selectedRole.description);
      setRoleFormPerms({ ...selectedRole.permissions });
    } else {
      setRoleFormName('');
      setRoleFormDesc('');
      setRoleFormPerms(Object.fromEntries(modules.map(m => [m.key, 'read'])));
    }
    setShowRoleModal(true);
  };

  const handleSaveRole = () => {
    if (!roleFormName.trim()) {
      toast.error('Nama role tidak boleh kosong');
      return;
    }
    
    if (isEditMode) {
      setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, name: roleFormName, description: roleFormDesc, permissions: roleFormPerms } : r));
      setSelectedRole(prev => ({ ...prev, name: roleFormName, description: roleFormDesc, permissions: roleFormPerms }));
      toast.success('Role berhasil diupdate');
    } else {
      const newRole: Role = {
        id: `r${Date.now()}`,
        name: roleFormName,
        nameId: roleFormName,
        color: 'bg-slate-100 text-slate-700 border-slate-200',
        memberCount: 0,
        description: roleFormDesc,
        permissions: roleFormPerms,
      };
      setRoles(prev => [...prev, newRole]);
      setSelectedRole(newRole);
      toast.success('Role berhasil dibuat');
    }
    setShowRoleModal(false);
  };

  const handleAssignRole = () => {
    if (!assignFormMemberId || !assignFormRoleId) {
      toast.error('Pilih anggota dan role');
      return;
    }
    const roleObj = roles.find(r => r.id === assignFormRoleId);
    if (!roleObj) return;
    
    setMemberRoles(prev => ({ ...prev, [assignFormMemberId]: roleObj.name }));
    toast.success('Role berhasil diubah');
    setShowAssignModal(false);
  };

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
                <button 
                  onClick={() => handleOpenRoleModal(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-[12px] font-medium hover:bg-primary/90 transition-colors duration-150"
                >
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
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${selectedRole.color}`}>
                      {selectedRole.memberCount} {t.accessControl.members}
                    </span>
                    <button onClick={() => handleOpenRoleModal(true)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted dark:hover:bg-gray-800 text-muted-foreground transition-colors">
                      <Edit2 size={14} />
                    </button>
                  </div>
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
              <button 
                onClick={() => {
                  setAssignFormMemberId(members[0]?.id || '');
                  setAssignFormRoleId(roles[0]?.id || '');
                  setShowAssignModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-[12px] font-medium hover:bg-primary/90 transition-colors duration-150"
              >
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

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md border border-border dark:border-gray-700 overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-border dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-foreground dark:text-white">{isEditMode ? 'Edit Role' : 'Tambah Role Baru'}</h3>
              <button onClick={() => setShowRoleModal(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X size={15} />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">Nama Role</label>
                <input type="text" value={roleFormName} onChange={e => setRoleFormName(e.target.value)} placeholder="contoh: Marketing" className="w-full px-3 py-2 text-[13px] border border-border dark:border-gray-700 rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">Deskripsi</label>
                <input type="text" value={roleFormDesc} onChange={e => setRoleFormDesc(e.target.value)} placeholder="Deskripsi singkat role" className="w-full px-3 py-2 text-[13px] border border-border dark:border-gray-700 rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
              </div>
              <div className="pt-2">
                <label className="block text-[12px] font-medium text-muted-foreground mb-3">Hak Akses Modul</label>
                <div className="space-y-3">
                  {modules.map(mod => (
                    <div key={mod.key} className="flex items-center justify-between">
                      <span className="text-[13px] text-foreground dark:text-white">{mod.label}</span>
                      <select value={roleFormPerms[mod.key] || 'read'} onChange={e => setRoleFormPerms(prev => ({ ...prev, [mod.key]: e.target.value as any }))} className="text-[12px] px-2 py-1 border border-border dark:border-gray-700 rounded bg-background dark:bg-gray-800 text-foreground dark:text-white outline-none">
                        <option value="full">Full Access</option>
                        <option value="read">Read Only</option>
                        <option value="none">No Access</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleSaveRole} className="w-full py-2.5 bg-primary text-white rounded-lg text-[13px] font-medium hover:bg-primary/90 transition-colors mt-2">
                Simpan Role
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-sm border border-border dark:border-gray-700 overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-border dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-foreground dark:text-white">Assign Role</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X size={15} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">Pilih Anggota</label>
                <select value={assignFormMemberId} onChange={e => setAssignFormMemberId(e.target.value)} className="w-full px-3 py-2 text-[13px] border border-border dark:border-gray-700 rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">Pilih Role</label>
                <select value={assignFormRoleId} onChange={e => setAssignFormRoleId(e.target.value)} className="w-full px-3 py-2 text-[13px] border border-border dark:border-gray-700 rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <button onClick={handleAssignRole} className="w-full py-2.5 bg-primary text-white rounded-lg text-[13px] font-medium hover:bg-primary/90 transition-colors">
                Terapkan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
