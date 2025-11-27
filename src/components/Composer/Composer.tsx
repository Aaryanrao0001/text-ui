import { useState, useRef, type KeyboardEvent, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import styles from './Composer.module.css';

interface ComposerProps {
  onSend: (message: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function Composer({
  onSend,
  placeholder = 'Type a secure message...',
  maxLength = 2000,
  disabled = false,
}: ComposerProps) {
  const [message, setMessage] = useState('');
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setMessage(e.target.value);
    }
  };

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
  };

  const charCountClass = () => {
    const remaining = maxLength - message.length;
    if (remaining <= 0) return styles.error;
    if (remaining <= 100) return styles.warning;
    return '';
  };

  return (
    <motion.div
      className={styles.composer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className={styles.inputWrapper}>
        <textarea
          className={`${styles.input} ${message.length > 0 ? styles.typing : ''}`}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
        />
        {message.length > maxLength - 200 && (
          <span className={`${styles.charCount} ${charCountClass()}`}>
            {maxLength - message.length}
          </span>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.actionButton} type="button" title="Attach file">
          <svg viewBox="0 0 24 24">
            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
          </svg>
        </button>

        <button
          ref={buttonRef}
          className={styles.sendButton}
          onClick={(e) => {
            createRipple(e);
            handleSend();
          }}
          disabled={!message.trim() || disabled}
          type="button"
          title="Send message"
        >
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              className={styles.ripple}
              style={{ left: ripple.x, top: ripple.y }}
            />
          ))}
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export default Composer;
