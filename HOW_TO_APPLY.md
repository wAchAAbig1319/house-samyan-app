# วิธีใช้

แตกไฟล์ zip นี้แล้ว copy ไปทับที่ root ของโปรเจกต์ — **ไม่มี dependency ใหม่**
แค่ reload JS ก็เห็นผล ไม่ต้อง rebuild native

## เจอบั๊กจริง 2 ตัว ไม่ใช่แค่ "ยังไม่ได้ทำ"

เช็คโค้ดที่ให้มาแล้วพบว่าฟีเจอร์ resume/continue-watching เขียนไว้ถูกทิศทางแล้ว
แต่มีบั๊กที่ทำให้ผลลัพธ์จริงเป็น "ไม่เคยเซฟ progress เลย" อยู่ 2 จุด:

### บั๊กที่ 1 (ตัวหลัก): progress ไม่เคยถูกเซฟจริง ไม่ว่าหนังจะสั้นหรือยาว

โค้ดเดิมใน `PlayerScreen.tsx`:
```js
useEffect(() => {
  if (!status?.isLoaded || !status.isPlaying || !movie) return;
  const positionSeconds = Math.floor(status.positionMillis / 1000);
  const interval = setInterval(() => {
    updateProgress(movie.id, positionSeconds).catch(console.error);
  }, 5000);
  return () => clearInterval(interval);
}, [status, movie, updateProgress]);
```

ปัญหาคือ `status` เป็น dependency ของ `useEffect` นี้ตรงๆ แต่ `status` เปลี่ยนค่า
ทุกครั้งที่ `onPlaybackStatusUpdate` ยิง ซึ่ง expo-av ยิงถี่มาก (ประมาณทุก 500ms)
ผลคือ effect นี้ **cleanup แล้วสร้าง `setInterval` ใหม่ทุก 500ms** — ตัว
`setInterval(..., 5000)` เลย**ไม่เคยอยู่ได้นานพอจะยิงสักครั้งในชีวิต** เท่ากับ
progress ไม่เคยถูกเซฟเลยระหว่างเล่น ไม่ว่าจะดูหนังสั้นแค่ไหนหรือยาวแค่ไหนก็ตาม
(ที่คุณเทสแล้วไม่เห็น progress เลยสักครั้ง คือผลจากบั๊กนี้ตรงๆ)

**วิธีแก้:** แยกการอัปเดต "ตำแหน่งล่าสุด" ออกจากตัว `setInterval` — เก็บตำแหน่ง
ล่าสุดไว้ใน `useRef` (อัปเดตได้ถี่ๆ โดยไม่ทำให้ interval ถูกทำลาย) แล้วตั้ง
`setInterval` แค่ครั้งเดียวตอนรู้จักหนังเรื่องนั้น อ่านค่าจาก ref ทุกครั้งที่ tick
แทน วิธีนี้ interval อยู่ครบ 5 วินาทีจริง ไม่โดนรีเซ็ตกลางคัน

เพิ่มอีกชั้นเผื่อไว้: ถ้าออกจากหน้าเล่นก่อนครบ 5 วินาที (คลิปสั้นมาก หรือกด
ย้อนกลับเร็ว) จะเซฟตำแหน่งล่าสุดที่รู้อีกทีตอน unmount กันไม่ให้หลุดหายไปเฉยๆ

### บั๊กที่ 2: ไม่มีอะไรมาร์ก "ดูจบแล้ว" เลยสักที่

เช็คทั้งโปรเจกต์แล้วไม่พบว่ามีจุดไหนเซ็ต `watched: true` ให้หนังเลย แปลว่าต่อให้
ดูจบเรื่องจริงๆ ก็จะไม่ได้ badge ✓ ในกล่องฟิล์ม และค้างอยู่ในแถว "Continue
Watching" ตลอดไปไม่มีวันหลุด (เพราะ `continueWatching` กรองจาก
`!watched && progressSeconds > 0`)

**วิธีแก้:** เพิ่ม `markWatched()` เข้าไปในทุกชั้น (`mockStore.ts` →
`movies.ts` → `LibraryContext.tsx`) แล้วเรียกใน `PlayerScreen.tsx` ตอนตรวจพบ
`status.didJustFinish === true` (ค่านี้ expo-av ส่งมาให้เองตอนวิดีโอเล่นจบ
โดยธรรมชาติ — ของเดิมมีค่านี้ให้ใช้อยู่แล้วแต่ไม่มีใครอ่านมันเลย)

## ไฟล์ที่แก้

- `src/screens/PlayerScreen.tsx` — แก้บั๊กที่ 1, เพิ่มการเรียก `markWatched`
  ตอนดูจบ (บั๊กที่ 2)
- `src/store/LibraryContext.tsx` — เพิ่ม `markWatched()` เข้า context
- `src/api/movies.ts` — เพิ่ม endpoint `markWatched`
- `src/api/mockStore.ts` — เพิ่มฟังก์ชัน `setWatched()`

## ทดสอบยังไง

1. เปิดหนังเรื่องที่มีวิดีโอจริง ปล่อยให้เล่นไปสัก **6-10 วินาที** (เกิน 5 วิ
   ที่ interval รอบแรกจะ tick) แล้วกดย้อนกลับ
2. ไปหน้า Library — คราวนี้ควรเห็นเรื่องนั้นทั้งในแถว "Continue Watching" และมี
   เส้น progress ใต้โปสเตอร์ในกริดด้านล่างด้วย
3. เข้าไปดูอีกครั้ง — ควรเล่นต่อจากวินาทีที่ค้างไว้จริง
4. ปล่อยให้เล่นจนจบคลิป (หรือลากแถบไปท้ายสุดแล้วรอ) — กลับไป Library ควรเห็น
   badge ✓ แทน ไม่อยู่ในแถว Continue Watching อีกต่อไป

## เจอเพิ่มอีกเรื่อง (ไม่เกี่ยวกับที่ถาม แต่ควรรู้ไว้)

ตอนรัน type-check เจอว่า `mockData.ts` มีหนัง 2 เรื่องขาด field `country` กับ
`year` ไป (บรรทัดประมาณ 21 และ 55) — TypeScript คอมไพล์ผ่านอยู่ดีเพราะ Metro
ไม่ได้ type-check เข้มตอน bundle จริง แต่ 2 เรื่องนี้อาจจะโชว์ประเทศ/ปีเป็นค่า
ว่างหรือพังตอนแสดงผลได้ ลองเช็คดูว่าตั้งใจเว้นไว้จริงหรือพิมพ์ตกหล่นครับ
