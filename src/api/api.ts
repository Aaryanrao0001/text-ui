import type { User, Message, HealthResponse, MetricsResponse } from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Re-export types for convenience
export type { User as ApiUser, Message as ApiMessage } from '../types/api';

export async function createUser(name: string): Promise<User> {
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

export async function listUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users/`);
  if (!res.ok) {
    throw new Error(`Failed to list users: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function sendMessage(sender_id: number, recipient_id: number, message: string): Promise<Message> {
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

export async function getConversation(userA: number, userB: number): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/conversations/${userA}/${userB}`);
  if (!res.ok) {
    throw new Error(`Failed to get conversation: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/healthz`);
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getMetrics(): Promise<MetricsResponse> {
  const res = await fetch(`${API_BASE}/metrics`);
  if (!res.ok) {
    throw new Error(`Failed to get metrics: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
