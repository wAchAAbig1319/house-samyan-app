import React, { createContext, useCallback, useContext, useState } from 'react';
import type { OwnedMovie } from '@/api/types';
import { moviesApi } from '@/api/movies';

interface LibraryContextValue {
  ownedMovieIds: Set<string>;
  continueWatching: OwnedMovie[];
  all: OwnedMovie[];
  isOwned: (movieId: string) => boolean;
  refresh: () => Promise<void>;
  markPurchased: (movieId: string) => void;
  updateProgress: (movieId: string, progressSeconds: number) => Promise<void>;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [ownedMovieIds, setOwnedMovieIds] = useState<Set<string>>(new Set());
  const [continueWatching, setContinueWatching] = useState<OwnedMovie[]>([]);
  const [all, setAll] = useState<OwnedMovie[]>([]);

  const refresh = useCallback(async () => {
    const { continueWatching: cw, all: allOwned } = await moviesApi.getLibrary();
    setContinueWatching(cw);
    setAll(allOwned);
    setOwnedMovieIds(new Set(allOwned.map((m) => m.id)));
  }, []);

  const isOwned = useCallback(
    (movieId: string) => ownedMovieIds.has(movieId),
    [ownedMovieIds],
  );

  // อัปเดต state ทันทีหลังซื้อสำเร็จ ไม่ต้องรอ refetch ทั้งก้อน
  const markPurchased = useCallback((movieId: string) => {
    setOwnedMovieIds((prev) => new Set(prev).add(movieId));
  }, []);

  // เรียกจาก PlayerScreen เป็นระยะๆ ระหว่างเล่นวิดีโอ เพื่อบันทึกตำแหน่งที่ดูค้างไว้
  // (mock — เก็บใน memory ผ่าน moviesApi.updateProgress ไม่ได้ persist ข้ามการรีโหลดแอป)
  const updateProgress = useCallback(async (movieId: string, progressSeconds: number) => {
    await moviesApi.updateProgress(movieId, progressSeconds);
    setAll((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, progressSeconds } : m)),
    );
    setContinueWatching((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, progressSeconds } : m)),
    );
  }, []);

  return (
    <LibraryContext.Provider
      value={{
        ownedMovieIds,
        continueWatching,
        all,
        isOwned,
        refresh,
        markPurchased,
        updateProgress,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}
