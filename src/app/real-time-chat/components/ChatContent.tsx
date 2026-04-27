'use client';

import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatMessageArea from './ChatMessageArea';
import ChatInfoPanel from './ChatInfoPanel';
import { mockChannels, mockMembers } from './chatMockData';
import { ChatChannel, ChatMessage } from './chatTypes';
import { useChatChannels, useChatMessages, useProfiles } from '@/lib/useSupabase';

// Adapter: DB channel → ChatChannel shape
function dbChannelToChatChannel(ch: any): ChatChannel {
  return {
    id: ch.id,
    name: ch.name || 'Unnamed',
    type: ch.type === 'dm' ? 'dm' : 'channel',
    description: ch.description || '',
    memberCount: 0,
    unreadCount: 0,
    lastMessage: '',
    lastMessageTime: ch.updated_at,
    waBridge: ch.wa_bridge || false,
    online: false,
  };
}

// Adapter: DB message → ChatMessage shape
function dbMsgToChatMsg(m: any, myId: string): ChatMessage {
  return {
    id: m.id,
    channelId: m.channel_id,
    senderId: m.sender_id,
    senderName: m.sender?.name || 'Unknown',
    senderAvatar: m.sender?.avatar || '??',
    senderRole: m.sender?.role || '',
    content: m.content,
    timestamp: m.created_at,
    status: (m.status as any) || 'sent',
    reactions: [],
    isMe: m.sender_id === myId,
  };
}

// Placeholder "me" — replace with useSupabaseUser() when auth is live
const ME_ID = 'member-001';
const ME_NAME = 'Andi Susanto';
const ME_AVATAR = 'AS';

export default function ChatContent() {
  const { channels: dbChannels, loading: chLoading, createChannel } = useChatChannels();
  const { profiles } = useProfiles();

  // Use DB channels if available, else mock
  const channels: ChatChannel[] = dbChannels.length > 0
    ? dbChannels.map(dbChannelToChatChannel)
    : mockChannels;

  const [activeChannelId, setActiveChannelId] = useState('');
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Set initial channel when channels load
  useEffect(() => {
    if (channels.length > 0 && !activeChannelId) {
      setActiveChannelId(channels[0].id);
    }
  }, [channels, activeChannelId]);

  const { messages: dbMessages, sendMessage, loading: msgsLoading } = useChatMessages(activeChannelId || null);

  // For mock channels, use local message state
  const [localMessages, setLocalMessages] = useState<Record<string, ChatMessage[]>>({});

  const activeChannel = channels.find((c) => c.id === activeChannelId) || null;

  // Decide which message set to use
  const isUsingDb = dbChannels.length > 0;
  const activeMessages: ChatMessage[] = isUsingDb
    ? dbMessages.map((m) => dbMsgToChatMsg(m, ME_ID))
    : (localMessages[activeChannelId] || []);

  const handleSendMessage = async (content: string) => {
    if (isUsingDb) {
      await sendMessage(content, ME_ID);
    } else {
      // Local mock
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        channelId: activeChannelId,
        senderId: ME_ID,
        senderName: ME_NAME,
        senderAvatar: ME_AVATAR,
        senderRole: 'Manager',
        content,
        timestamp: new Date().toISOString(),
        status: 'sent',
        reactions: [],
        isMe: true,
      };
      setLocalMessages((prev) => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
      }));
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    // Local-only for now
    setLocalMessages((prev) => {
      const msgs = prev[activeChannelId] || [];
      return {
        ...prev,
        [activeChannelId]: msgs.map((m) => {
          if (m.id !== messageId) return m;
          const existing = m.reactions.find((r) => r.emoji === emoji);
          if (existing) {
            return {
              ...m,
              reactions: m.reactions
                .map((r) => r.emoji === emoji ? { ...r, count: r.byMe ? r.count - 1 : r.count + 1, byMe: !r.byMe } : r)
                .filter((r) => r.count > 0),
            };
          }
          return { ...m, reactions: [...m.reactions, { emoji, count: 1, byMe: true }] };
        }),
      };
    });
  };

  const handleSelectChannel = (id: string) => {
    setActiveChannelId(id);
    setMobileSidebarOpen(false);
  };

  const handleCreateChannel = async (name: string) => {
    if (isUsingDb) {
      const ch = await createChannel(name, 'channel');
      if (ch) setActiveChannelId(ch.id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40 md:z-auto
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ top: 64 }}
      >
        <ChatSidebar
          channels={channels}
          activeId={activeChannelId}
          onSelect={handleSelectChannel}
          onClose={() => setMobileSidebarOpen(false)}
          onCreateChannel={handleCreateChannel}
          members={profiles.length > 0 ? profiles as any : mockMembers}
        />
      </div>

      {/* Message area */}
      <ChatMessageArea
        channel={activeChannel}
        messages={activeMessages}
        onSend={handleSendMessage}
        onReaction={handleReaction}
        onToggleInfo={() => setInfoPanelOpen((p) => !p)}
        onToggleSidebar={() => setMobileSidebarOpen((p) => !p)}
        infoPanelOpen={infoPanelOpen}
        channels={channels}
        loading={msgsLoading}
      />

      {/* Info panel */}
      {infoPanelOpen && activeChannel && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setInfoPanelOpen(false)}
          />
          <div className="fixed md:static right-0 inset-y-0 z-40 md:z-auto" style={{ top: 64 }}>
            <ChatInfoPanel
              channel={activeChannel}
              onClose={() => setInfoPanelOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}