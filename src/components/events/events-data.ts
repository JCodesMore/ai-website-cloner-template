export interface EventItem {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string; // ISO date, e.g. "2026-10-06"
  time: string;
  location: string;
}

export const eventTags = [
  "Workshop",
  "CTF",
  "Social",
  "Beginner",
  "Guest Speaker",
];

export const events: EventItem[] = [
  {
    slug: "intro-to-ctf",
    title: "Intro to Capture the Flag",
    description:
      "New to security? Start here. We'll walk through your first CTF challenges together, covering the basics of recon, web, and crypto categories.",
    tags: ["Workshop", "Beginner"],
    date: "2026-10-06",
    time: "6:00 PM",
    location: "USU Room 205",
  },
  {
    slug: "web-exploitation-night",
    title: "Web Exploitation Night",
    description:
      "Hands-on session covering SQL injection, XSS, and broken auth against a deliberately vulnerable web app. Bring a laptop.",
    tags: ["Workshop", "CTF"],
    date: "2026-10-13",
    time: "6:00 PM",
    location: "USU Room 205",
  },
  {
    slug: "guest-speaker-pentester",
    title: "Guest Speaker: Life as a Pentester",
    description:
      "An alum currently working as a penetration tester walks through a typical engagement, how they broke into the field, and takes questions.",
    tags: ["Guest Speaker"],
    date: "2026-10-20",
    time: "6:00 PM",
    location: "ECS 301",
  },
  {
    slug: "ctf-qualifiers",
    title: "CSULBreach CTF Qualifiers",
    description:
      "Our internal qualifier round to pick the team representing CSULBreach at the regional CTF. Solo or teams of two.",
    tags: ["CTF"],
    date: "2026-10-27",
    time: "5:00 PM",
    location: "ECS 301",
  },
  {
    slug: "general-meeting-pizza",
    title: "General Meeting + Pizza",
    description:
      "Club updates, upcoming event planning, and free pizza. Come meet the officers and other members — no experience needed.",
    tags: ["Social", "Beginner"],
    date: "2026-11-03",
    time: "6:00 PM",
    location: "USU Room 205",
  },
  {
    slug: "reverse-engineering-basics",
    title: "Reverse Engineering Basics",
    description:
      "Intro to reading disassembly and using Ghidra to analyze a compiled binary and find a hidden flag.",
    tags: ["Workshop"],
    date: "2026-11-10",
    time: "6:00 PM",
    location: "ECS 301",
  },
];
