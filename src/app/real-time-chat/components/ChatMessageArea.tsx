'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Hash,
  MessageSquare,
  Info,
  Paperclip,
  Smile,
  Send,
  Check,
  CheckCheck,
  FileText,
  Image as ImageIcon,
  MoreHorizontal,
  Menu,
  X,
} from 'lucide-react';
import { ChatChannel, ChatMessage } from './chatTypes';
import { toast } from 'sonner';

interface Props {
  channel: ChatChannel | null;
  messages: ChatMessage[];
  onSend: (content: string) => void;
  onReaction: (messageId: string, emoji: string) => void;
  onToggleInfo: () => void;
  onToggleSidebar: () => void;
  infoPanelOpen: boolean;
}

const avatarColors: Record<string, string> = {
  AS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  BH: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  CD: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
  DP: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  EW: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400',
  FR: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  GP: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  HW: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
};

function formatMessageTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDateSeparator(ts: string) {
  const d = new Date(ts);
  const now = new Date('2026-04-26T09:29:08');
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-ID', { weekday: 'long', month: 'long', day: 'numeric' });
}

const EMOJI_QUICK = ['👍', '❤️', '😂', '🎉', '🔥', '✅', '👀', '💯', '🙌', '🚀'];

export default function ChatMessageArea({ channel, messages, onSend, onReaction, onToggleInfo, onToggleSidebar, infoPanelOpen }: Props) {
  const [input, setInput] = useState('');
  const [isTyping] = useState(false);
  const [emojiPickerFor, setEmojiPickerFor] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      // reset height
      if (inputRef.current) inputRef.current.style.height = 'auto';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }

    // Mock mentions
    const lastChar = e.target.value.slice(-1);
    if (lastChar === '@') toast.info('Mention member (@) functionality coming soon');
    if (lastChar === '#') toast.info('Tag channel (#) functionality coming soon');
  };

  if (!channel) return null;

  const isDm = channel.type === 'dm';
  const dmMember = channel.members?.[0];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Channel header */}
      <div className="flex items-center gap-2 px-3 md:px-5 py-3 border-b border-border dark:border-gray-700 shrink-0 bg-white dark:bg-gray-900">
        {/* Mobile sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden w-8 h-8 rounded-lg hover:bg-muted dark:hover:bg-gray-800 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
        >
          <Menu size={16} />
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isDm ? (
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold ${dmMember ? avatarColors[dmMember.avatar] || 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-600'}`}>
                {dmMember?.avatar || '?'}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 ${channel.online ? 'bg-green-500' : 'bg-slate-300'}`} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hash size={15} className="text-primary" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-foreground dark:text-white truncate">
              {isDm ? channel.name : `#${channel.name}`}
            </p>
            <p className="text-[11px] text-muted-foreground dark:text-gray-400 truncate">
              {isDm
                ? (channel.online ? 'Online now' : dmMember?.lastSeen || 'Offline')
                : `${channel.memberCount} members${channel.description ? ` · ${channel.description}` : ''}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {channel.waBridge && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg mr-2">
              <MessageSquare size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">WA Bridge Active</span>
            </div>
          )}
          <button
            onClick={() => toast.info('File upload coming soon')}
            className="w-8 h-8 rounded-lg hover:bg-muted dark:hover:bg-gray-800 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
          >
            <Paperclip size={15} />
          </button>
          <button
            onClick={onToggleInfo}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${
              infoPanelOpen
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground dark:hover:text-white'
            }`}
          >
            {infoPanelOpen ? <X size={15} /> : <Info size={15} />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto scrollbar-thin px-3 md:px-5 py-4 space-y-1"
        onClick={() => setEmojiPickerFor(null)}
      >
        {messages.map((msg, idx) => {
          const prevMsg = messages[idx - 1];
          const showDateSep =
            !prevMsg ||
            new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
          const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId || showDateSep;

          return (
            <React.Fragment key={msg.id}>
              {showDateSep && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border dark:bg-gray-700" />
                  <span className="text-[11px] font-medium text-muted-foreground dark:text-gray-400 px-2">
                    {formatDateSeparator(msg.timestamp)}
                  </span>
                  <div className="flex-1 h-px bg-border dark:bg-gray-700" />
                </div>
              )}

              <div
                className={`flex gap-2 md:gap-3 group relative ${msg.isMe ? 'flex-row-reverse' : 'flex-row'} ${showAvatar ? 'mt-3' : 'mt-0.5'}`}
              >
                {/* Avatar */}
                <div className="shrink-0 w-7 md:w-8">
                  {showAvatar ? (
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-semibold ${avatarColors[msg.senderAvatar] || 'bg-slate-100 text-slate-600'}`}>
                      {msg.senderAvatar}
                    </div>
                  ) : null}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col min-w-0 max-w-[calc(100%-3.5rem)] md:max-w-[60%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  {showAvatar && (
                    <div className={`flex items-baseline gap-2 mb-0.5 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[12.5px] font-semibold text-foreground dark:text-white">{msg.senderName}</span>
                      <span className="text-[10px] text-muted-foreground dark:text-gray-400 tabular-nums">
                        {formatMessageTime(msg.timestamp)}
                      </span>
                    </div>
                  )}

                  <div
                    className={`relative px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl text-[13px] md:text-[13.5px] leading-relaxed break-words whitespace-pre-wrap ${
                      msg.isMe
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-muted dark:bg-gray-800 text-foreground dark:text-white rounded-tl-sm'
                    }`}
                  >
                    {msg.content}

                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.attachments.map((att) => (
                          <div
                            key={`att-${msg.id}-${att.name}`}
                            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer ${msg.isMe ? 'bg-white/20 hover:bg-white/30' : 'bg-white dark:bg-gray-700 hover:bg-muted dark:hover:bg-gray-600 border border-border dark:border-gray-600'} transition-colors duration-150`}
                            onClick={() => toast.info(`Opening ${att.name}`)}
                          >
                            {att.type === 'image' ? (
                              <ImageIcon size={14} className={msg.isMe ? 'text-white' : 'text-primary'} />
                            ) : (
                              <FileText size={14} className={msg.isMe ? 'text-white' : 'text-muted-foreground'} />
                            )}
                            <div>
                              <p className={`text-[12px] font-medium truncate max-w-[120px] md:max-w-[150px] ${msg.isMe ? 'text-white' : 'text-foreground dark:text-white'}`}>
                                {att.name}
                              </p>
                              <p className={`text-[10px] ${msg.isMe ? 'text-white/70' : 'text-muted-foreground'}`}>
                                {att.size}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Status tick */}
                    {msg.isMe && (
                      <span className="absolute -bottom-4 right-0 text-muted-foreground dark:text-gray-500">
                        {msg.status === 'read' ? (
                          <CheckCheck size={12} className="text-primary" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck size={12} />
                        ) : (
                          <Check size={12} />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Reactions */}
                  {msg.reactions.length > 0 && (
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {msg.reactions.map((r) => (
                        <button
                          key={`react-${msg.id}-${r.emoji}`}
                          onClick={() => onReaction(msg.id, r.emoji)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] border transition-all duration-150 ${
                            r.byMe
                              ? 'bg-primary/10 border-primary/30 text-primary dark:bg-primary/20'
                              : 'bg-muted dark:bg-gray-800 border-border dark:border-gray-600 text-muted-foreground hover:border-primary/30'
                          }`}
                        >
                          {r.emoji} <span className="tabular-nums">{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover actions — positioned to avoid clipping */}
                <div className={`absolute top-0 ${msg.isMe ? 'left-10 md:left-12' : 'right-10 md:right-12'} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-white dark:bg-gray-800 border border-border dark:border-gray-600 rounded-lg shadow-dropdown px-1.5 py-1 -translate-y-1/2 z-10`}>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmojiPickerFor(emojiPickerFor === msg.id ? null : msg.id);
                      }}
                      className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
                    >
                      <Smile size={13} />
                    </button>
                    {emojiPickerFor === msg.id && (
                      <div
                        className={`absolute ${msg.isMe ? 'right-0' : 'left-0'} bottom-full mb-1 w-[150px] flex flex-wrap gap-1 bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-dropdown p-2 z-50 animate-fade-in`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {EMOJI_QUICK.map((emoji) => (
                          <button
                            key={`emoji-pick-${msg.id}-${emoji}`}
                            onClick={() => {
                              onReaction(msg.id, emoji);
                              setEmojiPickerFor(null);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted dark:hover:bg-gray-700 text-[16px] transition-colors duration-150"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toast.info('More options coming soon')}
                    className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
                  >
                    <MoreHorizontal size={13} />
                  </button>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 mt-3">
            <div className="w-8 h-8 rounded-full bg-muted dark:bg-gray-800 flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground">...</span>
            </div>
            <div className="bg-muted dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={`typing-dot-${i}`}
                  className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-3 md:px-5 py-3 md:py-4 border-t border-border dark:border-gray-700 shrink-0 bg-white dark:bg-gray-900">
        <div className="flex items-end gap-2 md:gap-3 bg-muted dark:bg-gray-800 rounded-xl px-3 md:px-4 py-2.5 md:py-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${isDm ? channel.name : `#${channel.name}`}...`}
            rows={1}
            className="flex-1 bg-transparent text-[13px] md:text-[13.5px] text-foreground dark:text-white placeholder:text-muted-foreground outline-none resize-none leading-relaxed max-h-32 scrollbar-thin min-w-0"
            style={{ minHeight: 22 }}
          />
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => toast.info('File upload coming soon')}
              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
            >
              <Paperclip size={15} />
            </button>
            <button
              onClick={() => toast.info('Emoji picker coming soon')}
              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150"
            >
              <Smile size={15} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all duration-150 ml-1"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
        <p className="text-[10px] md:text-[10.5px] text-muted-foreground dark:text-gray-500 mt-1.5 px-1">
          Enter untuk kirim · Shift+Enter untuk baris baru
          {channel.waBridge && (
            <span className="ml-2 text-emerald-600 dark:text-emerald-400">· WA Bridge aktif</span>
          )}
        </p>
      </div>
    </div>
  );
}