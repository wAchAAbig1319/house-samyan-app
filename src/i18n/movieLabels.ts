import type { Movie } from '@/api/types';
import type { Language } from './translations';

// ============================================================================
// การแปลข้อมูลหนัง — แยกจาก UI string ทั่วไป (translations.ts) เพราะข้อมูลหนัง
// มาจาก mockData.ts (เทียบเท่า field จากฟอร์ม admin) ไม่ใช่ข้อความ UI คงที่
// ============================================================================

// Genre/Sub genre ในข้อมูลเก็บเป็นค่าอังกฤษตายตัว (ตรงกับตัวเลือกใน field ของ
// ฟอร์ม admin — ดู GENRE_OPTIONS/SUB_GENRE_OPTIONS ใน api/types.ts) ฉะนั้นเวลา
// UI เป็นภาษาไทย ต้องแปลไทยเอง ไม่ได้มาจาก mockData ตรงๆ แบบ genre เดิม
const GENRE_TAG_TH: Record<string, string> = {
  Action: 'แอ็กชัน',
  Horror: 'สยองขวัญ',
  Drama: 'ดราม่า',
  Thriller: 'ระทึกขวัญ',
  Documentary: 'สารคดี',
  Scifi: 'ไซไฟ',
  Award: 'รางวัล',
};

/** แปล genre/subGenre แท็กเดียว (เช่น ใช้เรนเดอร์ label บน filter chip) */
export function localizedGenreTag(tag: string, lang: Language): string {
  if (lang === 'en') return tag;
  return GENRE_TAG_TH[tag] ?? tag;
}

/** แปล + รวม genre/subGenre หลายแท็กเป็นสตริงเดียว ใช้โชว์บนการ์ด/หน้ารายละเอียด */
export function localizedGenreList(tags: string[], lang: Language): string {
  return tags.map((tag) => localizedGenreTag(tag, lang)).join(lang === 'th' ? '/' : ' / ');
}

const COUNTRY_EN: Record<string, string> = {
  ไทย: 'Thailand',
  เกาหลีใต้: 'South Korea',
  ญี่ปุ่น: 'Japan',
  ฝรั่งเศส: 'France',
  อินโดนีเซีย: 'Indonesia',
  สหรัฐอเมริกา: 'United States',
};

export function localizedCountry(countryTh: string, lang: Language): string {
  if (lang === 'th') return countryTh;
  return COUNTRY_EN[countryTh] ?? countryTh;
}

const SUBTITLE_EN: Record<string, string> = {
  ซับไทย: 'Thai subtitles',
  'พากย์ไทย / ซับไทย': 'Thai dub / Thai subtitles',
};

export function localizedSubtitle(subtitleTh: string, lang: Language): string {
  if (lang === 'th') return subtitleTh;
  return SUBTITLE_EN[subtitleTh] ?? subtitleTh;
}

export function localizedTitle(movie: Movie, lang: Language): string {
  if (lang === 'en') return movie.titleEn ?? movie.title;
  return movie.title;
}

export function localizedDescription(movie: Movie, lang: Language): string {
  if (lang === 'en') return movie.shortDescriptionEn ?? movie.shortDescription;
  return movie.shortDescription;
}
