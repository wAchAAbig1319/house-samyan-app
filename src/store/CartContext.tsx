import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { CartItem, Movie } from '@/api/types';
import { cartApi } from '@/api/cart';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isInCart: (movieId: string) => boolean;
  addToCart: (movie: Movie) => Promise<void>;
  removeFromCart: (movieId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const itemCount = items.length;
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.movie.priceTHB, 0),
    [items],
  );

  const isInCart = useCallback(
    (movieId: string) => items.some((item) => item.movie.id === movieId),
    [items],
  );

  const refresh = useCallback(async () => {
    const cart = await cartApi.getCart();
    setItems(cart);
  }, []);

  // อัปเดต UI ทันที (optimistic) ไม่รอ response จาก server ก่อน ให้รู้สึกไวเหมือน Shopee
  const addToCart = useCallback(async (movie: Movie) => {
    setItems((prev) =>
      prev.some((i) => i.movie.id === movie.id)
        ? prev
        : [...prev, { movie, addedAt: new Date().toISOString() }],
    );
    try {
      await cartApi.addItem(movie.id);
    } catch (err) {
      // rollback ถ้า server ปฏิเสธ
      setItems((prev) => prev.filter((i) => i.movie.id !== movie.id));
      throw err;
    }
  }, []);

  const removeFromCart = useCallback(async (movieId: string) => {
    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.movie.id !== movieId));
    try {
      await cartApi.removeItem(movieId);
    } catch (err) {
      setItems(prevItems); // rollback
      throw err;
    }
  }, [items]);

  const clearCart = useCallback(async () => {
    const prevItems = items;
    setItems([]);
    try {
      await cartApi.clearCart();
    } catch (err) {
      setItems(prevItems);
      throw err;
    }
  }, [items]);

  const checkout = useCallback(async () => {
    await cartApi.checkout();
    setItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        isInCart,
        addToCart,
        removeFromCart,
        clearCart,
        refresh,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
