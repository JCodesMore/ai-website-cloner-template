// Inner-page content for VertexLink Inc — services, FAQs, blog posts, portfolio.

export interface TeamMember {
  image: string;
  name: string;
  role: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { image: "/img/team/team-01.jpg", name: "Boaz Luth", role: "General Manager" },
  { image: "/img/team/team-02.jpg", name: "Donna Everts", role: "Marketing Director" },
  { image: "/img/team/team-03.jpg", name: "Alessio Zito", role: "Product Manager" },
  { image: "/img/team/team-04.jpg", name: "Vana Erada", role: "Sr. Manager" },
  { image: "/img/team/team-05.jpg", name: "Claude Primeau", role: "Sr. Executive" },
  { image: "/img/team/team-06.jpg", name: "Kaarlo Kapanen", role: "Sr. Executive" },
  { image: "/img/team/team-07.jpg", name: "Danait Yemane", role: "Sr. Executive" },
  { image: "/img/team/team-08.jpg", name: "Abel Nebay", role: "Sr. Executive" },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    q: "01. How to resell business package ?",
    a: "We make it simple to resell our business broadband packages. Sign up as a partner, pick the plans you want to offer, and we handle installation, support and billing — you keep the margin.",
  },
  {
    q: "02. Which VertexStream internet plan is the fastest?",
    a: "Our top-tier VertexStream Ultra plan delivers symmetrical gigabit speeds — perfect for streaming 8K, multiplayer gaming, and large-team video calls without bandwidth fights.",
  },
  {
    q: "03. How much bandwith per month ?",
    a: "All VertexLink home plans are unmetered — there is no monthly bandwidth cap. Business plans include a soft-cap fair-use policy starting at 5 TB/month.",
  },
  {
    q: "04. How can i get internet for my business?",
    a: "Tell us your address and team size on the contact form. A specialist will check coverage, recommend a plan, and schedule installation — usually within 5 business days.",
  },
  {
    q: "05. What payment methods are available?",
    a: "We accept all major credit and debit cards, direct debit, PayPal, and bank transfer for annual plans. Business plans can be invoiced quarterly.",
  },
  {
    q: "06. What is home broadband TV?",
    a: "Home broadband TV bundles your internet with live channels, on-demand streaming, and a smart set-top box — one router, one bill, one remote.",
  },
];

export interface PortfolioItem {
  slug: string;
  image: string;
  title: string;
  category: string;
}

export const PORTFOLIO: PortfolioItem[] = [
  { slug: "internet-services", image: "/img/portfolio/portfolio-01.jpg", title: "Internet Services", category: "Broadband" },
  { slug: "wifi-installation", image: "/img/portfolio/portfolio-02.jpg", title: "WiFi Installation", category: "Wireless" },
  { slug: "satellite-setup", image: "/img/portfolio/portfolio-03.jpg", title: "Satellite Setup", category: "Television" },
  { slug: "router-deployment", image: "/img/portfolio/portfolio-04.jpg", title: "Router Deployment", category: "Networking" },
  { slug: "fiber-rollout", image: "/img/portfolio/portfolio-05.jpg", title: "Fiber Rollout", category: "Infrastructure" },
  { slug: "home-security", image: "/img/portfolio/portfolio-06.jpg", title: "Home Security", category: "Security" },
];

export interface BlogListPost {
  slug: string;
  image: string;
  day: string;
  month: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  comments: number;
}

export const BLOG_LIST: BlogListPost[] = [
  {
    slug: "comedy-channels-this-week",
    image: "/img/blog/blog-01.jpg",
    day: "10",
    month: "Aug",
    category: "Broadband",
    title: "We newly added some comedy channels this week.",
    excerpt: "Catch the freshest line-up of stand-up specials, late-night shows, and sketch series — now bundled into every VertexStream TV plan.",
    author: "Admin",
    comments: 5,
  },
  {
    slug: "advanced-security-online-device",
    image: "/img/blog/blog-02.jpg",
    day: "07",
    month: "Aug",
    category: "Highspeed",
    title: "Advanced security to protect stay safe online device.",
    excerpt: "From AI-powered intrusion detection to encrypted DNS, learn how our newest router firmware keeps every device on your network safer.",
    author: "Admin",
    comments: 2,
  },
  {
    slug: "internet-speed-online-trading",
    image: "/img/blog/blog-03.jpg",
    day: "04",
    month: "Aug",
    category: "Internet",
    title: "Internet speed for day today online trading.",
    excerpt: "Latency matters more than raw bandwidth when you trade. Here is how VertexLink's low-jitter fiber gives traders the millisecond edge.",
    author: "Admin",
    comments: 4,
  },
  {
    slug: "remote-work-best-practices",
    image: "/img/blog/blog-04.jpg",
    day: "01",
    month: "Aug",
    category: "Lifestyle",
    title: "Remote work best practices for ultra-fast home offices.",
    excerpt: "A practical checklist for setting up a quiet, distraction-free home office on a 1 Gbps connection — from VPN tuning to QoS.",
    author: "Admin",
    comments: 3,
  },
  {
    slug: "fiber-vs-cable-explained",
    image: "/img/blog/blog-05.jpg",
    day: "28",
    month: "Jul",
    category: "Broadband",
    title: "Fiber vs. cable: what actually matters in 2025.",
    excerpt: "Speed, latency, reliability, price — we benchmark the four real-world differences between fiber and cable internet today.",
    author: "Admin",
    comments: 7,
  },
  {
    slug: "smart-home-essentials",
    image: "/img/blog/blog-06.jpg",
    day: "24",
    month: "Jul",
    category: "Lifestyle",
    title: "Five smart-home essentials every VertexLink home should have.",
    excerpt: "A curated list of the smart-home gear that pairs best with our routers — cameras, sensors, voice assistants, and the glue between them.",
    author: "Admin",
    comments: 1,
  },
];

export interface ServiceDetail {
  slug: string;
  title: string;
  intro: string;
  icon: string;
  longDescription: string[];
  bullets: string[];
}

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    slug: "broadband",
    title: "Broadband",
    icon: "/img/icons/icon-01.png",
    intro: "Broadband is a high-speed internet connection that lets you stream, work, and play without buffering.",
    longDescription: [
      "Our broadband network is engineered around symmetric fiber backbones with last-mile redundancy in every metro we serve. The result is a connection that stays fast under load — not just on a speed-test.",
      "Every plan comes with our dual-band Wi-Fi 6 router, unmetered data, and 24/7 expert support. We also bundle a free static IP on business plans for self-hosting servers, VPNs, and home labs.",
    ],
    bullets: ["Symmetric fiber speeds up to 1 Gbps", "Free Wi-Fi 6 router included", "Unmetered data on every plan", "Static IP on business tiers"],
  },
  {
    slug: "wifi-internet",
    title: "WIFI Internet",
    icon: "/img/icons/icon-02.png",
    intro: "Wi-Fi internet lets you connect every device in your home wirelessly without compromising on speed.",
    longDescription: [
      "Our mesh-ready Wi-Fi 6 routers blanket every corner of your home with reliable, low-latency wireless coverage. Add satellite nodes as needed — they auto-discover and self-configure.",
      "Each access point supports 256 concurrent devices, MU-MIMO, and band steering, so smart-home swarms, gaming consoles, and laptops all get their fair share of airtime.",
    ],
    bullets: ["Whole-home Wi-Fi 6 coverage", "Add mesh satellites as needed", "Smart band steering", "Up to 256 connected devices"],
  },
  {
    slug: "vertexstream-tv-box",
    title: "VertexStream TV Box",
    icon: "/img/icons/icon-03.png",
    intro: "A streaming TV Box that brings your favorite shows and movies into one app — bundled into your broadband bill.",
    longDescription: [
      "The VertexStream Box pairs with your subscription apps (Netflix, Prime Video, Disney+, YouTube) and adds a personalised live-TV grid layered over the top.",
      "4K HDR output, voice remote, and Bluetooth audio out for your soundbar — all integrated into a single app with one universal search across every service.",
    ],
    bullets: ["4K HDR streaming", "Voice-control remote", "Universal cross-service search", "Bluetooth audio output"],
  },
  {
    slug: "satellite-tv",
    title: "Satellite TV",
    icon: "/img/icons/icon-04.png",
    intro: "Satellite TV brings a wide range of channels straight to your TV — no matter where you live.",
    longDescription: [
      "Get hundreds of HD channels delivered to your home — even where fiber and cable can not reach. Our 80 cm dish ships pre-aligned for the regional Astra and Hotbird feeds.",
      "Bundle satellite with broadband for a single bill, free installation, and a smart hybrid receiver that mixes satellite channels with internet streaming in one interface.",
    ],
    bullets: ["300+ HD channels", "Works anywhere in the country", "Hybrid receiver (satellite + streaming)", "Free professional installation"],
  },
  {
    slug: "mobile-connection",
    title: "Mobile Connection",
    icon: "/img/icons/icon-05.png",
    intro: "Add a VertexLink Mobile SIM to your broadband — pay one bill, share data across every device.",
    longDescription: [
      "Our 5G mobile plans share their data pool with your home broadband — if you don't use it at home, you use it on the go. No more juggling separate top-ups for every line.",
      "Add up to five SIMs per household, all priced at a steep discount when bundled with broadband. International roaming included in 60+ countries at no extra cost.",
    ],
    bullets: ["Shared data with home broadband", "Up to 5 SIMs per household", "5G coverage nationwide", "Free roaming in 60+ countries"],
  },
  {
    slug: "home-security",
    title: "Home Security",
    icon: "/img/icons/icon-11.png",
    intro: "Protect your home and loved ones with smart, reliable security solutions trusted by thousands.",
    longDescription: [
      "Cameras, motion sensors, smart locks, and a 24/7 monitoring service — all running over your VertexLink router with a dedicated security VLAN that keeps them isolated from your main network.",
      "Get real-time alerts on your phone, watch live feeds with sub-second latency, and grant temporary access codes to trusted visitors — all from one VertexLink Home app.",
    ],
    bullets: ["Smart cameras with AI motion detection", "24/7 professional monitoring", "Smart locks and temporary codes", "Dedicated security VLAN"],
  },
];

export interface PackagePlan {
  name: string;
  speed: string;
  price: string;
  unit: string;
  features: string[];
  highlighted?: boolean;
}

export const PACKAGES: PackagePlan[] = [
  {
    name: "Starter",
    speed: "80 Mbps",
    price: "$45",
    unit: "/mo",
    features: ["80 Mbps download", "20 Mbps upload", "Wi-Fi 6 router included", "Email and chat support"],
  },
  {
    name: "Standard",
    speed: "300 Mbps",
    price: "$65",
    unit: "/mo",
    features: ["300 Mbps download", "100 Mbps upload", "Mesh-ready router", "Priority phone support"],
    highlighted: true,
  },
  {
    name: "Premium",
    speed: "1 Gbps",
    price: "$95",
    unit: "/mo",
    features: ["1 Gbps symmetric", "Static IP included", "24/7 dedicated support", "Free professional install"],
  },
];
