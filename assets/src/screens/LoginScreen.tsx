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
import { colors, fontFamily, fontSize } from '@/theme';
import { useAuth } from '@/store/AuthContext';

// ยังไม่มี backend จริง (ดู src/api/auth.ts) — ล็อกอินด้วยบัญชีทดลอง
// demo@housesamyan.com / demo1234 ได้เลย หรือสมัครสมาชิกใหม่ด้วยอีเมล/รหัสผ่านอะไรก็ได้
export function LoginScreen() {
  const { login, register, isBusy, error, clearError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@housesamyan.com');
  const [password, setPassword] = useState('demo1234');

  const handleSubmit = () => {
    if (mode === 'login') {
      login(email, password).catch(() => {});
    } else {
      register(name, email, password).catch(() => {});
    }
  };

  const switchMode = () => {
    clearError();
    setMode((m) => (m === 'login' ? 'register' : 'login'));
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
          <Text style={styles.title}>
            {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'login'
              ? 'เข้าโรงหนังของคุณอีกครั้ง'
              : 'สมัครสมาชิกใหม่ ใช้เวลาไม่ถึงนาที'}
          </Text>
        </View>

        <View style={styles.form}>
          {mode === 'register' && (
            <View style={styles.field}>
              <Text style={styles.label}>ชื่อ</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="ชื่อที่ใช้แสดงในแอป"
                placeholderTextColor={colors.ash2}
                style={styles.input}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>อีเมล</Text>
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
            <Text style={styles.label}>รหัสผ่าน</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="อย่างน้อย 4 ตัวอักษร"
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
              <Text style={styles.submitText}>
                {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
              </Text>
            )}
          </Pressable>

          <Pressable onPress={switchMode} style={styles.switchBtn}>
            <Text style={styles.switchText}>
              {mode === 'login'
                ? 'ยังไม่มีบัญชี? สมัครสมาชิก'
                : 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'}
            </Text>
          </Pressable>
        </View>

        {mode === 'login' && (
          <Text style={styles.hint}>
            ทดลองใช้: demo@housesamyan.com / demo1234
          </Text>
        )}
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
  hint: {
    fontFamily: fontFamily.mono,
    fontSize: 10,
    color: colors.ash2,
    textAlign: 'center',
    marginTop: 24,
  },
});
