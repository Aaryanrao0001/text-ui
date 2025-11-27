/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, Message } from '../types';
import { listUsers, createUser as apiCreateUser, getConversation, sendMessage as apiSendMessage, type ApiUser, type ApiMessage } from '../api/api';

// Convert API user to UI User type
function toUiUser(apiUser: ApiUser): User {
  return {
    id: String(apiUser.id),
    username: apiUser.name,
    status: 'online', // Default status since API doesn't provide it
  };
}

// Convert API message to UI Message type
function toUiMessage(apiMessage: ApiMessage): Message {
  return {
    id: String(apiMessage.id),
    content: apiMessage.decrypted,
    senderId: String(apiMessage.sender_id),
    receiverId: String(apiMessage.recipient_id),
    timestamp: new Date(apiMessage.timestamp),
    status: 'delivered',
    encrypted: true,
  };
}

interface AppContextValue {
  // State
  currentUser: User | null;
  users: User[];
  selectedUser: User | undefined;
  selectedUserId: string | undefined;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;

  // Actions
  selectUser: (userId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  addUser: (name: string) => Promise<void>;
  getLastMessage: (userId: string) => { text: string; timestamp: string } | undefined;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  // Fetch users from API on mount - auto-select first user as logged-in user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const apiUsers = await listUsers();
        const uiUsers = apiUsers.map(toUiUser);
        setUsers(uiUsers);
        // Set the first user as the current (logged-in) user per requirements
        if (uiUsers.length > 0 && !currentUser) {
          setCurrentUser(uiUsers[0]);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch conversation when a user is selected
  useEffect(() => {
    if (!selectedUserId || !currentUser) return;

    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        const apiMessages = await getConversation(
          parseInt(currentUser.id, 10),
          parseInt(selectedUserId, 10)
        );
        const uiMessages = apiMessages.map((m) => toUiMessage(m));
        setMessages((prev) => ({
          ...prev,
          [selectedUserId]: uiMessages,
        }));
        setError(null);
      } catch (err) {
        console.error('Failed to fetch conversation:', err);
        // Don't set error state for conversation fetch - just show empty conversation
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversation();
  }, [selectedUserId, currentUser]);

  const selectUser = useCallback((userId: string) => {
    setSelectedUserId(userId);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedUserId || !currentUser) return;

      const tempId = `m${Date.now()}`;
      const newMessage: Message = {
        id: tempId,
        content,
        senderId: currentUser.id,
        receiverId: selectedUserId,
        timestamp: new Date(),
        status: 'sending',
        encrypted: true,
      };

      // Optimistically add the message
      setMessages((prev) => ({
        ...prev,
        [selectedUserId]: [...(prev[selectedUserId] || []), newMessage],
      }));

      try {
        // Send message via API
        await apiSendMessage(
          parseInt(currentUser.id, 10),
          parseInt(selectedUserId, 10),
          content
        );

        // Update message status to sent
        setMessages((prev) => ({
          ...prev,
          [selectedUserId]: prev[selectedUserId]?.map((m) =>
            m.id === tempId ? { ...m, status: 'sent' } : m
          ) || [],
        }));

        // Update to delivered after a short delay
        setTimeout(() => {
          setMessages((prev) => ({
            ...prev,
            [selectedUserId]: prev[selectedUserId]?.map((m) =>
              m.id === tempId ? { ...m, status: 'delivered' } : m
            ) || [],
          }));
        }, 500);

        setError(null);
      } catch (err) {
        console.error('Failed to send message:', err);
        // Mark message as error
        setMessages((prev) => ({
          ...prev,
          [selectedUserId]: prev[selectedUserId]?.map((m) =>
            m.id === tempId ? { ...m, status: 'error' } : m
          ) || [],
        }));
        setError('Failed to send message');
      }
    },
    [selectedUserId, currentUser]
  );

  const addUser = useCallback(async (name: string) => {
    if (!name.trim()) return;

    try {
      setIsLoading(true);
      const newUser = await apiCreateUser(name.trim());
      const uiUser = toUiUser(newUser);
      setUsers((prev) => [...prev, uiUser]);
      setError(null);
    } catch (err) {
      console.error('Failed to add user:', err);
      setError('Failed to add user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getLastMessage = useCallback(
    (userId: string) => {
      const userMessages = messages[userId];
      if (!userMessages || userMessages.length === 0) return undefined;

      const lastMsg = userMessages[userMessages.length - 1];
      const timeStr = new Date(lastMsg.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        text: lastMsg.content.length > 30 ? `${lastMsg.content.slice(0, 30)}...` : lastMsg.content,
        timestamp: timeStr,
      };
    },
    [messages]
  );

  const value: AppContextValue = {
    currentUser,
    users,
    selectedUser,
    selectedUserId,
    messages,
    isLoading,
    error,
    selectUser,
    sendMessage,
    addUser,
    getLastMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { AppContext };
