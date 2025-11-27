// Core types for the application - User and Message interfaces
// These are used throughout the app for type safety

export interface User {
  id: string;
  username: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  encrypted?: boolean;
  read?: boolean;
  decrypted?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface CommandItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
}
