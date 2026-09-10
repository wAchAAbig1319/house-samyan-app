import React, { useMemo, useState } from 'react';
import { Modal, View, Text, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

import { colors, fontFamily, fontSize } from '@/theme';
import { useLanguage } from '@/store/LanguageContext';
import { PROMPTPAY_ID } from '@/config/payment';
import { generatePromptPayPayload } from '@/utils/promptpay';
import { useSavedCard } from '@/store/SavedCardContext';
import type { Language } from '@/i18n/translations';

// ============================================================================
// PAYMENT SHEET — หน้าจ่ายเงิน 2 แบบ (พร้อมเพย์ / บัตรเครดิต-เดบิต)
// (เดิมมี "โอนผ่านธนาคาร" เป็นแบบที่ 3 ด้วย — เอาออกแล้วตามที่ขอ)
//
// พร้อมเพย์: QR ที่เห็นเป็นของจริง สร้างตามสเปก EMV QR / Thai QR Payment
// (ดู src/utils/promptpay.ts) ล็อกยอดเงินไว้ในตัว QR เอง (Dynamic QR) สแกน
// จ่ายได้จริงถ้าตั้งค่า PROMPTPAY_ID ใน src/config/payment.ts เป็นเบอร์/เลข
// ผู้เสียภาษีจริงของร้าน — ของตัวอย่างตอนนี้เป็นเบอร์ปลอม เงินจะไม่เข้าบัญชี
// ร้านจริงจนกว่าจะเปลี่ยนค่านั้น
//
// บัตรเครดิต/เดบิต: ยังเป็น MOCK — ไม่มีการเชื่อมต่อ payment gateway จริง
// ไม่มีการส่ง/บันทึกเลขบัตรไปที่ไหนเลย ของจริงต้องเก็บเลขบัตรผ่าน SDK ของ
// ผู้ให้บริการอย่าง Omise/2C2P/Stripe (tokenize ฝั่ง client) แล้วส่งแค่ token
// ไป backend เพื่อสร้าง charge เท่านั้น ห้ามส่งเลขบัตรตรงจาก client ไป
// backend ของเราเองแบบดิบๆ เด็ดขาด (ผิด PCI-DSS)
//
// "จำบัตรไว้" (ดู src/store/SavedCardContext.tsx): เก็บเฉพาะ brand/เลข 4
// ตัวท้าย/ชื่อ/วันหมดอายุ ไว้ผ่าน AsyncStorage (persist ข้ามการเปิดแอปใหม่)
// ไม่เก็บเลขบัตรเต็มหรือ CVV ไว้เลยแม้แต่ตอน mock เพื่อไม่ให้เป็นตัวอย่างที่
// ผิดหลัก PCI-DSS ตั้งแต่ในโค้ดเดโม — ครั้งแรกที่จ่ายด้วยบัตรจะเห็นฟอร์ม
// กรอกบัตร พอกดจ่ายสำเร็จแล้ว ครั้งต่อไปจะเจอหน้าเลือกว่าจะ "ใช้บัตรเดิม"
// หรือ "ใช้บัตรอื่น" (กรอกบัตรใหม่) แทน
// ============================================================================

type Tab = 'promptpay' | 'card';

function detectCardBrand(digits: string): string | null {
  if (digits.startsWith('4')) return 'VISA';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'AMEX';
  return null;
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

interface PaymentSheetProps {
  visible: boolean;
  amount: number;
  onClose: () => void;
  // เรียกตอนผู้ใช้ยืนยัน "จ่ายแล้ว" ในแท็บไหนก็ตาม — parent ค่อยไปเรียก API
  // ซื้อจริง (mock) ต่อเอง PaymentSheet เองไม่ยุ่งกับ business logic การซื้อ
  onConfirm: () => void;
}

export function PaymentSheet({ visible, amount, onClose, onConfirm }: PaymentSheetProps) {
  const { t, language } = useLanguage();
  const [tab, setTab] = useState<Tab>('promptpay');

  const { savedCard, saveCard, isLoading: isSavedCardLoading } = useSavedCard();
  const [addingNewCard, setAddingNewCard] = useState(false);
  // มีบัตรที่บันทึกไว้แล้ว และผู้ใช้ยังไม่ได้กด "ใช้บัตรอื่น" -> โชว์หน้าเลือก
  // ใช้บัตรเดิม แทนฟอร์มกรอกบัตรใหม่
  const showCardForm = !savedCard || addingNewCard;

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardTouched, setCardTouched] = useState(false);

  // สร้างครั้งเดียวตอนเปิดชีทนี้ขึ้นมา (ไม่สุ่มใหม่ทุก re-render) ผูกกับยอด
  // เงินตรงนี้เป๊ะๆ — ถ้ายอด (amount) เปลี่ยน payload ก็เปลี่ยนตาม เพราะ
  // ยอดถูกล็อกเข้าไปในตัว QR เอง (tag 54)
  const promptPayPayload = useMemo(() => {
    try {
      return generatePromptPayPayload(PROMPTPAY_ID, amount);
    } catch (err) {
      console.error('Failed to generate PromptPay payload:', err);
      return null;
    }
  }, [amount]);

  const cardDigits = cardNumber.replace(/\D/g, '');
  const cardBrand = useMemo(() => detectCardBrand(cardDigits), [cardDigits]);
  const isCardValid =
    cardDigits.length >= 13 &&
    cardDigits.length <= 16 &&
    cardName.trim().length > 1 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    Number(expiry.slice(0, 2)) >= 1 &&
    Number(expiry.slice(0, 2)) <= 12 &&
    cvv.length >= 3;

  function resetAndClose() {
    setTab('promptpay');
    setCardNumber('');
    setCardName('');
    setExpiry('');
    setCvv('');
    setCardTouched(false);
    setAddingNewCard(false);
    onClose();
  }

  function handleCardPay() {
    if (!showCardForm) {
      // จ่ายด้วยบัตรที่บันทึกไว้ — ไม่ต้องกรอกอะไรใหม่
      onConfirm();
      return;
    }

    setCardTouched(true);
    if (!isCardValid) return;

    // บันทึกไว้ใช้ครั้งหน้า — เก็บแค่ brand/เลข 4 ตัวท้าย/ชื่อ/วันหมดอายุ
    // (ดูเหตุผลที่ไม่เก็บเลขเต็ม/CVV ใน SavedCardContext.tsx)
    saveCard({
      brand: cardBrand,
      last4: cardDigits.slice(-4),
      expiry,
      cardName: cardName.trim(),
    });
    onConfirm();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={resetAndClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={resetAndClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>{t('paymentTitle')}</Text>
            <Pressable onPress={resetAndClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.ash} />
            </Pressable>
          </View>

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>{t('paymentAmountLabel')}</Text>
            <Text style={styles.amountValue}>฿{amount}</Text>
          </View>

          <View style={styles.tabs}>
            {(
              [
                ['promptpay', t('paymentTabPromptpay'), 'qr-code-outline'],
                ['card', t('paymentTabCard'), 'card-outline'],
              ] as const
            ).map(([key, label, icon]) => (
              <Pressable
                key={key}
                style={[styles.tabBtn, tab === key && styles.tabBtnActive]}
                onPress={() => setTab(key)}
              >
                <Ionicons
                  name={icon}
                  size={16}
                  color={tab === key ? colors.ink : colors.ash}
                  style={{ marginBottom: 3 }}
                />
                <Text style={[styles.tabLabel, tab === key && styles.tabLabelActive]} numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {tab === 'promptpay' && (
              <View style={styles.center}>
                <View style={styles.qrBox}>
                  {promptPayPayload ? (
                    <QRCode value={promptPayPayload} size={144} backgroundColor={colors.stub} />
                  ) : (
                    <Text style={styles.warnText}>{t('promptpayUnavailable')}</Text>
                  )}
                </View>
                <Text style={styles.instruction}>{t('promptpayInstruction')}</Text>
                <Text style={styles.lockedNotice}>
                  {t('promptpayLockedNotice', { amount })}
                </Text>
                <Text style={styles.mono}>{formatPromptPayId(PROMPTPAY_ID, language)}</Text>
                <Pressable style={styles.payBtn} onPress={onConfirm}>
                  <Text style={styles.payBtnText}>{t('iHavePaid')}</Text>
                </Pressable>
              </View>
            )}

            {tab === 'card' && isSavedCardLoading && (
              <View style={styles.center}>
                <Text style={styles.mono}>{t('loading')}</Text>
              </View>
            )}

            {tab === 'card' && !isSavedCardLoading && !showCardForm && savedCard && (
              <View style={styles.center}>
                <Text style={styles.fieldLabel}>{t('savedCardTitle')}</Text>
                <View style={styles.savedCardBox}>
                  <View style={styles.cardInputRow}>
                    {savedCard.brand && <Text style={styles.brandTag}>{savedCard.brand}</Text>}
                    <Text style={styles.mono}>•••• •••• •••• {savedCard.last4}</Text>
                  </View>
                  <Text style={styles.mono}>{savedCard.cardName}</Text>
                  <Text style={styles.mono}>{savedCard.expiry}</Text>
                </View>

                <Pressable style={styles.payBtn} onPress={handleCardPay}>
                  <Text style={styles.payBtnText}>{t('payAmountButton', { amount })}</Text>
                </Pressable>
                <Pressable onPress={() => setAddingNewCard(true)} hitSlop={8}>
                  <Text style={styles.linkText}>{t('useDifferentCard')}</Text>
                </Pressable>
              </View>
            )}

            {tab === 'card' && !isSavedCardLoading && showCardForm && (
              <View style={styles.form}>
                <View>
                  <Text style={styles.fieldLabel}>{t('cardNumberLabel')}</Text>
                  <View style={styles.cardInputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder={t('cardNumberPlaceholder')}
                      placeholderTextColor={colors.ash2}
                      keyboardType="number-pad"
                      value={cardNumber}
                      onChangeText={(v) => setCardNumber(formatCardNumber(v))}
                      maxLength={19}
                    />
                    {cardBrand && <Text style={styles.brandTag}>{cardBrand}</Text>}
                  </View>
                </View>

                <View>
                  <Text style={styles.fieldLabel}>{t('cardNameLabel')}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t('cardNamePlaceholder')}
                    placeholderTextColor={colors.ash2}
                    autoCapitalize="characters"
                    value={cardName}
                    onChangeText={setCardName}
                  />
                </View>

                <View style={styles.rowSplit}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>{t('cardExpiryLabel')}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      placeholderTextColor={colors.ash2}
                      keyboardType="number-pad"
                      value={expiry}
                      onChangeText={(v) => setExpiry(formatExpiry(v))}
                      maxLength={5}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>{t('cardCvvLabel')}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="•••"
                      placeholderTextColor={colors.ash2}
                      keyboardType="number-pad"
                      secureTextEntry
                      value={cvv}
                      onChangeText={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                    />
                  </View>
                </View>

                {cardTouched && !isCardValid && (
                  <Text style={styles.warnText}>{t('cardFormIncomplete')}</Text>
                )}

                <Pressable
                  style={[styles.payBtn, !isCardValid && cardTouched && styles.payBtnDisabled]}
                  onPress={handleCardPay}
                >
                  <Text style={styles.payBtnText}>{t('payAmountButton', { amount })}</Text>
                </Pressable>

                {savedCard && (
                  <Pressable onPress={() => setAddingNewCard(false)} hitSlop={8}>
                    <Text style={styles.linkText}>{t('backToSavedCard')}</Text>
                  </Pressable>
                )}
              </View>
            )}

            <Text style={styles.demoNotice}>{t('paymentDemoNotice')}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// แสดงเบอร์พร้อมเพย์แบบ mask บางส่วน เผื่อร้านตั้ง PROMPTPAY_ID เป็นเลข
// ผู้เสียภาษี/บัตรประชาชนก็ยังอ่านง่าย ไม่ต้องมี placeholder แยกจาก config จริง
function formatPromptPayId(id: string, language: Language): string {
  const digits = id.replace(/[^0-9]/g, '');
  const label = language === 'en' ? 'PromptPay' : 'พร้อมเพย์';
  if (digits.length === 10) {
    return `${label}: ${digits.slice(0, 3)}-XXX-${digits.slice(6)}`;
  }
  if (digits.length === 13) {
    return `${label}: ${digits.slice(0, 1)}-XXXX-XXXXX-XX-${digits.slice(-1)}`;
  }
  return `${label}: ${id}`;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.ink2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '86%',
    paddingBottom: 24,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  title: { flex: 1, fontFamily: fontFamily.display, fontSize: 18, color: colors.stub },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.ink3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  amountLabel: { fontFamily: fontFamily.mono, fontSize: 10.5, color: colors.ash2, textTransform: 'uppercase' },
  amountValue: { fontFamily: fontFamily.display, fontSize: 24, color: colors.marquee },

  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginTop: 16 },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.ink3,
  },
  tabBtnActive: { backgroundColor: colors.marquee },
  tabLabel: { fontFamily: fontFamily.bodyMedium, fontSize: 10.5, color: colors.ash, textAlign: 'center' },
  tabLabelActive: { color: colors.ink },

  body: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },

  center: { alignItems: 'center', gap: 10 },
  qrBox: {
    width: 168,
    height: 168,
    backgroundColor: colors.stub,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption,
    color: colors.ash,
    textAlign: 'center',
    maxWidth: 260,
  },
  lockedNotice: {
    fontFamily: fontFamily.body,
    fontSize: 10.5,
    color: colors.marquee,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 15,
  },
  mono: { fontFamily: fontFamily.mono, fontSize: 11.5, color: colors.stub, marginBottom: 4 },

  form: { gap: 14 },
  fieldLabel: {
    fontFamily: fontFamily.mono,
    fontSize: 10,
    color: colors.ash2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    flex: 1,
    backgroundColor: colors.ink3,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fontFamily.mono,
    fontSize: 13.5,
    color: colors.stub,
  },
  cardInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandTag: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 10,
    color: colors.marquee,
    paddingHorizontal: 8,
  },
  rowSplit: { flexDirection: 'row', gap: 12 },
  warnText: { fontFamily: fontFamily.body, fontSize: 11.5, color: colors.velvetBright },

  savedCardBox: {
    width: '100%',
    backgroundColor: colors.ink3,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontFamily: fontFamily.mono,
    fontSize: 11,
    color: colors.velvetBright,
    textDecorationLine: 'underline',
    marginTop: 10,
  },

  payBtn: {
    backgroundColor: colors.velvet,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    width: '100%',
  },
  payBtnDisabled: { opacity: 0.5 },
  payBtnText: { fontFamily: fontFamily.bodySemiBold, fontSize: fontSize.body, color: colors.stub },

  demoNotice: {
    fontFamily: fontFamily.body,
    fontSize: 10,
    color: colors.ash2,
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 15,
  },
});
