// Metro bundler เลือกไฟล์ที่ตรง platform ให้อัตโนมัติ:
//   - รันบน TV (EXPO_TV=1)      -> MovieCard.tv.tsx
//   - รันบนมือถือ/แท็บเล็ตปกติ -> MovieCard.mobile.tsx
// ไฟล์นี้แค่ export type ให้ import จากที่อื่นได้สะดวก
export type { MovieCardProps } from './MovieCard.types';
export { MovieCard } from './MovieCard';
