# LeadingCards Page Topology

## Site Overview
LeadingCards.com — Secure virtual cards for media buyers & advertisers. Built with Webflow. Uses GSAP + Splide for animations.

## Page Sections (top to bottom)

### 1. Navbar (fixed, z-999)
- **Type:** Fixed position navigation bar
- **Interaction:** Static layout with dropdown for language selector
- **Content:** Logo (left), Nav links (center: Our Partners, Blog, Contact us), Auth buttons (right: Sign in, Sign up), Language dropdown (ENG)
- **Background:** Transparent, sits over dark hero

### 2. Hero / Home Header
- **Type:** Full-width dark section with card slider
- **Background:** Deep purple (#180425) with gooey filter effect, clip-path cutout at top for navbar
- **Content:**
  - Heading: "Trusted cards for advertising"
  - Subheading: "Our cards work flawlessly with major advertising platforms..."
  - CTA: "Open Account" green button
  - Social proof: "Trusted | 100+ businesses" line with line separators
  - Card slider: 4 banking card SVGs in an auto-scrolling Splide carousel
  - Pattern overlay at bottom
- **Interaction:** Splide auto-scroll slider for cards
- **Radius:** 28px border-radius on wrapper

### 3. Integrations Section
- **Type:** Content section showing platform compatibility
- **Content:**
  - "Pay for all your business services from one platform"
  - "Clearly organized, managed in one place"
  - Grid of integration icons: OpenAI, Midjourney, Netflix, DigitalOcean, Amazon, Airbnb, Spotify
  - "Connect to Apple Pay" footer
- **Layout:** Grid of icons positioned absolutely over a relative container
- **Background:** White/light

### 4. Features Section (video cards grid)
- **Type:** Multi-card feature showcase with embedded videos
- **Content:**
  - Section header: "Everything to Ensure the Best Experience"
  - 6 feature cards in a grid:
    1. Wide choice of BINs (large card with video)
    2. Analytics & Reports (small card)
    3. 3DS Support (small card)
    4. Dedicated Support Team (small card)
    5. Convenient Customization (small card)
    6. Instant Issuance (large card with video, mobile variants)
  - Each card has an icon, title, optional description, and some have autoplay videos
- **Layout:** Grid: first row = 1 large + 3 small, then small cards row, then large card
- **Videos:** 6 autoplay looping muted videos (desktop + mobile variants)

### 5. Team Interface Section
- **Type:** Full-width feature section with video
- **Content:**
  - "Our team interface is for collaboration"
  - "Easily create teams, assign roles to new members, and manage users..."
  - Full-width video showing team interface demo
- **Layout:** Text centered above, video below
- **Video:** Team member management demo (autoplay, loop, muted)

### 6. Partners Section
- **Type:** Grid of partner cards with popup modals
- **Content:**
  - "Our charging solutions come from trusted partners"
  - 9 partner cards in 4-column grid:
    - Octo Browser, Dolphin Anty, AdsPower, Mostbet Partners, ADxAD, Everad, ClickAdilla, Admobispy, PrimeAds
  - Each card opens a popup modal with details, promo code, and "Get bonus" CTA
  - "More Partners" button
- **Interaction:** Click card → popup modal with partner details
- **Background:** #f7f7f7 (gray-10)

### 7. Video CTA Section
- **Type:** Dark CTA card with 3D cards video background
- **Content:**
  - "Ready to power up your media buying? Let's make it happen!"
  - "Open Account" button
- **Background:** Deep purple with 3D card animation video and dot pattern overlay
- **Video:** 3D rotating cards (autoplay, loop)

### 8. Reviews Section
- **Type:** Horizontal scrolling review cards (Trustpilot)
- **Content:**
  - "Reviews from Trustpilot"
  - 3 review cards (colored borders: blue, green, pink):
    1. Elsa Finance, Romania - 5 stars
    2. Виктор Ларичев, Israel - 5 stars
    3. Sergei Kashaev, Cyprus - 5 stars
- **Layout:** Horizontal slider/scroll
- **Styling:** Each card has colored top border accent

### 9. FAQ Section
- **Type:** Accordion FAQ section
- **Content:**
  - "Our Frequently asked questions"
  - 4 questions:
    1. How do I get started?
    2. Which platforms do your cards work with?
    3. What top-up methods are available?
    4. Can I choose the billing address on the card?
- **Interaction:** Click-driven accordion, icon rotates on expand
- **Background:** #fcfcfd (gray-20) with rounded wrapper
- **Layout:** FAQ cards + decorative circle element

### 10. Contact / Still Have Questions
- **Type:** CTA section with background image
- **Content:**
  - "Still have questions?"
  - "Contact us" button (black)
  - WhatsApp and Telegram contact links
- **Background:** Abstract purple/dark background image

### 11. Newsletter CTA
- **Type:** Dark CTA bar
- **Content:**
  - "Unlock exclusive perks! Subscribe & Supercharge your ad spend"
  - Email input + Subscribe button (or links to Typeform)
- **Background:** Purple gradient/dark with dot pattern

### 12. Footer
- **Type:** Site footer with links and social
- **Content:**
  - Logo, nav links (Blog, Our partners, Contact us)
  - Social icons (Facebook, Instagram, LinkedIn, Telegram)
  - Copyright: "© LeadingCards 2025"
  - Legal links: Privacy Policy, Terms of Condition, KYC & AML Policy
- **Layout:** Two rows separated by decorative HR with dots

## Z-Index Layers
1. z-999: Navbar (fixed)
2. z-999: Partner popup modals (fixed overlay)
3. z-1: Content sections
4. z-n1: Background videos/patterns (behind content)

## Global Interactions
- GSAP + Observer for scroll-based animations
- Splide for card carousels
- Auto-scrolling integration icons
- FAQ accordion toggle
- Partner modal open/close
