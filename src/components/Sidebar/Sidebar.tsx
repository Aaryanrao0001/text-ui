import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '../../types';
import { UserItem } from '../UserItem';
import styles from './Sidebar.module.css';

interface SidebarProps {
  users: User[];
  selectedUserId?: string;
  onSelectUser: (userId: string) => void;
  onAddUser?: () => void;
  getLastMessage?: (userId: string) => { text: string; timestamp: string } | undefined;
  getUnreadCount?: (userId: string) => number;
  isOpen?: boolean;
  searchUserById?: (userId: string) => Promise<User | null>;
  addContact?: (user: User) => void;
  currentUserId?: string;
}

export function Sidebar({
  users,
  selectedUserId,
  onSelectUser,
  onAddUser,
  getLastMessage,
  getUnreadCount,
  isOpen = true,
  searchUserById,
  addContact,
  currentUserId,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Check if search query is a valid user ID (positive integer)
  const isIdSearch = /^\d+$/.test(searchQuery.trim()) && parseInt(searchQuery.trim(), 10) > 0;

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchById = async () => {
    if (!searchUserById || !isIdSearch) return;
    
    setIsSearching(true);
    setSearchError('');
    setSearchedUser(null);
    
    try {
      const user = await searchUserById(searchQuery.trim());
      if (user) {
        // Check if this is the current user
        if (user.id === currentUserId) {
          setSearchError('You cannot add yourself as a contact');
        } else {
          setSearchedUser(user);
        }
      } else {
        setSearchError('User not found');
      }
    } catch {
      setSearchError('Failed to search for user');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddContact = () => {
    if (!addContact || !searchedUser) return;
    
    addContact(searchedUser);
    setSearchedUser(null);
    setSearchQuery('');
    setSearchError('');
  };

  const handleOpenChat = () => {
    if (!searchedUser) return;
    
    onSelectUser(searchedUser.id);
    setSearchedUser(null);
    setSearchQuery('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSearchedUser(null);
    setSearchError('');
  };

  // Check if searched user already exists in contacts
  const isAlreadyContact = searchedUser && users.some(u => u.id === searchedUser.id);

  return (
    <motion.aside
      className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.sidebarHeader}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search contacts or enter ID..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <svg className={styles.searchIcon} viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>

        {/* Search by ID button */}
        {isIdSearch && searchUserById && !searchedUser && (
          <button
            className={styles.searchByIdButton}
            onClick={handleSearchById}
            disabled={isSearching}
          >
            {isSearching ? (
              <span className={styles.searchingIndicator}>Searching...</span>
            ) : (
              <>Search for user #{searchQuery.trim()}</>
            )}
          </button>
        )}

        {/* Search error */}
        {searchError && (
          <div className={styles.searchError}>{searchError}</div>
        )}

        {/* Found user result */}
        {searchedUser && (
          <div className={styles.searchResult}>
            <div className={styles.searchResultUser}>
              <div className={styles.searchResultAvatar}>
                {searchedUser.username.charAt(0).toUpperCase()}
              </div>
              <div className={styles.searchResultInfo}>
                <span className={styles.searchResultName}>{searchedUser.username}</span>
                <span className={styles.searchResultId}>ID: {searchedUser.id}</span>
              </div>
            </div>
            {isAlreadyContact ? (
              <button
                className={styles.alreadyContactButton}
                onClick={handleOpenChat}
              >
                Open Chat
              </button>
            ) : (
              <button
                className={styles.addContactButton}
                onClick={handleAddContact}
              >
                Add Contact
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.sectionLabel}>Contacts</div>

      <div className={styles.userList}>
        <AnimatePresence mode="popLayout">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => {
              const lastMsg = getLastMessage?.(user.id);
              const unread = getUnreadCount?.(user.id) ?? 0;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <UserItem
                    user={user}
                    isSelected={selectedUserId === user.id}
                    lastMessage={lastMsg?.text}
                    timestamp={lastMsg?.timestamp}
                    unreadCount={unread}
                    onClick={() => onSelectUser(user.id)}
                  />
                </motion.div>
              );
            })
          ) : (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className={styles.emptyIcon} viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className={styles.emptyText}>
                {searchQuery ? 'No contacts found' : 'No contacts yet'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.sidebarFooter}>
        <button className={styles.addUserButton} onClick={onAddUser}>
          <svg className={styles.addIcon} viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add Contact
        </button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
