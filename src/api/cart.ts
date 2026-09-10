import type { CartItem, Movie } from './types';
import { MOCK_MOVIES } from './mockData';
import { markOwned } from './mockStore';

// ============================================================================
// MOCK CART API — ไม่มีการเรียก network ใดๆ ในไฟล์นี้
// เก็บสถานะตะกร้าไว้ในหน่วยความจำระหว่างที่แอปเปิดอยู่ (รีเซ็ตเมื่อรีโหลดแอป)
// checkout() จะสั่ง markOwned() ผ่าน mockStore.ts (สถานะเดียวกับ movies.ts)
// เพื่อให้หนังที่ซื้อจากตะกร้าโผล่ในกล่องฟิล์มทันที
//
// เมื่อมี backend จริงแล้ว ให้แก้ไฟล์นี้กลับไปเรียก apiClient จาก './client'
// ตามโครง endpoint เดิม (เช่น GET /cart, POST /cart/items, POST /cart/checkout)
// ============================================================================

const MOCK_DELAY_MS = 250;

function resolveAfterDelay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

function findMovieOrThrow(id: string): Movie {
  const movie = MOCK_MOVIES.find((m) => m.id === id);
  if (!movie) throw new Error(`ไม่พบหนังรหัส ${id} ใน mock data`);
  return movie;
}

let cartState: CartItem[] = [];

export const cartApi = {
  // เดิม: apiClient.get('/cart')
  getCart: () => resolveAfterDelay(cartState),

  // เดิม: apiClient.post('/cart/items', { movieId })
  addItem: (movieId: string) => {
    const movie = findMovieOrThrow(movieId);
    if (!cartState.some((item) => item.movie.id === movieId)) {
      cartState = [...cartState, { movie, addedAt: new Date().toISOString() }];
    }
    return resolveAfterDelay(cartState);
  },

  // เดิม: apiClient.post('/cart/items/remove', { movieId })
  removeItem: (movieId: string) => {
    cartState = cartState.filter((item) => item.movie.id !== movieId);
    return resolveAfterDelay(cartState);
  },

  // เดิม: apiClient.post('/cart/clear')
  clearCart: () => {
    cartState = [];
    return resolveAfterDelay(cartState);
  },

  // เดิม: apiClient.post('/cart/checkout')
  checkout: () => {
    const purchaseIds = cartState.map((item) => {
      markOwned(item.movie.id); // ← จุดสำคัญ: ทำให้หนังโผล่ในกล่องฟิล์มจริง
      return `mock-purchase-${item.movie.id}-${Date.now()}`;
    });
    cartState = [];
    return resolveAfterDelay({ purchaseIds });
  },
};
