'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CheckSquare,
  Activity,
  MessageSquare,
  Calendar,
  FolderOpen,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LayoutDashboard,
  Shield,
  X,
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { useApp } from '@/lib/AppContext';

interface NavItem {
  id: string;
  labelKey: keyof ReturnType<typeof useApp>['t']['nav'];
  href: string;
  icon: React.ReactNode;
  badge?: number;
  group: 'main' | 'manage';
}

const navItems: NavItem[] = [
  { id: 'nav-dashboard', labelKey: 'dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} />, group: 'main' },
  { id: 'nav-tasks', labelKey: 'taskManagement', href: '/task-management', icon: <CheckSquare size={18} />, badge: 4, group: 'main' },
  { id: 'nav-activity', labelKey: 'activityFeed', href: '/activity-feed', icon: <Activity size={18} />, group: 'main' },
  { id: 'nav-chat', labelKey: 'realTimeChat', href: '/real-time-chat', icon: <MessageSquare size={18} />, badge: 7, group: 'main' },
  { id: 'nav-calendar', labelKey: 'calendar', href: '/calendar', icon: <Calendar size={18} />, group: 'main' },
  { id: 'nav-documents', labelKey: 'documents', href: '/documents', icon: <FolderOpen size={18} />, group: 'main' },
  { id: 'nav-team', labelKey: 'teamMembers', href: '/team', icon: <Users size={18} />, group: 'manage' },
  { id: 'nav-access', labelKey: 'accessControl', href: '/access-control', icon: <Shield size={18} />, group: 'manage' },
  { id: 'nav-notifications', labelKey: 'notifications', href: '/notifications', icon: <Bell size={18} />, group: 'manage' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { t, notificationCount } = useApp();

  const groups: { key: 'main' | 'manage'; label: string }[] = [
    { key: 'main', label: t.nav.workspace },
    { key: 'manage', label: t.nav.manage },
  ];

  const sidebarContent = (
    <aside
      className={`relative flex flex-col bg-white dark:bg-gray-900 border-r border-border dark:border-gray-700 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-60'
      } shrink-0 h-screen`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-border dark:border-gray-700 px-3 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-semibold text-[15px] text-foreground dark:text-white tracking-tight flex-1">
            sipOS - dashboard
          </span>
        )}
        {/* Mobile close button */}
        {!collapsed && onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden p-1 rounded-lg hover:bg-muted dark:hover:bg-gray-800">
            <X size={16} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        {groups.map((group) => (
          <div key={`group-${group.key}`} className="mb-4">
            {!collapsed && (
              <p className="text-[10px] font-600 uppercase tracking-widest text-muted-foreground dark:text-gray-500 px-2 mb-1.5">
                {group.label}
              </p>
            )}
            {navItems
              .filter((item) => item.group === group.key)
              .map((item) => {
                const isActive = pathname === item.href;
                const label = t.nav[item.labelKey];
                const badgeCount = item.id === 'nav-notifications' ? notificationCount : item.badge;
                return (
                  <div key={item.id} className="relative group/nav">
                    <Link
                      href={item.href}
                      onClick={onMobileClose}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 transition-all duration-150 ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium' :'text-muted-foreground dark:text-gray-400 hover:bg-muted dark:hover:bg-gray-800 hover:text-foreground dark:hover:text-white'
                      }`}
                    >
                      <span className={`shrink-0 ${isActive ? 'text-primary' : ''}`}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="text-[13.5px] truncate flex-1">{label}</span>
                      )}
                      {!collapsed && badgeCount !== undefined && badgeCount > 0 && (
                        <span className="ml-auto bg-primary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums">
                          {badgeCount}
                        </span>
                      )}
                      {collapsed && badgeCount !== undefined && badgeCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                      )}
                    </Link>
                    {collapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-foreground dark:bg-gray-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover/nav:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-dropdown">
                        {label}
                        {badgeCount !== undefined && badgeCount > 0 && (
                          <span className="ml-1.5 bg-primary text-white text-[10px] px-1 rounded-full">
                            {badgeCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Bottom user + settings */}
      <div className="border-t border-border dark:border-gray-700 p-2">
        <div className="relative group/nav">
          <Link
            href="/settings"
            onClick={onMobileClose}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground dark:text-gray-400 hover:bg-muted dark:hover:bg-gray-800 hover:text-foreground dark:hover:text-white transition-all duration-150"
          >
            <Settings size={18} className="shrink-0" />
            {!collapsed && <span className="text-[13.5px]">{t.nav.settings}</span>}
          </Link>
          {collapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-foreground dark:bg-gray-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover/nav:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-dropdown">
              {t.nav.settings}
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 mt-1 rounded-lg hover:bg-muted dark:hover:bg-gray-800 cursor-pointer transition-all duration-150">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary text-xs font-semibold">AS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-medium text-foreground dark:text-white truncate">Andi Susanto</p>
              <p className="text-[11px] text-muted-foreground dark:text-gray-500 truncate">Manager</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center mt-1">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer">
              <span className="text-primary text-xs font-semibold">AS</span>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle - desktop only */}
      <button
        onClick={onToggle}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-full items-center justify-center shadow-card hover:bg-muted dark:hover:bg-gray-800 transition-colors duration-150 z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex sticky top-0 h-screen">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="relative z-10 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}