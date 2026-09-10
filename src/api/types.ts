// ตรงกับตัวเลือกใน field "Status" ของหน้า admin Movie Management
export type MovieStatus = 'active' | 'suspended';

// ตรงกับตัวเลือกใน field "Rate" — เรตติ้งภาพยนตร์ไทย (ท / น13+ / น15+ / น18+ / น20+)
export type MovieRating = 'ท' | 'น13+' | 'น15+' | 'น18+' | 'น20+';

// ตรงกับตัวเลือกใน field "Genre" ของหน้า admin — เลือกได้สูงสุด 2 อันต่อเรื่อง
export const GENRE_OPTIONS = ['Action', 'Horror', 'Drama', 'Thriller'] as const;
export type Genre = (typeof GENRE_OPTIONS)[number];

// ตรงกับตัวเลือกใน field "Sub genre" ของหน้า admin — เลือกได้สูงสุด 2 อันต่อเรื่อง
// เช่นกัน (ซ้อนทับกับ Genre บางตัวได้ เช่น เลือก Genre เป็น Action แล้วยังเลือก
// Sub genre เป็น Scifi เพิ่มเพื่อระบุให้ละเอียดขึ้น)
export const SUB_GENRE_OPTIONS = [
  'Action',
  'Horror',
  'Drama',
  'Thriller',
  'Documentary',
  'Scifi',
  'Award',
] as const;
export type SubGenre = (typeof SUB_GENRE_OPTIONS)[number];

export interface Movie {
  id: string;
  // ----- ตรงกับ field "Status" ในหน้า admin: Activate / Suspend -----
  status: MovieStatus;
  title: string;
  titleEn?: string;
  // ----- ตรงกับ tab "language TH"/"language EN" ในหน้า admin -----
  // Short Description (บังคับกรอกในฟอร์ม admin) — คำโปรยสั้นๆ ใช้แสดงในแอป
  shortDescription: string;
  shortDescriptionEn?: string;
  // Description (rich text, ไม่บังคับในฟอร์ม admin) — เนื้อหายาวกว่า ยังไม่ได้
  // เอามาโชว์ที่ไหนในแอปตอนนี้ แต่เก็บโครงไว้ให้ตรงกับฟอร์ม admin
  description?: string;
  descriptionEn?: string;
  // ----- ตรงกับ "Movie Category" -----
  // Genre / Sub genre: เลือกได้สูงสุด 2 อันต่อ field (ตรงกับฟอร์ม admin) —
  // ฝั่ง UI (ฟอร์มเพิ่ม/แก้หนัง) เป็นคนบังคับ limit 2 ตอนกด toggle, ที่นี่แค่
  // เก็บเป็น array ธรรมดา ไม่ validate ซ้ำ
  genre: Genre[];
  subGenre: SubGenre[];
  country: string;
  year: number;
  // ----- ตรงกับ "Duration (min)" -----
  runtimeMinutes: number;
  // ----- ตรงกับ "Rate" -----
  rating: MovieRating;
  // ----- ตรงกับ "Subtitle Language" -----
  subtitleLanguage: string;
  // ----- ตรงกับ "Start Release" / "End Release" (ช่วงวันที่จัดฉาย) — ISO date string -----
  startRelease: string;
  endRelease: string;
  // ----- ตรงกับ "Booking Date Member" / "Booking Date Regular" (วันเปิดจองล่วงหน้า) -----
  bookingDateMember?: string;
  bookingDateRegular?: string;
  // ----- ตรงกับ "Voucher" (Used/No Used) และ "Gift Voucher" (Used/Not Used) -----
  // หมายถึง: หนังเรื่องนี้รับคูปองส่วนลด/ใช้ gift voucher แลกได้หรือไม่
  voucherEligible: boolean;
  giftVoucherEligible: boolean;
  // ----- โปรโมชั่น/ส่วนลด (ไม่บังคับ) -----
  // ราคาเต็มก่อนลด — ใช้โชว์คู่กับราคาใหม่แบบขีดฆ่า ถ้าเรื่องนี้ไม่มีโปรโมชั่น
  // ก็ไม่ต้องใส่ field นี้เลย (undefined = ไม่มีส่วนลด)
  originalPriceTHB?: number;
  // เปอร์เซ็นต์ส่วนลด เช่น 20 = ลด 20% — priceTHB ด้านล่างควรเท่ากับ
  // originalPriceTHB * (1 - discountPercent / 100) ปัดเศษแล้ว (คำนวณมือไว้ใน
  // mockData.ts เพราะเป็น static data ถ้าต่อ backend จริงค่อยคำนวณฝั่ง server)
  discountPercent?: number;
  // ราคาที่ลูกค้าจ่ายจริง — ถ้ามีโปรโมชั่นคือราคาหลังหักส่วนลดแล้ว ทุกที่ในแอป
  // ที่ใช้ราคาไปคำนวณ (ตะกร้า, เช็คเอาต์, สถิติ) ใช้ field นี้เหมือนเดิมทั้งหมด
  priceTHB: number;
  // ----- รูปภาพจริง (ถ้ามี) — ต้องเป็นรูปที่มีสิทธิ์ใช้เท่านั้น ห้ามใส่ลิงก์จาก
  // เว็บที่มีลิขสิทธิ์หนัง (เช่น Flixster, IMDb ฯลฯ) โดยไม่ได้รับอนุญาต
  // ถ้าไม่ใส่ (undefined) แอปจะ fallback ไปใช้ gradient จาก accentColor แทน -----
  // posterUrl: แนวตั้ง (portrait) ใช้ในการ์ดหนัง (หน้าแรก, ค้นหา, กล่องฟิล์ม)
  posterUrl?: string;
  // bannerUrl: แนวนอน (landscape) ใช้ใน Hero/หน้ารายละเอียด/ดูค้างไว้ในกล่องฟิล์ม
  bannerUrl?: string;
  // ----- ใช้สร้าง "โปสเตอร์"/"แบนเนอร์" ของหนังขึ้นเองในโค้ด (ไล่สี 2 สี: [เข้ม, เด่น])
  // แทนรูปภาพจริง เผื่อกรณีไม่มี posterUrl/bannerUrl -----
  accentColor: [string, string];
  trailerUrl?: string;
  // ลิงก์ไฟล์วิดีโอเรื่องเต็ม (จากเน็ต/CDN) เล่นผ่าน PlayerScreen (expo-av)
  videoUrl?: string;
  // ไฟล์วิดีโอที่แปะไว้ในโปรเจกต์เอง (local asset) — ใช้ require() เช่น
  // videoAsset: require('../../assets/videos/sample.mp4')
  // เหมาะสำหรับทดลองเล่นตอน dev ก่อนมีไฟล์จริงบน CDN ถ้าใส่ทั้งคู่ PlayerScreen
  // จะเล่น videoAsset (ไฟล์ในเครื่อง) ก่อน videoUrl เสมอ
  videoAsset?: number;
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
