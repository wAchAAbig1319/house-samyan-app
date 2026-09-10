// ============================================================================
// PROMPTPAY QR GENERATOR
// สร้าง payload ตามมาตรฐาน EMV QR Code for Payment Systems ที่ธนาคารแห่ง
// ประเทศไทยใช้กับพร้อมเพย์ (Thai QR Payment) — เป็นสเปกสาธารณะ ไม่ใช่ของลับ
// อ้างอิง: https://www.bot.or.th, EMVCo QR Code Specification
//
// จุดสำคัญ: เราใส่ tag 54 (Transaction Amount) เข้าไปในตัว payload เอง ทำให้
// เป็น "Dynamic QR" ที่ล็อกยอดเงินไว้แน่นอน — แอปธนาคารที่สแกนจะโชว์ยอดนี้
// แบบแก้ไขไม่ได้ ต่างจาก Static QR (ไม่มี tag 54) ที่ผู้จ่ายพิมพ์ยอดเองได้
//
// ข้อควรระวังของจริง: การสร้าง QR ล็อกยอดฝั่ง client แบบนี้ "ล็อกที่ตัว QR"
// เท่านั้น ไม่ได้แปลว่าเงินเข้าระบบเราอัตโนมัติ — ร้านค้าจริงต้องมีฝั่ง
// backend คอยเช็คยอดที่เข้าบัญชีจริง (ผ่าน bank API / webhook ของธนาคาร หรือ
// บริการตรวจสลิปอย่าง SlipOK/Opn) แล้วค่อย mark order ว่าจ่ายแล้ว ห้าม
// เชื่อคำว่า "ฉันจ่ายแล้ว" จากฝั่งผู้ใช้เพียงอย่างเดียวในระบบโปรดักชันจริง
// ============================================================================

function tlv(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

/**
 * CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF) — อัลกอริทึมเดียวกับที่สเปก
 * EMV QR กำหนดไว้สำหรับ tag 63 (CRC) ท้าย payload
 */
function crc16ccitt(input: string): string {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

const PROMPTPAY_AID = 'A000000677010111';

/**
 * แปลงเบอร์โทร/เลขบัตรประชาชน/เลขผู้เสียภาษี ให้เป็น sub-tag ที่ถูกต้อง
 * - เบอร์มือถือ 10 หลัก (ขึ้นต้น 0) -> sub tag 01, แปลงเป็นรูป 0066XXXXXXXXX
 * - เลขบัตรประชาชน/เลขผู้เสียภาษี 13 หลัก -> sub tag 02
 */
function resolvePromptPayTarget(rawId: string): { subTag: string; value: string } {
  const digits = rawId.replace(/[^0-9]/g, '');

  if (digits.length === 13) {
    return { subTag: '02', value: digits };
  }

  if (digits.length === 10 && digits.startsWith('0')) {
    const withCountryCode = `66${digits.slice(1)}`; // 0812345678 -> 66812345678
    return { subTag: '01', value: withCountryCode.padStart(13, '0') };
  }

  throw new Error(
    `Invalid PromptPay ID: "${rawId}" — must be a 10-digit mobile number starting with 0, or a 13-digit national/tax ID.`,
  );
}

/**
 * สร้าง PromptPay QR payload ที่ล็อกยอดเงินตายตัว (Dynamic QR)
 * @param promptPayId เบอร์มือถือ 10 หลัก หรือเลขบัตรประชาชน/ผู้เสียภาษี 13 หลัก ของร้าน
 * @param amountTHB ยอดที่ต้องชำระ หน่วยบาท (ทศนิยมได้ เช่น 119.00)
 */
export function generatePromptPayPayload(promptPayId: string, amountTHB: number): string {
  if (!(amountTHB > 0)) {
    throw new Error('PromptPay amount must be greater than 0');
  }

  const { subTag, value } = resolvePromptPayTarget(promptPayId);

  const merchantAccountInfo = tlv('00', PROMPTPAY_AID) + tlv(subTag, value);

  const payloadWithoutCrc =
    tlv('00', '01') + // Payload Format Indicator
    tlv('01', '12') + // Point of Initiation Method: 12 = dynamic (มียอดเงินล็อกอยู่)
    tlv('29', merchantAccountInfo) + // Merchant Account Info (PromptPay)
    tlv('53', '764') + // Transaction Currency: 764 = THB
    tlv('54', amountTHB.toFixed(2)) + // Transaction Amount — ตัวล็อกยอด
    tlv('58', 'TH') + // Country Code
    '6304'; // ID+length ของ CRC field ที่กำลังจะตามมา ต้องรวมในการคำนวณ CRC ด้วย

  const crc = crc16ccitt(payloadWithoutCrc);
  return payloadWithoutCrc + crc;
}

/**
 * เลขอ้างอิงคำสั่งซื้อ ไว้ให้ลูกค้าแจ้งตอนโอนผ่านธนาคาร (ไม่เกี่ยวกับพร้อมเพย์)
 * เพื่อให้ทีมหลังบ้าน/บัญชี จับคู่สลิปกับคำสั่งซื้อได้ถูกตัว
 */
export function generateOrderReference(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(2);
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `HS${y}${m}${d}-${rand}`;
}
