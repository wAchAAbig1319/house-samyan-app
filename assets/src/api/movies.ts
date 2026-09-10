import type { Movie, OwnedMovie } from './types';
import {
  MOCK_MOVIES,
  MOCK_HOME_ROWS,
  HERO_MOVIE_ID,
} from './mockData';
import { getOwnedState, markOwned, setProgress } from './mockStore';

// ============================================================================
// MOCK API — ไม่มีการเรียก network ใดๆ ในไฟล์นี้
//
// โปรเจกต์นี้ยังไม่มี backend จริง (ดู README) จึงจำลองพฤติกรรมของ apiClient
// เดิมไว้ที่นี่แทน: ดีเลย์เล็กน้อยให้ยังรู้สึกเหมือนเรียก API จริง แล้วคืนค่า
// จาก mockData.ts ตรงๆ สถานะ "ซื้อแล้ว" ใช้ร่วมกับ cart.ts ผ่าน mockStore.ts
// เพื่อให้ซื้อจากตะกร้าหรือซื้อทีละเรื่องก็โผล่ในกล่องฟิล์มเหมือนกัน
//
// เมื่อมี backend จริงแล้ว ให้แก้ไฟล์นี้กลับไปเรียก apiClient จาก './client'
// ตามโครง endpoint ที่คอมเมนต์ไว้ในแต่ละฟังก์ชันด้านล่าง
// ============================================================================

const MOCK_DELAY_MS = 300;

function resolveAfterDelay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

function findMovieOrThrow(id: string): Movie {
  const movie = MOCK_MOVIES.find((m) => m.id === id);
  if (!movie) throw new Error(`ไม่พบหนังรหัส ${id} ใน mock data`);
  return movie;
}

function toOwnedMovie(movie: Movie): OwnedMovie {
  const owned = getOwnedState()[movie.id];
  return {
    ...movie,
    purchasedAt: owned.purchasedAt,
    progressSeconds: owned.progressSeconds,
    durationSeconds: movie.runtimeMinutes * 60,
    watched: owned.watched,
  };
}

export const moviesApi = {
  // เดิม: apiClient.get('/movies/home')
  getHomeFeed: () =>
    resolveAfterDelay({
      hero: findMovieOrThrow(HERO_MOVIE_ID),
      rows: MOCK_HOME_ROWS.map((row) => ({
        title: row.title,
        movies: row.ids.map(findMovieOrThrow),
      })),
    }),

  // เดิม: apiClient.get(`/movies/${id}`)
  getMovie: (id: string) => resolveAfterDelay(findMovieOrThrow(id)),

  // เดิม: apiClient.get(`/movies/${id}/similar`)
  getSimilar: (id: string) => {
    const current = findMovieOrThrow(id);
    const rest = MOCK_MOVIES.filter((m) => m.id !== id);
    const sameGenre = rest.filter((m) => m.genre === current.genre);
    const others = rest.filter((m) => m.genre !== current.genre);
    return resolveAfterDelay([...sameGenre, ...others].slice(0, 4));
  },

  // เดิม: apiClient.post(`/movies/${movieId}/purchase`)
  purchase: (movieId: string) => {
    findMovieOrThrow(movieId); // จะ throw ถ้า id ไม่มีจริง เหมือนพฤติกรรม backend
    markOwned(movieId);
    return resolveAfterDelay({ purchaseId: `mock-purchase-${movieId}-${Date.now()}` });
  },

  // เดิม: apiClient.get('/library')
  getLibrary: () => {
    const all = Object.keys(getOwnedState()).map((id) => toOwnedMovie(findMovieOrThrow(id)));
    const continueWatching = all.filter((m) => !m.watched && m.progressSeconds > 0);
    return resolveAfterDelay({ continueWatching, all });
  },

  // เดิม: apiClient.post(`/library/${movieId}/progress`, { progressSeconds })
  updateProgress: (movieId: string, progressSeconds: number) => {
    setProgress(movieId, progressSeconds);
    return resolveAfterDelay(undefined);
  },

  // ใหม่: ค้นหาในคลัง mock ทั้งหมด ใช้โดย SearchScreen (ของเดิมยังไม่ได้ต่อ API ค้นหา)
  search: (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return resolveAfterDelay<Movie[]>([]);
    const results = MOCK_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.titleEn ?? '').toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q),
    );
    return resolveAfterDelay(results);
  },

  // ใหม่: รายชื่อแนวหนังทั้งหมดที่มีอยู่จริงในคลัง ใช้เรนเดอร์ filter chip ในหน้าค้นหา
  getGenres: () =>
    resolveAfterDelay(Array.from(new Set(MOCK_MOVIES.map((m) => m.genre))).sort()),

  // ใหม่: ช่วงราคาต่ำสุด/สูงสุดที่มีอยู่จริงในคลัง ใช้ตั้งค่าเริ่มต้นของ price range
  getPriceBounds: () => {
    const prices = MOCK_MOVIES.map((m) => m.priceTHB);
    return resolveAfterDelay({ min: Math.min(...prices), max: Math.max(...prices) });
  },

  // ใหม่: ค้นหาแบบมีตัวกรอง — คำค้น (ไม่บังคับ) + แนวหนัง (เลือกได้หลายอัน) + ช่วงราคา
  // ถ้าไม่ใส่คำค้นแต่เลือกตัวกรองไว้ ก็ยังคืนผลลัพธ์ตามตัวกรองได้ (โหมด "เลือกดู" ไม่ต้องพิมพ์)
  searchAdvanced: (params: {
    query?: string;
    genres?: string[];
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const { query = '', genres = [], minPrice, maxPrice } = params;
    const q = query.trim().toLowerCase();

    let results = MOCK_MOVIES.slice();

    if (q) {
      results = results.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.titleEn ?? '').toLowerCase().includes(q) ||
          m.genre.toLowerCase().includes(q) ||
          m.country.toLowerCase().includes(q),
      );
    }
    if (genres.length > 0) {
      results = results.filter((m) => genres.includes(m.genre));
    }
    if (typeof minPrice === 'number') {
      results = results.filter((m) => m.priceTHB >= minPrice);
    }
    if (typeof maxPrice === 'number') {
      results = results.filter((m) => m.priceTHB <= maxPrice);
    }

    return resolveAfterDelay(results);
  },
};
