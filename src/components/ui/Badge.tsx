import React from 'react';

type BadgeVariant =
  | 'draft' |'assigned' |'in-progress' |'under-review' |'done' |'archived' |'high' |'medium' |'low' |'critical' |'ceo' |'manager' |'spv' |'employee' |'default';

const variantMap: Record<BadgeVariant, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  assigned: 'bg-blue-50 text-blue-700 border-blue-200',
  'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
  'under-review': 'bg-violet-50 text-violet-700 border-violet-200',
  done: 'bg-green-50 text-green-700 border-green-200',
  archived: 'bg-gray-50 text-gray-500 border-gray-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  low: 'bg-slate-50 text-slate-600 border-slate-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
  ceo: 'bg-purple-50 text-purple-700 border-purple-200',
  manager: 'bg-blue-50 text-blue-700 border-blue-200',
  spv: 'bg-teal-50 text-teal-700 border-teal-200',
  employee: 'bg-slate-50 text-slate-600 border-slate-200',
  default: 'bg-muted text-muted-foreground border-border',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export default function Badge({ variant = 'default', children, className = '', dot }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${variantMap[variant]} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
      )}
      {children}
    </span>
  );
}