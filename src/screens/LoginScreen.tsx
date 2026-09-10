import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, fontFamily, fontSize } from '@/theme';
import { useAuth } from '@/store/AuthContext';
import { useLanguage } from '@/store/LanguageContext';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

// ยังไม่มี backend จริง (ดู src/api/auth.ts) — ล็อกอินด้วยบัญชีทดลอง
// demo@housesamyan.com / demo1234 ได้เลย หรือกด "สมัครสมาชิก" ไปหน้า Register
export function LoginScreen({ navigation }: Props) {
  const { login, isBusy, error, clearError } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState('demo@housesamyan.com');
  const [password, setPassword] = useState('demo1234');

  const handleSubmit = () => {
    login(email, password).catch(() => {});
  };

  const goToRegister = () => {
    clearError();
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* ผู้ใช้ยังไม่ล็อกอิน เลยเข้าไม่ถึงตัวสลับภาษาที่หน้าโปรไฟล์ — ใส่ตัวสลับ
            เล็กๆ ไว้ตรงนี้ด้วย ใช้ LanguageContext ตัวเดียวกันทั้งแอป */}
        <View style={styles.langSwitch}>
          <Pressable
            onPress={() => setLanguage('th')}
            style={[styles.langOption, language === 'th' && styles.langOptionActive]}
          >
            <Text style={[styles.langOptionText, language === 'th' && styles.langOptionTextActive]}>
              ไทย
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setLanguage('en')}
            style={[styles.langOption, language === 'en' && styles.langOptionActive]}
          >
            <Text style={[styles.langOptionText, language === 'en' && styles.langOptionTextActive]}>
              English
            </Text>
          </Pressable>
        </View>

        <View style={styles.brand}>
          <Text style={styles.eyebrow}>✦ HOUSE SAMYAN</Text>
          <Text style={styles.title}>{t('loginTitle')}</Text>
          <Text style={styles.subtitle}>{t('loginSubtitle')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>{t('emailLabel')}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.ash2}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('passwordLabel')}</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t('passwordPlaceholder')}
              placeholderTextColor={colors.ash2}
              style={styles.input}
              secureTextEntry
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            onPress={handleSubmit}
            disabled={isBusy}
            style={({ pressed }) => [
              styles.submitBtn,
              { opacity: pressed || isBusy ? 0.75 : 1 },
            ]}
          >
            {isBusy ? (
              <ActivityIndicator color={colors.stub} />
            ) : (
              <Text style={styles.submitText}>{t('loginTitle')}</Text>
            )}
          </Pressable>

          <Pressable onPress={goToRegister} style={styles.switchBtn}>
            <Text style={styles.switchText}>{t('switchToRegister')}</Text>
          </Pressable>
        </View>

        <Text style={styles.hint}>{t('demoHint')}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.ink },
  container: { flexGrow: 1, justifyContent: 'center', padding: 26 },
  langSwitch: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: colors.ink3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 3,
    gap: 2,
    marginBottom: 20,
  },
  langOption: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  langOptionActive: { backgroundColor: colors.marquee },
  langOptionText: { fontFamily: fontFamily.body, fontSize: 12, color: colors.ash },
  langOptionTextActive: { color: colors.ink, fontFamily: fontFamily.bodyMedium },
  brand: { marginBottom: 32, gap: 8 },
  eyebrow: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.eyebrow,
    letterSpacing: 1.5,
    color: colors.marquee,
  },
  title: {
    fontFamily: fontFamily.displayItalic,
    fontSize: 30,
    color: colors.stub,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    color: colors.ash,
  },
  form: { gap: 16 },
  field: { gap: 6 },
  label: {
    fontFamily: fontFamily.mono,
    fontSize: 9.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.ash2,
  },
  input: {
    backgroundColor: colors.ink2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: colors.stub,
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
  },
  error: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption,
    color: colors.velvetBright,
  },
  submitBtn: {
    backgroundColor: colors.velvet,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  submitText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.bodyLarge,
    color: colors.stub,
  },
  switchBtn: { alignItems: 'center', paddingVertical: 8 },
  switchText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption,
    color: colors.marquee,
  },
  hint: {
    fontFamily: fontFamily.mono,
    fontSize: 10,
    color: colors.ash2,
    textAlign: 'center',
    marginTop: 24,
  },
});
