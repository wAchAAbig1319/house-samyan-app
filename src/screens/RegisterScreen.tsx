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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

// ยังไม่มี backend จริง (ดู src/api/auth.ts) — สมัครสมาชิกด้วยอีเมล/รหัสผ่าน
// อะไรก็ได้ เก็บบัญชีไว้ใน memory ระหว่างแอปเปิดอยู่เท่านั้น (รีเซ็ตเมื่อรีโหลดแอป)
export function RegisterScreen({ navigation }: Props) {
  const { register, isBusy, error, clearError } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    register(name, email, password).catch(() => {});
  };

  const goToLogin = () => {
    clearError();
    navigation.navigate('Login');
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
        <View style={styles.brand}>
          <Text style={styles.eyebrow}>✦ HOUSE SAMYAN</Text>
          <Text style={styles.title}>{t('registerTitle')}</Text>
          <Text style={styles.subtitle}>{t('registerSubtitle')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>{t('nameLabel')}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('namePlaceholder')}
              placeholderTextColor={colors.ash2}
              style={styles.input}
              autoCapitalize="words"
            />
          </View>

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
              <Text style={styles.submitText}>{t('registerTitle')}</Text>
            )}
          </Pressable>

          <Pressable onPress={goToLogin} style={styles.switchBtn}>
            <Text style={styles.switchText}>{t('switchToLogin')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.ink },
  container: { flexGrow: 1, justifyContent: 'center', padding: 26 },
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
});
