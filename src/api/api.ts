// API Base URL - defaults to http://127.0.0.1:5173/ if VITE_API_URL is not set
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5173/';

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
