import { useState, useEffect, useCallback } from 'react';
import type { CommandItem } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Conversation } from './components/Conversation';
import { CommandPalette } from './components/CommandPalette';
import { LoginModal } from './components/LoginModal';
import { useApp } from './context/AppContext';
import './App.css';

function App() {
  const {
    currentUser,
    users,
    selectedUser,
    selectedUserId,
    messages,
    isLoading,
    error,
    showLoginModal,
    selectUser,
    sendMessage,
    addUser,
    getLastMessage,
    getUnreadCount,
    loginById,
    createAndLoginUser,
    setShowLoginModal,
    searchUserById,
    addContact,
  } = useApp();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const currentUserId = currentUser?.id || '';

  // Filter out the current user from the contacts list
  const contactUsers = users.filter((u) => u.id !== currentUser?.id);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectUser = useCallback((userId: string) => {
    selectUser(userId);
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  }, [selectUser]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      await sendMessage(content);
    },
    [sendMessage]
  );

  // Handle adding a new user
  const handleAddUser = useCallback(async () => {
    const name = prompt('Enter the name for the new contact:');
    if (!name || !name.trim()) return;
    await addUser(name);
  }, [addUser]);

  const commands: CommandItem[] = [
    {
      id: 'add-user',
      label: 'Add new contact',
      icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
      shortcut: '⌘+N',
      action: () => {
        setIsCommandPaletteOpen(false);
        handleAddUser();
      },
    },
    {
      id: 'jump-chat',
      label: 'Jump to chat',
      icon: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z',
      shortcut: '⌘+J',
      action: () => setIsCommandPaletteOpen(false),
    },
    {
      id: 'settings',
      label: 'Open settings',
      icon: 'M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
      shortcut: '⌘+,',
      action: () => alert('Settings coming soon!'),
    },
    {
      id: 'toggle-theme',
      label: 'Toggle dark mode',
      icon: 'M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z',
      action: () => alert('Theme toggle coming soon!'),
    },
    {
      id: 'search',
      label: 'Search messages',
      icon: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
      shortcut: '⌘+F',
      action: () => alert('Search coming soon!'),
    },
  ];

  return (
    <div className="app">
      {/* Ambient particles */}
      <div className="particles">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <Header isConnected={users.length > 0 && !error} />

      <main className="mainContent">
        <Sidebar
          users={contactUsers}
          selectedUserId={selectedUserId}
          onSelectUser={handleSelectUser}
          onAddUser={handleAddUser}
          getLastMessage={getLastMessage}
          getUnreadCount={getUnreadCount}
          isOpen={isSidebarOpen}
          searchUserById={searchUserById}
          addContact={addContact}
          currentUserId={currentUserId}
        />

        <Conversation
          user={selectedUser}
          messages={selectedUserId ? messages[selectedUserId] || [] : []}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onBack={() => setIsSidebarOpen(true)}
          isLoading={isLoading}
        />
      </main>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />

      <LoginModal
        isOpen={showLoginModal}
        onLoginById={loginById}
        onCreate={createAndLoginUser}
        onClose={() => setShowLoginModal(false)}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
