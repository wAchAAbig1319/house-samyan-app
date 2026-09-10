// ต้องโหลดฟอนต์เหล่านี้ผ่าน expo-font ก่อนใช้งาน (ดู src/theme/loadFonts.ts)
// ดาวน์โหลดไฟล์ฟอนต์จาก Google Fonts แล้ววางไว้ที่ assets/fonts/ ตามชื่อไฟล์ด้านล่าง

export const fontFamily = {
  display: 'Fraunces-SemiBold', // หัวข้อ/ชื่อหนัง สไตล์ป้ายหนังคลาสสิก
  displayItalic: 'Fraunces-SemiBoldItalic',
  body: 'IBMPlexSansThai-Regular', // เนื้อหาทั่วไป รองรับไทย
  bodyMedium: 'IBMPlexSansThai-Medium',
  bodySemiBold: 'IBMPlexSansThai-SemiBold',
  mono: 'IBMPlexMono-Regular', // ราคา / เวลาฉาย / metadata แบบตั๋ว
} as const;

export const fontSize = {
  eyebrow: 10,
  caption: 11,
  body: 13,
  bodyLarge: 14.5,
  title: 16,
  heroTitle: 30,
  detailTitle: 25,
} as const;
