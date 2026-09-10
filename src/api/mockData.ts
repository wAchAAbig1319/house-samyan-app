import type { Movie } from './types';

// ============================================================================
// MOCK DATA — ใช้แทน backend จริงชั่วคราว
// ยังไม่มี server รองรับ (ดู README) จึงเก็บข้อมูลหนังไว้ในไฟล์นี้แทน
// เมื่อ backend พร้อมใช้งานแล้ว ให้ลบไฟล์นี้และแก้ src/api/movies.ts
// กลับไปเรียก apiClient ตามเดิม (ดูคอมเมนต์ใน movies.ts)
//
// หมายเหตุเรื่องข้อมูล: ชื่อเรื่อง/ปี/ประเทศ/แนว เป็นข้อมูลจริงของหนังที่มีตัวตน
// จริง (เหมือนฐานข้อมูลหนังทั่วไป) แต่ "โปสเตอร์"/"แบนเนอร์" ที่เห็นในแอปยังคง
// เป็นกราฟิกที่สร้างขึ้นเอง (ไล่สี + ตัวหนังสือ ผ่าน MoviePoster/MovieBanner)
// ไม่ใช่ภาพโปสเตอร์จริงของหนังเหล่านี้ เพราะภาพโปสเตอร์จริงมีลิขสิทธิ์เป็นของ
// สตูดิโอ/ผู้สร้างแต่ละเรื่อง เรื่องย่อก็เขียนขึ้นเองสั้นๆ ไม่ได้คัดลอกจากค่ายหนัง
//
// โครงสร้าง field (status, rating, subtitleLanguage, startRelease/endRelease,
// bookingDateMember/Regular, voucherEligible, giftVoucherEligible) ปรับให้ตรง
// กับฟอร์ม "Movie Management" ของหน้า admin จริง เผื่อเชื่อมกับ backend จริงทีหลัง
// ============================================================================

export const MOCK_MOVIES: Movie[] = [
  {
    id: 'm1',
    status: 'active',
    title: 'ลุงบุญมีระลึกชาติ',
    titleEn: 'Uncle Boonmee Who Can Recall His Past Lives',
    shortDescription:
      'กำกับโดยอภิชาติพงศ์ วีระเศรษฐกุล คว้ารางวัลปาล์มทองคำจากเมืองคานส์ปี 2010 เล่าเรื่องชายป่วยไตวายที่ใช้ช่วงเวลาสุดท้ายของชีวิตอยู่กับครอบครัว ก่อนวิญญาณของภรรยาที่เสียชีวิตไปแล้วและลูกชายที่หายตัวไปจะกลับมาเยี่ยม',
    shortDescriptionEn:
      "Directed by Apichatpong Weerasethakul, winner of the 2010 Palme d'Or. A dying man spends his final days with family, visited by the ghost of his late wife and his long-lost son.",
    genre: ['Drama'],
    subGenre: ['Award'],
    runtimeMinutes: 114,
    rating: 'น15+',
    subtitleLanguage: 'ซับไทย',
    startRelease: '2026-08-28',
    endRelease: '2026-09-03',
    bookingDateMember: '2026-08-26',
    bookingDateRegular: '2026-08-27',
    voucherEligible: true,
    giftVoucherEligible: true,
    priceTHB: 129,
    accentColor: ['#3D1F1C', '#C23B49'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m1-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m1-banner/800/450',
    // ลิงก์ทดสอบสาธารณะจาก Mux (ไม่ใช่หนังเรื่องนี้จริง แค่ใช้เช็คว่า Player
    // เล่นวิดีโอได้จริง) — พอมีไฟล์จริงแล้ว แทนที่บรรทัดนี้ด้วย URL ของคุณเอง
    // หรือลบบรรทัดนี้ทิ้งถ้ายังไม่อยากให้เรื่องนี้เล่นได้
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    isClassic: false,
  },
  {
    id: 'm2',
    status: 'active',
    title: 'เดอะมาสเตอร์',
    titleEn: 'The Master',
    shortDescription:
      'สารคดีโดยอาทิตย์ อัสสรัตน์ ตามรอยโรงหนังสแตนด์อโลนย่านสะพานควาย และวัฒนธรรมการฉายหนังผ่านม้วนวิดีโอละเมิดลิขสิทธิ์ในยุคก่อนอินเทอร์เน็ต บอกเล่าผ่านสายตาของเจ้าของโรงหนังที่ยึดอาชีพนี้มาทั้งชีวิต',
    shortDescriptionEn:
      "A documentary by Aditya Assarat tracing the last standalone cinemas of Saphan Kwai and the bootleg-VHS screening culture of the pre-internet era, told through a lifelong theater owner's eyes.",
    genre: ['Drama'],
    subGenre: ['Documentary'],
    runtimeMinutes: 78,
    rating: 'ท',
    subtitleLanguage: 'ซับไทย',
    startRelease: '2026-08-25',
    endRelease: '2026-09-07',
    voucherEligible: true,
    giftVoucherEligible: false,
    priceTHB: 89,
    accentColor: ['#16302B', '#4FA98A'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m2-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m2-banner/800/450',
    isClassic: false,
  },
  {
    id: 'm3',
    status: 'active',
    title: 'วันสุดท้าย..ก่อนบายเธอ',
    titleEn: 'One for the Road',
    shortDescription:
      'กำกับโดยนวพล ธำรงรัตนฤทธิ์ อำนวยการสร้างโดยหว่องกาไว เรื่องราวของชายหนุ่มป่วยระยะสุดท้ายที่ชวนเพื่อนสนิทออกเดินทางตามหาอดีตแฟนเก่าทั่วประเทศ เพื่อคืนของที่เคยติดค้างใจกันไว้',
    shortDescriptionEn:
      "Directed by Nawapol Thamrongrattanarit, produced by Wong Kar-wai. A terminally ill man and his estranged brother road-trip across Thailand returning things to old flames.",
    genre: ['Drama'],
    subGenre: [],
    country: 'ไทย',
    year: 2021,
    runtimeMinutes: 130,
    rating: 'น15+',
    subtitleLanguage: 'ซับไทย',
    startRelease: '2026-07-01',
    endRelease: '2026-08-15',
    voucherEligible: true,
    giftVoucherEligible: true,
    // โปรโมชั่น: ราคาเต็ม 199 ลด 25% เหลือ 149 (199 * 0.75 = 149.25 ปัดเป็น 149)
    originalPriceTHB: 199,
    discountPercent: 25,
    priceTHB: 149,
    accentColor: ['#3D2A12', '#E0A63E'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m3-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m3-banner/800/450',
    isClassic: false,
  },
  {
    id: 'm4',
    status: 'active',
    title: 'ซัมเมอร์คืนสุดท้ายของสองพี่น้อง',
    titleEn: 'Moving On',
    shortDescription:
      'ภาพยนตร์เกาหลีที่ได้รับคำชมจากหลายเทศกาลนานาชาติ เล่าเรื่องพี่น้องวัยรุ่นที่ต้องย้ายไปอยู่บ้านคุณปู่ในช่วงฤดูร้อนหนึ่ง และค่อยๆ เรียนรู้เรื่องความรักและการสูญเสียผ่านสายตาของเด็กสองคน',
    shortDescriptionEn:
      "An internationally acclaimed Korean festival favorite about two siblings who spend a summer at their grandfather's house, quietly learning about love and loss.",
    genre: ['Drama'],
    subGenre: [],
    country: 'เกาหลีใต้',
    year: 2019,
    runtimeMinutes: 105,
    rating: 'ท',
    subtitleLanguage: 'ซับไทย',
    startRelease: '2026-08-20',
    endRelease: '2026-09-10',
    voucherEligible: false,
    giftVoucherEligible: false,
    priceTHB: 159,
    accentColor: ['#16233D', '#4E86C9'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m4-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m4-banner/800/450',
    isClassic: false,
  },
  {
    id: 'm5',
    status: 'active',
    title: 'เด็กเทวดา',
    titleEn: 'Weathering with You',
    shortDescription:
      'อนิเมะโดยมาโคโตะ ชินไก เรื่องราวของเด็กหนุ่มที่หนีออกจากบ้านมาโตเกียว และพบกับเด็กสาวผู้มีพลังพิเศษหยุดฝนได้ ทั้งคู่ต้องเลือกระหว่างโชคชะตาของเมืองกับความสัมพันธ์ของพวกเขาเอง',
    shortDescriptionEn:
      "An anime by Makoto Shinkai. A runaway teen in Tokyo meets a girl with the power to stop the rain — and the two must choose between the city's fate and their bond.",
    genre: ['Drama'],
    subGenre: ['Scifi'],
    country: 'ญี่ปุ่น',
    year: 2019,
    runtimeMinutes: 112,
    rating: 'ท',
    subtitleLanguage: 'พากย์ไทย / ซับไทย',
    startRelease: '2026-08-15',
    endRelease: '2026-09-15',
    voucherEligible: true,
    giftVoucherEligible: false,
    priceTHB: 139,
    accentColor: ['#2B1640', '#9B5FC0'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m5-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m5-banner/800/450',
    isClassic: false,
  },
  {
    id: 'm6',
    // ตัวอย่างเรื่องที่ admin กด Suspend ไว้ — ใช้ทดสอบ UI ตอนหนังถูกระงับการฉาย
    status: 'suspended',
    title: 'เลมิเซราบล์',
    titleEn: 'Les Misérables',
    shortDescription:
      'กำกับโดยลาจ ลี ได้รางวัล Jury Prize จากเมืองคานส์และเข้าชิงออสการ์ ตำรวจใหม่ในหน่วยปราบปรามอาชญากรรมของชานเมืองปารีสต้องเผชิญความตึงเครียดระหว่างเจ้าหน้าที่กับชุมชนที่ปะทุขึ้นภายในวันเดียว',
    shortDescriptionEn:
      "Directed by Ladj Ly, winner of the Cannes Jury Prize and an Oscar nominee. A rookie cop in a Paris suburb crime unit faces mounting tension between officers and the community in a single day.",
    genre: ['Drama', 'Thriller'],
    subGenre: ['Award'],
    country: 'ฝรั่งเศส',
    year: 2019,
    runtimeMinutes: 104,
    rating: 'น15+',
    subtitleLanguage: 'ซับไทย',
    startRelease: '2026-08-10',
    endRelease: '2026-08-24',
    voucherEligible: false,
    giftVoucherEligible: false,
    priceTHB: 129,
    accentColor: ['#3D1616', '#C0454A'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m6-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m6-banner/800/450',
    isClassic: false,
  },
  {
    id: 'm7',
    status: 'active',
    title: 'นางนาก',
    titleEn: 'Nang Nak',
    shortDescription:
      'กำกับโดยนนทรีย์ นิมิบุตร ภาพยนตร์คลาสสิกที่นำตำนานผีแม่นากพระโขนงมาเล่าใหม่ด้วยน้ำเสียงดราม่ารักโศก ระหว่างนากกับมากในช่วงสงครามและความรักที่ยืนยงข้ามความตาย',
    shortDescriptionEn:
      "Directed by Nonzee Nimibutr. A classic retelling of the Mae Nak Phra Khanong legend — a tragic love story between Nak and Mak that endures across war and death.",
    genre: ['Drama', 'Horror'],
    subGenre: [],
    country: 'ไทย',
    year: 1999,
    runtimeMinutes: 100,
    rating: 'น13+',
    subtitleLanguage: 'ซับไทย',
    startRelease: '2026-01-01',
    endRelease: '2026-12-31',
    voucherEligible: true,
    giftVoucherEligible: true,
    priceTHB: 79,
    accentColor: ['#2E2A22', '#C9BBA0'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m7-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m7-banner/800/450',
    isClassic: true,
  },
  {
    id: 'm8',
    status: 'active',
    title: 'สัปเหร่อ',
    titleEn: 'The Undertaker',
    shortDescription:
      'กำกับโดยธิติ ศรีนวล ภาพยนตร์ไทยที่ทำรายได้สูงสุดแห่งปี เล่าเรื่องของสัปเหร่อประจำหมู่บ้านในอีสานที่ต้องรับมือกับพิธีศพลึกลับ ผสมผสานความสยองขวัญเข้ากับฮาและความรู้สึกอบอุ่นแบบไทยๆ',
    shortDescriptionEn:
      "Directed by Thiti Srinual, Thailand's highest-grossing film of the year. A village undertaker in Isaan handles a mysterious funeral, blending horror with warm Thai comedy.",
    genre: ['Horror', 'Drama'],
    subGenre: [],
    country: 'ไทย',
    year: 2023,
    runtimeMinutes: 125,
    rating: 'น15+',
    subtitleLanguage: 'ซับไทย',
    startRelease: '2026-08-27',
    endRelease: '2026-09-10',
    voucherEligible: true,
    giftVoucherEligible: true,
    // โปรโมชั่น: ราคาเต็ม 149 ลด 20% เหลือ 119 (149 * 0.8 = 119.2 ปัดเป็น 119)
    originalPriceTHB: 149,
    discountPercent: 20,
    priceTHB: 119,
    accentColor: ['#2B0A0A', '#9C2222'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m8-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m8-banner/800/450',
    // ตัวอย่างการใส่ไฟล์วิดีโอในเครื่อง (local asset) — ทำตาม 3 ขั้นตอนนี้:
    // 1) สร้างโฟลเดอร์ assets/videos/ ในโปรเจกต์ (ถ้ายังไม่มี)
    // 2) เอาไฟล์ .mp4 ของคุณไปวางไว้ในนั้น เช่น assets/videos/sample.mp4
    // 3) เอา comment บรรทัดล่างออก แล้วแก้ path ให้ตรงกับชื่อไฟล์จริงของคุณ
    // videoAsset: require('../../assets/videos/sample.mp4'),
    isClassic: false,
  },
  {
    id: 'm9',
    status: 'active',
    title: 'มาร์ลีนา นักฆ่าสี่องก์',
    titleEn: 'Marlina the Murderer in Four Acts',
    shortDescription:
      'ภาพยนตร์แนวตะวันตกจากซุมบา อินโดนีเซีย เรื่องราวของหญิงม่ายที่ถูกกลุ่มโจรปล้นบ้าน เธอจึงต้องออกเดินทางข้ามเกาะเพื่อไปแจ้งความ พร้อมหิ้วศีรษะของหัวหน้าโจรที่ฆ่าไปด้วยตัวเอง',
    shortDescriptionEn:
      "A western from Sumba, Indonesia. A widow robbed by a gang of bandits travels across the island to report the crime — carrying the severed head of their leader.",
    genre: ['Action', 'Thriller'],
    subGenre: [],
    country: 'อินโดนีเซีย',
    year: 2017,
    runtimeMinutes: 93,
    rating: 'น18+',
    subtitleLanguage: 'ซับไทย',
    startRelease: '2026-08-22',
    endRelease: '2026-09-05',
    voucherEligible: false,
    giftVoucherEligible: false,
    priceTHB: 149,
    accentColor: ['#123326', '#3FAE7E'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m9-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m9-banner/800/450',
    isClassic: false,
  },
  {
    id: 'm10',
    status: 'active',
    title: 'ผีเสื้อและดอกไม้',
    titleEn: 'Butterfly and Flowers',
    shortDescription:
      'กำกับโดยยุทธนา มุกดาสนิท ดัดแปลงจากนวนิยายของนิพนธ์ ทรงวุฒิศักดิ์ เรื่องราวเด็กหนุ่มมุสลิมในสามจังหวัดชายแดนใต้ที่ต้องออกจากโรงเรียนมาช่วยครอบครัวทำมาหากิน ภาพยนตร์คลาสสิกที่ยังถูกพูดถึงในแวดวงหนังไทยจนถึงทุกวันนี้',
    shortDescriptionEn:
      "Directed by Euthana Mukdasanit, adapted from Nipon Trongwutthisak's novel. A young Muslim boy in Thailand's deep south leaves school to help support his family — a Thai classic still discussed today.",
    genre: ['Drama'],
    subGenre: [],
    country: 'ไทย',
    year: 1985,
    runtimeMinutes: 111,
    rating: 'ท',
    subtitleLanguage: 'ซับไทย',
    startRelease: '2026-01-01',
    endRelease: '2026-12-31',
    voucherEligible: true,
    giftVoucherEligible: true,
    priceTHB: 79,
    accentColor: ['#302818', '#C7A15A'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m10-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m10-banner/800/450',
    isClassic: true,
  },
  // ----- หนังฟอร์มยักษ์ (แยกโทนจากอาร์ตเฮาส์ด้านบน จัดฉายพิเศษเป็นครั้งคราว) -----
  {
    id: 'm11',
    status: 'active',
    title: 'สไปเดอร์แมน: โน เวย์ โฮม',
    titleEn: 'Spider-Man: No Way Home',
    shortDescription:
      'ปีเตอร์ ปาร์กเกอร์ ขอให้ด็อกเตอร์สเตรนจ์ร่ายมนตร์ลบความทรงจำของคนทั้งโลกเกี่ยวกับตัวตนสไปเดอร์แมน แต่คาถากลับพลาดจนเปิดประตูมิติ ดึงตัวร้ายจากจักรวาลสไปเดอร์แมนเรื่องก่อนๆ ให้หลุดเข้ามา',
    shortDescriptionEn:
      "Peter Parker asks Doctor Strange to cast a spell making the world forget his identity as Spider-Man — but it backfires, tearing open the multiverse and unleashing villains from other Spider-Man timelines.",
    genre: ['Action'],
    subGenre: ['Scifi'],
    country: 'สหรัฐอเมริกา',
    year: 2021,
    runtimeMinutes: 148,
    rating: 'น13+',
    subtitleLanguage: 'พากย์ไทย / ซับไทย',
    startRelease: '2026-08-29',
    endRelease: '2026-09-13',
    bookingDateMember: '2026-08-27',
    bookingDateRegular: '2026-08-28',
    voucherEligible: false,
    giftVoucherEligible: false,
    // โปรโมชั่น: ราคาเต็ม 249 ลด 24% เหลือ 189 (249 * 0.76 = 189.24 ปัดเป็น 189)
    originalPriceTHB: 249,
    discountPercent: 24,
    priceTHB: 189,
    accentColor: ['#8B1E3F', '#1E56A8'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m11-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m11-banner/800/450',
    isClassic: false,
  },
  {
    id: 'm12',
    status: 'active',
    title: 'สไปเดอร์แมน: ผงาดจักรวาลแมงมุม',
    titleEn: 'Spider-Man: Into the Spider-Verse',
    shortDescription:
      'ไมล์ส โมราเลส เด็กหนุ่มบรุกลินผู้ได้รับพลังสไปเดอร์แมนจากแมงมุมกัด ต้องเรียนรู้จะเป็นฮีโร่ในแบบของตัวเอง พร้อมพบกับสไปเดอร์แมนจากจักรวาลคู่ขนานอีกหลายเวอร์ชันที่หลุดเข้ามาในโลกเดียวกัน',
    shortDescriptionEn:
      "Miles Morales, a Brooklyn teen bitten by a radioactive spider, must learn to become a hero in his own way after meeting Spider-People from parallel universes who fall into his world.",
    genre: ['Action'],
    subGenre: ['Scifi'],
    country: 'สหรัฐอเมริกา',
    year: 2018,
    runtimeMinutes: 117,
    rating: 'น13+',
    subtitleLanguage: 'พากย์ไทย / ซับไทย',
    startRelease: '2026-08-29',
    endRelease: '2026-09-13',
    voucherEligible: false,
    giftVoucherEligible: false,
    priceTHB: 179,
    accentColor: ['#4A1780', '#E0458F'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m12-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m12-banner/800/450',
    isClassic: false,
  },
  {
    id: 'm13',
    status: 'active',
    title: 'สไปเดอร์แมน: ทะยานสู่จักรวาลแมงมุม',
    titleEn: 'Spider-Man: Across the Spider-Verse',
    shortDescription:
      'ไมล์ส โมราเลส ออกผจญภัยข้ามจักรวาลไปพบสมาคมสไปเดอร์แมนนับพันตัวที่ดูแลความสมดุลของทุกมิติ แต่เมื่อเขาขัดแย้งกับกฎของสมาคม ก็ต้องเลือกระหว่างชะตากรรมที่ถูกกำหนดไว้กับเส้นทางของตัวเอง',
    shortDescriptionEn:
      "Miles Morales journeys across the multiverse to meet a society of countless Spider-People guarding its balance — but clashing with their rules forces him to choose between destiny and his own path.",
    genre: ['Action'],
    subGenre: ['Scifi'],
    country: 'สหรัฐอเมริกา',
    year: 2023,
    runtimeMinutes: 140,
    rating: 'น13+',
    subtitleLanguage: 'พากย์ไทย / ซับไทย',
    startRelease: '2026-08-29',
    endRelease: '2026-09-13',
    voucherEligible: false,
    giftVoucherEligible: false,
    priceTHB: 179,
    accentColor: ['#1B2C8B', '#F0538F'],
    // รูปเดโมจาก Picsum (ฟรี ไม่ผูกลิขสิทธิ์ใคร) ใช้ id หนังเป็น seed ให้ได้รูปเดิมทุกครั้ง
    // แทนที่ด้วย URL รูปจริงที่มีสิทธิ์ใช้ทีหลังได้เลย
    posterUrl: 'https://picsum.photos/seed/m13-poster/400/600',
    bannerUrl: 'https://picsum.photos/seed/m13-banner/800/450',
    isClassic: false,
  },
];

// แถวหนังในหน้า Home — เทียบเท่า response ของ GET /movies/home
export const MOCK_HOME_ROWS: { title: string; titleEn: string; ids: string[] }[] = [
  { title: 'กำลังฉายในสัปดาห์นี้', titleEn: 'Now showing this week', ids: ['m1', 'm2', 'm8', 'm9', 'm4'] },
  { title: 'หนังจากเทศกาลนานาชาติ', titleEn: 'From international festivals', ids: ['m4', 'm5', 'm6', 'm9'] },
  { title: 'หนังคลาสสิกที่ควรดูสักครั้ง', titleEn: 'Classics worth watching', ids: ['m7', 'm10'] },
  {
    title: 'เพราะคุณเก็บ "วันสุดท้าย..ก่อนบายเธอ" ไว้',
    titleEn: 'Because you saved "One for the Road"',
    ids: ['m9', 'm6', 'm4'],
  },
  { title: 'หนังฟอร์มยักษ์สุดสัปดาห์', titleEn: 'Blockbusters this week', ids: ['m11', 'm12', 'm13'] },
];

export const HERO_MOVIE_ID = 'm1';

// สถานะกล่องฟิล์มเริ่มต้น — เทียบเท่า response ของ GET /library
// เริ่มต้นว่าง ไม่มีหนังที่ซื้อไว้ล่วงหน้า จนกว่าผู้ใช้จะซื้อจริงผ่านแอป
export const MOCK_INITIAL_OWNED: Record<
  string,
  { progressSeconds: number; watched: boolean; purchasedAt: string }
> = {};
