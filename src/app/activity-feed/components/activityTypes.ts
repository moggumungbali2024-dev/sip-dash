export type ActivityType =
  | 'task_created' |'task_updated' |'task_completed' |'task_assigned' |'task_overdue' |'comment_added' |'file_uploaded' |'status_changed' |'wa_sent' |'chat_message';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  actor: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  description: string;
  taskRef?: { id: string; title: string };
  project?: string;
  timestamp: string;
  waSent?: boolean;
  gotifyPushed?: boolean;
  meta?: Record<string, string>;
}