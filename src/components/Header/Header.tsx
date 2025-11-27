import { motion } from 'framer-motion';
import styles from './Header.module.css';

interface HeaderProps {
  isConnected?: boolean;
}

export function Header({ isConnected = true }: HeaderProps) {
  return (
    <motion.header 
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.logoSection}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoGlow} />
          <svg className={styles.logoIcon} viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
          </svg>
        </div>
        <h1 className={styles.appName}>
          Cyber<span>Chat</span>
        </h1>
      </div>

      <div className={styles.statusSection}>
        <div className={styles.encryptionBadge}>
          <svg className={styles.lockIcon} viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          End-to-End Encrypted
        </div>

        <div className={styles.connectionStatus}>
          <span className={`${styles.statusDot} ${!isConnected ? styles.offline : ''}`} />
          {isConnected ? 'Secure Channel' : 'Reconnecting...'}
        </div>
      </div>

      <div className={styles.cornerVent} />
    </motion.header>
  );
}

export default Header;
