export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  dateLabel: string;
  author: string;
  readingTime: string;
  image: string;
  imageAlt: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-time-to-see-orcas-sea-of-cortez",
    title: "When Is the Best Time to See Orcas in the Sea of Cortez?",
    description:
      "April through June is peak season for orca encounters near La Ventana, Baja California Sur. Here's exactly when to come, what behaviors to expect, and how to plan your trip.",
    date: "2026-04-08",
    dateLabel: "April 8, 2026",
    author: "Bajablue Team",
    readingTime: "6 min read",
    image: "/images/tours/master-seafari.jpg",
    imageAlt: "Pod of orcas swimming in the Sea of Cortez near Cerralvo Island during peak season",
    tags: ["Orcas", "Wildlife", "Planning"],
  },
  {
    slug: "what-to-expect-first-ocean-safari",
    title: "What to Expect on Your First Ocean Safari in La Ventana",
    description:
      "A complete walkthrough of a Bajablue day-trip Ocean Safari — what to bring, the typical schedule, what wildlife you'll likely see, and how to prepare physically and mentally.",
    date: "2026-03-22",
    dateLabel: "March 22, 2026",
    author: "Bajablue Team",
    readingTime: "8 min read",
    image: "/images/tours/ocean-safari.jpg",
    imageAlt: "Snorkelers preparing for a Bajablue Ocean Safari from a panga in La Ventana bay",
    tags: ["Tours", "First-timers", "Planning"],
  },
  {
    slug: "sea-of-cortez-worlds-aquarium",
    title: "Why Jacques Cousteau Called the Sea of Cortez \"The World's Aquarium\"",
    description:
      "The Sea of Cortez holds 39% of the world's marine mammal species and over 800 fish species. Here's the science, the history, and why this place is so extraordinary.",
    date: "2026-02-14",
    dateLabel: "February 14, 2026",
    author: "Bajablue Team",
    readingTime: "7 min read",
    image: "/images/gallery/hd-1.jpg",
    imageAlt: "Sea of Cortez near La Ventana, Baja California Sur",
    tags: ["Wildlife", "Science", "UNESCO"],
  },
];
