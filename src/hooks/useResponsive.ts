import { useWindowDimensions } from 'react-native';

export type DeviceCategory = 'phone' | 'tablet';
export type Orientation = 'portrait' | 'landscape';

interface ResponsiveInfo {
  width: number;
  height: number;
  device: DeviceCategory;
  orientation: Orientation;
  /** จำนวนการ์ดที่ควรโชว์ต่อแถวใน grid (หน้ากล่องฟิล์ม) */
  gridColumns: number;
  /** ความกว้างการ์ดหนังในแถวเลื่อนแนวนอน (หน้า Home) */
  posterWidth: number;
}

// จุดตัด breakpoint อิงตามขนาดจอทั่วไป ไม่ใช้พิกเซลตายตัวจากดีไซน์เดสก์ท็อป
const TABLET_MIN_WIDTH = 768;

export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();

  const device: DeviceCategory = width >= TABLET_MIN_WIDTH ? 'tablet' : 'phone';
  const orientation: Orientation = width > height ? 'landscape' : 'portrait';

  let gridColumns = 3;
  let posterWidth = 104;

  if (device === 'phone' && orientation === 'portrait') {
    gridColumns = 3;
    posterWidth = 104;
  } else if (device === 'phone' && orientation === 'landscape') {
    gridColumns = 5;
    posterWidth = 120;
  } else if (device === 'tablet' && orientation === 'portrait') {
    gridColumns = 4;
    posterWidth = 140;
  } else if (device === 'tablet' && orientation === 'landscape') {
    gridColumns = 6;
    posterWidth = 150;
  }

  return { width, height, device, orientation, gridColumns, posterWidth };
}
