export const SOURCE = "https://www.showlanka.com";
export const ASSETS = "/sites/showlanka";

export type NavLink = { label: string; href: string; external?: boolean };

// Rendered with flex-direction: row-reverse, so the visual order is reversed.
export const mainMenu: NavLink[] = [
  { label: "Contact", href: "/contact" },
  { label: "Travel News", href: "/news-offers" },
  { label: "Tours", href: "/sri-lanka-tours" },
  { label: "Our team & Guides", href: "/meet-your-travel-gurus" },
  { label: "About", href: "/about" },
  { label: "Home", href: "/" },
];

export const heroImages = [
  { src: `${ASSETS}/hero/sigiriya-world-heritage.jpg`, alt: "sigiriya-world-heritage" },
  { src: `${ASSETS}/hero/stilt-fishing-sri-lanka.jpg`, alt: "stilt-fishing-sri-lanka" },
  { src: `${ASSETS}/hero/surfing-srilanka.jpg`, alt: "surfing-srilanka" },
];

export const heroWords = [
  "Your Path to Paradise",
  "Golden Beaches & Coastlines",
  "Ancient Wonders & Heritage",
  "Wild Safaris & Rainforests",
  "Rich Cultural Journeys",
];

export const tripadvisorUrl =
  "https://www.tripadvisor.com/Attraction_Review-g11999643-d13421293-Reviews-Show_Lanka_Tours-Minuwangoda_Western_Province.html";

export const tourRadarIframe =
  "https://www.tourradar.com/iframes/reviews_widget_to/237/0/134495/0/0/0/316/409cd1/1?q";

export const packages = [
  { title: "Group wise tours (2)", image: "group.jpg", query: "group" },
  { title: "All year tours (8)", image: "year.jpg", query: "year" },
  { title: "Family tours (2)", image: "family.jpg", query: "family" },
  { title: "Hot summer tours (13)", image: "summer.jpg", query: "summer" },
  { title: "Most popular tours (17)", image: "popular.jpg", query: "popular" },
  { title: "Private tours (21)", image: "private.jpg", query: "private" },
  { title: "Winter tours (18)", image: "winter.jpg", query: "winter" },
  { title: "Safari tours", image: "safari.jpg", query: "safari" },
  { title: "Day tours", image: "day.jpg", query: "day" },
];

export type Review = {
  name: string;
  date: string;
  dateFull: string;
  stars: number;
  text: string;
};

export const googleReviews: Review[] = [
  {
    name: "Ayondip Dam",
    date: "3 years ago",
    dateFull: "February 17, 2023",
    stars: 5,
    text: "Our Showlanka tour has been nothing but brilliant and we have enjoyed every location, every trek and every waterfall visited! Our tour guide and driver Manju was really lovely and very knowledgable and always tried to ensure we were having a great time. Thank you Showlanka for making our honeymoon so memorable and accommodating all our needs!",
  },
  {
    name: "siro23",
    date: "6 years ago",
    dateFull: "January 11, 2020",
    stars: 5,
    text: "We booked a 12 day tour in Sri Lanka with Show Lanka Tours. We are very satisfied! Everything went smoothly. The program was good structured and was well distributed during our stay. The driver (Mr. Manjula) was a really likable guy, always gentle, helpful and very knowledgeable with regards to all the location that we visited. Actually for us he was not just a driver, but also a tourguide and friend. We recommend him 100%!",
  },
  {
    name: "Haridas pangayil",
    date: "6 years ago",
    dateFull: "November 7, 2019",
    stars: 3,
    text: "Good Place",
  },
  {
    name: "Vishnu Harikumar",
    date: "7 years ago",
    dateFull: "April 9, 2019",
    stars: 5,
    text: "Mr. Janaka and his team provide the best service Definitely Recommend. Reasonable rates and Best services. The Guide provided also was best. Mr. Gayan.",
  },
  {
    name: "RM",
    date: "8 years ago",
    dateFull: "August 24, 2018",
    stars: 5,
    text: "We have just returned from a three-week trip in Sri Lanka and Showlanka Tours contributed heavily to this great experience. We were amazed how smoothly everything went. We recommend booking with Showlanka Tours because of the great service they provide: flexible itinerary during the trip (we changed our schedule and the hotels because of bad weather three times at zero costs), cleanliness of the car and the hotels they booked for us, great English skills of the driver, safety while driving (which can be quite tricky given the way some people drive there-or rather we are just not used to it), friendliness, positive mindset and love for their own country... At this point, we also would like to thank Mr Suranga, who was our driver, for literally everything.",
  },
  {
    name: "amna mirza",
    date: "8 years ago",
    dateFull: "July 13, 2018",
    stars: 5,
    text: "One great trip with showlanka. Everything was well taken care. Our driver Mr. Suranga was very decent and well mannered person. I went with friends for a time out and sure we did not have to worry about any thing. Everything was so well managed by them.",
  },
  {
    name: "Johannes Sim",
    date: "8 years ago",
    dateFull: "May 26, 2018",
    stars: 5,
    text: "We can recommend showlanka! Everything went smoothly. Especially our guide Manjula was fantastic! He is such a good driver and even through the heavy rain he kept calm and drove safely. He is well informed and we got new inputs. I was really touched and surprised that he remembered my birthday and came with flowers in the morning! So nice!! We highly recommend Showlanka and Manjula!",
  },
  {
    name: "Jennifer Weber",
    date: "8 years ago",
    dateFull: "May 23, 2018",
    stars: 5,
    text: "Based on the good reviews on the internet, we decided to travel with SHOW LANKA TOURS. We requested the car service only, as we had planned an individual route. To get straight to the point: We are 100% satisfied with our decision for SHOW LANKA TOURS and especially with our driver Suranga. There is nothing to complain about. The following points are particularly worth to mention: Travel planning and preparation ⦁\tFriendly and personal contact ⦁\tQuick response on Emails ⦁\tCompetent and helpful ⦁\tProfessional, non-binding and extremely flexible trip planning ⦁\tNo hidden costs (all costs [tolls, parking fees etc.] were included in the package) Service ⦁\tPayment at the airport (in cash) or in advance (bank transfer) ⦁\tPersonal and warm welcome on arrival at the airport ⦁\tLocal mobile phone for 24h communication with the driver provided free of charge ⦁\tJust in case, umbrella, scarf (for the temples) etc. were available in the vehicle free of charge Driver (Suranga) ⦁\tVery friendly and always in a good temper ⦁\tExtremely helpful ⦁\tVery good English ⦁\tSolution-oriented in case of problems ⦁\tVery flexible ⦁\tSympathetic ⦁\tAlways strives for the well-being of the guests ⦁\tCommunicative, but never intrusive ⦁\tPredictive and comfortable style of driving ⦁\tAlways on time and reliable Tranfers / vehicle ⦁ Transfer from and to Colombo airport ⦁ Large and comfortable vehicle, fully air conditioned ⦁ Vehicle was cleaned on a daily base - very clean and well maintained condition We had a great holiday and will definitely go back to Sri Lanka, of course with SHOW LANKA TOURS and hopefully with Suranga as our driver :)",
  },
  {
    name: "SyMa 1907",
    date: "8 years ago",
    dateFull: "May 16, 2018",
    stars: 5,
    text: "We spent 15 wonderful days in Sri Lanka together with our driver Suranga from Showlanka Tours.  Our trip: Galle-Tangalle-Tissa-Haputale-Nuwara Eliya-Kandy-Sigirya-Anuradhapura-Negombo. It was our first trip with a private chauffeur and it was a good experience. In other destinations we prefer to drive on our own, but in Sri Lanka it is really advisable to have a local driver. With Suranga we always felt safe, independent how crazy the other drivers were.  He was always on time (even on short notice), well prepared concerning our itinerary and also helpful in arranging additional tours (like Yala Safari or Village Tour). In this regard we never had the feeling that he brought us to places just for getting commissions. Suranga had a good English knowledge and we were happy to have many interesting chats with him about religion, local life etc. He was always polite and cautious and provide a good balance between taking care of us and giving sufficient leeway. The booking of the tour with Mr. Janaka, owner of Showlanka Tours, was very easy. We planned our tour on our own, sent our itinerary to Showlanka Tours and asked for an offer and comments and/or recommendations. Mr. Janaka was very prompt in his replies, answered our questions and made a professional and well-priced offer. We booked all hotels on our own which was accepted without any problems. We appreciate that Mr. Janaka managed also the booking of train tickets in 3rd class from Nuwara Eliya to Kandy. Another plus was that Showlanka Tours provided a mobile for us so that we could easily communicate which Suranga during the tour. As not optimal we perceived that we had to pay the whole amount for the tour in cash by arriving at the airport. Knowing the company only by internet reviews (even when these all are positive), it causes a bit of an uncertain feeling… We would have preferred to pay 50% on arrival and 50% at the end or a least in the half term of the trip, but this suggestion was not accepted. Nevertheless, we were very satisfied with Showlanka Tours and with the communication with Mr. Janaka for the organisation in advance. A special thanks goes to Suranga who contributed a lot to make our holidays great!",
  },
];

export const footerMenus: { label: string; links: NavLink[] }[] = [
  {
    label: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About us", href: "/about" },
      { label: "Inspirational customer talks", href: "/real-traveler-stories" },
      { label: "Help desk", href: "/about#our-team" },
      { label: "Guides", href: "/meet-your-travel-gurus#our-guides" },
      { label: "Ground flow support", href: "/meet-your-travel-gurus#ground-support" },
      { label: "Sweet Bonanza", href: "/sweet-bonanza" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Travel News", href: "/news-offers" },
      { label: "Terms and conditions", href: "/terms-and-conditions" },
      { label: "Entrance fee", href: `${ASSETS}/uploads/2024/07/Entrance-fee-2024-2.pdf`, external: true },
      { label: "B2B Business", href: "/about#b2b-business" },
      { label: "Sri Lankan visa", href: "https://www.immigration.gov.lk/pages_e.php?id=61" },
      {
        label: "Travel insurance",
        href: "https://www.travelinsurance.com/travel-insurance-quotes/?utm_source=papcpc&a_aid=638566e896202&a_bid=a755b3fe&data1=usn_bestoverall&data2=blank",
      },
    ],
  },
  {
    label: "Tour categories",
    links: [
      { label: "Summer tours", href: "/sri-lanka-tours?summer" },
      { label: "Winter tours", href: "/sri-lanka-tours?winter" },
      { label: "Group wise tours", href: "/sri-lanka-tours?group" },
      { label: "Day tours", href: "/sri-lanka-tours?day" },
      { label: "Safari tours", href: "/sri-lanka-tours?safari" },
      { label: "Ramayana Yatra", href: "/ramayana-yatra" },
      { label: "All year adventures", href: "/sri-lanka-tours?year" },
      { label: "Family adventure", href: "/sri-lanka-tours?family" },
    ],
  },
];

export const partnerLogos = [
  { href: "https://www.tourradar.com/o/showlanka-tours", src: "tourradar.webp", alt: "tour radar" },
  { href: tripadvisorUrl, src: "tripadvisor.png", alt: "trip advisor" },
  { href: "https://olami.org/", src: "olami.png", alt: "olami" },
  { href: "https://srilankacaranddriverhire.com/business-directory/show-lanka-tours/", src: "driver.png", alt: "sri lanka drivers" },
  { href: "https://www.edeltrips.com/reiseberichte/sri-lanka/", src: "edeltrips.webp", alt: "edel trips" },
  { href: "https://www.touristlink.com/user/showlanka-tours.html", src: "touristlink.png", alt: "tourist link" },
  { href: "https://www.thrillophilia.com/", src: "thrillophilia.png", alt: "thrillophilia" },
];
