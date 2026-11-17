import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// 1. STRUCTURED DATA MODEL — 100% UNALTERED ORIGINAL MONGOLIAN TEXTS
// ============================================================================

interface ProvinceSection {
  id: string;
  chineseTitle: string;
  title: string;
  content: string;
  seal: string;
}

interface LocationItem {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  chineseName: string;
  regionTag: string;
  category: 'nature' | 'sacred' | 'craft' | 'pavilion';
  mapX: number; // Logical coordinate on 1400x950 imperial scroll map
  mapY: number;
  hotspotHero?: { x: number; y: number };
  description: string;
  imperialNotes: string[];
}

const PROVINCE_OVERVIEW: ProvinceSection[] = [
  {
    id: 'geography',
    chineseTitle: '地理疆域',
    title: 'БАЙРЛАЛ БА ГАЗАР НУТАГ',
    seal: '锦淮',
    content:
      'Цзинь’Хуай хот нь Тианши улсын төвийн өмнө этгээдэд, Хуай мөрний дунд урсгал дагуу оршино. Уул, усны дунд оршсон энэ мужийг “Манан татуулсан мөрний хөндий” хэмээн нэрийддэг. Умард хэсгээрээ Юньшань уулсаар хүрээлэгдэж, өмнө талдаа өргөн мөрний бэлчир далайцтайгаар нээгдэнэ. Газар нутаг нь үржил шимтэй, гол мөрөн, нуур цөөрөм олонтой тул эртнээс тариалангийн гол бүс нутаг байжээ.',
  },
  {
    id: 'economy',
    chineseTitle: '物产工艺',
    title: 'ОНЦЛОГ, ЭДИЙН ЗАСАГ',
    seal: '白蜥纸',
    content:
      'Цзинь’Хуай нь тариалангийн болон гар урлалын хослол бүхий муж. Хуай мөрний усаар тэтгэгдсэн хөвөн, будааны тариа, жимсний аж ахуй элбэг. Үүнээс гадна “Цагаан гүрвэл цаас” хэмээх уламжлалт гар урлалын бүтээл нь Тианши улсын хэмжээнд нэрд гарсан. Мөн хүрэл, шавар урлалын түүхтэй бөгөөд тэдгээрийн хийцэд Юньшань уулсын эрдэнэт шавар, Хуай мөрний ус ашигладаг гэдэг.',
  },
];

const JINHUAI_LOCATIONS: LocationItem[] = [
  {
    id: 1,
    slug: 'huai-hua',
    title: 'Хуай’Хуа цэцэрлэг',
    chineseName: '淮花梨园',
    regionTag: 'Баруун хойд лийрийн төгөл',
    category: 'nature',
    mapX: 350,
    mapY: 345,
    hotspotHero: { x: 24, y: 46 },
    description:
      '300 гаруй жилийн настай лийрийн модод ургасан асар том цэцэрлэг. Хаврын сүүл сарын үед лийрийн цэцэг цас шиг буудаг тул “цагаан бороо ордог газар” гэж нэрлэдэг.',
    imperialNotes: ['300+ жилийн настай лийрийн модод', 'Хаврын сүүл сарын “Цагаан бороо”'],
  },
  {
    id: 2,
    slug: 'yunshi-tea',
    title: 'Юньши цайны тариалан',
    chineseName: '云溪茶园',
    regionTag: 'Хойд манант бэл',
    category: 'nature',
    mapX: 525,
    mapY: 255,
    hotspotHero: { x: 38, y: 34 },
    description:
      'Цагаан мананд бүрхэгдсэн хөндий дунд орших цайны тариалангийн талбай. Цайны навчинд уулсын хүйтэн манан шингэдэг тул амт нь гүн, үнэр нь нарны.',
    imperialNotes: ['Цагаан манант уулын дэнж', 'Гүн амт, нарны анхилуун үнэрт навч'],
  },
  {
    id: 3,
    slug: 'bronze-village',
    title: 'Хүрэл дархны тосгон',
    chineseName: '铸铜古村',
    regionTag: 'Зүүн хойд уулын бэл',
    category: 'craft',
    mapX: 930,
    mapY: 275,
    hotspotHero: { x: 75, y: 38 },
    description:
      'Урт настай хурал, дархчуудын тосгон, гар урчуудын уран чадвар энд төвлөрдөг.\n“Тианши тал нутгийн бурхан”-ы хүрэл баримал энд дархлагдсан хэмээн тэмдэглэгдсэн.',
    imperialNotes: ['Юньшань уулсын эрдэнэт шавар ба Хуай мөрний ус', '“Тианши тал нутгийн бурхан”-ы хүрэл баримлын өлгий'],
  },
  {
    id: 4,
    slug: 'junyang-temple',
    title: 'Жүнян сүм',
    chineseName: '钧阳古寺',
    regionTag: 'Жүнян хотын зүүн зах',
    category: 'sacred',
    mapX: 1125,
    mapY: 420,
    hotspotHero: { x: 83, y: 49 },
    description:
      'Цзинь’Хуайн төв Жүнян хотын зүүн захад орших, хүрэл дээвэртэй эртний хийд. Тианши улсын анхны хаад төрийн тахил өргөдөг байсан ариун газар.\nСүмийн гол танхимд “Галын илд” хэмээх домогт зэвсгийн хуулбар хадгалагддаг.',
    imperialNotes: ['Хүрэл дээвэртэй төрийн тахилын хийд', 'Гол танхимд: “Галын илд” домогт зэвсгийн хуулбар'],
  },
  {
    id: 5,
    slug: 'yunshan-mountains',
    title: 'Юньшань уулс',
    chineseName: '云山雪峰',
    regionTag: 'Умард хилийн сүрлэг нуруу',
    category: 'nature',
    mapX: 700,
    mapY: 135,
    hotspotHero: { x: 52, y: 21 },
    description:
      'Цаст оргил, манан бүрхсэн хөндийгөөрөө алдартай. Оргил дээрээс Тианши улсын төв хүртэл цэлмэг өдөр харж болдог гэдэг. Уулсын бэлд “Нэг мянган хонхот булаг” оршдог. Ус уух бүрт нь хонхны дуу мэт цангинах учир энэ нэртэй болжээ.',
    imperialNotes: ['Цаст оргил ба Тианши улсын төвийг тольдох өндөрлөг', 'Уулсын бэлд: “Нэг мянган хонхот булаг”'],
  },
  {
    id: 6,
    slug: 'huai-misty-valley',
    title: 'Хуай мөрний манант хөндий',
    chineseName: '淮河雾谷',
    regionTag: 'Төв мөрний гольдрол',
    category: 'nature',
    mapX: 430,
    mapY: 515,
    hotspotHero: { x: 31, y: 63 },
    description:
      'Хуай мөрөн өглөөний мананд дарагдаж, усан дээр хөвөх загасчны завь, дэнлүүний гэрэл шийдэн үзэсгэлэн бүрдүүлнэ. Жил бүрийн зуны дунд сарын шөнө “Манангийн баяр” болж, хүмүүс цагаан дэнлүү хөвүүлэн хүслээ шивнэдэг.',
    imperialNotes: ['Өглөөний манан ба загасчны дэнлүүт завь', 'Зуны дунд сарын шөнө: “Манангийн баяр”'],
  },
  {
    id: 7,
    slug: 'white-glow-lake',
    title: 'Цагаан гэрэлт нуур',
    chineseName: '白光月湖',
    regionTag: 'Баруун өмнөд сарны толь',
    category: 'sacred',
    mapX: 250,
    mapY: 710,
    hotspotHero: { x: 16, y: 74 },
    description:
      'Сар мандах бүрд нуурын гадарга монголор гэрлээр туяардаг тул “сарны нүд” хэмээн домоглосон.\nНуурын доор нэгэн эртний хот нуугдаж байдаг гэх домогтой.',
    imperialNotes: ['Сарны туяанд гэрэлтэх “Сарны нүд”', 'Усан доорх живсэн эртний хотын домог'],
  },
  {
    id: 8,
    slug: 'lianghuai-bridge',
    title: 'Лянхуайгийн гүүр',
    chineseName: '两淮虹桥',
    regionTag: 'Хуай мөрний хоёр салааны уулзвар',
    category: 'craft',
    mapX: 690,
    mapY: 525,
    hotspotHero: { x: 50, y: 62 },
    description:
      'Хуай мөрний хоёр салааг холбосон чулуун гүүр. 200 жилийн настай, ус татах үед нум хэлбэр нь тэнгэрийн солонго мэт гэрэлтдэг.',
    imperialNotes: ['200 жилийн настай чулуун нуман гүүр', 'Ус татах үед тэнгэрийн солонго мэт гэрэлтэнэ'],
  },
  {
    id: 9,
    slug: 'jinyuan-hall',
    title: 'Цзинь’Юань өргөө',
    subtitle: 'Мөрийтэй тоглоомын газар',
    chineseName: '金源阁',
    regionTag: 'Хуай мөрний баян эрэг',
    category: 'pavilion',
    mapX: 880,
    mapY: 625,
    hotspotHero: { x: 66, y: 69 },
    description:
      'Шөнийн дэнлүү асахтай зэрэгцэн хөл хөдөлгөөн нь эхэлдэг нууцлаг асар. Хуай мөрний эргийн хамгийн баян худалдаачид, язгууртнууд энд цугларч аз сорьдог.Алт мөнгөний харших чимээ, шооны тоо шийдэх торгон агшин тасрахгүй бөгөөд хожсон нэгэнд нь зүүдлэмгүй их баялаг, хожигдсон нэгэнд нь гашуун сургамж үлдээдэг газар.',
    imperialNotes: ['Шөнийн дэнлүү асахтай зэрэгцэн нээгдэх нууцлаг асар', 'Баян худалдаачид ба язгууртнуудын аз сорих өргөө'],
  },
  {
    id: 10,
    slug: 'xianjin-red-pavilion',
    title: 'Сяньжин буюу Улаан асар',
    chineseName: '仙境红楼',
    regionTag: 'Мөрний мандал дээрх бадамлянхуа',
    category: 'pavilion',
    mapX: 560,
    mapY: 715,
    hotspotHero: { x: 43, y: 76 },
    description:
      'Усан дээрх бадамлянхуа мэт хөвөх, улаан торгон хөшиг, анхилуун хүжний үнэр шингэсэн тансаг өргөө.\nХуучир, ятгын уянгалаг эгшиг дунд гоо үзэсгэлэн, уран цэцэн үгсээрээ алдартай бүсгүйчүүд зочдыг саатуулна. Гаднаа зугаа цэнгэлийн ордон мэт харагдавч, дотроо хотын хамгийн нууцлаг мэдээлэл, язгууртнуудын шивнээ цуглардаг сүүдрийн ертөнц юм.',
    imperialNotes: ['Усан дээрх улаан торгон хөшигт өргөө', 'Хотын нууц мэдээлэл, язгууртнуудын шивнээ цугларах сүүдрийн ертөнц'],
  },
  {
    id: 11,
    slug: 'haitang-tavern',
    title: 'Хайтан уушийн газар',
    chineseName: '海棠酒肆',
    regionTag: 'Сюньчэн хотын хөл хөдөлгөөнт гудамж',
    category: 'pavilion',
    mapX: 1070,
    mapY: 730,
    hotspotHero: { x: 81, y: 75 },
    description:
      'Сюньчэн хотын хөл хөдөлгөөнтэй гудамжны голд орших, хаалганых нь өмнө хайтан цэцгийн мод сүндэрлэх эртний уушийн газар.\nЮньшань уулсын цэнгэг усаар нэрсэн хатуу дарс, шинэхэн шарсан загасны үнэр холоос сэнхийж, аянчид болон тулааны урлагийнхны амсхийх дуртай зогсоол болжээ. Хааяа нэг сэлэм харших чимээ гарах ч маргааш өглөө нь юу ч болоогүй мэт урьдын адил цэцэгс дэлгэрч, дарс хундагалагдсаар байдаг.',
    imperialNotes: ['Хаалганы өмнөх сүндэрлэсэн хайтан цэцгийн мод', 'Юньшань уулсын усаар нэрсэн хатуу дарс ба шарсан загас'],
  },
  {
    id: 12,
    slug: 'jinluo-inn',
    title: 'Цзинь’Луо дэн буудал',
    chineseName: '金罗客栈',
    regionTag: 'Лянхуайгийн гүүрний дэргэдэх мөрний эрэг',
    category: 'pavilion',
    mapX: 735,
    mapY: 425,
    hotspotHero: { x: 57, y: 52 },
    description:
      'Манан татсан мөрний эрэг дагуу баригдсан, гурван давхар модон хийцтэй, алтан шаргал дэнлүүгээр чимэглэсэн амралтын өргөө.\nХолын замаас ядарч ирсэн аянчид, жинчдийн алжаалыг тайлах дулаан ор, анхилуун цай энд бий. Дээд давхрын тагтнаас өглөөний манан дунд хөвөх загасчдын завь болон Лянхуайгийн гүүрийг бүхэлд нь тольдон харах боломжтой.',
    imperialNotes: ['Гурван давхар модон хийц, алтан шаргал дэнлүү', 'Дээд тагтнаас загасчны завь ба Лянхуайгийн гүүр бүхэлдээ харагдана'],
  },
];

// ============================================================================
// 2. TRADITIONAL CHINESE INSTRUMENTAL WEB AUDIO ENGINE (GUZHENG + DIZI)
// ============================================================================

class ImperialSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private step = 0;

  // Traditional Chinese Gong/Zhi Pentatonic Frequencies (D4, E4, F#4, A4, B4, D5, E5, A5)
  private readonly scale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 880.0];
  private readonly melodyPattern = [0, 3, 4, 5, 4, 3, 1, 0, 2, 3, 5, 6, 5, 3, 1, 0];

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.28;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.scheduleNext();
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private playGuzhengPluck(freq: number, duration = 3.2, volume = 0.22): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    // Subtle characteristic guzheng pitch bend on attack
    osc1.frequency.exponentialRampToValueAtTime(freq * 1.004, now + 0.09);
    osc1.frequency.exponentialRampToValueAtTime(freq, now + 0.35);

    osc2.frequency.setValueAtTime(freq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(480, now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
  }

  private playDiziBreath(freq: number): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const duration = 4.2;

    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    vibrato.frequency.setValueAtTime(4.8, now);
    vibGain.gain.setValueAtTime(3.2, now);
    vibrato.connect(vibGain);
    vibGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.075, now + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    vibrato.start(now);
    osc.stop(now + duration + 0.1);
    vibrato.stop(now + duration + 0.1);
  }

  private scheduleNext = (): void => {
    if (!this.isPlaying) return;

    const noteIdx = this.melodyPattern[this.step % this.melodyPattern.length];
    const freq = this.scale[noteIdx];
    this.playGuzhengPluck(freq, 3.4, 0.22);

    // Occasional octave harmonic arpeggio
    if (this.step % 4 === 0) {
      window.setTimeout(() => {
        if (this.isPlaying) {
          this.playGuzhengPluck(this.scale[(noteIdx + 3) % this.scale.length] * 0.5, 4.0, 0.14);
        }
      }, 280);
    }

    // Soft Dizi flute phrase every 8 beats
    if (this.step % 8 === 2) {
      this.playDiziBreath(this.scale[(noteIdx + 2) % this.scale.length]);
    }

    this.step++;
    const nextDelay = this.step % 4 === 0 ? 1550 : 980;
    this.timerId = window.setTimeout(this.scheduleNext, nextDelay);
  };
}

// ============================================================================
// 3. BESPOKE SVG ARCHITECTURAL & LANDSCAPE ILLUSTRATIONS PER LOCATION
// ============================================================================

const LocationArtwork: React.FC<{ location: LocationItem }> = ({ location }) => {
  switch (location.slug) {
    case 'huai-hua': // Pear blossom garden — "White rain"
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="hhSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A1218" />
              <stop offset="60%" stopColor="#582630" />
              <stop offset="100%" stopColor="#E9DCC3" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <rect width="640" height="280" fill="url(#hhSky)" />
          <circle cx="510" cy="74" r="38" fill="#E9DCC3" opacity="0.22" />
          {/* Ancient gnarled pear tree trunks */}
          <path d="M90,280 Q115,190 70,130 Q45,95 20,75 M95,210 Q165,165 240,125 M145,175 Q190,115 265,92" stroke="#191413" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M540,280 Q510,200 555,140 Q580,105 615,85 M525,215 Q450,170 385,135" stroke="#191413" strokeWidth="12" strokeLinecap="round" fill="none" />
          {/* Blossom canopies */}
          {[
            [75, 115, 58], [155, 110, 68], [235, 105, 54], [45, 78, 46],
            [545, 115, 62], [465, 125, 55], [395, 128, 44], [595, 88, 42]
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="#E9DCC3" opacity="0.28" />
              <circle cx={cx - 10} cy={cy + 6} r={r * 0.72} fill="#FFF9F0" opacity="0.45" />
            </g>
          ))}
          {/* Garden moon gate pavilion */}
          <path d="M275,245 L275,180 Q320,145 365,180 L365,245 Z" fill="#390B12" stroke="#C5A15A" strokeWidth="2.5" />
          <path d="M250,178 Q320,145 390,178 L372,186 Q320,162 268,186 Z" fill="#A82424" stroke="#C5A15A" strokeWidth="1.5" />
          {/* Drifting white pear petals ("Цагаан бороо") */}
          {Array.from({ length: 34 }).map((_, idx) => (
            <ellipse
              key={idx}
              cx={(idx * 47 + 25) % 620}
              cy={(idx * 31 + 20) % 265}
              rx="4.5"
              ry="2.2"
              transform={`rotate(${(idx * 29) % 180} ${(idx * 47 + 25) % 620} ${(idx * 31 + 20) % 265})`}
              fill="#FFFBF2"
              opacity={0.55 + (idx % 4) * 0.1}
            />
          ))}
          <rect x="0" y="245" width="640" height="35" fill="#191413" opacity="0.82" />
        </svg>
      );

    case 'yunshi-tea': // Mist-covered valley tea terraces
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="ytBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D2B24" />
              <stop offset="55%" stopColor="#3E5644" />
              <stop offset="100%" stopColor="#191413" />
            </linearGradient>
          </defs>
          <rect width="640" height="280" fill="url(#ytBg)" />
          <circle cx="135" cy="68" r="34" fill="#C5A15A" opacity="0.32" />
          {/* Distant peaks */}
          <path d="M0,155 L140,65 L290,145 L455,55 L640,150 L640,280 L0,280 Z" fill="#28392D" />
          {/* Flowing tea terraces */}
          <path d="M0,175 Q180,135 370,175 T640,165 L640,280 L0,280 Z" fill="#3D5942" stroke="#C5A15A" strokeWidth="0.9" strokeOpacity="0.4" />
          <path d="M0,205 Q210,168 410,205 T640,198 L640,280 L0,280 Z" fill="#2E4733" stroke="#E9DCC3" strokeWidth="0.8" strokeOpacity="0.3" />
          <path d="M0,238 Q190,205 430,238 T640,232 L640,280 L0,280 Z" fill="#1F3324" stroke="#C5A15A" strokeWidth="0.9" strokeOpacity="0.4" />
          {/* Tea pavilion */}
          <g transform="translate(435, 118)">
            <rect x="22" y="28" width="56" height="30" fill="#390B12" stroke="#C5A15A" strokeWidth="1.2" />
            <path d="M8,30 Q50,8 92,30 L80,35 Q50,18 20,35 Z" fill="#A82424" stroke="#C5A15A" strokeWidth="1.2" />
          </g>
          {/* White valley mist */}
          <ellipse cx="320" cy="168" rx="340" ry="22" fill="#E9DCC3" opacity="0.22" />
          <ellipse cx="220" cy="215" rx="280" ry="18" fill="#E9DCC3" opacity="0.18" />
        </svg>
      );

    case 'bronze-village': // Bronze Smith Village & Statue of Tiangshi Steppe Deity
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <rect width="640" height="280" fill="#1E1513" />
          <circle cx="320" cy="128" r="88" fill="#C5A15A" opacity="0.14" />
          <circle cx="320" cy="128" r="64" fill="none" stroke="#C5A15A" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
          {/* Sacred Bronze Statue Silhouette */}
          <g transform="translate(278, 48)">
            <path d="M42,14 L52,32 L32,32 Z" fill="#C5A15A" />
            <circle cx="42" cy="44" r="12" fill="#9E7B3C" stroke="#E9DCC3" strokeWidth="1" />
            <path d="M18,98 Q22,60 42,58 Q62,60 66,98 L74,148 L10,148 Z" fill="#8C6A30" stroke="#C5A15A" strokeWidth="1.4" />
            <rect x="6" y="148" width="72" height="16" rx="3" fill="#390B12" stroke="#C5A15A" strokeWidth="1.4" />
          </g>
          {/* Traditional forge workshops on both sides */}
          <g transform="translate(45, 145)">
            <rect x="15" y="34" width="130" height="65" fill="#2B1416" stroke="#C5A15A" strokeWidth="1.2" />
            <path d="M0,36 Q80,6 160,36 Z" fill="#720E18" stroke="#C5A15A" strokeWidth="1.3" />
            <circle cx="80" cy="70" r="16" fill="#D9532F" opacity="0.75" />
          </g>
          <g transform="translate(445, 145)">
            <rect x="15" y="34" width="130" height="65" fill="#2B1416" stroke="#C5A15A" strokeWidth="1.2" />
            <path d="M0,36 Q80,6 160,36 Z" fill="#720E18" stroke="#C5A15A" strokeWidth="1.3" />
          </g>
          <rect x="0" y="242" width="640" height="38" fill="#140F0E" />
        </svg>
      );

    case 'junyang-temple': // Bronze-roofed Junyang Temple & Sword of Fire
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <rect width="640" height="280" fill="#240D11" />
          <circle cx="320" cy="115" r="95" fill="#A82424" opacity="0.22" />
          {/* Grand Bronze-Roofed Imperial Temple */}
          <g transform="translate(150, 42)">
            {/* Upper tier roof */}
            <path d="M75,46 Q170,10 265,46 L245,56 Q170,28 95,56 Z" fill="#C5A15A" stroke="#E9DCC3" strokeWidth="1.2" />
            <rect x="108" y="54" width="124" height="36" fill="#390B12" stroke="#C5A15A" strokeWidth="1.2" />
            {/* Main grand bronze roof */}
            <path d="M22,96 Q170,54 318,96 L292,108 Q170,74 48,108 Z" fill="#B58E46" stroke="#E9DCC3" strokeWidth="1.5" />
            <rect x="58" y="106" width="224" height="72" fill="#4A0E16" stroke="#C5A15A" strokeWidth="1.5" />
            {/* Columns */}
            {[80, 125, 215, 260].map((x) => (
              <rect key={x} x={x} y="106" width="8" height="72" fill="#A82424" />
            ))}
            {/* Glowing Sword of Fire ("Галын илд") enshrined in center */}
            <g transform="translate(170, 114)">
              <circle cx="0" cy="30" r="22" fill="#FF6B35" opacity="0.28" />
              <polygon points="0,4 4,44 0,48 -4,44" fill="#FFE6A3" stroke="#FF7B29" strokeWidth="1" />
              <rect x="-11" y="44" width="22" height="4" rx="1" fill="#C5A15A" />
              <rect x="-2.5" y="48" width="5" height="11" fill="#720E18" />
            </g>
            {/* Stone terrace */}
            <rect x="30" y="178" width="280" height="22" fill="#2A2220" stroke="#C5A15A" strokeWidth="1.2" />
          </g>
          <rect x="0" y="242" width="640" height="38" fill="#191413" />
        </svg>
      );

    case 'yunshan-mountains': // Snow peaks & Thousand-Bell Spring
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="ysSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#161C24" />
              <stop offset="65%" stopColor="#354652" />
              <stop offset="100%" stopColor="#191413" />
            </linearGradient>
          </defs>
          <rect width="640" height="280" fill="url(#ysSky)" />
          {/* Snow-capped Yunshan Peaks */}
          <polygon points="40,250 185,68 330,250" fill="#27333A" />
          <polygon points="185,68 145,118 172,112 185,126 202,110 225,118" fill="#E9DCC3" />
          <polygon points="195,250 365,36 535,250" fill="#32414A" />
          <polygon points="365,36 312,104 345,96 365,115 390,94 418,104" fill="#FFFDF9" />
          <polygon points="380,250 515,82 640,250" fill="#212B31" />
          <polygon points="515,82 480,126 515,118 548,126" fill="#E9DCC3" />
          {/* Thousand-Bell Spring ("Нэг мянган хонхот булаг") */}
          <path d="M355,130 Q340,185 305,245 L345,245 Q365,185 372,130 Z" fill="#89B8C2" opacity="0.65" />
          <ellipse cx="320" cy="248" rx="145" ry="18" fill="#46727D" stroke="#C5A15A" strokeWidth="1.2" />
          {/* Floating mist */}
          <ellipse cx="320" cy="175" rx="310" ry="20" fill="#E9DCC3" opacity="0.22" />
        </svg>
      );

    case 'huai-misty-valley': // Misty river, fishing boat & Mist Festival white lanterns
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <rect width="640" height="280" fill="#182022" />
          <path d="M0,145 Q170,115 340,145 T640,135 L640,280 L0,280 Z" fill="#233336" />
          <rect x="0" y="162" width="640" height="118" fill="#1C2E33" />
          {/* Floating white lanterns ("Манангийн баяр") */}
          {[
            [115, 72], [195, 48], [285, 84], [385, 52], [475, 76], [545, 44],
            [155, 198], [260, 224], [430, 210], [520, 232]
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x}, ${y})`}>
              <circle cx="0" cy="0" r="14" fill="#FFF8E7" opacity="0.18" />
              <rect x="-5" y="-7" width="10" height="13" rx="3" fill="#FFFDF7" stroke="#C5A15A" strokeWidth="1" />
            </g>
          ))}
          {/* Fisherman silhouette boat */}
          <g transform="translate(275, 182)">
            <path d="M0,16 Q55,28 115,12 Q85,24 25,24 Z" fill="#191413" />
            <path d="M35,15 L42,2 L48,15 Z" fill="#390B12" />
            <line x1="88" y1="15" x2="108" y2="2" stroke="#C5A15A" strokeWidth="1.5" />
            <circle cx="108" cy="7" r="4.5" fill="#FFE6A3" />
          </g>
          <ellipse cx="320" cy="162" rx="330" ry="18" fill="#E9DCC3" opacity="0.2" />
        </svg>
      );

    case 'white-glow-lake': // Moonlit "Eye of the Moon" & Sunken Ancient City
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <rect width="640" height="280" fill="#12161F" />
          {/* Radiant Full Moon */}
          <circle cx="320" cy="64" r="36" fill="#FFFDF5" opacity="0.9" />
          <circle cx="320" cy="64" r="56" fill="#E9DCC3" opacity="0.16" />
          {/* Moonlit lake surface */}
          <rect x="0" y="135" width="640" height="145" fill="#182736" />
          <ellipse cx="320" cy="195" rx="185" ry="44" fill="#DCEAF5" opacity="0.22" />
          {/* Submerged Sunken Ancient City Silhouettes beneath the water */}
          <g opacity="0.32" stroke="#9CC4E4" strokeWidth="1.2" fill="#0E1822">
            <path d="M235,232 Q320,206 405,232 L390,240 Q320,218 250,240 Z" />
            <rect x="265" y="238" width="110" height="32" />
            <path d="M165,248 Q205,232 245,248 Z" />
            <path d="M395,248 Q435,232 475,248 Z" />
          </g>
        </svg>
      );

    case 'lianghuai-bridge': // 200-year-old Stone Arch Bridge glowing like a rainbow
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <rect width="640" height="280" fill="#1F1618" />
          <rect x="0" y="182" width="640" height="98" fill="#1C3136" />
          {/* Rainbow luminescence behind the bridge */}
          <path d="M110,185 Q320,38 530,185" fill="none" stroke="#C5A15A" strokeWidth="16" opacity="0.16" />
          <path d="M122,185 Q320,50 518,185" fill="none" stroke="#A82424" strokeWidth="8" opacity="0.18" />
          {/* Stone Arch Bridge */}
          <path d="M90,185 Q320,66 550,185 L550,205 L445,205 Q320,118 195,205 L90,205 Z" fill="#C9BCA6" stroke="#191413" strokeWidth="2" />
          <path d="M95,176 Q320,58 545,176" fill="none" stroke="#C5A15A" strokeWidth="3" />
          {/* Reflection in the river */}
          <path d="M195,205 Q320,272 445,205" fill="none" stroke="#E9DCC3" strokeWidth="2" strokeDasharray="6 5" opacity="0.45" />
        </svg>
      );

    case 'jinyuan-hall': // Jin'Yuan Gambling Hall with Night Lanterns & Dice Motif
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <rect width="640" height="280" fill="#21090E" />
          {/* Luxurious multi-tiered nocturnal pavilion */}
          <g transform="translate(145, 34)">
            <path d="M85,38 Q175,8 265,38 L248,46 Q175,22 102,46 Z" fill="#A82424" stroke="#C5A15A" strokeWidth="1.5" />
            <rect x="112" y="45" width="126" height="42" fill="#390B12" stroke="#C5A15A" strokeWidth="1.2" />
            <path d="M35,92 Q175,54 315,92 L292,102 Q175,70 58,102 Z" fill="#720E18" stroke="#C5A15A" strokeWidth="1.8" />
            <rect x="66" y="100" width="218" height="86" fill="#2A080D" stroke="#C5A15A" strokeWidth="1.5" />
            {/* Glowing lanterns */}
            {[82, 135, 215, 268].map((lx) => (
              <g key={lx} transform={`translate(${lx}, 115)`}>
                <circle cx="0" cy="0" r="14" fill="#FFB84D" opacity="0.25" />
                <rect x="-6" y="-8" width="12" height="16" rx="4" fill="#D9381E" stroke="#C5A15A" strokeWidth="1.2" />
              </g>
            ))}
            {/* Golden Dice & Coin Emblem */}
            <g transform="translate(175, 144)">
              <rect x="-15" y="-15" width="30" height="30" rx="5" fill="#C5A15A" stroke="#191413" strokeWidth="1.5" />
              <circle cx="-6" cy="-6" r="2.8" fill="#720E18" />
              <circle cx="6" cy="6" r="2.8" fill="#720E18" />
              <circle cx="0" cy="0" r="2.8" fill="#720E18" />
            </g>
          </g>
          <rect x="0" y="220" width="640" height="60" fill="#191413" />
        </svg>
      );

    case 'xianjin-red-pavilion': // Floating Red Silk Lotus Pavilion
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <rect width="640" height="280" fill="#280B14" />
          <rect x="0" y="188" width="640" height="92" fill="#18222B" />
          {/* Giant Lotus Petals Supporting the Floating Pavilion */}
          <g transform="translate(320, 188)">
            <path d="M-165,0 Q-110,-32 -55,0 Q0,-36 55,0 Q110,-32 165,0 Q115,24 0,24 Q-115,24 -165,0 Z" fill="#A82424" stroke="#C5A15A" strokeWidth="1.5" />
          </g>
          {/* Floating Red Silk Pavilion */}
          <g transform="translate(185, 48)">
            <path d="M40,48 Q135,10 230,48 L210,58 Q135,26 60,58 Z" fill="#A82424" stroke="#C5A15A" strokeWidth="1.6" />
            <rect x="68" y="56" width="134" height="84" fill="#4E0D18" stroke="#C5A15A" strokeWidth="1.4" />
            {/* Flowing red silk curtains */}
            <path d="M74,56 Q88,98 72,138 L94,138 Q104,98 92,56 Z" fill="#C42B2B" opacity="0.85" />
            <path d="M196,56 Q182,98 198,138 L176,138 Q166,98 178,56 Z" fill="#C42B2B" opacity="0.85" />
            {/* Incense smoke wisps */}
            <path d="M135,128 Q125,105 138,85 Q148,68 132,52" fill="none" stroke="#E9DCC3" strokeWidth="1.5" opacity="0.45" />
          </g>
        </svg>
      );

    case 'haitang-tavern': // Haitang Flowering Tree & Bustling Xuncheng Street Tavern
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <rect width="640" height="280" fill="#231416" />
          {/* Tavern building */}
          <g transform="translate(220, 56)">
            <path d="M15,44 Q165,12 315,44 L295,54 Q165,26 35,54 Z" fill="#720E18" stroke="#C5A15A" strokeWidth="1.5" />
            <rect x="45" y="52" width="240" height="126" fill="#321818" stroke="#C5A15A" strokeWidth="1.4" />
            {/* Tavern Signboard */}
            <rect x="135" y="64" width="60" height="26" fill="#191413" stroke="#C5A15A" strokeWidth="1.5" />
            <text x="165" y="82" textAnchor="middle" fill="#C5A15A" fontSize="14" fontFamily="serif">海棠酒肆</text>
          </g>
          {/* Towering Haitang Crabapple Blossom Tree at the Entrance */}
          <path d="M145,245 Q155,165 118,112 M148,175 Q195,132 232,108" stroke="#191413" strokeWidth="13" strokeLinecap="round" fill="none" />
          {[
            [115, 102, 48], [178, 98, 54], [225, 104, 42], [85, 124, 38]
          ].map(([cx, cy, r], idx) => (
            <circle key={idx} cx={cx} cy={cy} r={r} fill="#C94A5A" opacity="0.52" />
          ))}
          <rect x="0" y="234" width="640" height="46" fill="#191413" />
        </svg>
      );

    case 'jinluo-inn': // Three-story wooden riverside inn with golden lanterns
    default:
      return (
        <svg viewBox="0 0 640 280" className="w-full h-full object-cover">
          <rect width="640" height="280" fill="#1B191E" />
          <rect x="0" y="210" width="640" height="70" fill="#1B3036" />
          {/* Three-story wooden inn */}
          <g transform="translate(185, 22)">
            {/* Story 3 */}
            <path d="M65,32 Q135,8 205,32 L190,40 Q135,20 80,40 Z" fill="#720E18" stroke="#C5A15A" strokeWidth="1.3" />
            <rect x="88" y="38" width="94" height="36" fill="#3B1D16" stroke="#C5A15A" strokeWidth="1.2" />
            {/* Story 2 */}
            <path d="M42,76 Q135,50 228,76 L210,84 Q135,62 60,84 Z" fill="#720E18" stroke="#C5A15A" strokeWidth="1.3" />
            <rect x="66" y="82" width="138" height="42" fill="#3B1D16" stroke="#C5A15A" strokeWidth="1.2" />
            {/* Story 1 */}
            <path d="M18,126 Q135,98 252,126 L232,135 Q135,112 38,135 Z" fill="#720E18" stroke="#C5A15A" strokeWidth="1.4" />
            <rect x="45" y="133" width="180" height="55" fill="#2E1510" stroke="#C5A15A" strokeWidth="1.3" />
            {/* Golden Lanterns on all 3 floors */}
            {[95, 175, 72, 198, 52, 218].map((lx, idx) => {
              const ly = idx < 2 ? 46 : idx < 4 ? 92 : 144;
              return (
                <g key={idx} transform={`translate(${lx}, ${ly})`}>
                  <circle cx="0" cy="0" r="10" fill="#F2C14E" opacity="0.28" />
                  <rect x="-4" y="-6" width="8" height="12" rx="3" fill="#F2C14E" />
                </g>
              );
            })}
          </g>
        </svg>
      );
  }
};

// ============================================================================
// 4. OPENING PANORAMIC HISTORICAL PAINTING SCREEN
// ============================================================================

interface OpeningScreenProps {
  onEnterProvince: (preselectLocationId?: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const OpeningPanorama: React.FC<OpeningScreenProps> = ({
  onEnterProvince,
  soundEnabled,
  onToggleSound,
}) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.04);
  const [isDragging, setIsDragging] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<LocationItem | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const nextX = Math.max(-180, Math.min(180, e.clientX - dragStartRef.current.x));
    const nextY = Math.max(-110, Math.min(110, e.clientY - dragStartRef.current.y));
    setPan({ x: nextX, y: nextY });
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((z) => Math.max(1, Math.min(1.55, Number((z + delta).toFixed(2)))));
  };

  const triggerExplore = (locId?: number) => {
    setIsEntering(true);
    setZoom(1.75);
    window.setTimeout(() => {
      onEnterProvince(locId);
    }, 850);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isEntering ? 0 : 1 }}
      transition={{ duration: 0.85, ease: 'easeInOut' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      className="fixed inset-0 z-50 overflow-hidden bg-[#191413] select-none cursor-grab active:cursor-grabbing"
    >
      {/* Interactive Panoramic Landscape Artwork Layer */}
      <motion.div
        animate={{
          scale: zoom,
          x: pan.x,
          y: pan.y,
        }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        className="absolute inset-0 w-full h-full origin-center"
      >
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="imperialSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#191413" />
              <stop offset="32%" stopColor="#390B12" />
              <stop offset="68%" stopColor="#720E18" />
              <stop offset="100%" stopColor="#261916" />
            </linearGradient>
            <radialGradient id="imperialSun" cx="52%" cy="28%" r="36%">
              <stop offset="0%" stopColor="#E9DCC3" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#C5A15A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#390B12" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="riverSilk" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2D4342" />
              <stop offset="50%" stopColor="#46635C" />
              <stop offset="100%" stopColor="#1E2D2F" />
            </linearGradient>
            <linearGradient id="mistBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E9DCC3" stopOpacity="0" />
              <stop offset="50%" stopColor="#E9DCC3" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#E9DCC3" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Silk Sky & Imperial Sun */}
          <rect width="1600" height="900" fill="url(#imperialSky)" />
          <rect width="1600" height="900" fill="url(#imperialSun)" />
          <circle cx="835" cy="235" r="78" fill="#E9DCC3" opacity="0.2" />

          {/* Far Yunshan Mountain Ranges */}
          <path
            d="M0,430 L180,220 L340,340 L540,165 L760,310 L920,135 L1140,295 L1340,175 L1600,340 L1600,900 L0,900 Z"
            fill="#241618"
            opacity="0.92"
          />
          {/* Snow-dusted peaks on Yunshan */}
          <polygon points="920,135 868,195 904,186 920,204 942,184 972,195" fill="#E9DCC3" opacity="0.55" />
          <polygon points="540,165 498,215 526,208 540,222 558,206 582,215" fill="#E9DCC3" opacity="0.4" />

          {/* Midground Jade & Ink Mountains */}
          <path
            d="M0,510 Q240,330 490,465 T990,430 T1600,485 L1600,900 L0,900 Z"
            fill="#2B362C"
            opacity="0.88"
          />

          {/* Winding Huai River & Delta */}
          <path
            d="M140,475 C420,465 560,555 810,565 C1060,575 1290,525 1600,610 L1600,900 L0,900 L0,610 C110,575 240,515 140,475 Z"
            fill="url(#riverSilk)"
          />

          {/* White Glow Lake in Southwest */}
          <ellipse cx="265" cy="690" rx="165" ry="52" fill="#5D7E7E" opacity="0.55" stroke="#C5A15A" strokeWidth="1.2" />

          {/* Distant Imperial Palaces & Red Roofs */}
          {/* Junyang Temple on East */}
          <g transform="translate(1275, 410)">
            <path d="M10,36 Q65,12 120,36 L106,44 Q65,24 24,44 Z" fill="#C5A15A" />
            <rect x="30" y="42" width="70" height="34" fill="#390B12" stroke="#C5A15A" strokeWidth="1" />
            <path d="M0,76 Q65,50 130,76 L112,84 Q65,64 18,84 Z" fill="#A82424" stroke="#C5A15A" strokeWidth="1" />
          </g>

          {/* Lianghuai Stone Arch Bridge */}
          <g transform="translate(720, 535)">
            <path d="M0,42 Q85,-12 170,42 L170,54 L132,54 Q85,18 38,54 L0,54 Z" fill="#D5C6AE" stroke="#191413" strokeWidth="1.5" />
            <path d="M4,36 Q85,-16 166,36" fill="none" stroke="#C5A15A" strokeWidth="2" />
          </g>

          {/* Jin'Luo Three-Story Lantern Inn */}
          <g transform="translate(885, 445)">
            <path d="M15,24 Q55,6 95,24 Z" fill="#A82424" stroke="#C5A15A" strokeWidth="1" />
            <rect x="28" y="24" width="54" height="22" fill="#390B12" />
            <path d="M5,48 Q55,28 105,48 Z" fill="#A82424" stroke="#C5A15A" strokeWidth="1" />
            <rect x="18" y="48" width="74" height="28" fill="#2A0D10" />
          </g>

          {/* Xianjin Floating Red Pavilion */}
          <g transform="translate(645, 665)">
            <ellipse cx="62" cy="54" rx="68" ry="12" fill="#A82424" opacity="0.7" />
            <path d="M10,24 Q62,-4 114,24 Z" fill="#A82424" stroke="#C5A15A" strokeWidth="1.4" />
            <rect x="24" y="24" width="76" height="30" fill="#4B0D16" stroke="#C5A15A" strokeWidth="1.2" />
          </g>

          {/* Huai'Hua Pear Blossom Grove */}
          {[
            [340, 420], [385, 405], [425, 430], [310, 445]
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="32" fill="#E9DCC3" opacity="0.32" />
          ))}

          {/* Drifting Mist Bands */}
          <rect x="0" y="365" width="1600" height="75" fill="url(#mistBand)" />
          <rect x="0" y="545" width="1600" height="65" fill="url(#mistBand)" />

          {/* Floating Lanterns Across the Night-Dusk Sky */}
          {[
            [220, 290], [310, 220], [460, 270], [640, 195], [1040, 230],
            [1190, 295], [1390, 240], [520, 620], [790, 645], [960, 615]
          ].map(([lx, ly], idx) => (
            <g key={idx} transform={`translate(${lx}, ${ly})`}>
              <circle cx="0" cy="0" r="16" fill="#C5A15A" opacity="0.2" />
              <rect x="-5" y="-7" width="10" height="14" rx="3" fill="#E9DCC3" stroke="#C5A15A" strokeWidth="1" />
            </g>
          ))}
        </svg>

        {/* Interactive Clickable Hotspots on the Panoramic Artwork */}
        <div className="absolute inset-0">
          {JINHUAI_LOCATIONS.filter((l) => l.hotspotHero).map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerExplore(loc.id);
              }}
              onMouseEnter={() => setHoveredHotspot(loc)}
              onMouseLeave={() => setHoveredHotspot(null)}
              style={{
                left: `${loc.hotspotHero!.x}%`,
                top: `${loc.hotspotHero!.y}%`,
              }}
              className="group absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 focus:outline-none"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A15A] opacity-65" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#A82424] border border-[#E9DCC3]" />
              </span>
              <span className="hidden md:inline-block px-2.5 py-0.5 rounded bg-[#191413]/85 border border-[#C5A15A]/60 text-[#E9DCC3] text-xs font-serif tracking-wide opacity-80 group-hover:opacity-100 group-hover:border-[#C5A15A] group-hover:bg-[#390B12] transition-all whitespace-nowrap shadow-lg">
                {loc.title}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Ornate Imperial Silk Frame Border */}
      <div className="pointer-events-none fixed inset-3 sm:inset-5 border border-[#C5A15A]/45 rounded-sm">
        <div className="absolute inset-1.5 border border-[#C5A15A]/20" />
        {/* Four Corner Bronze Ornaments */}
        <div className="absolute -top-1 -left-1 w-7 h-7 border-t-2 border-l-2 border-[#C5A15A]" />
        <div className="absolute -top-1 -right-1 w-7 h-7 border-t-2 border-r-2 border-[#C5A15A]" />
        <div className="absolute -bottom-1 -left-1 w-7 h-7 border-b-2 border-l-2 border-[#C5A15A]" />
        <div className="absolute -bottom-1 -right-1 w-7 h-7 border-b-2 border-r-2 border-[#C5A15A]" />
      </div>

      {/* Top Controls on Opening Screen */}
      <div className="fixed top-7 inset-x-7 sm:inset-x-10 flex items-center justify-between z-20">
        <div className="flex items-center gap-3 bg-[#191413]/80 backdrop-blur-md border border-[#C5A15A]/40 px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#A82424]" />
          <span className="text-xs sm:text-sm text-[#E9DCC3]/90 font-serif tracking-wider">
            ТИАНШИ УЛСЫН ЭЗЭНТ ГҮРНИЙ ГАЗРЫН ЗУРАГ
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            className="px-3.5 py-1.5 rounded-full bg-[#390B12]/90 hover:bg-[#720E18] border border-[#C5A15A]/60 text-[#E9DCC3] text-xs sm:text-sm font-serif flex items-center gap-2 transition-colors shadow-lg"
          >
            <span>{soundEnabled ? '♪ Хөгжим: Асаалттай' : '♪ Хөгжим: Унтраалттай'}</span>
          </button>
        </div>
      </div>

      {/* Center Imperial Title & Enter Button */}
      <div className="pointer-events-none fixed inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="max-w-3xl flex flex-col items-center"
        >
          {/* Imperial Seal Stamp */}
          <div className="mb-4 px-3.5 py-2 border-2 border-[#A82424] bg-[#720E18]/85 shadow-[0_0_30px_rgba(168,36,36,0.55)]">
            <span
              style={{ fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif' }}
              className="text-3xl sm:text-4xl text-[#E9DCC3] tracking-widest block leading-none"
            >
              锦淮
            </span>
          </div>

          <h1
            style={{ fontFamily: '"Cormorant Garamond", "Noto Serif", serif' }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.14em] text-[#E9DCC3] drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)]"
          >
            ЦЗИНЬ’ХУАЙ МУЖ
          </h1>

          <div className="flex items-center gap-4 my-4 w-full max-w-md">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C5A15A] to-transparent" />
            <span className="text-[#C5A15A] text-sm">❖</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C5A15A] to-transparent" />
          </div>

          <p className="text-lg sm:text-2xl italic text-[#E9DCC3]/95 font-serif tracking-wide drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] mb-8">
            Манан татуулсан мөрний хөндий
          </p>

          <button
            type="button"
            onClick={() => triggerExplore()}
            className="pointer-events-auto group relative px-9 py-4 bg-gradient-to-b from-[#A82424] to-[#720E18] hover:from-[#B82929] hover:to-[#82111C] text-[#E9DCC3] font-serif text-base sm:text-lg tracking-[0.18em] uppercase border-2 border-[#C5A15A] shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(197,161,90,0.35)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span>Мужийг судлах</span>
              <span className="text-[#C5A15A] group-hover:translate-x-1 transition-transform">➔</span>
            </span>
          </button>
        </motion.div>
      </div>

      {/* Bottom Interactive Hint & Hovered Hotspot Preview */}
      <div className="fixed bottom-7 inset-x-7 sm:inset-x-10 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 pointer-events-none">
        <div className="bg-[#191413]/85 backdrop-blur-md border border-[#C5A15A]/35 px-4 py-2 rounded-full text-xs text-[#E9DCC3]/80 font-serif">
          Зургийг чирж хөдөлгөх, томруулах эсвэл гэрэлт цэгүүд дээр дарж шууд нэвтэрнэ үү
        </div>

        {hoveredHotspot && (
          <div className="bg-[#390B12]/95 border border-[#C5A15A] px-4 py-2 rounded-lg shadow-xl text-xs sm:text-sm text-[#E9DCC3] font-serif">
            <span className="text-[#C5A15A] mr-2">{hoveredHotspot.chineseName}</span>
            <strong>{hoveredHotspot.title}</strong> — Шууд очих
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// 5. MAIN INTERACTIVE ATLAS APPLICATION
// ============================================================================

export function App() {
  const [showOpening, setShowOpening] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<number[]>([5, 6, 8]); // Initial starting landmarks discovered
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | LocationItem['category']>('all');
  const [nightLanternMode, setNightLanternMode] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Interactive Map Pan & Zoom Camera State
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isMapDragging, setIsMapDragging] = useState(false);
  const mapDragOrigin = useRef({ x: 0, y: 0 });
  const didDragMove = useRef(false);
  const mapViewportRef = useRef<HTMLDivElement | null>(null);
  const mapSectionRef = useRef<HTMLElement | null>(null);
  const soundEngineRef = useRef<ImperialSoundEngine | null>(null);

  useEffect(() => {
    soundEngineRef.current = new ImperialSoundEngine();
    return () => {
      soundEngineRef.current?.stop();
    };
  }, []);

  const handleToggleSound = () => {
    if (!soundEngineRef.current) return;
    const playing = soundEngineRef.current.toggle();
    setSoundEnabled(playing);
  };

  // Filtered locations for map markers & search
  const filteredLocations = useMemo(() => {
    return JINHUAI_LOCATIONS.filter((loc) => {
      const matchesCat = activeCategory === 'all' || loc.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        loc.title.toLowerCase().includes(q) ||
        (loc.subtitle && loc.subtitle.toLowerCase().includes(q)) ||
        loc.description.toLowerCase().includes(q) ||
        loc.chineseName.includes(q);
      return matchesCat && matchesQuery;
    });
  }, [searchQuery, activeCategory]);

  // Smoothly focus camera onto a specific location on the 1400x950 map & open its imperial dossier
  const focusAndOpenLocation = (loc: LocationItem, scrollToMap = false) => {
    if (!discoveredIds.includes(loc.id)) {
      setDiscoveredIds((prev) => [...prev, loc.id]);
    }

    if (scrollToMap && mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const targetZoom = 1.65;
    if (mapViewportRef.current) {
      const rect = mapViewportRef.current.getBoundingClientRect();
      const normX = loc.mapX / 1400;
      const normY = loc.mapY / 950;
      const offsetX = (0.5 - normX) * rect.width * targetZoom;
      const offsetY = (0.5 - normY) * rect.height * targetZoom;
      setMapZoom(targetZoom);
      setMapPan({
        x: Math.max(-rect.width * 0.45, Math.min(rect.width * 0.45, offsetX)),
        y: Math.max(-rect.height * 0.45, Math.min(rect.height * 0.45, offsetY)),
      });
    } else {
      setMapZoom(targetZoom);
    }

    setSelectedLocation(loc);
  };

  const handleEnterFromOpening = (preselectId?: number) => {
    setShowOpening(false);
    if (preselectId) {
      const found = JINHUAI_LOCATIONS.find((l) => l.id === preselectId);
      if (found) {
        window.setTimeout(() => {
          focusAndOpenLocation(found, true);
        }, 250);
      }
    }
  };

  const resetMapCamera = () => {
    setMapZoom(1);
    setMapPan({ x: 0, y: 0 });
  };

  // Map Dragging Handlers
  const onMapPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsMapDragging(true);
    didDragMove.current = false;
    mapDragOrigin.current = { x: e.clientX - mapPan.x, y: e.clientY - mapPan.y };
  };

  const onMapPointerMove = (e: React.PointerEvent) => {
    if (!isMapDragging) return;
    const dx = e.clientX - mapDragOrigin.current.x;
    const dy = e.clientY - mapDragOrigin.current.y;
    if (Math.abs(dx - mapPan.x) > 4 || Math.abs(dy - mapPan.y) > 4) {
      didDragMove.current = true;
    }
    const maxPanX = 420 * mapZoom;
    const maxPanY = 300 * mapZoom;
    setMapPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, dx)),
      y: Math.max(-maxPanY, Math.min(maxPanY, dy)),
    });
  };

  const onMapPointerUp = () => {
    setIsMapDragging(false);
  };

  const onMapWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const step = e.deltaY < 0 ? 0.16 : -0.16;
    setMapZoom((prev) => Math.max(0.85, Math.min(2.4, Number((prev + step).toFixed(2)))));
  };

  const navigateLocation = (dir: -1 | 1) => {
    if (!selectedLocation) return;
    const idx = JINHUAI_LOCATIONS.findIndex((l) => l.id === selectedLocation.id);
    const nextIdx = (idx + dir + JINHUAI_LOCATIONS.length) % JINHUAI_LOCATIONS.length;
    focusAndOpenLocation(JINHUAI_LOCATIONS[nextIdx], false);
  };

  return (
    <div className="min-h-screen bg-[#191413] text-[#E9DCC3] font-serif selection:bg-[#A82424] selection:text-[#E9DCC3] relative overflow-x-hidden">
      {/* ================================================================== */}
      {/* OPENING PANORAMIC SCREEN                                           */}
      {/* ================================================================== */}
      <AnimatePresence>
        {showOpening && (
          <OpeningPanorama
            onEnterProvince={handleEnterFromOpening}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* TOP IMPERIAL NAVIGATION BAR                                        */}
      {/* ================================================================== */}
      <header className="sticky top-0 z-30 bg-[#191413]/95 backdrop-blur-md border-b border-[#C5A15A]/45 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowOpening(true)}
              title="Нээлтийн уран зураг руу буцах"
              className="px-2.5 py-1.5 bg-[#720E18] hover:bg-[#A82424] border border-[#C5A15A] text-[#E9DCC3] transition-colors shadow"
            >
              <span
                style={{ fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif' }}
                className="text-xl leading-none block"
              >
                锦淮
              </span>
            </button>
            <div>
              <h1
                style={{ fontFamily: '"Cormorant Garamond", "Noto Serif", serif' }}
                className="text-xl sm:text-2xl font-bold tracking-[0.12em] text-[#E9DCC3] leading-none"
              >
                ЦЗИНЬ’ХУАЙ МУЖ
              </h1>
              <p className="text-xs text-[#C5A15A] tracking-wider mt-0.5">
                Тианши улс · Манан татуулсан мөрний хөндий
              </p>
            </div>
          </div>

          {/* Right Controls: Progress, Journal, Sound, Panorama */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Exploration Progress Badge */}
            <div className="px-3 py-1.5 rounded bg-[#390B12] border border-[#C5A15A]/50 flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-[#C5A15A]">❖</span>
              <span>
                Нээсэн газар:{' '}
                <strong className="text-[#C5A15A] font-bold">
                  {discoveredIds.length}/{JINHUAI_LOCATIONS.length}
                </strong>
              </span>
            </div>

            {/* Historical Journal Button */}
            <button
              type="button"
              onClick={() => setJournalOpen(true)}
              className="px-3.5 py-1.5 rounded bg-[#720E18] hover:bg-[#A82424] border border-[#C5A15A] text-xs sm:text-sm text-[#E9DCC3] tracking-wide transition-colors shadow"
            >
              Түүхэн дэвтэр
            </button>

            {/* Atmospheric Sound Control */}
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label="Арын хөгжим асаах унтраах"
              className={`px-3 py-1.5 rounded border text-xs sm:text-sm transition-colors ${
                soundEnabled
                  ? 'bg-[#526A53] border-[#E9DCC3] text-[#E9DCC3]'
                  : 'bg-[#191413] border-[#C5A15A]/50 text-[#C5A15A] hover:border-[#C5A15A]'
              }`}
            >
              {soundEnabled ? '♪ Аялгуу: Асаалттай' : '♪ Аялгуу'}
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* PROVINCE OVERVIEW SECTION (БАЙРЛАЛ, ЭДИЙН ЗАСАГ, АЛДАРТАЙ ГАЗРУУД)  */}
      {/* ================================================================== */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 border-b border-[#C5A15A]/30 bg-[radial-gradient(circle_at_top,#390B12_0%,#191413_72%)]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="inline-block text-xs tracking-[0.25em] uppercase text-[#C5A15A] mb-2">
              ТИАНШИ УЛСЫН ЭЗЭНТ ГҮРНИЙ ТҮҮХЭН ШАСТИР
            </span>
            <h2
              style={{ fontFamily: '"Cormorant Garamond", "Noto Serif", serif' }}
              className="text-3xl sm:text-5xl font-bold text-[#E9DCC3] tracking-wide"
            >
              Цзинь’Хуай Мужийн Ерөнхий Тойм
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="h-px w-16 bg-[#C5A15A]/60" />
              <span className="text-[#A82424] text-sm">❖</span>
              <span className="h-px w-16 bg-[#C5A15A]/60" />
            </div>
          </div>

          {/* Two Official Imperial Scroll Cards: Location & Economy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {PROVINCE_OVERVIEW.map((sec) => (
              <article
                key={sec.id}
                className="relative bg-[#390B12]/75 border border-[#C5A15A]/55 p-6 sm:p-8 rounded-sm shadow-[0_14px_40px_rgba(0,0,0,0.65)]"
              >
                {/* Decorative inner scroll frame */}
                <div className="pointer-events-none absolute inset-2 border border-[#C5A15A]/20" />

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs tracking-[0.2em] text-[#C5A15A] block mb-1">
                      {sec.chineseTitle}
                    </span>
                    <h3
                      style={{ fontFamily: '"Cormorant Garamond", "Noto Serif", serif' }}
                      className="text-xl sm:text-2xl font-bold text-[#E9DCC3] tracking-wider"
                    >
                      {sec.title}
                    </h3>
                  </div>
                  <div className="px-2.5 py-1 border border-[#A82424] bg-[#720E18] text-[#E9DCC3] text-sm font-serif shrink-0">
                    {sec.seal}
                  </div>
                </div>

                <p className="text-[#E9DCC3]/95 text-base sm:text-[17px] leading-[1.85] font-serif">
                  {sec.content}
                </p>
              </article>
            ))}
          </div>

          {/* Famous Places Directory Bar ("Мужийн алдартай газрууд") */}
          <div className="bg-[#191413]/90 border border-[#C5A15A]/45 p-5 sm:p-7 rounded-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-[#C5A15A]/25">
              <div>
                <span className="text-xs uppercase tracking-[0.22em] text-[#C5A15A]">
                  锦淮十二胜景
                </span>
                <h3
                  style={{ fontFamily: '"Cormorant Garamond", "Noto Serif", serif' }}
                  className="text-2xl font-bold text-[#E9DCC3]"
                >
                  Мужийн алдартай газрууд (12 дурсгалт газар)
                </h3>
              </div>
              <p className="text-xs text-[#E9DCC3]/70">
                Аль ч нэр дээр дарж газрын зураг дээр шууд очиж судлаарай
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {JINHUAI_LOCATIONS.map((loc) => {
                const isDiscovered = discoveredIds.includes(loc.id);
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => focusAndOpenLocation(loc, true)}
                    className="group text-left px-3.5 py-2.5 rounded-sm bg-[#390B12]/55 hover:bg-[#720E18] border border-[#C5A15A]/30 hover:border-[#C5A15A] transition-all flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span className="text-[11px] text-[#C5A15A] block truncate">
                        {loc.id}. {loc.chineseName}
                      </span>
                      <span className="text-sm text-[#E9DCC3] font-medium block truncate group-hover:text-white">
                        {loc.title}
                      </span>
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isDiscovered
                          ? 'bg-[#C5A15A] shadow-[0_0_8px_#C5A15A]'
                          : 'bg-[#E9DCC3]/20'
                      }`}
                      title={isDiscovered ? 'Нээсэн газар' : 'Хараахан нээгээгүй'}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* INTERACTIVE PROVINCE GEOGRAPHICAL SCROLL MAP                       */}
      {/* ================================================================== */}
      <section ref={mapSectionRef} className="py-10 sm:py-14 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Map Toolbar: Search, Category Filters, Day/Night & Camera Controls */}
        <div className="bg-[#390B12] border border-[#C5A15A]/55 p-4 rounded-t-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Газрын нэрээр хайх (жишээ нь: Лянхуай, Жүнян, Улаан асар...)"
              className="w-full bg-[#191413] border border-[#C5A15A]/50 focus:border-[#C5A15A] rounded-sm px-4 py-2 text-sm text-[#E9DCC3] placeholder-[#E9DCC3]/45 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#C5A15A] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'Бүгд (12)' },
              { id: 'nature', label: 'Уул ус, байгаль' },
              { id: 'sacred', label: 'Ариун сүм, домог' },
              { id: 'craft', label: 'Дархан, гүүр' },
              { id: 'pavilion', label: 'Өргөө, асар, буудал' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as 'all' | LocationItem['category'])}
                className={`px-3 py-1.5 rounded-sm border transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#A82424] border-[#C5A15A] text-[#E9DCC3]'
                    : 'bg-[#191413]/80 border-[#C5A15A]/30 text-[#E9DCC3]/80 hover:border-[#C5A15A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Atmosphere & Zoom Controls */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button
              type="button"
              onClick={() => setNightLanternMode((v) => !v)}
              className={`px-3 py-1.5 rounded-sm border text-xs transition-colors ${
                nightLanternMode
                  ? 'bg-[#720E18] border-[#C5A15A] text-[#E9DCC3]'
                  : 'bg-[#191413] border-[#C5A15A]/40 text-[#C5A15A]'
              }`}
            >
              {nightLanternMode ? '🏮 Шөнийн дэнлүү' : '☀ Өдрийн манан'}
            </button>

            <div className="flex items-center bg-[#191413] border border-[#C5A15A]/45 rounded-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setMapZoom((z) => Math.max(0.85, Number((z - 0.2).toFixed(2))))}
                className="px-2.5 py-1.5 text-sm text-[#E9DCC3] hover:bg-[#390B12]"
                title="Жижигрүүлэх"
              >
                −
              </button>
              <span className="px-2 text-xs text-[#C5A15A]">{Math.round(mapZoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setMapZoom((z) => Math.min(2.4, Number((z + 0.2).toFixed(2))))}
                className="px-2.5 py-1.5 text-sm text-[#E9DCC3] hover:bg-[#390B12]"
                title="Томруулах"
              >
                +
              </button>
              <button
                type="button"
                onClick={resetMapCamera}
                className="px-2.5 py-1.5 text-xs text-[#E9DCC3]/80 hover:bg-[#390B12] border-l border-[#C5A15A]/30"
                title="Бүтэн зургаар харах"
              >
                Бүтэн
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Viewport Frame */}
        <div
          ref={mapViewportRef}
          onPointerDown={onMapPointerDown}
          onPointerMove={onMapPointerMove}
          onPointerUp={onMapPointerUp}
          onPointerLeave={onMapPointerUp}
          onWheel={onMapWheel}
          className="relative w-full h-[540px] sm:h-[660px] lg:h-[740px] overflow-hidden border-x border-b border-[#C5A15A]/65 bg-[#191413] select-none cursor-grab active:cursor-grabbing shadow-[0_25px_70px_rgba(0,0,0,0.9)]"
        >
          {/* Draggable & Zoomable Imperial Silk Map Layer */}
          <motion.div
            animate={{
              scale: mapZoom,
              x: mapPan.x,
              y: mapPan.y,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 24 }}
            className="w-full h-full origin-center relative"
          >
            {/* 1400x950 Imperial Cartographic SVG */}
            <svg
              viewBox="0 0 1400 950"
              preserveAspectRatio="xMidYMid slice"
              className="w-full h-full"
            >
              <defs>
                {/* Antique Imperial Silk & Parchment Base */}
                <radialGradient id="parchmentBase" cx="50%" cy="48%" r="65%">
                  <stop offset="0%" stopColor={nightLanternMode ? '#241819' : '#D8C5A3'} />
                  <stop offset="68%" stopColor={nightLanternMode ? '#1B1314' : '#C3AC84'} />
                  <stop offset="100%" stopColor={nightLanternMode ? '#130E0E' : '#9F865E'} />
                </radialGradient>

                {/* Huai River Water Gradient */}
                <linearGradient id="huaiWater" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={nightLanternMode ? '#1D333A' : '#4E7273'} />
                  <stop offset="50%" stopColor={nightLanternMode ? '#294850' : '#658D8C'} />
                  <stop offset="100%" stopColor={nightLanternMode ? '#16282E' : '#3E5E60'} />
                </linearGradient>

                {/* Subtle Silk Grid Pattern */}
                <pattern id="imperialGrid" width="70" height="70" patternUnits="userSpaceOnUse">
                  <path
                    d="M 70 0 L 0 0 0 70"
                    fill="none"
                    stroke={nightLanternMode ? '#C5A15A' : '#720E18'}
                    strokeWidth="0.5"
                    strokeOpacity="0.14"
                  />
                </pattern>
              </defs>

              {/* Base Silk Scroll */}
              <rect width="1400" height="950" fill="url(#parchmentBase)" />
              <rect width="1400" height="950" fill="url(#imperialGrid)" />

              {/* Decorative Cartographic Outer Frame */}
              <rect
                x="22"
                y="22"
                width="1356"
                height="906"
                fill="none"
                stroke="#720E18"
                strokeWidth="3"
                strokeOpacity="0.65"
              />
              <rect
                x="32"
                y="32"
                width="1336"
                height="886"
                fill="none"
                stroke="#C5A15A"
                strokeWidth="1.2"
                strokeOpacity="0.65"
              />

              {/* Traditional Compass & Imperial Cartouche */}
              <g transform="translate(120, 120)">
                <circle
                  cx="0"
                  cy="0"
                  r="48"
                  fill={nightLanternMode ? '#390B12' : '#E9DCC3'}
                  fillOpacity="0.78"
                  stroke="#720E18"
                  strokeWidth="2"
                />
                <circle cx="0" cy="0" r="38" fill="none" stroke="#C5A15A" strokeWidth="1" />
                <polygon points="0,-42 7,-7 42,0 7,7 0,42 -7,7 -42,0 -7,-7" fill="#A82424" />
                <text x="0" y="-54" textAnchor="middle" fill="#720E18" fontSize="13" fontWeight="bold">
                  УМАРД · 北
                </text>
                <text x="0" y="65" textAnchor="middle" fill="#720E18" fontSize="13" fontWeight="bold">
                  ӨМНӨ · 南
                </text>
              </g>

              {/* ============================================================ */}
              {/* GEOGRAPHICAL FEATURES MATCHING SUPPLIED TEXT                 */}
              {/* ============================================================ */}

              {/* 1. NORTHERN YUNSHAN MOUNTAIN RANGE (Юньшань уулс) */}
              <g opacity={nightLanternMode ? 0.85 : 0.92}>
                <path
                  d="M170,220 L290,115 L410,195 L545,82 L700,175 L845,75 L995,180 L1130,105 L1250,225 L1120,255 L260,255 Z"
                  fill="#526A53"
                  stroke="#191413"
                  strokeWidth="1.8"
                />
                {/* Snow Peaks */}
                <polygon points="545,82 512,124 545,116 576,124" fill="#E9DCC3" />
                <polygon points="845,75 808,120 845,110 882,120" fill="#E9DCC3" />
                <polygon points="700,95 668,136 700,128 732,136" fill="#E9DCC3" />
                {/* Thousand-Bell Spring ("Нэг мянган хонхот булаг") */}
                <path
                  d="M685,155 Q665,205 645,255"
                  fill="none"
                  stroke="#74A8B0"
                  strokeWidth="4"
                  strokeDasharray="6 3"
                />
              </g>

              {/* 2. HUAI RIVER MAIN FLOW & TWO BRANCHES (Хуай мөрөн & Бэлчир) */}
              {/* Upper river entering from west through Misty Valley */}
              <path
                d="M20,460 C170,445 310,495 450,510 C550,520 620,515 680,520"
                fill="none"
                stroke="url(#huaiWater)"
                strokeWidth="44"
                strokeLinecap="round"
              />
              {/* Two branches splitting around central island and connected by Lianghuai Bridge */}
              <path
                d="M665,515 C760,445 910,455 1035,545 C1155,630 1275,720 1380,820"
                fill="none"
                stroke="url(#huaiWater)"
                strokeWidth="34"
                strokeLinecap="round"
              />
              <path
                d="M665,525 C730,625 835,685 960,725 C1105,770 1245,830 1380,885"
                fill="none"
                stroke="url(#huaiWater)"
                strokeWidth="36"
                strokeLinecap="round"
              />
              {/* Southern wide river estuary delta ("өмнө талдаа өргөн мөрний бэлчир") */}
              <path
                d="M990,735 C1135,730 1270,745 1380,765 L1380,925 L940,925 C965,850 975,785 990,735 Z"
                fill="url(#huaiWater)"
                opacity="0.85"
              />

              {/* 3. WHITE GLOW LAKE (Цагаан гэрэлт нуур — Сарны нүд) */}
              <ellipse
                cx="250"
                cy="710"
                rx="115"
                ry="62"
                fill="url(#huaiWater)"
                stroke="#C5A15A"
                strokeWidth="2.5"
              />
              <ellipse
                cx="250"
                cy="710"
                rx="78"
                ry="38"
                fill="none"
                stroke="#E9DCC3"
                strokeWidth="1"
                strokeDasharray="5 4"
                opacity="0.7"
              />

              {/* 4. IMPERIAL ROADS & TRADE ROUTES */}
              <path
                d="M350,345 Q440,300 525,255 Q620,210 700,135 M525,255 Q725,265 930,275 Q1040,345 1125,420 Q1010,520 880,625 Q975,680 1070,730"
                fill="none"
                stroke="#720E18"
                strokeWidth="2"
                strokeDasharray="7 6"
                opacity="0.65"
              />
              <path
                d="M350,345 Q390,430 430,515 Q560,520 690,525 Q712,475 735,425 M690,525 Q625,620 560,715 Q405,712 250,710"
                fill="none"
                stroke="#720E18"
                strokeWidth="2"
                strokeDasharray="7 6"
                opacity="0.65"
              />

              {/* 5. ILLUSTRATED LANDSCAPE SYMBOLS ON MAP */}
              {/* Pear Blossoms at Huai'Hua */}
              {[
                [325, 330], [372, 328], [348, 368], [318, 362]
              ].map(([px, py], i) => (
                <circle key={i} cx={px} cy={py} r="14" fill="#FFFDF7" opacity="0.72" stroke="#C5A15A" strokeWidth="0.8" />
              ))}

              {/* Tea Terraces at Yunshi */}
              <path d="M480,268 Q525,244 570,268" fill="none" stroke="#3B593E" strokeWidth="4" />
              <path d="M488,280 Q525,258 562,280" fill="none" stroke="#3B593E" strokeWidth="4" />

              {/* Lianghuai Stone Arch Bridge Icon */}
              <path
                d="M652,525 Q690,492 728,525"
                fill="none"
                stroke="#E9DCC3"
                strokeWidth="6"
              />
              <path
                d="M652,525 Q690,492 728,525"
                fill="none"
                stroke="#720E18"
                strokeWidth="2"
              />

              {/* District Labels (Junyang Town & Xuncheng Town) */}
              <text
                x="1150"
                y="375"
                fill={nightLanternMode ? '#C5A15A' : '#390B12'}
                fontSize="14"
                fontWeight="bold"
                letterSpacing="2"
              >
                ЖҮНЯН ХОТ · 钧阳城
              </text>
              <text
                x="1095"
                y="682"
                fill={nightLanternMode ? '#C5A15A' : '#390B12'}
                fontSize="14"
                fontWeight="bold"
                letterSpacing="2"
              >
                СЮНЬЧЭН ХОТ · 浔城
              </text>
              <text
                x="355"
                y="475"
                fill={nightLanternMode ? '#E9DCC3' : '#191413'}
                fontSize="13"
                fontStyle="italic"
                opacity="0.85"
              >
                Хуай мөрөн · 淮河
              </text>
            </svg>

            {/* ============================================================== */}
            {/* CLICKABLE INTERACTIVE LOCATION MARKERS (ALL 12 LOCATIONS)      */}
            {/* ============================================================== */}
            <div className="absolute inset-0">
              {JINHUAI_LOCATIONS.map((loc) => {
                const isVisible = filteredLocations.some((f) => f.id === loc.id);
                const isSelected = selectedLocation?.id === loc.id;
                const isDiscovered = discoveredIds.includes(loc.id);

                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!didDragMove.current) {
                        focusAndOpenLocation(loc, false);
                      }
                    }}
                    style={{
                      left: `${(loc.mapX / 1400) * 100}%`,
                      top: `${(loc.mapY / 950) * 100}%`,
                      opacity: isVisible ? 1 : 0.22,
                    }}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center focus:outline-none transition-opacity duration-300 z-10"
                  >
                    {/* Imperial Seal Pin */}
                    <div
                      className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 shadow-[0_6px_18px_rgba(0,0,0,0.75)] ${
                        isSelected
                          ? 'bg-[#A82424] border-[#E9DCC3] scale-125 ring-4 ring-[#C5A15A]/45'
                          : isDiscovered
                          ? 'bg-[#720E18] border-[#C5A15A]'
                          : 'bg-[#191413]/90 border-[#C5A15A]/75'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold text-[#E9DCC3]">
                        {loc.id}
                      </span>
                      {nightLanternMode && (
                        <span className="absolute -inset-1.5 rounded-full bg-[#C5A15A]/25 animate-pulse pointer-events-none" />
                      )}
                    </div>

                    {/* Mongolian Location Name Label */}
                    <div
                      className={`mt-1.5 px-2.5 py-0.5 rounded-sm border text-[11px] sm:text-xs font-serif whitespace-nowrap shadow-md transition-colors ${
                        isSelected
                          ? 'bg-[#A82424] border-[#E9DCC3] text-[#E9DCC3] font-bold'
                          : 'bg-[#191413]/90 border-[#C5A15A]/65 text-[#E9DCC3] group-hover:bg-[#390B12] group-hover:border-[#C5A15A]'
                      }`}
                    >
                      {loc.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Bottom Map Legend Overlay */}
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
            <div className="bg-[#191413]/90 border border-[#C5A15A]/45 px-3 py-1.5 rounded-sm text-[#E9DCC3]/85">
              Газрын зургийг хулгана эсвэл хуруугаар чирж гүйлгэх · Дугуйгаар томруулах · Тэмдэгт дээр дарж дэлгэрэнгүй унших
            </div>
            <div className="bg-[#390B12]/90 border border-[#C5A15A]/45 px-3 py-1.5 rounded-sm text-[#C5A15A]">
              Илэрсэн байршил: {filteredLocations.length} / {JINHUAI_LOCATIONS.length}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* LOCATION INFORMATION EXPERIENCE PANEL / MODAL                      */}
      {/* ================================================================== */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#191413]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div
              initial={{ y: 36, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 150, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[#390B12] border-2 border-[#C5A15A] rounded-sm shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
            >
              {/* Ornate Inner Gold Border */}
              <div className="pointer-events-none absolute inset-2 border border-[#C5A15A]/30 z-10" />

              {/* Large Bespoke Historical Illustration Header */}
              <div className="relative h-52 sm:h-64 w-full bg-[#191413] border-b border-[#C5A15A]/50 overflow-hidden">
                <LocationArtwork location={selectedLocation} />

                {/* Top Gradient Vignette & Close Button */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#390B12] via-transparent to-[#191413]/60" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                  <span className="px-3 py-1 bg-[#191413]/90 border border-[#C5A15A]/60 text-xs text-[#C5A15A] tracking-wider">
                    № {selectedLocation.id} · {selectedLocation.regionTag}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedLocation(null)}
                    className="px-3.5 py-1.5 bg-[#720E18] hover:bg-[#A82424] border border-[#C5A15A] text-xs sm:text-sm text-[#E9DCC3] transition-colors shadow-lg"
                  >
                    ✕ Хаах
                  </button>
                </div>

                {/* Title Overlay at Bottom of Artwork */}
                <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3 z-20">
                  <div>
                    <span
                      style={{ fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif' }}
                      className="text-2xl sm:text-3xl text-[#C5A15A] tracking-widest block leading-none mb-1"
                    >
                      {selectedLocation.chineseName}
                    </span>
                    <h3
                      style={{ fontFamily: '"Cormorant Garamond", "Noto Serif", serif' }}
                      className="text-2xl sm:text-4xl font-bold text-[#E9DCC3] drop-shadow"
                    >
                      {selectedLocation.title}
                    </h3>
                    {selectedLocation.subtitle && (
                      <p className="text-sm sm:text-base text-[#C5A15A] font-semibold tracking-wider uppercase mt-0.5">
                        — {selectedLocation.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Complete Unedited Mongolian Description Body */}
              <div className="p-6 sm:p-8 relative z-20">
                <div className="space-y-4 text-[#E9DCC3] text-base sm:text-lg leading-[1.9] font-serif">
                  {selectedLocation.description.split('\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {/* Historical & Geographical Notes */}
                <div className="mt-6 pt-5 border-t border-[#C5A15A]/30">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A15A] mb-3">
                    Түүхэн ба газарзүйн тэмдэглэл
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.imperialNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-[#191413]/85 border border-[#C5A15A]/40 text-xs sm:text-sm text-[#E9DCC3]/90 rounded-sm"
                      >
                        ❖ {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Navigation: Prev / Back to Map / Next */}
                <div className="mt-7 pt-5 border-t border-[#C5A15A]/30 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigateLocation(-1)}
                      className="px-3.5 py-2 bg-[#191413] hover:bg-[#720E18] border border-[#C5A15A]/50 text-xs sm:text-sm text-[#E9DCC3] transition-colors"
                    >
                      ← Өмнөх газар
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateLocation(1)}
                      className="px-3.5 py-2 bg-[#191413] hover:bg-[#720E18] border border-[#C5A15A]/50 text-xs sm:text-sm text-[#E9DCC3] transition-colors"
                    >
                      Дараагийн газар →
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocation(null);
                      resetMapCamera();
                    }}
                    className="px-5 py-2 bg-gradient-to-b from-[#A82424] to-[#720E18] hover:from-[#B82929] hover:to-[#82111C] border border-[#C5A15A] text-xs sm:text-sm text-[#E9DCC3] tracking-wider uppercase shadow"
                  >
                    Газрын зураг руу буцах
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* HISTORICAL JOURNAL MODAL (ТҮҮХЭН ТЭМДЭГЛЭЛИЙН ДЭВТЭР)             */}
      {/* ================================================================== */}
      <AnimatePresence>
        {journalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#191413]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={() => setJournalOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#390B12] border-2 border-[#C5A15A] rounded-sm shadow-2xl overflow-hidden"
            >
              {/* Journal Header */}
              <div className="p-5 sm:p-6 bg-[#191413] border-b border-[#C5A15A]/50 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.24em] text-[#C5A15A] block">
                    锦淮志 · АЯЛАГЧИЙН ШАСТИР
                  </span>
                  <h2
                    style={{ fontFamily: '"Cormorant Garamond", "Noto Serif", serif' }}
                    className="text-2xl sm:text-3xl font-bold text-[#E9DCC3]"
                  >
                    Цзинь’Хуай Мужийн Түүхэн Тэмдэглэлийн Дэвтэр
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setJournalOpen(false)}
                  className="px-4 py-2 bg-[#720E18] hover:bg-[#A82424] border border-[#C5A15A] text-sm text-[#E9DCC3]"
                >
                  ✕ Хаах
                </button>
              </div>

              {/* Scrollable Complete Archive of All 12 Locations */}
              <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between text-xs sm:text-sm text-[#C5A15A] pb-3 border-b border-[#C5A15A]/25">
                  <span>Нийт 12 дурсгалт газрын бүрэн эх бичвэр</span>
                  <span>
                    Судалсан явц: {discoveredIds.length} / {JINHUAI_LOCATIONS.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {JINHUAI_LOCATIONS.map((loc) => {
                    const isDiscovered = discoveredIds.includes(loc.id);
                    return (
                      <div
                        key={loc.id}
                        className="bg-[#191413]/85 border border-[#C5A15A]/45 p-5 rounded-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="text-xs text-[#C5A15A]">
                                {loc.id}. {loc.chineseName} · {loc.regionTag}
                              </span>
                              <h3
                                style={{ fontFamily: '"Cormorant Garamond", "Noto Serif", serif' }}
                                className="text-xl font-bold text-[#E9DCC3]"
                              >
                                {loc.title}
                                {loc.subtitle ? ` — ${loc.subtitle}` : ''}
                              </h3>
                            </div>
                            <span
                              className={`px-2 py-0.5 text-[11px] border ${
                                isDiscovered
                                  ? 'border-[#C5A15A] text-[#C5A15A] bg-[#390B12]'
                                  : 'border-[#E9DCC3]/25 text-[#E9DCC3]/55'
                              }`}
                            >
                              {isDiscovered ? 'Нээсэн' : 'Судлаагүй'}
                            </span>
                          </div>

                          <div className="space-y-2.5 text-sm text-[#E9DCC3]/90 leading-relaxed mt-3">
                            {loc.description.split('\n').map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#C5A15A]/20 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setJournalOpen(false);
                              focusAndOpenLocation(loc, true);
                            }}
                            className="text-xs text-[#C5A15A] hover:text-[#E9DCC3] underline underline-offset-4"
                          >
                            Газрын зураг дээр очих ➔
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* IMPERIAL FOOTER                                                    */}
      {/* ================================================================== */}
      <footer className="border-t border-[#C5A15A]/35 bg-[#191413] py-10 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-3 py-1 border border-[#A82424] bg-[#720E18]/60 text-[#E9DCC3] text-lg mb-3">
            锦淮 · ЦЗИНЬ’ХУАЙ МУЖ
          </div>
          <p className="text-sm text-[#E9DCC3]/75 font-serif">
            Тианши улсын өмнө этгээдийн “Манан татуулсан мөрний хөндий” · Түүхэн уран сэтгэмжийн цахим шастир
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;