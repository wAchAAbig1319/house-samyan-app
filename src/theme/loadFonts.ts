import * as Font from 'expo-font';

// เรียกฟังก์ชันนี้ใน App.tsx ก่อน render UI จริง
// ต้องมีไฟล์ฟอนต์ตามชื่อนี้ใน assets/fonts/ (ดูคำแนะนำใน README หัวข้อ "ฟอนต์")
export async function loadAppFonts(): Promise<void> {
  await Font.loadAsync({
    'Fraunces-SemiBold': require('../../assets/fonts/Fraunces-SemiBold.ttf'),
    'Fraunces-SemiBoldItalic': require('../../assets/fonts/Fraunces-SemiBoldItalic.ttf'),
    'IBMPlexSansThai-Regular': require('../../assets/fonts/IBMPlexSansThai-Regular.ttf'),
    'IBMPlexSansThai-Medium': require('../../assets/fonts/IBMPlexSansThai-Medium.ttf'),
    'IBMPlexSansThai-SemiBold': require('../../assets/fonts/IBMPlexSansThai-SemiBold.ttf'),
    'IBMPlexMono-Regular': require('../../assets/fonts/IBMPlexMono-Regular.ttf'),
  });
}
