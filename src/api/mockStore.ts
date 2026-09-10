import { MOCK_INITIAL_OWNED } from './mockData';

// ============================================================================
// SHARED MOCK STORE — แหล่งความจริงเดียวสำหรับ "หนังที่ซื้อแล้ว"
//
// เดิม movies.ts และ cart.ts ต่างคนต่างเก็บสถานะ owned ของตัวเอง ทำให้ซื้อผ่าน
// ตะกร้า (cart.ts) แล้วไม่โผล่ในกล่องฟิล์ม (ซึ่งอ่านจาก movies.ts) ไฟล์นี้รวม
// สถานะไว้ที่เดียว ทั้งซื้อทีละเรื่องและซื้อจากตะกร้าจะอัปเดตที่นี่เหมือนกัน
// ============================================================================

export interface OwnedRecord {
  progressSeconds: number;
  watched: boolean;
  purchasedAt: string;
}

let ownedState: Record<string, OwnedRecord> = { ...MOCK_INITIAL_OWNED };

export function getOwnedState(): Record<string, OwnedRecord> {
  return ownedState;
}

export function isMovieOwned(movieId: string): boolean {
  return !!ownedState[movieId];
}

// เรียกตอนซื้อสำเร็จ ไม่ว่าจะซื้อทีละเรื่อง (moviesApi.purchase) หรือซื้อจากตะกร้า (cartApi.checkout)
export function markOwned(movieId: string): void {
  if (ownedState[movieId]) return; // ซื้อซ้ำไม่ต้องรีเซ็ต progress ที่มีอยู่แล้ว
  ownedState = {
    ...ownedState,
    [movieId]: {
      progressSeconds: 0,
      watched: false,
      purchasedAt: new Date().toISOString(),
    },
  };
}

export function setProgress(movieId: string, progressSeconds: number): void {
  if (!ownedState[movieId]) return;
  ownedState = {
    ...ownedState,
    [movieId]: { ...ownedState[movieId], progressSeconds },
  };
}
