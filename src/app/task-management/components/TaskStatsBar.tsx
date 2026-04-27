import React from 'react';
import { Task } from './taskTypes';
import { AlertTriangle, Clock, CheckCircle2, Eye, ListChecks } from 'lucide-react';

interface TaskStatsBarProps {
  tasks: Task[];
  onFilter?: (status: string) => void;
  activeFilter?: string;
}

export default function TaskStatsBar({ tasks, onFilter, activeFilter }: TaskStatsBarProps) {
  const total = tasks.length;
  const overdue = tasks.filter((t) => t.overdue && t.status !== 'done').length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const underReview = tasks.filter((t) => t.status === 'under-review').length;

  const stats = [
    {
      id: 'stat-total',
      label: 'Total Tasks',
      value: total,
      icon: <ListChecks size={15} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: activeFilter === 'all' ? 'border-blue-400' : 'border-border dark:border-gray-700',
      filterKey: 'all',
    },
    {
      id: 'stat-overdue',
      label: 'Overdue',
      value: overdue,
      icon: <AlertTriangle size={15} />,
      color: 'text-red-600',
      bg: overdue > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-gray-800',
      border: activeFilter === 'overdue' ? 'border-red-400' : overdue > 0 ? 'border-red-200 dark:border-red-800/40' : 'border-border dark:border-gray-700',
      filterKey: 'overdue',
    },
    {
      id: 'stat-inprogress',
      label: 'In Progress',
      value: inProgress,
      icon: <Clock size={15} />,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: activeFilter === 'in-progress' ? 'border-amber-400' : 'border-border dark:border-gray-700',
      filterKey: 'in-progress',
    },
    {
      id: 'stat-review',
      label: 'Under Review',
      value: underReview,
      icon: <Eye size={15} />,
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      border: activeFilter === 'under-review' ? 'border-violet-400' : 'border-border dark:border-gray-700',
      filterKey: 'under-review',
    },
    {
      id: 'stat-done',
      label: 'Completed',
      value: done,
      icon: <CheckCircle2 size={15} />,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: activeFilter === 'done' ? 'border-green-400' : 'border-border dark:border-gray-700',
      filterKey: 'done',
    },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 w-full sm:w-auto sm:flex sm:flex-wrap">
      {stats.map((s) => (
        <button
          key={s.id}
          onClick={() => onFilter?.(s.filterKey === activeFilter ? 'all' : s.filterKey)}
          className={`flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg border ${s.bg} ${s.border} shadow-sm transition-all duration-150 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-left`}
        >
          <span className={`${s.color} shrink-0`}>{s.icon}</span>
          <span className={`text-[14px] sm:text-[13px] font-bold ${s.color} tabular-nums`}>{s.value}</span>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground whitespace-nowrap">{s.label}</span>
        </button>
      ))}
    </div>
  );
}