export type TaskStatus = 'draft' | 'assigned' | 'in-progress' | 'under-review' | 'done' | 'archived';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type MemberRole = 'ceo' | 'manager' | 'spv' | 'employee';

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: MemberRole;
  department: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: string;
  assignee: TeamMember;
  createdBy: TeamMember;
  dueDate: string;
  createdAt: string;
  subtaskCount: number;
  subtaskDone: number;
  waReminder: boolean;
  tags: string[];
  attachmentCount: number;
  overdue?: boolean;
}

export interface TaskFilters {
  search: string;
  status: string;
  priority: string;
  assignee: string;
  project: string;
}