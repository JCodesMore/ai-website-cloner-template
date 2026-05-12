// Content for VertexLink Inc (Sacramento, CA).
// Structure preserved from the original broadband template; copy adapted to VertexLink branding.

import type {
  AboutFeature,
  BlogPost,
  CounterStat,
  HeroSlide,
  PricingPlan,
  ServiceCard,
  StreamingCard,
  WhyChooseFeature,
} from "@/types/content";

export interface NavLink {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
}

export const NAV_LINKS: NavLink[] = [
  {
    label: "Home",
    href: "/",
    submenu: [{ label: "Home 01", href: "/" }],
  },
  {
    label: "Pages",
    href: "/about",
    submenu: [
      { label: "About Us", href: "/about" },
      { label: "Our Services", href: "/services" },
      { label: "Our Team", href: "/team" },
      { label: "Our Packages", href: "/packages" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Coming Soon", href: "/coming-soon" },
      { label: "404 Error", href: "/404-demo" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    submenu: [
      { label: "Broadband", href: "/services/broadband" },
      { label: "WIFI Internet", href: "/services/wifi-internet" },
      { label: "VertexStream TV Box", href: "/services/vertexstream-tv-box" },
      { label: "Satellite TV", href: "/services/satellite-tv" },
      { label: "Mobile Connection", href: "/services/mobile-connection" },
      { label: "Home Security", href: "/services/home-security" },
    ],
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    submenu: [
      { label: "Portfolio Grid", href: "/portfolio" },
      { label: "Portfolio Details", href: "/portfolio/internet-services" },
    ],
  },
  {
    label: "Blog",
    href: "/blog",
    submenu: [
      { label: "Blog Grid", href: "/blog" },
      { label: "Blog Details", href: "/blog/comedy-channels-this-week" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    bg: "/img/banner/banner-01.jpg",
    heading: "Explore over",
    highlight: "world broadband",
    intro:
      "We offer the excessive speed, secure, and dependable net connection that helps you to do what you like online.",
  },
  {
    bg: "/img/banner/banner-02.jpg",
    heading: "Strong connection",
    highlight: "smooth journey",
    intro:
      "We offer the excessive speed, secure, and dependable net connection that helps you to do what you like online.",
  },
  {
    bg: "/img/banner/banner-03.jpg",
    heading: "Boost every",
    highlight: "digital moments",
    intro:
      "We offer the excessive speed, secure, and dependable net connection that helps you to do what you like online.",
  },
];

export const SERVICES: ServiceCard[] = [
  {
    icon: "/img/icons/icon-01.png",
    title: "Broadband",
    description:
      "Broadband is a high-speed internet connection that lets you stream.",
    href: "#broadband",
    active: true,
  },
  {
    icon: "/img/icons/icon-02.png",
    title: "WIFI Internet",
    description:
      "Wi-Fi internet lets you connect devices wirelessly to the internet.",
    href: "#wifi",
  },
  {
    icon: "/img/icons/icon-03.png",
    title: "VertexStream TV box",
    description: "A streaming TV box that brings your favorite shows and movies into one app.",
    href: "#tv-box",
  },
  {
    icon: "/img/icons/icon-04.png",
    title: "Satellite TV",
    description:
      "Satellite TV brings a wide range of channels straight to your TV.",
    href: "#satellite",
  },
];

export const ABOUT_FEATURES: AboutFeature[] = [
  { label: "Our fastest ever router", active: true },
  { label: "Browse and download around the clock" },
  { label: "Superfast and ultra-reliable" },
];

export const ABOUT_VIDEO = {
  poster: "/img/content/about-03.jpg",
  href: "https://www.youtube.com/watch?v=yd1JhZzoS6A",
  name: "Sandra Braun",
  role: "Senior Executive",
};

export const COUNTERS: CounterStat[] = [
  { value: 268, label1: "Internet", label2: "Package" },
  { value: 823, label1: "Satisfaction", label2: "Clients" },
  { value: 252, label1: "Available", label2: "Channels" },
  { value: 964, label1: "Projects", label2: "Completed" },
];

export const WHY_CHOOSE_LEFT: WhyChooseFeature[] = [
  {
    icon: "/img/icons/icon-07.png",
    title: "4K and 8K Quality",
    description:
      "4K and 8K quality deliver ultra-clear, lifelike visuals with stunning detail and depth.",
    href: "#quality",
  },
  {
    icon: "/img/icons/icon-08.png",
    title: "Free Installation",
    description:
      "Enjoy quick and hassle-free setup at no extra cost, with expert support and zero delays.",
    href: "#install",
  },
  {
    icon: "/img/icons/icon-09.png",
    title: "Fast Support 24/7",
    description:
      "Around-the-clock support to keep you connected, anytime, anywhere fast, and reliable.",
    href: "#support",
  },
];

export const WHY_CHOOSE_RIGHT: WhyChooseFeature[] = [
  {
    icon: "/img/icons/icon-10.png",
    title: "Best Pricing",
    description:
      "Get the best value with affordable plans that fit every budget no hidden fees ever.",
    href: "#pricing",
  },
  {
    icon: "/img/icons/icon-11.png",
    title: "Home Security",
    description:
      "Protect your home and loved ones with smart, reliable security solutions trusted proven.",
    href: "#security",
  },
  {
    icon: "/img/icons/icon-12.png",
    title: "Ultrafast Connect",
    description:
      "Experience blazing speeds with ultrafast connect for seamless stream and browsing.",
    href: "#ultrafast",
  },
];

export const OFFER = {
  title: "We deliver the",
  highlight: "best networking devices",
  paragraph:
    "Broadband is usually related and eliminates the want for dial-up. Its significance is far-reaching; it lets in for incredible and brief get entry to to information, teleconferencing, information transmission, and greater in numerous capacities. Broadband is a community connection technology that provides you with to a high-pace connection to the Internet. Broadband has come to be a need in each workplace and domestic settings.",
  icon: "/img/icons/icon-01.png",
  bullet1: "Try Free For 1 Month",
  bullet2: "High-quality data of a wide bandwidth.",
  image: "/img/content/01.jpg",
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    icon: "rss",
    title: "Internet",
    price: "$55",
    unit: "/Per Month",
    caption: "For 12 mos when bundled, + taxes & equip fee",
    features: [
      "Internet with a 80Mbps",
      "65 + HD Channels",
      "WiFi connection",
      "2 devices",
    ],
  },
  {
    icon: "desktop",
    title: "TV",
    price: "$75",
    unit: "/Per Month",
    caption: "For 12 mos when bundled, + taxes & equip fee",
    features: [
      "Internet with a 130Mbps",
      "85 + HD Channels",
      "TV connection",
      "4 devices",
    ],
  },
  {
    icon: "rss",
    extraIcon: "desktop",
    title: "Internet + TV",
    price: "$95",
    unit: "/Per Month",
    caption: "For 12 mos when bundled, + taxes & equip fee",
    features: [
      "Internet with a 150Mbps",
      "105 + HD Channels",
      "WiFi & TV connection",
      "Unlimited devices",
    ],
    highlighted: true,
  },
];

export const STREAMING_CARDS: StreamingCard[] = [
  { image: "/img/content/stream-01.jpg", title: "Music Channels" },
  { image: "/img/content/stream-02.jpg", title: "Fashion News Reports" },
  { image: "/img/content/stream-03.jpg", title: "Discovery Channel" },
  { image: "/img/content/stream-04.jpg", title: "Sports & action" },
  { image: "/img/content/stream-05.jpg", title: "Cartoon Channel" },
  { image: "/img/content/stream-06.jpg", title: "Family Weekend" },
];

export const STREAMING_VIDEO_HREF = "https://www.youtube.com/watch?v=yd1JhZzoS6A";

export const STREAMING_BG = "/img/bg/bg-02.jpg";

export const BLOG_POSTS: BlogPost[] = [
  {
    image: "/img/blog/blog-01.jpg",
    day: "10",
    month: "Aug",
    category: "Broadband",
    title: "We newly added some comedy channels this week.",
    author: "Admin",
    comments: 5,
  },
  {
    image: "/img/blog/blog-02.jpg",
    day: "07",
    month: "Aug",
    category: "Highspeed",
    title: "Advanced security to protect stay safe online device.",
    author: "Admin",
    comments: 2,
  },
  {
    image: "/img/blog/blog-03.jpg",
    day: "04",
    month: "Aug",
    category: "Internet",
    title: "Internet speed for day today online trading.",
    author: "Admin",
    comments: 4,
  },
];

export const FOOTER_CONTACT = {
  phone: "(916) 555-0142",
  email: "info@vertexlink.com",
  location: "2108 N St, Ste N, Sacramento, CA 95816",
};

export const FOOTER_NEWSLETTER_BLURB =
  "We’re growing the last communications community to strength high-quality, secure, affordable, speedy connections to effect people’s lives anywhere.";

export const FOOTER_QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Our Pricing", href: "/packages" },
];

export const FOOTER_SERVICES = [
  { label: "Broadband", href: "/services/broadband" },
  { label: "WIFI Internet", href: "/services/wifi-internet" },
  { label: "VertexStream TV Box", href: "/services/vertexstream-tv-box" },
  { label: "Satellite TV", href: "/services/satellite-tv" },
];

export const FOOTER_SCHEDULE = [
  { day: "Monday - Friday", time: "09:00 AM - 06:00 PM" },
  { day: "Saturday", time: "10:00 AM - 05:00 PM" },
  { day: "Sunday", time: "Closed" },
];
