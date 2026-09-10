# วิธีใช้

แตกไฟล์ zip นี้แล้ว copy ทั้งหมดไปทับที่ root ของโปรเจกต์ house-samyan-app
ไม่มี dependency ใหม่ (ใช้ @react-navigation/native-stack ที่มีอยู่แล้ว)
ไม่ต้อง npm install เพิ่ม

ไฟล์ในนี้:
- App.tsx                          — สลับจากเรนเดอร์ LoginScreen ตรงๆ เป็น
                                      AuthNavigator แทน
- src/navigation/types.ts          — เพิ่ม AuthStackParamList (Login/Register)
- src/navigation/AuthNavigator.tsx — ไฟล์ใหม่ stack navigator สำหรับหน้า
                                      ก่อนล็อกอิน (Login ↔ Register)
- src/screens/LoginScreen.tsx      — ตัดโหมด "สมัครสมาชิก" ที่เคยฝังอยู่ออก
                                      เหลือแค่ล็อกอิน + ลิงก์ไปหน้า Register
- src/screens/RegisterScreen.tsx   — ไฟล์ใหม่ หน้าสมัครสมาชิกแยกต่างหาก
                                      (ชื่อ/อีเมล/รหัสผ่าน) + ลิงก์กลับไป Login

สรุป: ตอนนี้ Login กับ Register เป็นคนละหน้ากันจริงๆ (นำทางด้วย
react-navigation, มี back gesture/animation ให้ตามปกติ) แทนการสลับ mode
ในฟอร์มเดียวแบบเดิม ฟิลด์และ logic การสมัคร/ล็อกอินยังเหมือนเดิมทุกอย่าง
(ยังเป็น mock auth ไม่มี backend จริง เก็บบัญชีไว้ใน memory เท่านั้น — ดู
src/api/auth.ts)
