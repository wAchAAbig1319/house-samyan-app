export interface Movie {
  id: string;
  title: string;
  titleEn?: string;
  genre: string;
  country: string;
  year: number;
  runtimeMinutes: number;
  synopsis: string;
  priceTHB: number;
  // ใช้สร้าง "โปสเตอร์"/"แบนเนอร์" ของหนังขึ้นเองในโค้ด (ไล่สี 2 สี: [เข้ม, เด่น])
  // แทนรูปภาพจริง เพราะไม่มีสิทธิ์ใช้โปสเตอร์หนังจริงที่มีลิขสิทธิ์
  accentColor: [string, string];
  trailerUrl?: string;
  isClassic: boolean;
}

export interface OwnedMovie extends Movie {
  purchasedAt: string;
  progressSeconds: number;
  durationSeconds: number;
  watched: boolean;
}

export interface CartItem {
  movie: Movie;
  addedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
