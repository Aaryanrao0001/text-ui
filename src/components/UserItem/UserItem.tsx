import { motion } from 'framer-motion';
import type { User } from '../../types';
import styles from './UserItem.module.css';

interface UserItemProps {
  user: User;
  isSelected?: boolean;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  onClick?: () => void;
}

export function UserItem({
  user,
  isSelected = false,
  lastMessage,
  timestamp,
  unreadCount = 0,
  onClick,
}: UserItemProps) {
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <motion.div
      className={`${styles.userItem} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className={styles.avatarImage} />
          ) : (
            getInitials(user.username)
          )}
        </div>
        <span className={`${styles.statusIndicator} ${styles[user.status]}`} />
      </div>

      <div className={styles.userInfo}>
        <span className={styles.username}>{user.username}</span>
        {lastMessage && <span className={styles.lastMessage}>{lastMessage}</span>}
      </div>

      <div className={styles.meta}>
        {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
        {unreadCount > 0 && (
          <motion.span
            className={styles.unreadBadge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

export default UserItem;
