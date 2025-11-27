import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CommandItem } from '../../types';
import styles from './CommandPalette.module.css';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      // Reset state when opening the palette
      setTimeout(() => {
        setQuery('');
        setActiveIndex(0);
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[activeIndex]) {
            filteredCommands[activeIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filteredCommands, activeIndex, onClose]
  );

  const handleCommandClick = (command: CommandItem) => {
    command.action();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className={styles.palette}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.searchSection}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                ref={inputRef}
                className={styles.searchInput}
                type="text"
                placeholder="Type a command..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
              />
              <span className={styles.shortcut}>ESC</span>
            </div>

            <div className={styles.commandList}>
              <div className={styles.sectionLabel}>Commands</div>
              {filteredCommands.length > 0 ? (
                filteredCommands.map((command, index) => (
                  <div
                    key={command.id}
                    className={`${styles.commandItem} ${index === activeIndex ? styles.active : ''}`}
                    onClick={() => handleCommandClick(command)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {command.icon && (
                      <svg className={styles.commandIcon} viewBox="0 0 24 24">
                        <path d={command.icon} />
                      </svg>
                    )}
                    <span className={styles.commandLabel}>{command.label}</span>
                    {command.shortcut && (
                      <div className={styles.commandShortcut}>
                        {command.shortcut.split('+').map((key, i) => (
                          <span key={i} className={styles.key}>{key}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>No commands found</div>
              )}
            </div>

            <div className={styles.footer}>
              <div className={styles.footerHint}>
                <span className={styles.key}>↑</span>
                <span className={styles.key}>↓</span>
                to navigate
              </div>
              <div className={styles.footerHint}>
                <span className={styles.key}>↵</span>
                to select
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
