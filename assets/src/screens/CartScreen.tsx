import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors, fontFamily, fontSize } from '@/theme';
import { CountdownLeader } from '@/components/CountdownLeader';
import { MoviePoster } from '@/components/MoviePoster';
import { useCart } from '@/store/CartContext';
import { useLibrary } from '@/store/LibraryContext';

export function CartScreen() {
  const navigation = useNavigation();
  const { items, totalPrice, removeFromCart, refresh, checkout } = useCart();
  const { markPurchased } = useLibrary();
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);

  async function handleCheckout() {
    setCheckingOut(true);
  }

  function onLeaderComplete() {
    // จำลองซื้อสำเร็จ: ทำเครื่องหมายว่าเก็บแล้วทุกเรื่องในตะกร้า แล้วค่อยเคลียร์ตะกร้าจริงผ่าน API
    items.forEach((item) => markPurchased(item.movie.id));
    checkout()
      .catch(console.error)
      .finally(() => {
        setCheckingOut(false);
        navigation.goBack();
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={{ color: colors.stub, fontSize: 18 }}>‹</Text>
        </Pressable>
        <Text style={styles.title}>ตะกร้าของฉัน</Text>
        <Text style={styles.sub}>{items.length} เรื่อง</Text>
      </View>

      {checkingOut ? (
        <CountdownLeader onComplete={onLeaderComplete} />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.movie.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={styles.poster}>
                  <MoviePoster
                    title={item.movie.title}
                    genre={item.movie.genre}
                    year={item.movie.year}
                    accentColor={item.movie.accentColor}
                  />
                </View>
                <View style={styles.info}>
                  <Text style={styles.movieTitle} numberOfLines={2}>
                    {item.movie.title}
                  </Text>
                  <Text style={styles.movieMeta}>
                    {item.movie.genre} · {item.movie.country}
                  </Text>
                  <Text style={styles.price}>฿{item.movie.priceTHB}</Text>
                </View>
                <Pressable
                  onPress={() => removeFromCart(item.movie.id)}
                  style={styles.removeBtn}
                >
                  <Text style={{ color: colors.ash, fontSize: 16 }}>×</Text>
                </Pressable>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>ยังไม่มีหนังในตะกร้า</Text>
            }
          />

          {items.length > 0 && (
            <View style={styles.checkoutBar}>
              <View>
                <Text style={styles.totalLabel}>ยอดรวม</Text>
                <Text style={styles.totalPrice}>฿{totalPrice}</Text>
              </View>
              <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
                <Text style={styles.checkoutBtnText}>ซื้อทั้งหมด</Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 16,
  },
  back: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.ink2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fontFamily.display, fontSize: 20, color: colors.stub, flex: 1 },
  sub: { fontFamily: fontFamily.mono, fontSize: 11, color: colors.ash2 },
  list: { paddingHorizontal: 22, paddingBottom: 20 },
  row: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.ink2,
    borderRadius: 12,
    padding: 10,
  },
  poster: { width: 56, height: 80, borderRadius: 6, backgroundColor: colors.ink3, overflow: 'hidden' },
  info: { flex: 1, justifyContent: 'center', gap: 3 },
  movieTitle: { fontFamily: fontFamily.bodyMedium, fontSize: fontSize.body, color: colors.stub },
  movieMeta: { fontFamily: fontFamily.mono, fontSize: 9.5, color: colors.ash2 },
  price: { fontFamily: fontFamily.mono, fontSize: 12, color: colors.marquee, marginTop: 2 },
  removeBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  empty: {
    fontFamily: fontFamily.body,
    fontSize: 13,
    color: colors.ash2,
    textAlign: 'center',
    marginTop: 60,
  },
  checkoutBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.ink2,
  },
  totalLabel: { fontFamily: fontFamily.mono, fontSize: 9.5, color: colors.ash2, textTransform: 'uppercase' },
  totalPrice: { fontFamily: fontFamily.display, fontSize: 22, color: colors.stub, marginTop: 2 },
  checkoutBtn: {
    backgroundColor: colors.velvet,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },
  checkoutBtnText: { fontFamily: fontFamily.bodySemiBold, fontSize: fontSize.body, color: colors.stub },
});
