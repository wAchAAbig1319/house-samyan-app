import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';

import { colors, fontFamily, fontSize } from '@/theme';
import { MovieBanner } from '@/components/MovieBanner';
import { moviesApi } from '@/api/movies';
import { useLibrary } from '@/store/LibraryContext';
import { useLanguage } from '@/store/LanguageContext';
import { localizedTitle } from '@/i18n/movieLabels';
import type { RootStackParamList } from '@/navigation/types';
import type { Movie } from '@/api/types';

type Route = RouteProp<RootStackParamList, 'Player'>;

const SKIP_MS = 10000;
const AUTO_HIDE_MS = 3500;

// ============================================================================
// PLAYER SCREEN — เล่นวิดีโอจริงผ่าน expo-av พร้อม UI แบบสตรีมมิงทั่วไป
// (Netflix-style): แตะจอเพื่อโชว์/ซ่อน control, ลากแถบ progress เพื่อ seek ได้
// จริง, ปุ่มถอย/เดินหน้า 10 วิ, ซ่อน control อัตโนมัติระหว่างเล่น, spinner ตอน
// buffering — ยังไม่มีไฟล์คลิปจริงให้เล่น (movie.videoUrl เป็น undefined อยู่
// ทุกเรื่อง ดู mockData.ts) พอมี URL ไฟล์วิดีโอจริงใส่ใน movie.videoUrl ได้เลย
// หน้านี้เล่นได้ทันทีโดยไม่ต้องแก้โค้ดเพิ่ม
//
// SCREEN CAPTURE PROTECTION (expo-screen-capture) — ป้องกันการแคปหน้าจอ/อัด
// วิดีโอ/แชร์จอตอนอยู่หน้านี้ (เหมือน Netflix/แอปสตรีมมิงที่มี DRM):
//   - Android: ปิดกั้นได้จริง (FLAG_SECURE) — แคปภาพหน้าจอไม่ได้เลย (ระบบจะเด้ง
//     แจ้งเตือนว่าแอปนี้ไม่อนุญาต), อัดหน้าจอ/แชร์จอ (เช่น cast ไป Chromecast,
//     แชร์จอผ่าน Zoom/Google Meet) จะเห็นเป็นจอดำแทนตัววิดีโอ
//   - iOS: Apple ไม่มี public API ให้บล็อกการแคปภาพหน้าจอได้ 100% (เป็นข้อจำกัด
//     ของแพลตฟอร์ม ไม่ใช่ของไลบรารีนี้) แต่ expo-screen-capture ใช้เทคนิค
//     secure overlay ทำให้ "การอัดวิดีโอหน้าจอ" (screen recording ผ่าน Control
//     Center) ออกมาเป็นจอดำแทนเนื้อหาจริงได้ — ส่วนการแคปภาพนิ่ง (screenshot)
//     ยังกันไม่ได้เต็มร้อยบน iOS จึงเสริมด้วย addScreenshotListener ด้านล่าง:
//     ตรวจจับตอนมีคนแคปหน้าจอสำเร็จ แล้วหยุดเล่นวิดีโอ + เตือนผู้ใช้ทันที
// ============================================================================

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function formatTime(msRaw: number): string {
  const ms = Number.isFinite(msRaw) && msRaw > 0 ? msRaw : 0;
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PlayerScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const { updateProgress, markWatched, all, refresh } = useLibrary();
  const { language, t } = useLanguage();

  // เปิดใช้ทันทีที่เข้าหน้านี้ ปิดอัตโนมัติตอนออกจากหน้านี้ (unmount) — ดูราย
  // ละเอียดพฤติกรรมแยกตาม platform ในคอมเมนต์หัวไฟล์ด้านบน
  ScreenCapture.usePreventScreenCapture();

  const videoRef = useRef<Video>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [showControls, setShowControls] = useState(true);
  // ระหว่างลากแถบ progress: 0–1 (ไม่ได้ลากอยู่ = null) แยกจาก state จริงของวิดีโอ
  // เพื่อให้แถบขยับตามนิ้วลื่นๆ โดยยังไม่สั่ง seek จริงจนกว่าจะปล่อยนิ้ว
  const [seekRatio, setSeekRatio] = useState<number | null>(null);

  const trackWidthRef = useRef(0);
  const durationRef = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    moviesApi.getMovie(params.movieId).then(setMovie).catch(console.error);
  }, [params.movieId]);

  // ตรวจจับตอนมีคนแคปหน้าจอสำเร็จขณะดูหนังอยู่ (เสริมจาก usePreventScreenCapture
  // ด้านบน เพราะ iOS บล็อก screenshot ไม่ได้ 100% ผ่าน public API) — หยุดเล่น
  // วิดีโอทันทีแล้วเตือนผู้ใช้ ว่ากันไม่ให้แคปจริงๆ ไม่ได้ แต่อย่างน้อยรู้ว่าเกิด
  // ขึ้นและตัดการเล่นต่อทันที (เนื้อหาที่แคปไปได้แค่เฟรมเดียว ไม่ใช่คลิปยาว)
  // หมายเหตุ: บน Android ต้องขอ READ_EXTERNAL_STORAGE ก่อน ไม่งั้น listener จะไม่
  // ทำงานเลย (ดู android.permissions ใน app.json) — iOS ไม่ต้องขอ อนุญาตเสมอ
  useEffect(() => {
    ScreenCapture.requestPermissionsAsync().catch(() => {});
    const subscription = ScreenCapture.addScreenshotListener(() => {
      videoRef.current?.pauseAsync().catch(() => {});
      Alert.alert(t('screenshotDetectedTitle'), t('screenshotDetectedBody'));
    });
    return () => subscription.remove();
  }, [t]);

  // เผื่อเข้าหน้านี้มาโดย library context ยังไม่เคยโหลด (เช่นเปิดตรงจากลิงก์)
  // จะได้รู้ตำแหน่งที่ดูค้างไว้ถูกต้องตั้งแต่เฟรมแรก
  //
  // สำคัญ: ต้องรอ refresh() เสร็จก่อนค่อย mount <Video> เพราะ initialStatus
  // (resumeFromMillis) ใช้ได้แค่ตอน mount ครั้งเดียวเท่านั้น — ถ้า movie โหลด
  // เสร็จก่อน all (คนละ mock API call กัน มีดีเลย์ไม่เท่ากัน) วิดีโอจะ mount
  // ไปก่อนโดยไม่รู้ตำแหน่งที่ดูค้างไว้จริง แล้วพอ all โหลดตามมาทีหลังก็สายไปแล้ว
  // เพราะ initialStatus ไม่ reactive — เลยต้องกัน race condition นี้ด้วย flag นี้
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  useEffect(() => {
    refresh()
      .catch(console.error)
      .finally(() => setLibraryLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ตำแหน่งที่จะเริ่มเล่นต่อ: เอาจากกล่องฟิล์ม ถ้าเรื่องนี้ดูค้างไว้ (ยังไม่ดูจบ)
  // ก็เริ่มจากตรงนั้นเลยเหมือนแอปสตรีมมิงทั่วไป — ถ้าดูจบแล้ว (watched) ให้เริ่ม
  // ใหม่ตั้งแต่ต้นแทนการกระโดดไปท้ายเรื่องซ้ำ
  const ownedRecord = all.find((m) => m.id === params.movieId);
  const resumeFromMillis =
    ownedRecord && !ownedRecord.watched ? ownedRecord.progressSeconds * 1000 : 0;

  // เก็บตำแหน่ง/สถานะล่าสุดไว้ใน ref แยกจาก state — เพราะ onPlaybackStatusUpdate
  // ยิงถี่มาก (ทุก ~500ms) ถ้าเอา status ไปเป็น dependency ของ useEffect ที่ตั้ง
  // setInterval ตรงๆ (แบบเดิม) effect จะ re-run รัว ๆ ทุก 500ms จนตัว setInterval
  // (5000ms) ไม่เคยอยู่ได้นานพอจะยิงสักครั้งเลย — บั๊กนี้ทำให้ progress ไม่เคยถูก
  // เซฟจริงๆ ไม่ว่าหนังจะยาวแค่ไหนก็ตาม ไม่ใช่แค่คลิปทดสอบสั้นๆ
  const latestPositionSecondsRef = useRef(0);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    if (!status?.isLoaded || !movie) return;
    latestPositionSecondsRef.current = Math.floor(status.positionMillis / 1000);
    isPlayingRef.current = status.isPlaying;

    // ดูจบจริง (expo-av บอกผ่าน didJustFinish) — เดิมไม่มีจุดไหนเรียก markWatched
    // เลยสักที่ ทำให้หนังที่ดูจบแล้วไม่เคยได้ badge ✓ และค้างอยู่ใน Continue
    // Watching ตลอดไป
    if (status.didJustFinish) {
      markWatched(movie.id).catch(console.error);
    }
  }, [status, movie, markWatched]);

  // ตั้ง interval แค่ครั้งเดียวตอนรู้จัก movie แล้ว (ไม่ผูกกับ status ที่เปลี่ยน
  // ถี่) อ่านตำแหน่งล่าสุดจาก ref ทุกครั้งที่ tick แทน จึงอยู่ได้ครบ 5 วินาทีจริง
  useEffect(() => {
    if (!movie) return;
    const interval = setInterval(() => {
      if (isPlayingRef.current) {
        updateProgress(movie.id, latestPositionSecondsRef.current).catch(console.error);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [movie, updateProgress]);

  // เผื่อออกจากหน้านี้ก่อนครบ 5 วินาที (คลิปสั้นมาก หรือกดย้อนกลับเร็ว) เซฟ
  // ตำแหน่งล่าสุดที่รู้อีกครั้งตอน unmount กันไม่ให้ progress หายไปเฉยๆ
  useEffect(() => {
    return () => {
      if (movie && latestPositionSecondsRef.current > 0) {
        updateProgress(movie.id, latestPositionSecondsRef.current).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie]);

  const isLoaded = status?.isLoaded ?? false;
  const isPlaying = isLoaded && (status as any).isPlaying;
  const isBuffering = isLoaded && (status as any).isBuffering;
  const positionMillis = isLoaded ? (status as any).positionMillis ?? 0 : 0;
  const durationMillis = isLoaded ? (status as any).durationMillis ?? 0 : 0;
  durationRef.current = durationMillis;

  const liveRatio = durationMillis > 0 ? positionMillis / durationMillis : 0;
  const displayRatio = seekRatio ?? liveRatio;
  const displayPositionMillis = seekRatio !== null ? seekRatio * durationMillis : positionMillis;

  // ซ่อน control อัตโนมัติหลังไม่มีการแตะจอ 3.5 วิ ระหว่างกำลังเล่นอยู่
  // (ไม่ซ่อนระหว่างลากแถบ progress หรือตอนวิดีโอหยุดนิ่ง)
  useEffect(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (showControls && isPlaying && seekRatio === null) {
      hideTimer.current = setTimeout(() => setShowControls(false), AUTO_HIDE_MS);
    }
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showControls, isPlaying, seekRatio, positionMillis]);

  async function togglePlay() {
    if (!videoRef.current || !isLoaded) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setShowControls(true);
  }

  async function skip(deltaMs: number) {
    if (!videoRef.current || !isLoaded || durationRef.current === 0) return;
    const next = clamp(positionMillis + deltaMs, 0, durationRef.current);
    await videoRef.current.setPositionAsync(next);
    setShowControls(true);
  }

  // สร้าง PanResponder ครั้งเดียว (ไม่ผูกกับ state ที่เปลี่ยนบ่อย) แล้วอ่าน/เขียน
  // ผ่าน ref + functional setState แทน กันปัญหาลากค้างตอน re-render ระหว่างกำลังลาก
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const w = trackWidthRef.current;
        if (w === 0) return;
        setSeekRatio(clamp(evt.nativeEvent.locationX / w, 0, 1));
        setShowControls(true);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const w = trackWidthRef.current;
        if (w === 0) return;
        setSeekRatio(clamp(evt.nativeEvent.locationX / w, 0, 1));
      },
      onPanResponderRelease: () => {
        setSeekRatio((r) => {
          if (r !== null && videoRef.current && durationRef.current > 0) {
            videoRef.current.setPositionAsync(r * durationRef.current).catch(console.error);
          }
          return null;
        });
      },
      onPanResponderTerminate: () => setSeekRatio(null),
    }),
  ).current;

  if (!movie || !libraryLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.marquee} />
      </View>
    );
  }

  const hasClip = Boolean(movie.videoAsset || movie.videoUrl);
  const showInitialLoading = hasClip && !isLoaded;

  return (
    <Pressable style={styles.container} onPress={() => setShowControls((v) => !v)}>
      <StatusBar hidden />

      {hasClip ? (
        <Video
          ref={videoRef}
          // ไฟล์ในเครื่อง (require) มาก่อนเสมอ ถ้ามี — เหมาะตอน dev ทดสอบก่อนมี
          // ไฟล์จริงบน CDN ไม่มีก็ fallback ไปเล่นจากลิงก์ videoUrl แทน
          source={movie.videoAsset ?? { uri: movie.videoUrl! }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.CONTAIN}
          // เริ่มเล่นต่อจากตำแหน่งที่ดูค้างไว้ (ถ้ามี) แทนการเริ่มจากต้นทุกครั้ง
          initialStatus={{ shouldPlay: true, positionMillis: resumeFromMillis }}
          onPlaybackStatusUpdate={setStatus}
        />
      ) : (
        // ยังไม่มีไฟล์คลิปจริง — โชว์พื้นหลังของหนังเรื่องนี้แทนจอเล่นวิดีโอ
        <MovieBanner accentColor={movie.accentColor} bannerUrl={movie.bannerUrl} />
      )}

      {/* Buffering spinner — โชว์แม้ control จะถูกซ่อนอยู่ก็ตาม */}
      {(showInitialLoading || (isBuffering && isPlaying)) && (
        <View style={styles.bufferOverlay} pointerEvents="none">
          <ActivityIndicator color={colors.stub} size="large" />
        </View>
      )}

      {showControls && (
        <View style={styles.overlay} pointerEvents="box-none">
          {/* แถบบน */}
          <LinearGradient
            colors={['rgba(16,12,9,0.85)', 'rgba(16,12,9,0)']}
            style={styles.topGradient}
            pointerEvents="box-none"
          >
            <View style={styles.topRow}>
              <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={10}>
                <Ionicons name="chevron-down" size={26} color={colors.stub} />
              </Pressable>
              <Text style={styles.topTitle} numberOfLines={1}>
                {localizedTitle(movie, language)}
              </Text>
              <View style={styles.iconBtn} />
            </View>
          </LinearGradient>

          {!hasClip && (
            <View style={styles.noClipBox}>
              <Ionicons name="film-outline" size={30} color={colors.marquee} style={{ marginBottom: 4 }} />
              <Text style={styles.noClipEyebrow}>◆ ยังไม่มีคลิปสำหรับเรื่องนี้</Text>
              <Text style={styles.noClipTitle}>{localizedTitle(movie, language)}</Text>
              <Text style={styles.noClipBody}>
                ต่อระบบเล่นวิดีโอ (expo-av) ไว้ครบแล้ว รอแค่ไฟล์วิดีโอจริงจาก CDN
                มาใส่ใน movie.videoUrl ก็เล่นได้ทันที
              </Text>
            </View>
          )}

          {/* ปุ่มกลางจอ: ถอย 10 วิ / เล่น-หยุด / เดินหน้า 10 วิ */}
          {hasClip && !showInitialLoading && (
            <View style={styles.centerRow} pointerEvents="box-none">
              <Pressable style={styles.skipBtn} onPress={() => skip(-SKIP_MS)} hitSlop={12}>
                <Ionicons name="play-back" size={26} color={colors.stub} />
                <Text style={styles.skipLabel}>10</Text>
              </Pressable>

              <Pressable style={styles.playBtnCircle} onPress={togglePlay} hitSlop={12}>
                {isBuffering ? (
                  <ActivityIndicator color={colors.stub} />
                ) : (
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={34}
                    color={colors.stub}
                    style={!isPlaying ? { marginLeft: 3 } : undefined}
                  />
                )}
              </Pressable>

              <Pressable style={styles.skipBtn} onPress={() => skip(SKIP_MS)} hitSlop={12}>
                <Ionicons name="play-forward" size={26} color={colors.stub} />
                <Text style={styles.skipLabel}>10</Text>
              </Pressable>
            </View>
          )}

          {/* แถบล่าง: progress ลากได้ + เวลา */}
          {hasClip && (
            <LinearGradient
              colors={['rgba(16,12,9,0)', 'rgba(16,12,9,0.9)']}
              style={styles.bottomGradient}
            >
              <View style={styles.bottomControls}>
                <View
                  style={styles.trackHitArea}
                  onLayout={(e) => {
                    trackWidthRef.current = e.nativeEvent.layout.width;
                  }}
                  {...panResponder.panHandlers}
                >
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${displayRatio * 100}%` }]} />
                    <View
                      style={[
                        styles.progressThumb,
                        { left: `${displayRatio * 100}%` },
                        seekRatio !== null && styles.progressThumbActive,
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{formatTime(displayPositionMillis)}</Text>
                  <Text style={styles.timeText}>
                    -{formatTime(durationMillis - displayPositionMillis)}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  loading: { flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  bufferOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topGradient: { paddingTop: 46, paddingBottom: 20 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  iconBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  topTitle: {
    flex: 1,
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.body,
    color: colors.stub,
  },

  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 46,
  },
  skipBtn: { alignItems: 'center', justifyContent: 'center', width: 50, height: 50 },
  skipLabel: {
    position: 'absolute',
    bottom: 2,
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 8.5,
    color: colors.stub,
  },
  playBtnCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(234,224,200,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(234,224,200,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noClipBox: {
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    maxWidth: 300,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  noClipEyebrow: {
    fontFamily: fontFamily.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.marquee,
  },
  noClipTitle: {
    fontFamily: fontFamily.displayItalic,
    fontSize: 22,
    color: colors.stub,
    textAlign: 'center',
  },
  noClipBody: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption,
    color: colors.ash,
    textAlign: 'center',
    lineHeight: 19,
  },

  bottomGradient: { paddingTop: 30 },
  bottomControls: { paddingHorizontal: 18, paddingBottom: 30, gap: 6 },
  // พื้นที่แตะ/ลากของแถบ progress ใหญ่กว่าเส้นที่มองเห็นจริง ให้กดง่ายขึ้น
  trackHitArea: { paddingVertical: 10, justifyContent: 'center' },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(234,224,200,0.25)',
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.marquee,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressThumb: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.marquee,
    marginLeft: -5.5,
    transform: [{ scale: 1 }],
  },
  progressThumbActive: { transform: [{ scale: 1.4 }] },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeText: { fontFamily: fontFamily.mono, fontSize: 11, color: colors.ash },
});
