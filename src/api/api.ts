// api.ts (top)
const rawBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
export const API_BASE = rawBase.replace(/\/+$/, ''); // remove trailing slashes

export interface ApiUser {
  id: number;
  name: string;
}

export interface ApiMessage {
  id: number;
  sender_id: number;
  recipient_id: number;
  ciphertext: string;
  nonce: string;
  timestamp: string;
  decrypted: string;
  read?: boolean;
}

export interface ContactSummary {
  contact_id: number;
  contact_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface HealthStatus {
  status: string;
}

export async function createUser(name: string): Promise<ApiUser> {
  const res = await fetch(`${API_BASE}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!res.ok) {
    throw new Error(`Failed to create user: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function listUsers(): Promise<ApiUser[]> {
  const res = await fetch(`${API_BASE}/users/`);
  if (!res.ok) {
    throw new Error(`Failed to list users: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getUser(userId: number): Promise<ApiUser> {
  const res = await fetch(`${API_BASE}/users/${userId}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('User not found');
    }
    throw new Error(`Failed to get user: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function sendMessage(sender_id: number, recipient_id: number, message: string): Promise<ApiMessage> {
  const res = await fetch(`${API_BASE}/messages/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender_id, recipient_id, message })
  });
  if (!res.ok) {
    throw new Error(`Failed to send message: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getConversation(userA: number, userB: number): Promise<ApiMessage[]> {
  const res = await fetch(`${API_BASE}/conversations/${userA}/${userB}`);
  if (!res.ok) {
    throw new Error(`Failed to get conversation: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error(`Failed to get health status: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getContactSummaries(userId: number): Promise<ContactSummary[]> {
  const res = await fetch(`${API_BASE}/conversations/user/${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to get contact summaries: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function markConversationRead(userId: number, contactId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/conversations/${userId}/${contactId}/read`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`Failed to mark conversation read: ${res.status} ${res.statusText}`);
  }
}
