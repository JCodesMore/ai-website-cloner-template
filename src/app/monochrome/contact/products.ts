export type ContactProduct = {
  slug: "roof" | "wall" | "panel" | "energy" | "power";
  name: string;
  tagline: string;
  anchor: string;
};

export const PRODUCTS: ContactProduct[] = [
  {
    slug: "roof",
    name: "Roof–1",
    tagline: "エネルギーをつくる屋根",
    anchor: "roofForm",
  },
  {
    slug: "wall",
    name: "Wall–1",
    tagline: "エネルギーをつくる壁",
    anchor: "wallForm",
  },
  {
    slug: "panel",
    name: "Panel–B",
    tagline: "最もミニマルな太陽光パネル",
    anchor: "panelForm",
  },
  {
    slug: "energy",
    name: "Energy–1",
    tagline: "電力コストを下げ、災害時に家族を守るHEMS",
    anchor: "energyForm",
  },
  {
    slug: "power",
    name: "モノクローム電力",
    tagline: "環境に貢献し、電気代がお得になる電力プラン",
    anchor: "powerForm",
  },
];

export const PREFECTURES: string[] = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];
