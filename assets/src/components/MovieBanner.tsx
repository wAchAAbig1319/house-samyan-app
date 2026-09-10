import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MovieBannerProps {
  accentColor: [string, string];
}

// "แบนเนอร์" แนวนอนสำหรับพื้นหลัง hero / backdrop — ไล่สีเฉพาะเรื่องเดียวกับ
// MoviePoster เพื่อให้หนังเรื่องเดียวกันดูเป็นชุดเดียวกันไม่ว่าจะโชว์แนวตั้งหรือ
// แนวนอน ไม่มีรูปภาพจริง (ไม่มีลิขสิทธิ์ใช้ภาพนิ่งจากหนัง)
//
// หมายเหตุ: คืนแค่ไล่สีล้วนๆ ไม่มี dark overlay ในตัว เพราะหน้าจอที่ต้องการให้
// ตัวหนังสือข้างบนอ่านง่าย (HeroBanner, MovieDetailScreen) ใส่ overlay ของตัวเอง
// ทับอยู่แล้ว — เดิม component นี้เคยใส่ overlay ซ้ำอีกชั้นในตัวเอง ทำให้เมื่อ
// ไปเจอ overlay ของหน้าจอที่เรียกใช้ซ้อนทับกันเข้าไปอีก สีเลยถูกทับจนดำเกือบสนิท
// (นี่คือบั๊ก "banner ไม่ขึ้น" ที่เจอ) ส่วนจุดที่ใช้แบบไม่มี overlay ทับ (เช่น
// การ์ดดูค้างไว้ในกล่องฟิล์ม) จะได้เห็นสีชัดเจนเต็มที่แทน
export function MovieBanner({ accentColor }: MovieBannerProps) {
  return (
    <LinearGradient
      colors={accentColor}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
}
