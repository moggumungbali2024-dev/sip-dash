import React from 'react';
import { Task } from './taskTypes';
import { AlertTriangle, Clock, CheckCircle2, Eye, ListChecks } from 'lucide-react';

interface TaskStatsBarProps {
  tasks: Task[];
}

export default function TaskStatsBar({ tasks }: TaskStatsBarProps) {
  const total = tasks.length;
  const overdue = tasks.filter((t) => t.overdue && t.status !== 'done').length;
  const doneToday = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const underReview = tasks.filter((t) => t.status === 'under-review').length;

  const stats = [
    {
      id: 'stat-total',
      label: 'Total Tasks',
      value: total,
      icon: <ListChecks size={15} />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'stat-overdue',
      label: 'Overdue',
      value: overdue,
      icon: <AlertTriangle size={15} />,
      color: overdue > 0 ? 'text-red-600 bg-red-50' : 'text-slate-500 bg-slate-50',
      alert: overdue > 0,
    },
    {
      id: 'stat-inprogress',
      label: 'In Progress',
      value: inProgress,
      icon: <Clock size={15} />,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'stat-review',
      label: 'Under Review',
      value: underReview,
      icon: <Eye size={15} />,
      color: 'text-violet-600 bg-violet-50',
    },
    {
      id: 'stat-done',
      label: 'Completed',
      value: doneToday,
      icon: <CheckCircle2 size={15} />,
      color: 'text-green-600 bg-green-50',
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {stats.map((s) => (
        <div
          key={s.id}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
            s.alert
              ? 'border-red-200 bg-red-50' :'border-border bg-white'
          } shadow-card`}
        >
          <span className={`${s.color} p-1 rounded`}>{s.icon}</span>
          <span className="text-[13px] font-semibold text-foreground tabular-nums">{s.value}</span>
          <span className="text-[11px] text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}