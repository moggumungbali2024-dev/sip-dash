export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
  reactions: { emoji: string; count: number; byMe: boolean }[];
  attachments?: { name: string; size: string; type: 'image' | 'doc' | 'pdf' }[];
  replyTo?: { id: string; preview: string; senderName: string };
  isMe: boolean;
}

export interface ChatChannel {id: string;
  name: string;
  type: 'channel' | 'dm';
  description?: string;
  memberCount?: number;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  waBridge: boolean;
  members?: ChatMember[];
  online?: boolean;
}

export interface ChatMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  online: boolean;
  lastSeen?: string;
}