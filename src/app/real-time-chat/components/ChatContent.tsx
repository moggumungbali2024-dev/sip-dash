'use client';

import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatMessageArea from './ChatMessageArea';
import ChatInfoPanel from './ChatInfoPanel';
import { mockChannels, mockMessages } from './chatMockData';
import { ChatMessage } from './chatTypes';

export default function ChatContent() {
  const [activeChannelId, setActiveChannelId] = useState('ch-engineering');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(mockMessages);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const activeChannel = mockChannels.find((c) => c.id === activeChannelId);
  const activeMessages = messages[activeChannelId] || [];

  const handleSendMessage = (content: string) => {
    // Backend: INSERT into supabase chat_messages table → real-time broadcast via Supabase Realtime
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderId: 'member-001',
      senderName: 'Andi Susanto',
      senderAvatar: 'AS',
      senderRole: 'Manager',
      content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: [],
      isMe: true,
    };
    setMessages((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
    }));
  };

  const handleReaction = (messageId: string, emoji: string) => {
    // Backend: UPSERT into message_reactions table
    setMessages((prev) => {
      const msgs = prev[activeChannelId] || [];
      return {
        ...prev,
        [activeChannelId]: msgs.map((m) => {
          if (m.id !== messageId) return m;
          const existing = m.reactions.find((r) => r.emoji === emoji);
          if (existing) {
            return {
              ...m,
              reactions: m.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.byMe ? r.count - 1 : r.count + 1, byMe: !r.byMe } : r
              ).filter((r) => r.count > 0),
            };
          }
          return { ...m, reactions: [...m.reactions, { emoji, count: 1, byMe: true }] };
        }),
      };
    });
  };

  const handleSelectChannel = (id: string) => {
    setActiveChannelId(id);
    setMobileSidebarOpen(false); // close sidebar on mobile after selection
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

      {/* Sidebar — hidden on mobile unless mobileSidebarOpen */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40 md:z-auto
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ top: 64 }}
      >
        <ChatSidebar
          channels={mockChannels}
          activeId={activeChannelId}
          onSelect={handleSelectChannel}
          onClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Message area */}
      <ChatMessageArea
        channel={activeChannel || null}
        messages={activeMessages}
        onSend={handleSendMessage}
        onReaction={handleReaction}
        onToggleInfo={() => setInfoPanelOpen((p) => !p)}
        onToggleSidebar={() => setMobileSidebarOpen((p) => !p)}
        infoPanelOpen={infoPanelOpen}
      />

      {/* Info panel — hidden on mobile unless infoPanelOpen, slide in from right */}
      {infoPanelOpen && activeChannel && (
        <>
          {/* Mobile overlay */}
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