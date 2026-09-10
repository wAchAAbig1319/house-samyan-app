import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fontFamily, fontSize } from '@/theme';
import { MoviePoster } from '@/components/MoviePoster';
import type { MovieCardProps } from './MovieCard.types';

// เวอร์ชัน TV — ควบคุมด้วยรีโมท (d-pad) ไม่มีการแตะจอ
// ต้องมี state "focused" ชัดเจน เพราะผู้ใช้ดูจากระยะไกล มองไม่เห็น cursor
//
// หมายเหตุเรื่องตะกร้าบน TV: ไม่ใช้ปุ่ม "+" เล็กซ้อนทับแบบมือถือ เพราะรีโมทเล็ง
// จุดเล็กๆ ได้ยาก จึงโชว์เป็นปุ่มแยกต่างหากด้านล่างการ์ด (โผล่เฉพาะตอนโฟกัส)
// ต้องมี react-tv-space-navigation ช่วยจัดการโฟกัสขึ้น-ลงระหว่างโปสเตอร์กับปุ่มนี้จริงจัง
export function MovieCard({ movie, owned, inCart, width, onPress, onAddToCart }: MovieCardProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, { width: focused ? width * 1.12 : width }]}>
      <Pressable
        onPress={() => onPress(movie)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        // จำเป็นบน TV เพื่อให้ focus engine ของระบบมองเห็น element นี้
        focusable
      >
        <View
          style={[
            styles.art,
            {
              width: focused ? width * 1.12 : width,
              height: (focused ? width * 1.12 : width) * 1.44,
              borderWidth: focused ? 3 : 0,
              borderColor: colors.tvFocusRing,
            },
          ]}
        >
          <MoviePoster
            title={movie.title}
            genre={movie.genre}
            year={movie.year}
            accentColor={movie.accentColor}
          />
          {owned ? (
            <View style={styles.badgeOwned}>
              <Text style={styles.badgeOwnedText}>เก็บแล้ว</Text>
            </View>
          ) : (
            <View style={styles.badgePrice}>
              <Text style={styles.badgePriceText}>฿{movie.priceTHB}</Text>
            </View>
          )}
        </View>
        {focused && (
          <>
            <Text style={styles.title} numberOfLines={1}>
              {movie.title}
            </Text>
            <Text style={styles.sub} numberOfLines={1}>
              {movie.genre} · {movie.country}
            </Text>
          </>
        )}
      </Pressable>

      {focused && !owned && (
        <Pressable
          focusable
          onPress={() => onAddToCart(movie)}
          style={[styles.cartRow, inCart && styles.cartRowActive]}
        >
          <Text style={styles.cartRowText}>
            {inCart ? '✓ อยู่ในตะกร้าแล้ว' : '+ ใส่ตะกร้า'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  art: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.ink3,
  },
  badgeOwned: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.reel,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeOwnedText: {
    fontFamily: fontFamily.mono,
    fontSize: 10,
    color: colors.ink,
  },
  badgePrice: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(16,12,9,0.8)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgePriceText: {
    fontFamily: fontFamily.mono,
    fontSize: 11,
    color: colors.marquee,
  },
  title: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.title,
    color: colors.stub,
  },
  sub: {
    fontFamily: fontFamily.mono,
    fontSize: 10.5,
    color: colors.ash2,
  },
  cartRow: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.velvet,
    alignItems: 'center',
  },
  cartRowActive: {
    backgroundColor: colors.reel,
  },
  cartRowText: {
    fontFamily: fontFamily.mono,
    fontSize: 10.5,
    color: colors.stub,
  },
});
