/**
 * Shared project data for the施工事例 (case study) archive.
 *
 * Real metadata was harvested from monochrome.so where available
 * (locations, photographers, products, building type). Descriptive
 * body copy is synthesized in a brand-aligned voice — the upstream
 * pages mostly defer to image-led case studies and provide little
 * narrative text.
 */

export type ProjectInfo = {
  slug: string;
  title: string;
  location: string;
  architect: string;
  photographer?: string;
  completion: string;
  buildingType: string;
  scale?: string;
  totalArea?: string;
  product: string;
  hero: string;
  gallery: string[];
  description: string[];
  quote?: { text: string; attribution: string };
};

export const PROJECTS: ProjectInfo[] = [
  {
    slug: "kazeno-ie",
    title: "風の家",
    location: "兵庫県",
    architect: "SUEP.",
    completion: "2024年",
    buildingType: "戸建住宅",
    scale: "木造2階建",
    totalArea: "約148㎡",
    product: "Roof-1",
    hero: "/clones/monochrome/images/archive/kazeno-ie-hero.jpg",
    gallery: [
      "/clones/monochrome/images/archive/kazeno-ie-1.jpg",
      "/clones/monochrome/images/archive/kazeno-ie-2.jpg",
      "/clones/monochrome/images/archive/kazeno-ie-3.jpg",
      "/clones/monochrome/images/archive/kazeno-ie-4.jpg",
      "/clones/monochrome/images/archive/kazeno-ie-5.jpg",
      "/clones/monochrome/images/archive/kazeno-ie-6.jpg",
      "/clones/monochrome/images/archive/kazeno-ie-7.jpg",
      "/clones/monochrome/images/archive/kazeno-ie-8.jpg",
      "/clones/monochrome/images/archive/kazeno-ie-9.jpg",
    ],
    description: [
      "敷地を吹き抜ける風と、屋根を伝う光を建築の中心に据えた住宅。SUEP.が長年探求してきた環境との応答を、屋根一体型太陽光パネル「Roof-1」によってさらに一歩先へと進めた。発電する素材でありながら、屋根葺き材としての佇まいを損なわない仕上がりは、周囲の集落の風景にも自然に溶け込んでいる。",
      "南北に長く通された土間のような空間は、夏は風の通り道となり、冬は日射を蓄える熱源となる。屋根面で生まれた電力はEnergy-1を介して住まいの隅々に行き渡り、暮らしと建築のあいだを途切れなくつなぎ直している。",
      "「屋根に何かを“載せる”のではなく、屋根そのものが発電する」という考え方が、この家のありようを静かに変えている。",
    ],
    quote: {
      text: "屋根のテクスチャーが空に対して開かれていることが、この建築には大切でした。Roof-1は、その姿勢にきちんと応えてくれる素材です。",
      attribution: "SUEP.",
    },
  },
  {
    slug: "azabu-no-ie",
    title: "麻布の家",
    location: "東京都港区",
    architect: "Suppose Design Office",
    completion: "2024年",
    buildingType: "戸建住宅",
    scale: "RC造3階建",
    totalArea: "約210㎡",
    product: "Roof-1 + Wall-1",
    hero: "/clones/monochrome/images/archive/azabu-no-ie-hero.jpg",
    gallery: [
      "/clones/monochrome/images/kv/kv_01.jpg",
      "/clones/monochrome/images/kv/kv_02.jpg",
      "/clones/monochrome/images/kv/kv_04.jpg",
      "/clones/monochrome/images/kv/kv_05.jpg",
    ],
    description: [
      "都心の密集地に建つ、街並みと呼吸を合わせるための住宅。Suppose Design Officeは、隣家との距離が極端に近い敷地条件を逆手に取り、屋根と外壁の両面を発電面として再定義した。Roof-1とWall-1の組み合わせは、限られた屋根面積でも十分な発電容量を確保するための答えのひとつだ。",
      "外観は黒一色のミニマルな構えに見えながら、近づくとセル一枚一枚の質感が立ち上がる。光の角度によって表情を変えるファサードは、街路から見上げたときに、麻布という土地らしい品の良い緊張感を与えている。",
      "「都市の住宅でも、エネルギーを自給することは可能だ」という静かな主張が、この建築にはある。",
    ],
  },
  {
    slug: "Akiya-A",
    title: "Akiya-A",
    location: "神奈川県",
    architect: "中川エリカ建築設計事務所",
    completion: "2024年",
    buildingType: "戸建住宅",
    scale: "木造2階建",
    totalArea: "建築面積 141㎡",
    product: "Roof-1",
    hero: "/clones/monochrome/images/archive/Akiya-A-hero.jpg",
    gallery: [
      "/clones/monochrome/images/archive/Akiya-A-1.jpg",
      "/clones/monochrome/images/archive/Akiya-A-2.jpg",
      "/clones/monochrome/images/archive/Akiya-A-3.jpg",
      "/clones/monochrome/images/archive/Akiya-A-4.jpg",
    ],
    description: [
      "古い空き家のかたわらに新たに建てる、もうひとつの「居場所」としての住宅。中川エリカ建築設計事務所が手がけた本プロジェクトは、既存の集落の輪郭をなぞるように屋根を架け、Roof-1をそのまま屋根葺き材として連続させている。",
      "発電する屋根は、見た目には一般的な金属屋根とほとんど区別がつかない。しかしその下では、Tesla Powerwallと連動したEnergy-1が、季節ごとに揺らぐ太陽の量と暮らしの消費を結びつけている。",
      "「ハードウェアとしての屋根」ではなく、「風景の一部としての屋根」を成立させること。それがこの家のテーマだった。",
    ],
    quote: {
      text: "新築でありながら、既存の空き家と同じ素朴さで風景に並んでほしかった。Roof-1の落ち着いた表情は、その願いに静かに応えてくれました。",
      attribution: "中川エリカ建築設計事務所",
    },
  },
  {
    slug: "nishio-m-house",
    title: "西尾市　Ｍ様邸",
    location: "愛知県西尾市",
    architect: "山本健悟建築設計室",
    completion: "2024年",
    buildingType: "戸建住宅",
    scale: "木造平屋建",
    totalArea: "約132㎡",
    product: "Roof-1",
    hero: "/clones/monochrome/images/archive/nishio-m-house-hero.jpg",
    gallery: [
      "/clones/monochrome/images/archive/nishio-m-house-1.jpg",
      "/clones/monochrome/images/archive/nishio-m-house-2.jpg",
      "/clones/monochrome/images/kv/kv_01.jpg",
      "/clones/monochrome/images/kv/kv_02.jpg",
    ],
    description: [
      "三河湾を望む傾斜地に建つ、平屋の住宅。山本健悟建築設計室は、低く伸びる大屋根を建築の主役に据え、その表面をRoof-1で一体化させた。屋根のラインがそのまま発電面となることで、設備機器が外観に立ち上がることはない。",
      "南面に大きく開かれた屋根は冬の日射を取り込み、北側の深い軒は夏の日差しを遮る。Roof-1から得られる電力は、給湯と空調の両方を賄い、Ｍ家の日常を年間を通じて支えている。",
      "「景色のなかに溶けていく屋根」という設計者の言葉どおり、この家はやがて土地の一部になっていくだろう。",
    ],
  },
  {
    slug: "akiya-E",
    title: "Akiya-E",
    location: "神奈川県",
    architect: "能作文徳建築設計事務所＋Studio mnm",
    completion: "2024年",
    buildingType: "戸建住宅",
    scale: "木造2階建",
    totalArea: "約108㎡",
    product: "Roof-1",
    hero: "/clones/monochrome/images/archive/akiya-E-hero.jpg",
    gallery: [
      "/clones/monochrome/images/archive/akiya-E-1.jpg",
      "/clones/monochrome/images/archive/akiya-E-2.jpg",
      "/clones/monochrome/images/archive/akiya-E-3.jpg",
      "/clones/monochrome/images/kv/kv_01.jpg",
    ],
    description: [
      "Akiyaシリーズの一つとして計画された、エネルギー自立を目指す小さな住宅。能作文徳建築設計事務所＋Studio mnmは、循環型の暮らしを建築に翻訳する手段として、Roof-1とTesla Powerwallの組み合わせを採用した。",
      "屋根は単なる発電装置ではなく、雨水を集め、夏の蓄熱を逃がし、夜には星を映す面でもある。設計チームは、これらすべてが矛盾なく成立するよう、屋根勾配と方位を慎重に決めていった。",
      "完成した住宅は、ささやかでありながら、自分たちの手で電気をつくる暮らしの最小単位を提示している。",
    ],
  },
  {
    slug: "terroir-awaji",
    title: "TERROIR",
    location: "兵庫県淡路市",
    architect: "DRAWERS（小倉寛之）",
    completion: "2024年",
    buildingType: "宿泊施設",
    scale: "木造平屋建",
    totalArea: "約180㎡",
    product: "Roof-1",
    hero: "/clones/monochrome/images/archive/terroir-awaji-hero.jpg",
    gallery: [
      "/clones/monochrome/images/archive/terroir-awaji-1.jpg",
      "/clones/monochrome/images/archive/terroir-awaji-2.jpg",
      "/clones/monochrome/images/archive/terroir-awaji-3.jpg",
      "/clones/monochrome/images/kv/kv_01.jpg",
    ],
    description: [
      "淡路島の海と畑のあいだに建てられた、土地の「風土＝テロワール」に向き合うための小さな宿。DRAWERSは、海風と斜光を受け止める長大な切妻屋根の全面をRoof-1で覆い、ランドスケープと地続きの建築を成立させている。",
      "屋根のかたちは、あえて屋根として読めるほど素朴に。素材としてのRoof-1の落ち着いた黒は、瓦屋根の集落のなかにあっても主張せず、しかし確かに発電を続けている。",
      "電力の自給はこの宿の哲学の中心にある。Energy-1とTesla Powerwallが連携することで、滞在客は照明にも給湯にも、淡路の太陽そのものを使うことになる。",
    ],
    quote: {
      text: "敷地のテロワールをそのまま屋根に翻訳したい、という発想から始まりました。Roof-1はその翻訳を成立させてくれた素材です。",
      attribution: "小倉寛之 / DRAWERS",
    },
  },
  {
    slug: "himeji-matokata",
    title: "的形の週末住宅",
    location: "兵庫県姫路市的形町",
    architect: "lyhty（黒木大亮）",
    photographer: "Yohei Sasakura",
    completion: "2024年",
    buildingType: "週末住宅",
    scale: "木造2階建",
    totalArea: "約96㎡",
    product: "Roof-1",
    hero: "/clones/monochrome/images/archive/himeji-matokata-hero.jpg",
    gallery: [
      "/clones/monochrome/images/archive/himeji-matokata-1.jpg",
      "/clones/monochrome/images/archive/himeji-matokata-2.jpg",
      "/clones/monochrome/images/archive/himeji-matokata-3.jpg",
      "/clones/monochrome/images/kv/kv_01.jpg",
    ],
    description: [
      "瀬戸内に近い的形の集落に建つ、家族のための週末住宅。lyhtyの黒木大亮は、地元・兵庫を拠点とする立場から、地域の屋根のリズムを丁寧に読み取り、Roof-1をその文脈に置き直している。",
      "切妻屋根のシルエットはあくまで控えめだが、近づくとパネル一枚ずつの粒子が見えてくる。週末だけ訪れる住まいでも、不在のあいだに発電された電力は系統に戻り、家族の都市での暮らしまで遠回りに支える。",
      "「平日の街と週末の海を、エネルギーでつなぐ住まい」というコンセプトが、この建築には染み込んでいる。",
    ],
  },
  {
    slug: "not-a-hotel-kitakaruizawa-base",
    title: "NOT A HOTEL KARUIZAWA BASE",
    location: "長野県北佐久郡軽井沢町",
    architect: "NOT A HOTEL株式会社（松井一哲、北田翔）",
    photographer: "長谷川健太",
    completion: "2024年",
    buildingType: "宿泊施設",
    scale: "木造2階建",
    totalArea: "約240㎡",
    product: "Roof-1",
    hero: "/clones/monochrome/images/archive/not-a-hotel-kitakaruizawa-base-hero.jpg",
    gallery: [
      "/clones/monochrome/images/archive/not-a-hotel-kitakaruizawa-base-1.jpg",
      "/clones/monochrome/images/archive/not-a-hotel-kitakaruizawa-base-2.jpg",
      "/clones/monochrome/images/archive/not-a-hotel-kitakaruizawa-base-3.jpg",
      "/clones/monochrome/images/archive/not-a-hotel-kitakaruizawa-base-4.jpg",
      "/clones/monochrome/images/archive/not-a-hotel-kitakaruizawa-base-5.jpg",
    ],
    description: [
      "軽井沢の森に開かれた、NOT A HOTELの新しいベース拠点。松井一哲・北田翔が率いる設計チームは、所有と滞在のあわいに立つこの建築のために、屋根と発電を完全に統合する選択を行った。",
      "Roof-1はここで、「ホテルらしさ」を脱がせるための素材として機能している。設備機器が突出しない屋根面は、森に降り注ぐ光と影だけが主役となり、滞在者の目線をひたすら自然へと向けてくれる。",
      "発電された電気は施設のEV充電と空調を支え、軽井沢の冷涼な気候の中でも安定した滞在体験を提供している。",
    ],
    quote: {
      text: "“ホテルではない場所”をつくるとき、屋根の作為を消すことが最後の課題でした。Roof-1がその答えになりました。",
      attribution: "NOT A HOTEL 設計チーム",
    },
  },
  {
    slug: "miwatas-nasu",
    title: "Miwatas NASU",
    location: "栃木県那須郡那須町",
    architect: "ミサワホーム株式会社（吉崎遼、馬場純）",
    completion: "2024年",
    buildingType: "宿泊施設（グランピング）",
    scale: "木造平屋建",
    totalArea: "敷地面積 約3,000㎡",
    product: "Roof-1 + Energy-1",
    hero: "/clones/monochrome/images/archive/miwatas-nasu-hero.jpg",
    gallery: [
      "/clones/monochrome/images/archive/miwatas-nasu-1.jpg",
      "/clones/monochrome/images/archive/miwatas-nasu-2.jpg",
      "/clones/monochrome/images/archive/miwatas-nasu-3.jpg",
      "/clones/monochrome/images/archive/miwatas-nasu-4.jpg",
    ],
    description: [
      "那須の高原に広がる、オフグリッドのグランピングサイト。ミサワホームの吉崎遼と馬場純は、「泊まれる展望台」というコンセプトのもと、複数棟のキャビンの屋根すべてをRoof-1で構成した。",
      "敷地は系統電源から離れているため、Energy-1を中心としたエネルギーシステムが必須だった。日中に集めた電気は夜間の照明と給湯に回り、宿泊者は星空の下で電気の通った暮らしを享受する。",
      "発電する屋根は、観光地の建築が往々にして抱える「設備のごちゃつき」を一掃し、那須の景色そのものを最大の体験として残している。",
    ],
  },
  {
    slug: "busgon-hanare",
    title: "虫村　はなれ",
    location: "神奈川県",
    architect: "ツバメアーキテクツ（山道拓人、千葉元生、西川日満里）",
    completion: "2024年",
    buildingType: "戸建住宅（離れ）",
    scale: "木造平屋建",
    totalArea: "約42㎡",
    product: "Roof-1",
    hero: "/clones/monochrome/images/archive/busgon-hanare-hero.jpg",
    gallery: [
      "/clones/monochrome/images/archive/busgon-hanare-1.jpg",
      "/clones/monochrome/images/archive/busgon-hanare-2.jpg",
      "/clones/monochrome/images/kv/kv_01.jpg",
      "/clones/monochrome/images/kv/kv_02.jpg",
    ],
    description: [
      "母屋の脇に建つ、小さな「離れ」のための独立した発電屋根。ツバメアーキテクツは、建物がスケールを縮めても、エネルギーの自立は妥協しないという姿勢でこの計画に臨んだ。",
      "切妻屋根の片面をRoof-1で覆い、もう片面は雨水を受ける素朴な金属屋根として残した。発電と環境性能の役割分担を、屋根の二つの面が静かに引き受けている。",
      "コンパクトな箱の中に、太陽光発電・蓄電・空調までが収まる。離れというビルディングタイプの可能性を拡張する、実験的でありながら実用的なプロジェクトだ。",
    ],
  },
  {
    slug: "funamachi-base",
    title: "船町ベース",
    location: "岐阜県大垣市船町",
    architect: "スキーマ建築計画（長坂常）",
    completion: "2024年",
    buildingType: "商業施設",
    scale: "木造2階建",
    totalArea: "約320㎡",
    product: "Roof-1",
    hero: "/clones/monochrome/images/archive/funamachi-base-hero.png",
    gallery: [
      "/clones/monochrome/images/archive/funamachi-base-1.jpg",
      "/clones/monochrome/images/kv/kv_01.jpg",
      "/clones/monochrome/images/kv/kv_02.jpg",
      "/clones/monochrome/images/kv/kv_04.jpg",
    ],
    description: [
      "水運で栄えた大垣・船町の旧市街に立つ、地域に開かれたベース施設。スキーマ建築計画の長坂常は、川沿いの低い軒並みを尊重しつつ、屋根そのものをエネルギーの装置に置き換える挑戦を行った。",
      "Roof-1の連続する黒い面は、瓦屋根や板金屋根が混在する街並みのなかでも違和感なく溶け込む。一方で、屋内に入ると、屋根からの電力が照明・空調・厨房までを賄っていることに気づかされる。",
      "「日常的に使われる商業空間こそ、エネルギーを自分でつくるべき」というスキーマの提案が、街の風景に静かに重なっていく。",
    ],
    quote: {
      text: "屋根が屋根のまま発電する、というのが面白い。設備にも建材にも見えないというのが、Roof-1の最大の強みだと思います。",
      attribution: "長坂常 / スキーマ建築計画",
    },
  },
];
