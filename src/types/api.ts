/**
 * API Types for FastAPI backend integration
 * These match the backend's data models
 */

export interface User {
  id: number;
  name: string;
}

export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  ciphertext: string;
  nonce: string;
  timestamp: string;
  decrypted?: string;
}

export interface HealthResponse {
  status: string;
}

export interface MetricsResponse {
  [key: string]: unknown;
}
