# บ้าน — House Samyan Film App

แอปซื้อหนังทีละเรื่อง (ไม่ใช่ subscription) ธีมตาม House Samyan โรงหนังอินดี้ในสามย่านมิตรทาวน์
รองรับมือถือ, แท็บเล็ต (แนวตั้ง/แนวนอน) และ Android TV/กล่อง IPTV จาก codebase เดียวกัน

---

## 🎬 สถานะปัจจุบัน — mockup ล้วนๆ ไม่มี backend

**ตอนนี้แอปรันได้ครบทุกหน้าโดยไม่ต้องมี server ใดๆ ทั้งสิ้น**

`src/api/movies.ts` และ `src/api/cart.ts` ไม่เรียก network แล้ว แต่คืนข้อมูลจาก
`src/api/mockData.ts` ตรงๆ (หน่วงเวลาเล็กน้อยด้วย `setTimeout` ให้ยังรู้สึกเหมือนเรียก API จริง)
หน้าจอทุกหน้า — Home, ค้นหา, รายละเอียดหนัง, ตะกร้า, กล่องฟิล์ม — ใช้งานได้จริงครบ รวมถึง
flow ซื้อหนัง (กด "ซื้อตั๋วเรื่องนี้" หรือเช็คเอาต์จากตะกร้า → นับถอยหลัง 3-2-1 แบบ `CountdownLeader`
→ ขึ้น "เป็นของคุณแล้ว") สถานะตะกร้า/การซื้อจะเก็บไว้ในหน่วยความจำระหว่างที่แอปเปิดอยู่
(รีเซ็ตเมื่อรีโหลดแอป)

`src/api/client.ts` (ตัวเรียก fetch จริง) ยังอยู่ในโปรเจกต์แต่ไม่ได้ถูกเรียกใช้แล้ว
เผื่อวันที่มี backend จริง — ตอนนั้นแก้ `src/api/movies.ts` และ `src/api/cart.ts` กลับไปเรียก
`apiClient` ตามโครง endpoint ที่คอมเมนต์ไว้ในแต่ละฟังก์ชัน (เช่น `GET /movies/home`,
`POST /movies/:id/purchase`, `POST /cart/checkout`) ก็จะต่อกับ backend จริงได้ทันที
โดยไม่ต้องแก้หน้าจอไหนเลย เพราะ shape ข้อมูลเหมือนเดิมทุกอย่าง

---

## 1. สิ่งที่ต้องติดตั้งก่อน (Prerequisites)

| เครื่องมือ | เวอร์ชันแนะนำ | เช็คด้วยคำสั่ง |
|---|---|---|
| Node.js | 20 LTS ขึ้นไป | `node -v` |
| npm หรือ pnpm | npm ที่มากับ Node ก็พอ | `npm -v` |
| Expo CLI | ไม่ต้องติดตั้งแยก ใช้ `npx expo` ได้เลย | — |
| Android Studio (สำหรับรัน Android/Android TV emulator) | เวอร์ชันล่าสุด | เปิดโปรแกรมได้ = โอเค |
| Xcode (สำหรับรัน iOS, ต้องเป็น Mac เท่านั้น) | เวอร์ชันล่าสุด | `xcodebuild -version` |
| แอป **Expo Go** บนมือถือจริง (ทางเลือกแทน emulator) | โหลดจาก App Store/Play Store | — |

---

## 2. ติดตั้งโปรเจกต์

```bash
# 1) แตกไฟล์ zip แล้วเข้าไปที่โฟลเดอร์โปรเจกต์
cd house-samyan-app

# 2) ติดตั้ง dependency ทั้งหมด
npm install
```

### ฟอนต์ (สำคัญ ห้ามข้าม)

โปรเจกต์นี้อ้างอิงไฟล์ฟอนต์ที่ **ไม่ได้แนบมาด้วย** (ต้องดาวน์โหลดเองเพราะเป็นไฟล์ลิขสิทธิ์ Google Fonts
ไม่ควรฝังมากับซอร์สโค้ดตรงๆ) ให้ทำตามนี้:

1. ดาวน์โหลดฟอนต์จาก Google Fonts:
   - [Fraunces](https://fonts.google.com/specimen/Fraunces) — เอาน้ำหนัก SemiBold และ SemiBold Italic
   - [IBM Plex Sans Thai](https://fonts.google.com/specimen/IBM+Plex+Sans+Thai) — เอา Regular, Medium, SemiBold
   - [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) — เอา Regular

2. เอาไฟล์ `.ttf` ที่ได้ไปวางไว้ที่ `assets/fonts/` โดยตั้งชื่อไฟล์ให้ตรงกับที่ `src/theme/loadFonts.ts` อ้างถึง:
   ```
   assets/fonts/Fraunces-SemiBold.ttf
   assets/fonts/Fraunces-SemiBoldItalic.ttf
   assets/fonts/IBMPlexSansThai-Regular.ttf
   assets/fonts/IBMPlexSansThai-Medium.ttf
   assets/fonts/IBMPlexSansThai-SemiBold.ttf
   assets/fonts/IBMPlexMono-Regular.ttf
   ```
   ถ้าชื่อไฟล์ไม่ตรง แอปจะ error ตอนเปิดครั้งแรก (`Unable to resolve module`)

### ตัวแปรแวดล้อม (.env)

```bash
cp .env.example .env
```
แล้วเปิด `.env` แก้ `EXPO_PUBLIC_API_URL` ให้ชี้ไปที่ backend จริงของคุณ
(ถ้าทดสอบบนมือถือ/emulator อย่าใช้ `localhost` ให้ใช้ IP เครื่องคอมในวง LAN เดียวกัน เช่น `192.168.1.100`)

---

## 3. วิธีรัน

### รันบนมือถือ/แท็บเล็ต (ปกติ)

```bash
npm start
```
จะเด้ง QR code ขึ้นมา:
- **มือถือจริง** — เปิดแอป Expo Go แล้วสแกน QR
- **Android emulator** — เปิด Android Studio > Device Manager > สร้าง/เปิด emulator ไว้ก่อน แล้วกด `a` ในหน้าต่าง terminal ที่รัน `npm start`
- **iOS Simulator (ต้องเป็น Mac)** — กด `i` ในหน้าต่าง terminal

### รันบน Android TV / กล่อง IPTV

ต้อง build แยกต่างหาก เพราะ TV ใช้ native module คนละชุดกับมือถือ:

```bash
npm run tv:prebuild   # สร้างโปรเจกต์ native สำหรับ TV (ทำครั้งแรกครั้งเดียว หรือทำใหม่เมื่อแก้ native config)
npm run tv:android    # build + รันบน Android TV emulator หรือกล่องจริงที่ต่อ ADB ไว้
```

**เชื่อมกล่อง IPTV จริงเข้ากับคอมเพื่อทดสอบ (ผ่าน ADB over network):**
```bash
adb connect <IP ของกล่อง>:5555
```
กล่องต้องเปิด "Developer options" > "USB debugging" หรือ "Network debugging" ไว้ก่อน (วิธีเปิดต่างกันไปตามยี่ห้อกล่อง)

---

## 4. โครงสร้างโปรเจกต์

```
house-samyan-app/
├── App.tsx                      ← entry point, โหลดฟอนต์ + provider ต่างๆ
├── app.json                     ← ตั้งค่า Expo (ชื่อแอป, icon, permission)
├── package.json
├── .env.example                 ← ตัวอย่างตัวแปรแวดล้อม (คัดลอกเป็น .env)
│
├── assets/
│   └── fonts/                   ← ต้องเอาไฟล์ฟอนต์มาวางเอง (ดูหัวข้อ 2)
│
└── src/
    ├── theme/                   ← สี, ฟอนต์, ขนาดตัวอักษร (design tokens ทั้งหมด)
    │   ├── colors.ts
    │   ├── typography.ts
    │   └── loadFonts.ts
    │
    ├── navigation/               ← โครงสร้างหน้าจอทั้งหมด (bottom tabs + stack)
    │   ├── RootNavigator.tsx
    │   └── types.ts
    │
    ├── screens/                  ← หน้าจอหลักแต่ละหน้า
    │   ├── HomeScreen.tsx         (hero + แถวเลื่อนแนวนอน + ปุ่มตะกร้าลอย)
    │   ├── MovieDetailScreen.tsx  (รายละเอียด + ปุ่มซื้อ/ใส่ตะกร้า + countdown leader)
    │   ├── LibraryScreen.tsx      (กล่องฟิล์ม — grid หนังที่ซื้อแล้ว)
    │   ├── CartScreen.tsx         (รายการในตะกร้า + ลบ + checkout ทั้งหมดพร้อมกัน)
    │   ├── SearchScreen.tsx       (โครงเปล่า รอเพิ่ม logic ค้นหา + มีปุ่มตะกร้าลอยแล้ว)
    │   └── ProfileScreen.tsx      (โครงเปล่า รอเพิ่มข้อมูลผู้ใช้)
    │
    ├── components/
    │   ├── MovieCard/
    │   │   ├── MovieCard.tsx      ← เวอร์ชันมือถือ/แท็บเล็ต (แตะจอ + ปุ่ม "+" หยิบใส่ตะกร้าด่วน)
    │   │   ├── MovieCard.tv.tsx   ← เวอร์ชัน TV (โฟกัสด้วยรีโมท + ปุ่มใส่ตะกร้าแยกแถว) — Metro เลือกให้อัตโนมัติ
    │   │   └── MovieCard.types.ts
    │   ├── HeroBanner.tsx
    │   ├── MovieRow.tsx
    │   ├── CartFAB.tsx             ← ปุ่มตะกร้าลอยแบบ Shopee (โผล่เฉพาะตอนมีของในตะกร้า)
    │   └── CountdownLeader.tsx    ← องค์ประกอบเด่น: วงเคาท์ดาวน์ฟิล์ม 3-2-1 ตอนซื้อสำเร็จ
    │
    ├── hooks/
    │   ├── useResponsive.ts       ← เช็คขนาดจอ/orientation ปรับ layout อัตโนมัติ
    │   └── useIsTV.ts             ← เช็คว่ารันบน TV อยู่หรือเปล่า
    │
    ├── api/                       ← ชั้นเชื่อมต่อ backend (ดูคำเตือนหัวข้อบนสุด)
    │   ├── client.ts
    │   ├── movies.ts
    │   ├── cart.ts                (endpoint ตะกร้า — add/remove/checkout)
    │   └── types.ts
    │
    └── store/
        ├── LibraryContext.tsx     ← เก็บสถานะ "หนังที่ซื้อแล้ว" ทั้งแอป (React Context)
        └── CartContext.tsx        ← เก็บสถานะตะกร้าทั้งแอป (จำนวน/ยอดรวม/add-remove) React Context
```

---

## 5. หลักการออกแบบที่ยึดไว้ (สำหรับคนต่อโค้ด)

- **แยกไฟล์ตาม platform ด้วยชื่อไฟล์** ไม่ใช่ `if/else` ในไฟล์เดียว — เช่น `MovieCard.tsx` (มือถือ/แท็บเล็ต)
  กับ `MovieCard.tv.tsx` (TV) Metro bundler จะเลือกไฟล์ที่ถูกต้องให้เองตอน build
- **TV ต้องมี state `focused`** เสมอสำหรับ element ที่กดได้ เพราะควบคุมด้วยรีโมท (d-pad) ไม่ใช่การแตะจอ
  ดูตัวอย่างใน `MovieCard.tv.tsx`
- **Responsive ใช้ `useWindowDimensions`** ไม่ fix ขนาดเป็น px ตายตัว ดูตัวอย่างใน `useResponsive.ts`
- สีและฟอนต์ทั้งหมดต้องดึงจาก `src/theme/` เท่านั้น ห้าม hardcode สีใหม่ในไฟล์ component โดยตรง
  เพื่อให้ธีม House Samyan เหมือนกันทั้งแอป
- **ระบบตะกร้า** ใช้ optimistic update (`CartContext.tsx`) คือเปลี่ยน UI ทันทีก่อนรอ API ตอบกลับ
  ถ้า API error จะ rollback state กลับให้อัตโนมัติ — ทำให้กดปุ่ม "+" แล้วรู้สึกไวแบบ Shopee
  ไม่ต้องรอโหลด แต่นักพัฒนาต้องระวังเรื่อง error handling ให้ครบเวลาต่อ backend จริง
- ปุ่มใส่ตะกร้าบน **มือถือ** ใช้ปุ่ม "+" เล็กซ้อนทับมุมโปสเตอร์ได้ (แตะแม่นได้) แต่บน **TV**
  ต้องแยกเป็นปุ่มแถวล่างต่างหาก เพราะรีโมทเล็งจุดเล็กๆ ซ้อนทับกันไม่ได้ — ดูตัวอย่างความต่างนี้ได้ใน
  `MovieCard.tsx` เทียบกับ `MovieCard.tv.tsx`

---

## 6. สิ่งที่ยังไม่ได้ทำ (To-do ต่อไป)

- [ ] สร้าง backend จริง (endpoints ตาม `src/api/movies.ts` และ `src/api/cart.ts`)
- [ ] ระบบ login/สมัครสมาชิก + การจ่ายเงิน (เชื่อม payment gateway ไทย เช่น Omise/2C2P/PromptPay)
- [ ] หน้าเล่นวิดีโอจริง (ใช้ `react-native-video` ที่ติดตั้งไว้แล้วใน `package.json`)
- [ ] เพิ่ม `TVEventHandler` จัดการปุ่ม back/menu บนรีโมท TV โดยเฉพาะ
- [ ] ติดตั้ง `react-tv-space-navigation` จัดการโฟกัสขึ้น-ลงระหว่างโปสเตอร์กับปุ่มใส่ตะกร้าบน TV ให้สมบูรณ์
  (ตอนนี้โครงไว้ให้แล้วใน `MovieCard.tv.tsx` แต่ยังไม่ได้ผูก space-navigation จริง)
- [ ] ทำหน้า Search และ Profile ให้สมบูรณ์ (ตอนนี้เป็นโครงเปล่า)
- [ ] เพิ่ม error state / retry เมื่อเรียก API ไม่สำเร็จ (ตอนนี้แค่ log error ใน console)
- [ ] เพิ่ม toast/feedback เล็กๆ ตอนกดใส่ตะกร้าสำเร็จ (ตอนนี้แค่เปลี่ยนไอคอนปุ่มเฉยๆ ไม่มี animation แจ้งเตือน)
