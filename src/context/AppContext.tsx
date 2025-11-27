/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, Message } from '../types';
import {
  listUsers,
  createUser as apiCreateUser,
  getConversation,
  sendMessage as apiSendMessage,
  getContactSummaries as apiGetContactSummaries,
  markConversationRead as apiMarkConversationRead,
  type ApiUser,
  type ApiMessage,
  type ContactSummary,
} from '../api/api';

const CURRENT_USER_KEY = 'currentUserId';
const DEFAULT_CONTACT_NAME = 'goutam kumar';
const GREETING_MESSAGES = [
  "Welcome to my project! 🎉 Feel free to explore and let me know if you have any suggestions.",
  "Hey there! Welcome! I'd love to hear your thoughts on how we can improve this app.",
  "Hi! Thanks for joining. Got any ideas to make this even better? Let me know!",
  "Welcome aboard! 🚀 Your feedback and suggestions are always appreciated.",
  "Hello and welcome! If you have any cool suggestions, I'm all ears!",
];

// Helper to convert string ID to number for API calls
function toApiId(id: string): number {
  return parseInt(id, 10);
}

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
    read: apiMessage.read,
    decrypted: apiMessage.decrypted,
  };
}

// Get a random greeting message
function getRandomGreeting(): string {
  return GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
}

export interface UiContactSummary {
  contactId: string;
  contactName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface AppContextValue {
  // State
  currentUser: User | null;
  users: User[];
  selectedUser: User | undefined;
  selectedUserId: string | undefined;
  messages: Record<string, Message[]>;
  contactSummaries: UiContactSummary[];
  isLoading: boolean;
  error: string | null;
  showLoginModal: boolean;

  // Actions
  selectUser: (userId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  addUser: (name: string) => Promise<void>;
  getLastMessage: (userId: string) => { text: string; timestamp: string } | undefined;
  getUnreadCount: (userId: string) => number;
  refreshUsers: () => Promise<void>;
  refreshConversation: () => Promise<void>;
  refreshContactSummaries: () => Promise<void>;
  loginUser: (userId: string) => void;
  createAndLoginUser: (name: string) => Promise<void>;
  setShowLoginModal: (show: boolean) => void;
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
  const [contactSummaries, setContactSummaries] = useState<UiContactSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  // Seed default contact "goutam kumar" and send greeting message
  const seedDefaultContact = useCallback(async (newUserId: number) => {
    try {
      // Fetch all users to check if goutam kumar exists
      const allUsers = await listUsers();
      let goutamUser = allUsers.find(
        (u) => u.name.toLowerCase() === DEFAULT_CONTACT_NAME.toLowerCase()
      );

      // Create goutam kumar if not exists
      if (!goutamUser) {
        goutamUser = await apiCreateUser(DEFAULT_CONTACT_NAME);
      }

      // Send greeting message from goutam to the new user
      await apiSendMessage(goutamUser.id, newUserId, getRandomGreeting());
    } catch (err) {
      console.error('Failed to seed default contact:', err);
    }
  }, []);

  // Refresh users from API
  const refreshUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiUsers = await listUsers();
      const uiUsers = apiUsers.map(toUiUser);
      setUsers(uiUsers);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh contact summaries
  const refreshContactSummaries = useCallback(async () => {
    if (!currentUser) return;
    try {
      const summaries = await apiGetContactSummaries(toApiId(currentUser.id));
      const uiSummaries: UiContactSummary[] = summaries.map((s: ContactSummary) => ({
        contactId: String(s.contact_id),
        contactName: s.contact_name,
        lastMessage: s.last_message,
        lastMessageTime: s.last_message_time,
        unreadCount: s.unread_count,
      }));
      setContactSummaries(uiSummaries);
    } catch (err) {
      console.error('Failed to fetch contact summaries:', err);
      // Don't set error - summaries are optional enhancement
    }
  }, [currentUser]);

  // Refresh conversation with selected user
  const refreshConversation = useCallback(async () => {
    if (!selectedUserId || !currentUser) return;
    try {
      setIsLoading(true);
      const apiMessages = await getConversation(
        toApiId(currentUser.id),
        toApiId(selectedUserId)
      );
      const uiMessages = apiMessages.map((m) => toUiMessage(m));
      setMessages((prev) => ({
        ...prev,
        [selectedUserId]: uiMessages,
      }));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUserId, currentUser]);

  // Initialize app - check localStorage for existing user
  useEffect(() => {
    const initApp = async () => {
      try {
        setIsLoading(true);
        const apiUsers = await listUsers();
        const uiUsers = apiUsers.map(toUiUser);
        setUsers(uiUsers);

        // Check localStorage for saved user
        const savedUserId = localStorage.getItem(CURRENT_USER_KEY);
        if (savedUserId) {
          const savedUser = uiUsers.find((u) => u.id === savedUserId);
          if (savedUser) {
            setCurrentUser(savedUser);
            setInitialized(true);
            setError(null);
            return;
          }
        }

        // No saved user - show login modal
        setShowLoginModal(true);
        setInitialized(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError('Failed to connect to server');
        setShowLoginModal(true);
        setInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  // Refresh contact summaries when current user changes
  useEffect(() => {
    if (currentUser && initialized) {
      refreshContactSummaries();
    }
  }, [currentUser, initialized, refreshContactSummaries]);

  // Fetch conversation when a user is selected
  useEffect(() => {
    if (!selectedUserId || !currentUser) return;

    const fetchAndMarkRead = async () => {
      try {
        setIsLoading(true);
        const apiMessages = await getConversation(
          toApiId(currentUser.id),
          toApiId(selectedUserId)
        );
        const uiMessages = apiMessages.map((m) => toUiMessage(m));
        setMessages((prev) => ({
          ...prev,
          [selectedUserId]: uiMessages,
        }));

        // Mark conversation as read
        try {
          await apiMarkConversationRead(
            toApiId(currentUser.id),
            toApiId(selectedUserId)
          );
          // Refresh contact summaries to update unread count
          refreshContactSummaries();
        } catch {
          // Silently fail - mark as read is optional
        }

        setError(null);
      } catch (err) {
        console.error('Failed to fetch conversation:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndMarkRead();
  }, [selectedUserId, currentUser, refreshContactSummaries]);

  // Login existing user
  const loginUser = useCallback(
    (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem(CURRENT_USER_KEY, userId);
        setShowLoginModal(false);
      }
    },
    [users]
  );

  // Create new user and login
  const createAndLoginUser = useCallback(
    async (name: string) => {
      if (!name.trim()) return;
      try {
        setIsLoading(true);
        const newUser = await apiCreateUser(name.trim());
        const uiUser = toUiUser(newUser);
        setUsers((prev) => [...prev, uiUser]);
        setCurrentUser(uiUser);
        localStorage.setItem(CURRENT_USER_KEY, uiUser.id);
        setShowLoginModal(false);

        // Seed default contact for new user
        await seedDefaultContact(newUser.id);

        // Refresh users and contact summaries
        await refreshUsers();
        await refreshContactSummaries();

        setError(null);
      } catch (err) {
        console.error('Failed to create user:', err);
        setError('Failed to create user');
      } finally {
        setIsLoading(false);
      }
    },
    [seedDefaultContact, refreshUsers, refreshContactSummaries]
  );

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
          toApiId(currentUser.id),
          toApiId(selectedUserId),
          content
        );

        // Update message status to sent
        setMessages((prev) => ({
          ...prev,
          [selectedUserId]: prev[selectedUserId]?.map((m) =>
            m.id === tempId ? { ...m, status: 'sent' } : m
          ) || [],
        }));

        // Refresh conversation to get server-side message
        await refreshConversation();

        // Refresh contact summaries to update last message
        await refreshContactSummaries();

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
        throw err; // Re-throw to allow caller to handle error state
      }
    },
    [selectedUserId, currentUser, refreshConversation, refreshContactSummaries]
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
      // First try contact summaries
      const summary = contactSummaries.find((s) => s.contactId === userId);
      if (summary && summary.lastMessage) {
        const text = summary.lastMessage.length > 30
          ? `${summary.lastMessage.slice(0, 30)}...`
          : summary.lastMessage;
        return {
          text,
          timestamp: summary.lastMessageTime
            ? new Date(summary.lastMessageTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '',
        };
      }

      // Fallback to local messages
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
    [messages, contactSummaries]
  );

  const getUnreadCount = useCallback(
    (userId: string) => {
      const summary = contactSummaries.find((s) => s.contactId === userId);
      return summary?.unreadCount ?? 0;
    },
    [contactSummaries]
  );

  const value: AppContextValue = {
    currentUser,
    users,
    selectedUser,
    selectedUserId,
    messages,
    contactSummaries,
    isLoading,
    error,
    showLoginModal,
    selectUser,
    sendMessage,
    addUser,
    getLastMessage,
    getUnreadCount,
    refreshUsers,
    refreshConversation,
    refreshContactSummaries,
    loginUser,
    createAndLoginUser,
    setShowLoginModal,
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
