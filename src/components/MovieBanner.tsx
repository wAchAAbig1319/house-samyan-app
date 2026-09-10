import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MovieBannerProps {
  accentColor: [string, string];
  bannerUrl?: string;
}

// "แบนเนอร์" แนวนอนสำหรับพื้นหลัง hero / backdrop — ถ้ามี bannerUrl (รูปจริง
// ที่มีสิทธิ์ใช้) จะโชว์รูปนั้นแทน ถ้าไม่มีจะ fallback ไปไล่สีเฉพาะเรื่องเดียว
// กับ MoviePoster เหมือนเดิม เพื่อให้หนังเรื่องเดียวกันดูเป็นชุดเดียวกันไม่ว่า
// จะโชว์แนวตั้งหรือแนวนอน
//
// หมายเหตุ: คืนแค่รูป/ไล่สีล้วนๆ ไม่มี dark overlay ในตัว เพราะหน้าจอที่ต้องการให้
// ตัวหนังสือข้างบนอ่านง่าย (HeroBanner, MovieDetailScreen) ใส่ overlay ของตัวเอง
// ทับอยู่แล้ว — เดิม component นี้เคยใส่ overlay ซ้ำอีกชั้นในตัวเอง ทำให้เมื่อ
// ไปเจอ overlay ของหน้าจอที่เรียกใช้ซ้อนทับกันเข้าไปอีก สีเลยถูกทับจนดำเกือบสนิท
// (นี่คือบั๊ก "banner ไม่ขึ้น" ที่เจอ) ส่วนจุดที่ใช้แบบไม่มี overlay ทับ (เช่น
// การ์ดดูค้างไว้ในกล่องฟิล์ม) จะได้เห็นสีชัดเจนเต็มที่แทน
export function MovieBanner({ accentColor, bannerUrl }: MovieBannerProps) {
  if (bannerUrl) {
    return <Image source={{ uri: bannerUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />;
  }
  return (
    <LinearGradient
      colors={accentColor}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
}
