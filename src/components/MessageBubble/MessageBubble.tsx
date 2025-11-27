import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import type { Message } from '../../types';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  isDecrypting?: boolean;
}

export function MessageBubble({ message, isSent, isDecrypting = false }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return dayjs(date).format('HH:mm');
  };

  const getStatusIcon = () => {
    if (!isSent) return null;

    switch (message.status) {
      case 'sending':
        return (
          <svg className={styles.statusIcon} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
        );
      case 'sent':
        return (
          <svg className={styles.statusIcon} viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        );
      case 'delivered':
        return (
          <svg className={`${styles.statusIcon} ${styles.delivered}`} viewBox="0 0 24 24">
            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
          </svg>
        );
      case 'read':
        return (
          <svg className={`${styles.statusIcon} ${styles.read}`} viewBox="0 0 24 24">
            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
          </svg>
        );
      case 'error':
        return (
          <svg className={styles.statusIcon} viewBox="0 0 24 24" style={{ fill: 'var(--neon-magenta)' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const statusClasses = [
    styles.messageBubble,
    isSent ? styles.sent : styles.received,
    message.status === 'sending' ? styles.sending : '',
    message.status === 'error' ? styles.error : '',
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={statusClasses}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      layout
    >
      <div className={`${styles.bubble} ${isDecrypting ? styles.decrypting : ''}`}>
        <span className={styles.content}>
          {isDecrypting ? 'Decrypting...' : message.content}
        </span>
      </div>
      <div className={styles.meta}>
        <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
        {getStatusIcon()}
        {message.encrypted && (
          <span className={styles.encryptedBadge}>
            <svg className={styles.lockIconSmall} viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default MessageBubble;
