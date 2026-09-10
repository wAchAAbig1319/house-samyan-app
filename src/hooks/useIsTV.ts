import { Platform } from 'react-native';

/**
 * true เมื่อรันบน Android TV / Fire TV / tvOS
 * ต้อง build ด้วย EXPO_TV=1 ถึงจะทำงานถูกต้อง (ดู README หัวข้อ "รันบน TV")
 */
export function useIsTV(): boolean {
  return Platform.isTV === true;
}
