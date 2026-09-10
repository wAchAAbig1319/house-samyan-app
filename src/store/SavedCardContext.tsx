import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// SAVED CARD CONTEXT
//
// ฟีเจอร์ "จำบัตรไว้ให้ครั้งหน้า" — persist ลงเครื่องจริงผ่าน AsyncStorage
// เปิดแอปใหม่ก็ยังเห็นบัตรที่บันทึกไว้อยู่ (ไม่ใช่แค่ในเซสชันปัจจุบัน)
//
// ⚠️ สำคัญ: เก็บเฉพาะข้อมูล "แสดงผล" แบบ mask แล้วเท่านั้น (brand, เลข 4
// ตัวท้าย, วันหมดอายุ, ชื่อบนบัตร) — ไม่เก็บเลขบัตรเต็มหรือ CVV ไว้ที่ไหนเลย
// แม้จะ persist ลงดิสก์แล้วก็ตาม เพราะของจริงต้องให้ SDK ของผู้ให้บริการอย่าง
// Omise/2C2P/Stripe เป็นคน tokenize บัตรแทน แล้วเก็บแค่ token/card ID ที่เขา
// ออกให้ ฝั่งเราไม่ควรแตะเลขบัตรเต็มเลยด้วยซ้ำ (ผิด PCI-DSS ถ้าทำเอง) —
// AsyncStorage เองก็ไม่ได้เข้ารหัส จึงยิ่งห้ามเก็บของอ่อนไหวจริงลงไปตรง ๆ
// ============================================================================

const STORAGE_KEY = 'houseSamyan.savedCard';

export interface SavedCard {
  brand: string | null;
  last4: string;
  expiry: string; // MM/YY แค่ไว้โชว์ผล ไม่ใช่ข้อมูลอ่อนไหวเท่าเลขเต็ม/CVV
  cardName: string;
}

interface SavedCardContextValue {
  savedCard: SavedCard | null;
  saveCard: (card: SavedCard) => void;
  clearCard: () => void;
  // true ระหว่างที่ยังอ่านค่าจาก AsyncStorage ไม่เสร็จตอนเปิดแอป — ใช้กัน
  // UI โชว์ฟอร์มกรอกบัตรวาบขึ้นมาก่อนแล้วค่อยสลับเป็นบัตรที่บันทึกไว้
  isLoading: boolean;
}

const SavedCardContext = createContext<SavedCardContextValue | null>(null);

export function SavedCardProvider({ children }: { children: React.ReactNode }) {
  const [savedCard, setSavedCard] = useState<SavedCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // โหลดบัตรที่เคยบันทึกไว้ตอนแอปเปิดขึ้นมาครั้งแรก
  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) return;
        setSavedCard(JSON.parse(raw) as SavedCard);
      })
      .catch((err) => {
        console.error('Failed to load saved card from storage:', err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const saveCard = useCallback((card: SavedCard) => {
    setSavedCard(card);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(card)).catch((err) => {
      console.error('Failed to persist saved card:', err);
    });
  }, []);

  const clearCard = useCallback(() => {
    setSavedCard(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch((err) => {
      console.error('Failed to remove saved card from storage:', err);
    });
  }, []);

  return (
    <SavedCardContext.Provider value={{ savedCard, saveCard, clearCard, isLoading }}>
      {children}
    </SavedCardContext.Provider>
  );
}

export function useSavedCard(): SavedCardContextValue {
  const ctx = useContext(SavedCardContext);
  if (!ctx) throw new Error('useSavedCard must be used within a SavedCardProvider');
  return ctx;
}
