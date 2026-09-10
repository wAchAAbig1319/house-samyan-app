// ============================================================================
// MOCK AUTH — ไม่มีการเรียก network ใดๆ ในไฟล์นี้ ไม่มี backend จริงรองรับ
// เก็บบัญชีผู้ใช้ไว้ในหน่วยความจำระหว่างที่แอปเปิดอยู่ (รีเซ็ตเมื่อรีโหลดแอป)
// เข้าสู่ระบบจะยังคง "ล็อกเอาต์" ทุกครั้งที่เปิดแอปใหม่ เพราะยังไม่ได้ต่อ
// AsyncStorage หรือ backend จริง — ถ้าจะทำ persistence ทีหลัง ให้เก็บ token/user
// ไว้ใน @react-native-async-storage/async-storage แล้วเช็คตอน app เปิดใน App.tsx
// ============================================================================

export interface MockUser {
  id: string;
  name: string;
  email: string;
}

interface MockAccount extends MockUser {
  password: string;
}

const MOCK_DELAY_MS = 500;

function resolveAfterDelay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}
function rejectAfterDelay(message: string): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), MOCK_DELAY_MS));
}

// บัญชีทดลองใช้ ให้ล็อกอินได้ทันทีโดยไม่ต้องสมัครก่อน
let accounts: MockAccount[] = [
  { id: 'u1', name: 'สมาชิก House Samyan', email: 'demo@housesamyan.com', password: 'demo1234' },
];

function stripPassword(account: MockAccount): MockUser {
  const { password: _password, ...user } = account;
  return user;
}

export const authApi = {
  // เดิม: apiClient.post('/auth/login', { email, password })
  login: (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const account = accounts.find((a) => a.email.toLowerCase() === normalized);
    if (!account) return rejectAfterDelay('ไม่พบบัญชีนี้ในระบบ ลองสมัครสมาชิกใหม่ดูนะ');
    if (account.password !== password) return rejectAfterDelay('รหัสผ่านไม่ถูกต้อง');
    return resolveAfterDelay(stripPassword(account));
  },

  // เดิม: apiClient.post('/auth/register', { name, email, password })
  register: (name: string, email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    if (accounts.some((a) => a.email.toLowerCase() === normalized)) {
      return rejectAfterDelay('อีเมลนี้มีผู้ใช้งานแล้ว');
    }
    const account: MockAccount = {
      id: `u${accounts.length + 1}`,
      name: name.trim() || 'สมาชิกใหม่',
      email: email.trim(),
      password,
    };
    accounts = [...accounts, account];
    return resolveAfterDelay(stripPassword(account));
  },
};
