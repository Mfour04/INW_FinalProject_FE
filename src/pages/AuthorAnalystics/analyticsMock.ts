// Mock API cho analytics (FE-only)

export type Summary = {
  totalCoins: number;
  totalOrders: number;
  avgOrderValue: number;
  refunds: number;
  byType: { BuyNovel: number; BuyChapter: number };
};

export type SeriesPoint = { ts: string; coins: number; orders: number };
export type ViewPoint = { ts: string; views: number };
export type TopItem = { novelId: string; title: string; coins: number; orders: number };
export type TopViewItem = { novelId: string; title: string; views: number };

export type Purchase = {
  id: string;
  ts: string; // ISO string
  buyerName: string;
  buyerId: string; // masked / id
  novelId: string;
  novelTitle: string;
  chapterId?: string;
  chapterTitle?: string;
  priceCoins: number;
  type: "BuyChapter" | "BuyNovel";
  orderId: string;
};

export type PurchaseQuery = {
  from?: string; to?: string;
  q?: string; // search buyer/novel/chapter/orderId
  novelId?: string;
  type?: "BuyChapter"|"BuyNovel"|"all";
  page?: number; pageSize?: number;
};

export type PurchasePage = { items: Purchase[]; total: number; page: number; pageSize: number };

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// ====== Helpers ======
const daysBack = (n: number) => {
  const arr: Date[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push(d);
  }
  return arr;
};
const fmtDay = (d: Date) => d.toISOString().slice(0,10);

// seed rand
const seedRandom = (seed=42) => () => {
  let t = (seed += 0x6D2B79F5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rand = seedRandom(1337);

// ====== Revenue Series (30 ngày) ======
const SERIES: SeriesPoint[] = daysBack(30).map(d => {
  const base = 120 + Math.floor(rand()*80); // coins
  const weekendBoost = [0,6].includes(d.getDay()) ? 1.15 : 1;
  const coins = Math.round(base * weekendBoost);
  const orders = Math.max(1, Math.round(coins / (8 + Math.floor(rand()*6))));
  return { ts: fmtDay(d), coins, orders };
});

// ====== Views Series (30 ngày, KHÔNG có unique) ======
const VIEW_SERIES: ViewPoint[] = daysBack(30).map(d => {
  const base = 2200 + Math.floor(rand()*600);
  const weekendPenalty = [0,6].includes(d.getDay()) ? 0.9 : 1;
  const views = Math.round(base * weekendPenalty);
  return { ts: fmtDay(d), views };
});

// ====== Top novels ======
const TOP: TopItem[] = [
  { novelId: "n1", title: "Hào Quang Trở Lại", coins: 1380, orders: 180 },
  { novelId: "n2", title: "Đêm Dài Không Ngủ", coins: 1120, orders: 140 },
  { novelId: "n3", title: "Phong Ấn Trận", coins: 980, orders: 120 },
  { novelId: "n4", title: "Thiên Tài Viết Chữ", coins: 770, orders: 98 },
  { novelId: "n5", title: "Bảy Năm Về Trước", coins: 630, orders: 82 },
];

const TOP_VIEWS: TopViewItem[] = [
  { novelId: "n3", title: "Phong Ấn Trận", views: 18240 },
  { novelId: "n1", title: "Hào Quang Trở Lại", views: 17620 },
  { novelId: "n2", title: "Đêm Dài Không Ngủ", views: 16410 },
  { novelId: "n5", title: "Bảy Năm Về Trước", views: 14110 },
  { novelId: "n4", title: "Thiên Tài Viết Chữ", views: 12990 },
];

const TOP_CHAPTER_VIEWS = [
  { id: "c1", title: "Chương 54: Giao ước", novelTitle: "Phong Ấn Trận", views: 4120 },
  { id: "c2", title: "Chương 12: Khởi hành", novelTitle: "Hào Quang Trở Lại", views: 3890 },
  { id: "c3", title: "Chương 7: Bóng đêm", novelTitle: "Đêm Dài Không Ngủ", views: 3510 },
  { id: "c4", title: "Chương 1: Gõ cửa", novelTitle: "Thiên Tài Viết Chữ", views: 3290 },
  { id: "c5", title: "Chương 23: Ngoặt gió", novelTitle: "Bảy Năm Về Trước", views: 3015 },
];

const TOP_REFERRERS = [
  { source: "Direct / app", views: 12890 },
  { source: "Google", views: 6420 },
  { source: "Facebook", views: 4980 },
  { source: "X (Twitter)", views: 2270 },
  { source: "Other", views: 1650 },
];

// ====== Purchases (log chi tiết 120 bản ghi giả) ======
const BUYERS = ["Minh T.", "Linh N.", "Phong L.", "Hà M.", "Kiệt P.", "An P.", "Quân Đ.", "Vy T.", "Tú H.", "Yến P."];
const NOVELS = [
  { id: "n1", title: "Hào Quang Trở Lại", chapters: 120 },
  { id: "n2", title: "Đêm Dài Không Ngủ", chapters: 96 },
  { id: "n3", title: "Phong Ấn Trận", chapters: 88 },
  { id: "n4", title: "Thiên Tài Viết Chữ", chapters: 73 },
  { id: "n5", title: "Bảy Năm Về Trước", chapters: 60 },
];

function randomLocalISOStringWithinDays(lastNDays=30) {
  const now = new Date();
  const offsetDays = Math.floor(rand() * lastNDays);
  const d = new Date(now);
  d.setDate(now.getDate() - offsetDays);
  d.setHours(Math.floor(rand()*24), Math.floor(rand()*60), Math.floor(rand()*60), 0);
  return d.toISOString();
}

const PURCHASES: Purchase[] = Array.from({ length: 120 }).map((_, i) => {
  const nv = NOVELS[Math.floor(rand()*NOVELS.length)];
  const isBundle = rand() < 0.12;
  const chapterIndex = Math.max(1, Math.floor(rand()*nv.chapters));
  const buyerName = BUYERS[Math.floor(rand()*BUYERS.length)];
  const price = isBundle ? (300 + Math.floor(rand()*120)) : (8 + Math.floor(rand()*8));

  return {
    id: `pc_${1000+i}`,
    ts: randomLocalISOStringWithinDays(30),
    buyerName,
    buyerId: `u_${Math.floor(rand()*9000)+1000}`,
    novelId: nv.id,
    novelTitle: nv.title,
    chapterId: isBundle ? undefined : `${nv.id}_c${chapterIndex}`,
    chapterTitle: isBundle ? undefined : `Chương ${chapterIndex}`,
    priceCoins: price,
    type: (isBundle ? "BuyNovel" : "BuyChapter") as Purchase["type"],
    orderId: `ord_${(Math.floor(rand()*9e5)+1e5) | 0}`,
  };
}).sort((a, b) => a.ts < b.ts ? 1 : -1);

// ====== Public APIs ======
export async function fetchSummary(_: { from?: string; to?: string; novelId?: string }): Promise<Summary> {
  await delay(200);
  const totalCoins = SERIES.reduce((s,x)=>s+x.coins,0);
  const totalOrders = SERIES.reduce((s,x)=>s+x.orders,0);
  const aov = totalCoins / Math.max(1,totalOrders);
  const BuyNovel = Math.round(totalCoins * 0.18);
  const BuyChapter = totalCoins - BuyNovel;
  return { totalCoins, totalOrders, avgOrderValue: Math.round(aov), refunds: 0, byType: { BuyNovel, BuyChapter } };
}

export async function fetchSeries(_: { from?: string; to?: string; novelId?: string; granularity?: "day"|"week"|"month" }): Promise<SeriesPoint[]> {
  await delay(180);
  return SERIES;
}

export async function fetchTopNovels(_: { from?: string; to?: string }): Promise<TopItem[]> {
  await delay(150);
  return TOP;
}

export async function fetchPurchases(params: PurchaseQuery): Promise<PurchasePage> {
  await delay(200);
  const { from, to, q, novelId, type="all", page=1, pageSize=20 } = params || {};
  let list = [...PURCHASES];

  if (from) list = list.filter(p => p.ts.slice(0,10) >= from);
  if (to) list = list.filter(p => p.ts.slice(0,10) <= to);
  if (novelId) list = list.filter(p => p.novelId === novelId);
  if (type !== "all") list = list.filter(p => p.type === type);
  if (q) {
    const k = q.toLowerCase();
    list = list.filter(p =>
      p.buyerName.toLowerCase().includes(k) ||
      p.novelTitle.toLowerCase().includes(k) ||
      (p.chapterTitle ?? "").toLowerCase().includes(k) ||
      p.orderId.toLowerCase().includes(k)
    );
  }

  const total = list.length;
  const start = (page-1)*pageSize;
  const items = list.slice(start, start+pageSize);
  return { items, total, page, pageSize };
}

/* ====== Views-specific APIs ====== */
export async function fetchViewsSeries(_: { from?: string; to?: string; granularity?: "day"|"month"|"year" }): Promise<ViewPoint[]> {
  await delay(150);
  return VIEW_SERIES;
}
export async function fetchTopViews(_: { from?: string; to?: string }): Promise<TopViewItem[]> {
  await delay(120);
  return TOP_VIEWS;
}
export async function fetchTopChapterViews(_: { from?: string; to?: string }) {
  await delay(120);
  return TOP_CHAPTER_VIEWS;
}
export async function fetchReferrers(_: { from?: string; to?: string }) {
  await delay(120);
  return TOP_REFERRERS;
}
