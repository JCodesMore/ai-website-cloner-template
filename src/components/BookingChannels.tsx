import { Globe, Code2, Search, Share2, Mic, Smartphone } from "lucide-react";

interface Channel {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  badgeFont?: string;
}

const channels: Channel[] = [
  {
    icon: <Globe size={26} style={{ color: "#00c8d4" }} />,
    iconBg: "rgba(0,200,212,0.12)",
    title: "Your Own Booking Website",
    description:
      "Get a dedicated booking page at yourname.simplybook.me or your custom domain. Fully branded and mobile-optimized.",
    badge: "simplybook.me/yourname",
    badgeBg: "#e8f8ff",
    badgeColor: "#00c8d4",
    badgeFont: "monospace",
  },
  {
    icon: <Code2 size={26} style={{ color: "#ff6c50" }} />,
    iconBg: "rgba(255,108,80,0.1)",
    title: "Booking Widget for Your Site",
    description:
      "Embed a booking button or full widget on your existing website with a single line of JavaScript. Works with any CMS.",
    badge: "</> Add to your website",
    badgeBg: "#fff0ed",
    badgeColor: "#ff6c50",
  },
  {
    icon: <Search size={26} style={{ color: "#4285F4" }} />,
    iconBg: "rgba(66,133,244,0.1)",
    title: "Reserve with Google",
    description:
      "Let customers book directly from Google Search and Google Maps. The 'Book Now' button appears right in your Google Business Profile.",
    badge: "Google Search & Maps",
    badgeBg: "#e8f0fe",
    badgeColor: "#4285F4",
  },
  {
    icon: <Share2 size={26} style={{ color: "#1877F2" }} />,
    iconBg: "rgba(24,119,242,0.1)",
    title: "Social Media Bookings",
    description:
      "Turn your Facebook Page and Instagram profile into booking hubs. Add booking buttons directly to your social profiles.",
    badge: "Facebook + Instagram",
    badgeBg: "#e8f0fe",
    badgeColor: "#1877F2",
  },
  {
    icon: <Mic size={26} style={{ color: "#6b5ce7" }} />,
    iconBg: "rgba(107,92,231,0.1)",
    title: "AI Voice Booking",
    description:
      "Let clients book by speaking naturally. The AI assistant understands their request and guides them to the right service and time slot.",
    badge: "Powered by AI",
    badgeBg: "#f0f0ff",
    badgeColor: "#6b5ce7",
  },
  {
    icon: <Smartphone size={26} style={{ color: "#00b894" }} />,
    iconBg: "rgba(0,184,148,0.1)",
    title: "Branded Client App",
    description:
      "Offer clients a personalized, branded mobile app. They can book, rebook, buy gift cards, and manage appointments on the go.",
    badge: "iOS & Android",
    badgeBg: "#e8fff8",
    badgeColor: "#00b894",
  },
];

export function BookingChannels() {
  return (
    <section style={{ background: "white", padding: "96px 0" }}>
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}
      >
        {/* Section header */}
        <div className="text-center">
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#ff6c50",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "12px",
            }}
          >
            BOOKING CHANNELS
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              color: "#1a1d4f",
              margin: "0 auto 20px",
              maxWidth: "640px",
              lineHeight: 1.15,
            }}
          >
            Accept bookings from everywhere
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: "#626b8a",
              lineHeight: 1.7,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Meet your clients where they are. SimplyBook.me makes it easy to
            accept appointments from all your channels — 24/7, with no
            back-and-forth.
          </p>
        </div>

        {/* Channel cards grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "24px", marginTop: "64px" }}
        >
          {channels.map((channel) => (
            <div
              key={channel.title}
              style={{
                background: "#f4f7ff",
                borderRadius: "16px",
                padding: "32px 28px",
                border: "1px solid #dde3f0",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: channel.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                {channel.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#1a1d4f",
                  marginBottom: "10px",
                }}
              >
                {channel.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "15px",
                  color: "#626b8a",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {channel.description}
              </p>

              {/* Badge */}
              <span
                style={{
                  display: "inline-block",
                  marginTop: "12px",
                  background: channel.badgeBg,
                  color: channel.badgeColor,
                  borderRadius: "4px",
                  padding: "4px 10px",
                  fontFamily: channel.badgeFont ?? "inherit",
                  fontSize: "12px",
                  fontWeight: channel.badgeFont ? 400 : 600,
                }}
              >
                {channel.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
