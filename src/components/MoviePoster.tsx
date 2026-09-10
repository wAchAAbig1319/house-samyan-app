import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily } from '@/theme';

interface MoviePosterProps {
  title: string;
  genre: string;
  year: number;
  accentColor: [string, string];
  posterUrl?: string;
}

// "โปสเตอร์" แนวตั้งของหนังแต่ละเรื่อง — ถ้ามี posterUrl (รูปจริงที่มีสิทธิ์ใช้)
// จะโชว์รูปนั้นแทน พร้อม gradient ทับด้านล่างให้ตัวหนังสืออ่านง่าย ถ้าไม่มี
// posterUrl จะ fallback ไปสร้างจากไล่สีเฉพาะเรื่อง (accentColor) + ข้อมูลหนัง
// เหมือนเดิม (กรณีไม่มีสิทธิ์ใช้รูปจริง)
export function MoviePoster({ title, genre, year, accentColor, posterUrl }: MoviePosterProps) {
  return (
    <View style={StyleSheet.absoluteFill}>
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <LinearGradient
          colors={accentColor}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <LinearGradient
        colors={['rgba(16,12,9,0)', 'rgba(16,12,9,0.8)']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.frame} pointerEvents="none" />
      <View style={styles.content}>
        <Text style={styles.year}>{year}</Text>
        <Text style={styles.title} numberOfLines={5}>
          {title}
        </Text>
        <Text style={styles.genre} numberOfLines={1}>
          {genre}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'absolute',
    top: 7,
    left: 7,
    right: 7,
    bottom: 7,
    borderWidth: 1,
    borderColor: 'rgba(234,224,200,0.22)',
  },
  content: { flex: 1, justifyContent: 'flex-end', padding: 12, gap: 4 },
  year: {
    fontFamily: fontFamily.mono,
    fontSize: 9,
    letterSpacing: 1,
    color: 'rgba(234,224,200,0.55)',
  },
  title: {
    fontFamily: fontFamily.displayItalic,
    fontSize: 15,
    lineHeight: 18,
    color: colors.stub,
  },
  genre: {
    fontFamily: fontFamily.mono,
    fontSize: 8.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: 'rgba(234,224,200,0.7)',
    marginTop: 2,
  },
});
