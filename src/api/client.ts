import type { ApiResponse } from './types';

// ⚠️ ไม่ได้ถูกเรียกใช้งานอยู่ตอนนี้ — src/api/movies.ts และ src/api/cart.ts
// เปลี่ยนไปใช้ mock data (src/api/mockData.ts) แทนแล้ว เพื่อให้แอปรันเป็น
// mockup ได้โดยไม่ต้องมี backend เก็บไฟล์นี้ไว้เผื่อวันที่มี backend จริง
// ค่อยกลับไปแก้ movies.ts / cart.ts ให้เรียกใช้ apiClient นี้อีกครั้ง

// อ่านจาก .env — ดู .env.example
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `Request failed: ${res.status}`);
  }

  return json.data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
};
