import { useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '../../types';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  users: User[];
  onLogin: (userId: string) => void;
  onCreate: (name: string) => Promise<void>;
  isLoading?: boolean;
}

export function LoginModal({
  isOpen,
  users,
  onLogin,
  onCreate,
  isLoading = false,
}: LoginModalProps) {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newUserName.trim() || isLoading) return;
    await onCreate(newUserName.trim());
    setNewUserName('');
    setIsCreateMode(false);
  };

  const handleLogin = () => {
    if (selectedUserId) {
      onLogin(selectedUserId);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.header}>
              <svg className={styles.lockIcon} viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <h2 className={styles.title}>Secure Chat</h2>
              <p className={styles.subtitle}>End-to-end encrypted messaging</p>
            </div>

            <div className={styles.content}>
              {isCreateMode ? (
                <div className={styles.createForm}>
                  <label className={styles.label}>Enter your name</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Your name..."
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    disabled={isLoading}
                  />
                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.secondaryButton}
                      onClick={() => setIsCreateMode(false)}
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button
                      className={styles.primaryButton}
                      onClick={handleCreate}
                      disabled={!newUserName.trim() || isLoading}
                    >
                      {isLoading ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {users.length > 0 ? (
                    <>
                      <label className={styles.label}>Select your account</label>
                      <div className={styles.userList}>
                        {users.map((user) => (
                          <button
                            key={user.id}
                            className={`${styles.userItem} ${selectedUserId === user.id ? styles.selected : ''}`}
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            <div className={styles.avatar}>
                              {user.username.slice(0, 2).toUpperCase()}
                            </div>
                            <span className={styles.userName}>{user.username}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        className={styles.primaryButton}
                        onClick={handleLogin}
                        disabled={!selectedUserId || isLoading}
                      >
                        Continue
                      </button>
                    </>
                  ) : (
                    <p className={styles.emptyText}>No existing accounts found.</p>
                  )}
                  <div className={styles.divider}>
                    <span>or</span>
                  </div>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setIsCreateMode(true)}
                    disabled={isLoading}
                  >
                    Create New Account
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;
