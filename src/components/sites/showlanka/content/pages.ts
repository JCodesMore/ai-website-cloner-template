// Content for the showlanka.com sub-pages. Structure, headings, names, numbers, images and
// links follow the source. Long-form copy is condensed and rewritten for the clone rather
// than reproduced; showlanka.com remains the authoritative text.

export type Hero = { image: string; alt: string; title?: string; subtitle?: string };

export const toursPage = {
  seoTitle: "Explore Sri Lanka with Show Lanka Tours - Sri Lanka tour operators | Show Lanka tours",
  description:
    "Discover Sri Lanka's top destinations with Show Lanka Tours. Custom tour packages featuring cultural, adventure, and wildlife experiences.",
  hero: {
    image: "2024/05/st-clair-waterfall.jpg",
    alt: "",
    title: "Sri Lanka Tour Packages – Custom Holidays for Every Traveler",
    subtitle: "Group Tours, Private Trips & Tailor-Made Itineraries Across Sri Lanka",
  } satisfies Hero,
  heading: "Custom Sri Lanka Tour Packages",
  intro:
    "Browse our private and small-group itineraries across Sri Lanka — beaches, ancient cities, tea country, wildlife parks and rainforest. Filter by tour type, length or travel month, then open any package for the day-by-day plan, prices and route map.",
  categories: [
    { value: "year", label: "All Year" },
    { value: "family", label: "family" },
    { value: "group", label: "Group wise tours" },
    { value: "summer", label: "Hot summer" },
    { value: "popular", label: "Most popular" },
    { value: "private", label: "Private tours" },
    { value: "safari", label: "Safari" },
    { value: "transfers", label: "Transfers" },
    { value: "winter", label: "Winter" },
  ],
  dayRanges: [
    { value: "1, 3", label: "From 1 to 3 days" },
    { value: "4, 7", label: "From 4 to 7 days" },
    { value: "8, 10", label: "From 8 to 10 days" },
    { value: "11, 15", label: "From 11 to 15 days" },
    { value: "16, 27", label: "From 16 to 27 days" },
  ],
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const coupons = [
  "2024/07/Two-Free.png",
  "2024/07/Two-Free-2.png",
  "2024/07/Shipping.png",
  "2024/07/Its-Giveaway-Time-1.png",
  "2024/07/Shipping-1.png",
  "2024/07/High-tea.png",
  "2024/07/Shipping-3.png",
  "2024/07/Shipping-2.png",
  "2024/07/Nanu-Oya-Ella-1.png",
];

export const bonanzaPage = {
  seoTitle: "Sweet Bonanza - Sri Lanka tour operators | Show Lanka tours",
  description:
    "Unlock amazing travel experiences with our exclusive Sweet Bonanza coupon! These special offers are designed to make your dream vacation more affordable and unforgettable. Don't miss out—redeem your Sweet Bonanza coupon today and start your journey to extraordinary destinations!",
  hero: { image: "2024/05/Lotus_tower-scaled.jpg", alt: "Lotus tower Sri Lanka" } satisfies Hero,
  heading: "Exclusive Sri Lanka Bonanza Deals",
  intro:
    "Unlock amazing travel experiences with our exclusive Sweet Bonanza coupon! These special offers are designed to make your dream vacation more affordable and unforgettable. Don’t miss out—redeem your Sweet Bonanza coupon today and start your journey to extraordinary destinations!",
};

export const aboutPage = {
  seoTitle: "Show Lanka Tours: Crafting Unforgettable Journeys in Sri Lanka",
  description: "About Show Lanka Tours, a local Sri Lanka tour operator founded in 2002.",
  hero: {
    image: "2024/07/difference_20between_20mission_20and_20vision.webp",
    alt: "vision mission and our tourism",
    title: "About Show Lanka Tours – Sri Lanka's Trusted Local Tour Operator",
    subtitle: "Personalized Sri Lanka Holidays Crafted by Local Travel Experts",
  } satisfies Hero,
  heading: "Discover Sri Lanka Tours & Travel Experiences",
  intro:
    "Show Lanka Tours is a small, locally run operator. We plan journeys around the people taking them and favour responsible travel that keeps your spending in local hands.",
  story: {
    title: "How it all begins",
    image: "2024/07/016-640x360.jpg",
    paragraphs: [
      "Founder Janaka Wanniarachchi started out in 2002 as a tourist driver at Bandaranaike International Airport, learning the trade through tour operators and travel agents and meeting travellers from all over the world.",
      "The job meant long hours and little fairness in how work was handed out. After an unjust run-in at the airport, he decided to leave and build something better on his own terms.",
      "He founded Show Lanka Tours on 3 December 2002 with a simple aim: treat every guest personally and look after their comfort and safety for the whole journey.",
      "That founding idea — hospitality first, and a trip that goes beyond expectations — still shapes how the company works today.",
    ],
  },
  vision: [
    {
      title: "Building Partnerships",
      icon: "handshake" as const,
      text: "We are working towards a catalogue of 50 adventure-focused packages and are growing a network of suppliers, operators and agents to deliver them. Partnership enquiries are welcome at",
      email: "showlankareservationsdpt@gmail.com",
    },
    {
      title: "Creating New Adventures & Group Tours",
      icon: "hiking" as const,
      text: "Many visitors only see the best-known sights. We want to open up lesser-known places too, with practical information and affordable small-group tours that make them easy to reach.",
    },
    {
      title: "Enhancing Customer Care & Benefits",
      icon: "smile" as const,
      text: "Our help desk and ground team follow each trip from arrival to departure and step in quickly when something goes wrong. Confirmed private bookings also receive Sweet Bonanza vouchers worth $10 to $100.",
    },
  ],
  b2b: {
    text: "We partner with businesses on hotel reservations, visas, car rental and land packages across Sri Lanka. For partnership opportunities, contact",
    email: "showlankareservationsdpt@gmail.com",
  },
};

export const team = [
  { name: "Janaka Wanniarachchi", image: "2024/07/Untitled-design-11.png", role: "Founder and Senior coodinator" },
  { name: "P A Nimalika", image: "2024/07/Untitled-design-13.png", role: "Hotel reservation & senior coordinator" },
  { name: "T D Abhimani", image: "2024/07/Untitled-design-15.png", role: "Tour consultant" },
  { name: "T M R D Wijesinghe", image: "2024/07/Untitled-design-8.png", role: "Transport executive" },
];

export const teamIntro =
  "A tour coordinator will get in touch soon after you send a request. For anything urgent, message us on WhatsApp at +94 77 914 4664.";

export const gurusPage = {
  seoTitle: "Meet the Show Lanka Tours Team - Your Travel Experts",
  description: "Meet the Show Lanka Tours ground support team and chauffeur guides.",
  hero: {
    image: "2024/06/239062_639cd2783b15c.jpg",
    alt: "Leopard in wilpattu",
    title: "Meet Your Sri Lanka Travel Experts – Guides & Drivers",
    subtitle: "Experienced, English-Speaking Local Guides Dedicated to Every Journey",
  } satisfies Hero,
  heading: "Meet Your Sri Lanka Travel Experts",
  intro: "Behind every trip is an office team that plans it and a guide who travels it with you.",
  support: {
    title: "Ground Floor Support Team",
    text: "Our support desk keeps in touch with you and your guide throughout the tour.",
    points: [
      { title: "Daily Updates and Communication", text: " — we check in every day to make sure the plan is working for you." },
      { title: "Swift Solutions for Unexpected Situations", text: " — delays, weather or health issues are handled quickly, with alternatives arranged on the spot." },
      { title: "Dedicated Team Support", text: " — a named coordinator is reachable throughout your stay." },
    ],
  },
  guidesTitle: "Your Trusted Tour Guides",
  guidesIntro: "Our chauffeur guides are licensed, English-speaking locals, most with two decades on Sri Lanka's roads.",
  guidesWhyTitle: "Why Our Guides Stand Out:",
  guidesWhy: [
    { title: "Vast Experience and Expertise", text: " — long experience with the island's history, culture and wildlife." },
    { title: "Excellent Communication Skills", text: " — clear English, with several guides speaking a second European language." },
    { title: "Personalized Itineraries", text: " — stops and timings adjusted to your interests along the way." },
    { title: "Dedicated and Friendly Service", text: " — safe driving and genuine care for guests." },
    { title: "Proactive Problem Solvers", text: " — practical fixes when plans change." },
  ],
};

export const guides = [
  { name: "Manjula", image: "2024/07/IMG-20240720-WA0011-640x360.jpg", languages: "English", years: "More than 20 years", vehicle: "Car", seats: "3" },
  { name: "Bandara", image: "2024/07/IMG-20240720-WA0017-576x360.jpg", languages: "English", years: "More than 20 years", vehicle: "Car/ SUV", seats: "4" },
  { name: "Chamara", image: "2024/07/Chamara-4-640x360.jpg", languages: "English", years: "More than 15 years", vehicle: "Van", seats: "6" },
  { name: "Udaya Nishantha", image: "2024/07/udaya-1-640x360.jpg", languages: "English/ Italy", years: "More than 20 years", vehicle: "Car", seats: "3" },
  { name: "Alahakoon", image: "2024/07/Alaha-4-640x360.jpg", languages: "English/ German", years: "More than 20 years", vehicle: "Car/ SUV", seats: "4" },
  { name: "Ruwan", image: "2024/07/Ruwan-640x360.jpg", languages: "English", years: "More than 20 years", vehicle: "Car", seats: "3" },
  { name: "Senaka", image: "2024/07/Senaka-1-640x360.jpg", languages: "English", years: "More than 20 years", vehicle: "Van", seats: "7" },
  { name: "Thushara", image: "2024/07/Thushara-1-640x360.jpg", languages: "English", years: "More than 15 years", vehicle: "Car", seats: "3" },
  { name: "Manoj", image: "2024/07/Manoj-7-640x360.jpg", languages: "English", years: "More than 20 years", vehicle: "Car/ SUV", seats: "5" },
  { name: "Niran", image: "2024/07/Niran-3-640x360.jpg", languages: "English", years: "More than 20 years", vehicle: "Car", seats: "3" },
  { name: "Ruwan", image: "2024/07/40-640x360.jpg", languages: "English", years: "More than 20 years", vehicle: "Van", seats: "6" },
  { name: "Sarath", image: "2024/07/IMG-20240327-WA0003-640x360.jpg", languages: "English", years: "More than 5 years", vehicle: "Van/ SUV", seats: "5" },
  { name: "Sudesh", image: "2024/07/WhatsApp-Image-2024-06-01-at-13.15.57-640x360.jpeg", languages: "English/Tamil", years: "More than 20 years", vehicle: "Van", seats: "7" },
];

export const storiesPage = {
  seoTitle: "Real Traveler Reviews and Testimonials | Sri Lanka tour guides",
  description: "Video stories from travellers who toured Sri Lanka with Show Lanka Tours.",
  hero: { image: "2024/08/Yala.jpg", alt: "Leopard family in Yala" } satisfies Hero,
  heading: "Sri Lanka Travel Stories & Real Experiences",
  intro:
    "Hear it from the people who travelled with us. These short videos were recorded by guests during and after their trips — press play to watch here, or open them on YouTube.",
  videosTitle: "Watch Real Traveler Video Stories",
  videos: [
    { label: "video review", image: "2024/08/review-pic2-640x360.png", id: "Szkym8CIPes", url: "https://www.youtube.com/watch?v=Szkym8CIPes&list=PLglAFGJWHrBducvofQ0pYZ9lj8-SpQA2D" },
    { label: "review 9", image: "2024/08/review-pic7-640x360.png", id: "uKPsmHbQlI0", url: "https://www.youtube.com/watch?v=uKPsmHbQlI0" },
    { label: "video review8", image: "2024/08/review-pic6-1-640x360.png", id: "A4pQkMlzkCU", url: "https://www.youtube.com/watch?v=A4pQkMlzkCU" },
    { label: "girls trips sri lanka", image: "2024/08/review-pic5-1-640x360.png", id: "vYHIUpg_9OY", url: "https://www.youtube.com/watch?v=vYHIUpg_9OY" },
    { label: "happy lady", image: "2024/08/review-pic5-640x360.png", id: "Dm9Prc17XUM", url: "https://www.youtube.com/watch?v=Dm9Prc17XUM" },
    { label: "happy tourist", image: "2024/08/review-pic4-640x360.png", id: "Br5Q3JlrC08", url: "https://www.youtube.com/watch?v=Br5Q3JlrC08" },
    { label: "customer talk", image: "2024/08/review-pic3-640x360.png", id: "vRQWo_Do0nw", url: "https://www.youtube.com/watch?v=vRQWo_Do0nw" },
    { label: "Happy customer", image: "2024/08/review-pic-640x360.png", id: "Szkym8CIPes", url: "https://www.youtube.com/watch?v=Szkym8CIPes&list=PLglAFGJWHrBducvofQ0pYZ9lj8-SpQA2D" },
    { label: "Mr. Ayondip's Review of Our Services", image: "2024/05/review-640x360.jpg", id: "tX3n8Bav9XM", url: "https://www.youtube.com/watch?v=tX3n8Bav9XM" },
  ],
};

export const faqPage = {
  seoTitle: "Show Lanka Tours - Frequently Asked Questions (FAQ)",
  description: "Answers to common questions about travelling in Sri Lanka with Show Lanka Tours.",
  hero: { image: "2024/05/arugambay.jpg", alt: "Arugambay beach Sri Lanka" } satisfies Hero,
  faqs: [
    { q: "Who will pick up the travelers from the airport arrival terminal?", a: "Our airport representative meets you in the arrivals hall holding a name board and introduces you to the chauffeur guide who will stay with you for the whole tour." },
    { q: "If my flight gets delayed, how do I catch my taxi?", a: "Send a WhatsApp message to +94 779 144 664 as soon as you know, and we will rearrange the pickup." },
    { q: "If my travel dates change, is my airport transfer still free?", a: "The free transfer applies to your booked arrival date; arriving on another day carries an extra charge." },
    { q: "If my travel dates change, how much is the cost per day for my accommodation?", a: "It depends on the hotel category you choose — tell us your dates and we will quote." },
    { q: "How can I change my itinerary during my journey?", a: "The agreed overnight stops stay fixed, but you can swap sightseeing stops along the route. Switching hotels mid-trip is possible, though the original booking is not refunded." },
    { q: "What are the best network connections in Sri Lanka covering all locations?", a: "Dialog, Mobitel, Airtel and Hutch all operate island-wide; Hutch is a good choice for travellers. SIM cards are sold at the airport." },
    { q: "How much does food cost and is it very spicy?", a: "Expect roughly $10–12 for a restaurant meal. Local food is often spicy, and small local eateries are much cheaper." },
    { q: "Can I pay in foreign currency for archaeological site and national park entrances?", a: "The big archaeological sites such as Sigiriya, Polonnaruwa and Anuradhapura take foreign currency, but national parks only accept rupees — carry both." },
    { q: "Where is the best place to change my foreign currency?", a: "Use the bank counters in the airport arrivals hall or licensed changers in the main towns." },
    { q: "Can I use my credit or debit card at local sites?", a: "Not reliably — several major sites and most parks and rainforests are cash only, although private activity operators often take cards. Keep cash with you." },
    { q: "Where can I withdraw cash in Sri Lanka?", a: "ATMs in every town accept Visa and MasterCard." },
    { q: "I am a woman traveling solo. What do I need to know?", a: "Sri Lanka is generally safe for solo women. Hike with others where possible, stay aware of your surroundings, avoid empty beach-town streets late at night and let your driver know where you are going." },
    { q: "Can I climb Adam's Peak by myself anytime during the year?", a: "The pilgrimage season, from the December to the May full moon, is the best and busiest time, so you are rarely alone on the path. Outside it the trail is quiet and the weather harder." },
    { q: "What clothes should I bring?", a: "Temperatures run from about 15°C in the hills to 36°C on the coast. Pack a warm layer for Nuwara Eliya and clothes that cover knees and shoulders for temples." },
    { q: "Do I need to bring leech socks for the rainforest?", a: "Leeches are common in Sinharaja, but leech socks can be hired cheaply there." },
    { q: "How can I rent a 4×4 jeep for safari tours?", a: "Your guide will book an experienced safari jeep driver; the price depends on the jeep type and how long you spend in the park." },
    { q: "What are the most beautiful beaches during the winter period?", a: "In winter the south coast is at its best — Mirissa, Tangalle, Hikkaduwa and Bentota." },
    { q: "What are the most beautiful beaches during the summer period?", a: "In summer head east, where the sea is calmer: Nilaveli, Uppuveli, Pasikuda, and Arugam Bay for surfing." },
    { q: "What are the most beautiful train rides in Sri Lanka? How do I book train journeys?", a: "Kandy to Ella and Nanu Oya to Ella are the classic scenic rides. Tickets open a month before travel, so ask us to book early." },
    { q: "How do I upgrade my hotel list?", a: "Mention it when you first enquire; we will suggest upgraded hotels and quote the difference before you book." },
    { q: "I'm a solo traveler. How can I join mini group tours?", a: "Check the group tour dates on our site, then contact a coordinator to confirm a seat." },
  ],
};

export const termsPage = {
  seoTitle: "Terms and conditions - Sri Lanka tour operators | Show Lanka tours",
  description: "Booking, payment, cancellation and refund terms for Show Lanka Tours.",
  hero: { image: "2024/06/beach-5812300_1920.jpg", alt: "Sri Lanka beach" } satisfies Hero,
  note: "Summary of the terms. The binding wording is published on showlanka.com.",
  sections: [
    {
      title: "1) Booking Confirmation & Payment",
      items: [
        "Confirm a package by emailing a passport scan and, if available, your flight ticket; hotels are booked within five business days and an invoice follows.",
        "Pay by bank transfer, starting with a 30% advance.",
        "If arrival is less than 10 days after confirmation, pay in full.",
        "Otherwise settle the balance within 21 days or the booking lapses.",
        "Bank charges are the client's; exchange rates are fixed at booking. Card payments are not taken in person.",
      ],
    },
    {
      title: "2) Group Booking Payments (10 or More Persons)",
      items: [
        "A 50% advance is due within 10 business days of confirmation.",
        "Pay in full if arrival is less than 10 days away.",
        "The balance is due within 21 days; a lapsed booking forfeits a 10% service charge.",
      ],
    },
    {
      title: "3) Cancellation Procedure",
      items: [
        "Cancel by email. 30+ days' notice: full refund less bank charges.",
        "21–30 days: 10% fee. 14–21 days: 50%. 7–14 days: 75%.",
        "Under 7 days, or a no-show on arrival: 100%.",
      ],
    },
    {
      title: "4) Accommodation Adjustments",
      items: [
        "Hotels cannot be changed once reservations are confirmed, unless you give at least 21 days' notice; otherwise the original charges stand.",
        "If a hotel cannot honour a booking, an equivalent alternative is arranged.",
      ],
    },
    {
      title: "5) Changes in Itineraries",
      items: [
        "Itinerary changes are possible if you cover any extra cost.",
        "Overnight destinations stay fixed; only the route and en-route stops can change.",
      ],
    },
    {
      title: "6) Refunding Methods",
      items: ["Refunds are paid by bank transfer within 30 business days, less the charges above, at the booking-date exchange rate."],
    },
    {
      title: "7) Group Tour Payments & Refunds",
      items: [
        "Advertised group prices exclude 18% hotel tax. Reserve a seat with a 30% advance after a seat number is issued; a confirmation letter follows.",
        "The balance is due within 21 days. Private rooms cost extra, and section 3 applies to cancellations.",
      ],
    },
    {
      title: "8) Important Notice for Group Tour",
      items: [
        "Group tours start at Colombo Airport on the scheduled day; late arrivals can join next morning at the Colombo hotel (Ramayana Yatra group).",
        "Every listed stop is visited, but you may skip any of them. Travellers who disrupt the group may be asked to leave without refund.",
      ],
    },
    {
      title: "9) Sweet Bonanza Coupons",
      items: ["Confirmed private bookings receive one or two vouchers worth $10–$100, chosen by the company and emailed to you. Your guide helps redeem them for selected services."],
    },
    {
      title: "10) Emergency Situations",
      items: ["If a government-declared emergency prevents entry, the full payment is refunded within 90 business days of an emailed cancellation."],
    },
    {
      title: "11) Acceptance of Terms",
      items: ["Paying for any package or custom itinerary means you accept these terms."],
    },
  ],
};

export const contactPage = {
  seoTitle: "Contact Show Lanka Tours - Your Trusted Sri Lanka Tour Operator",
  description: "Get in touch with Show Lanka Tours to plan your Sri Lanka trip.",
  hero: {
    image: "2024/06/beach-5812300_1920.jpg",
    alt: "",
    title: "Contact Show Lanka Tours – Plan Your Sri Lanka Trip",
    subtitle: "Get a Custom Quote or Speak With Our Local Travel Team Today",
  } satisfies Hero,
  heading: "Plan Your Sri Lanka Adventure",
  map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.456283350695!2d79.92425197400065!3d7.188662492816533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2e57b0f2ed167%3A0x3174de459e53eb80!2sShowlanka%20Tours!5e0!3m2!1sen!2slk!4v1721912794397!5m2!1sen!2slk",
  hotelCategories: ["5 Stars", "4 Stars", "2/3 Stars", "Comfort", "High Budget"],
};
