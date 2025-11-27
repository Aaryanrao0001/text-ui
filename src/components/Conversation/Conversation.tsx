import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import type { User, Message } from '../../types';
import { MessageBubble } from '../MessageBubble';
import { Composer } from '../Composer';
import styles from './Conversation.module.css';

interface ConversationProps {
  user?: User;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function Conversation({
  user,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  isLoading = false,
}: ConversationProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const prevUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Show decrypting effect when user changes
    if (user && user.id !== prevUserIdRef.current && messages.length > 0) {
      prevUserIdRef.current = user.id;
      // Use requestAnimationFrame to defer setState and avoid synchronous update warning
      const rafId = requestAnimationFrame(() => {
        setIsDecrypting(true);
      });
      const timer = setTimeout(() => setIsDecrypting(false), 300);
      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timer);
      };
    }
    if (!user) {
      prevUserIdRef.current = undefined;
    }
  }, [user, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';

    messages.forEach((message) => {
      const messageDate = dayjs(message.timestamp).format('YYYY-MM-DD');
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: messageDate, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  };

  const formatDateLabel = (date: string) => {
    const messageDate = dayjs(date);
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');

    if (messageDate.isSame(today, 'day')) return 'Today';
    if (messageDate.isSame(yesterday, 'day')) return 'Yesterday';
    return messageDate.format('MMM D, YYYY');
  };

  if (!user) {
    return (
      <div className={styles.conversation}>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
          <h3 className={styles.emptyTitle}>Select a Contact</h3>
          <p className={styles.emptyText}>
            Choose a contact from the sidebar to start an encrypted conversation.
          </p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className={styles.conversation}>
      <motion.div
        className={styles.conversationHeader}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button className={styles.backButton} onClick={onBack} title="Back to contacts">
          <svg viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        <div className={styles.userAvatar}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            getInitials(user.username)
          )}
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userName}>{user.username}</div>
          <div className={styles.userStatus}>
            <span className={`${styles.statusDot} ${styles[user.status]}`} />
            {user.status === 'online' ? 'Online' : user.status === 'away' ? 'Away' : 'Offline'}
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.headerButton} title="Voice call">
            <svg viewBox="0 0 24 24">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
          </button>
          <button className={styles.headerButton} title="Video call">
            <svg viewBox="0 0 24 24">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </button>
          <button className={styles.headerButton} title="More options">
            <svg viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </motion.div>

      <div className={styles.messagesContainer}>
        <AnimatePresence>
          {isDecrypting && (
            <motion.div
              className={styles.decryptingOverlay}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.decryptingContent}>
                <svg className={styles.decryptingIcon} viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <span className={styles.decryptingText}>Decrypting Messages</span>
                <div className={styles.shimmerBar} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <h3 className={styles.emptyTitle}>End-to-End Encrypted</h3>
            <p className={styles.emptyText}>
              Messages are secured with end-to-end encryption. Start the conversation!
            </p>
          </div>
        ) : (
          messageGroups.map((group) => (
            <div key={group.date}>
              <div className={styles.dateLabel}>
                <span className={styles.dateBadge}>{formatDateLabel(group.date)}</span>
              </div>
              {group.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isSent={message.senderId === currentUserId}
                />
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <Composer onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
}

export default Conversation;
