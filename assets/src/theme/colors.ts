// สีทั้งหมดยึดตาม design mockup ที่ตกลงกันไว้
// (โรงหนังมืดอุ่น, ทองมาร์คีย์, เบอร์กันดีเบาะที่นั่ง, เขียวฟิล์มเนกาทีฟ)

export const colors = {
  ink: '#100C09',
  ink2: '#1A1410',
  ink3: '#241C16',

  marquee: '#D9A441', // ปุ่มหลัก / แถบราคา / ไฮไลต์
  marqueeDim: '#8C6A2C',

  velvet: '#7A2E37', // ปุ่มซื้อ
  velvetBright: '#9C3E48',

  reel: '#4C6E62', // สถานะ "เก็บแล้ว"
  reelBright: '#6B9686',

  stub: '#EAE0C8', // ข้อความหลัก/สีสว่าง
  ash: '#9C9184', // ข้อความรอง
  ash2: '#6B6459', // ข้อความจาง/label

  line: 'rgba(234,224,200,0.10)',

  // สีเฉพาะสถานะโฟกัสบน TV เท่านั้น (ไม่ใช้บนมือถือ)
  tvFocusRing: '#D9A441',
} as const;

export type ColorToken = keyof typeof colors;
