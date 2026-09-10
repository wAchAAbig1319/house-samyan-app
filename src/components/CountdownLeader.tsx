import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily } from '@/theme';

interface CountdownLeaderProps {
  onComplete: () => void;
}

// องค์ประกอบเด่นของแอป — ใช้แทนหน้าจอ loading ทั่วไปตอนซื้อสำเร็จ
// อ้างอิงจากวงเคาท์ดาวน์ฟิล์มคลาสสิก (Academy leader) ก่อนหนังเริ่มฉาย
export function CountdownLeader({ onComplete }: CountdownLeaderProps) {
  const [count, setCount] = useState(3);
  // กัน onComplete ถูกเรียกซ้ำ: ถ้า parent re-render แล้วส่ง onComplete ตัวใหม่มา
  // (เช่น component ที่เรียกใช้ไม่ได้ห่อด้วย useCallback) effect ด้านล่างจะรันซ้ำ
  // ตอน count เหลือ 0 อยู่แล้ว — ref นี้ทำให้เรียก onComplete ได้แค่ครั้งเดียวจริงๆ
  const firedRef = useRef(false);

  useEffect(() => {
    if (count === 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        onComplete();
      }
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 700);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <View style={styles.wrap}>
      <View style={styles.circle}>
        <View style={styles.crosshairV} />
        <View style={styles.crosshairH} />
        <Text style={styles.num}>{count}</Text>
      </View>
      <Text style={styles.caption}>กำลังนำเข้าฉาย…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 14, paddingVertical: 30 },
  circle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 1.5,
    borderColor: colors.marqueeDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: colors.marqueeDim,
    opacity: 0.5,
  },
  crosshairH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: colors.marqueeDim,
    opacity: 0.5,
  },
  num: {
    fontFamily: fontFamily.display,
    fontSize: 34,
    color: colors.marquee,
  },
  caption: {
    fontFamily: fontFamily.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.ash2,
  },
});
