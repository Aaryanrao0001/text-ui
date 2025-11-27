import { useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '../../types';
import styles from './LoginModal.module.css';

type ModalView = 'login' | 'create' | 'success';

interface LoginModalProps {
  isOpen: boolean;
  onLoginById: (userId: string) => Promise<boolean>;
  onCreate: (name: string) => Promise<User | null>;
  onClose: () => void;
  isLoading?: boolean;
}

export function LoginModal({
  isOpen,
  onLoginById,
  onCreate,
  onClose,
  isLoading = false,
}: LoginModalProps) {
  const [view, setView] = useState<ModalView>('login');
  const [loginId, setLoginId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleLoginById = async () => {
    if (!loginId.trim() || isLoading) return;
    setLoginError('');
    const success = await onLoginById(loginId.trim());
    if (!success) {
      setLoginError('Invalid ID. Please check and try again.');
    }
  };

  const handleCreate = async () => {
    if (!newUserName.trim() || isLoading) return;
    const user = await onCreate(newUserName.trim());
    if (user) {
      setCreatedUser(user);
      setView('success');
    }
  };

  const handleCopyId = async () => {
    if (!createdUser) return;
    try {
      await navigator.clipboard.writeText(createdUser.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy ID:', err);
    }
  };

  const handleProceedToChat = () => {
    setCreatedUser(null);
    setNewUserName('');
    setLoginId('');
    setLoginError('');
    setView('login');
    setCopied(false);
    onClose();
  };

  const handleKeyDownLogin = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLoginById();
    }
  };

  const handleKeyDownCreate = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
  };

  const resetToLogin = () => {
    setView('login');
    setNewUserName('');
    setLoginId('');
    setLoginError('');
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
              {view === 'success' && createdUser ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>🎉</div>
                  <h3 className={styles.successTitle}>Account Created!</h3>
                  <p className={styles.welcomeText}>Welcome, {createdUser.username}!</p>
                  
                  <label className={styles.idLabel}>Your unique ID:</label>
                  <div className={styles.idDisplay}>
                    <span className={styles.idValue}>{createdUser.id}</span>
                    <button
                      className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                      onClick={handleCopyId}
                      title="Copy ID"
                    >
                      {copied ? '✓' : '📋'}
                    </button>
                  </div>
                  
                  <p className={styles.warningText}>
                    ⚠️ Save this ID! You'll need it to login.
                  </p>
                  
                  <button
                    className={styles.primaryButton}
                    onClick={handleProceedToChat}
                  >
                    Proceed to Chat
                  </button>
                </div>
              ) : view === 'create' ? (
                <div className={styles.createForm}>
                  <label className={styles.label}>Enter your name</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Your name..."
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    onKeyDown={handleKeyDownCreate}
                    autoFocus
                    disabled={isLoading}
                  />
                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.secondaryButton}
                      onClick={resetToLogin}
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
                  <label className={styles.label}>Enter your ID to login</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Your ID..."
                    value={loginId}
                    onChange={(e) => {
                      setLoginId(e.target.value);
                      setLoginError('');
                    }}
                    onKeyDown={handleKeyDownLogin}
                    autoFocus
                    disabled={isLoading}
                  />
                  {loginError && (
                    <p className={styles.errorText}>{loginError}</p>
                  )}
                  <button
                    className={styles.primaryButton}
                    onClick={handleLoginById}
                    disabled={!loginId.trim() || isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                  <div className={styles.divider}>
                    <span>or</span>
                  </div>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setView('create')}
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
