"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: "🚀",
    title: "Fully custom-built.",
    description:
      "We don't use cookie-cutter templates. Every system is designed around your exact workflow and integrated with the tools you already use.",
  },
  {
    icon: "💬",
    title: "Hands-free operations.",
    description:
      "Once live, your system runs without babysitting. We monitor, maintain, and improve it as your business grows.",
  },
  {
    icon: "🛡️",
    title: "Connected across platforms.",
    description:
      "Whether it's your CRM, inbox, spreadsheet, or project tool — we make everything talk to each other.",
  },
];

type AppIcon = {
  label: string;
  bg: string;
  top?: string; left?: string; right?: string; bottom?: string;
  logo: React.ReactNode;
};

const APP_ICONS: AppIcon[] = [
  {
    label: "Airtable", bg: "#fff",
    top: "11%", left: "7%",
    logo: (
      <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
        {/* Yellow top block */}
        <path d="M24 4L44 13.5L24 23L4 13.5Z" fill="#FCB400"/>
        {/* Cyan right block */}
        <path d="M25.5 25.5V44.5L44 36V17L25.5 25.5Z" fill="#18BFFF"/>
        {/* Red left block */}
        <path d="M22.5 25.5L4 17V36L22.5 44.5V25.5Z" fill="#F82B60"/>
      </svg>
    ),
  },
  {
    label: "HubSpot", bg: "#fff",
    top: "9%", right: "8%",
    logo: (
      <svg viewBox="0 0 56 56" width="30" height="30" fill="none">
        {/* HubSpot sprocket icon */}
        {/* Center circle */}
        <circle cx="28" cy="30" r="8" fill="#FF7A59"/>
        {/* Ring */}
        <circle cx="28" cy="30" r="13" stroke="#FF7A59" strokeWidth="3.5" fill="none"/>
        {/* Top stem + dot */}
        <line x1="28" y1="17" x2="28" y2="10" stroke="#FF7A59" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="28" cy="7" r="4" fill="#FF7A59"/>
        {/* Right stem + dot */}
        <line x1="41" y1="30" x2="48" y2="30" stroke="#FF7A59" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="51" cy="30" r="4" fill="#FF7A59"/>
        {/* Bottom-left stem + dot */}
        <line x1="19.8" y1="40.2" x2="14" y2="46" stroke="#FF7A59" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="11" cy="49" r="4" fill="#FF7A59"/>
      </svg>
    ),
  },
  {
    label: "Slack", bg: "#fff",
    top: "44%", left: "3%",
    logo: (
      <svg viewBox="0 0 54 54" width="28" height="28">
        <path d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386" fill="#36C5F0"/>
        <path d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387" fill="#2EB67D"/>
        <path d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386" fill="#ECB22E"/>
        <path d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.249m14.336 0v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.249a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387" fill="#E01E5A"/>
      </svg>
    ),
  },
  {
    label: "Gmail", bg: "#fff",
    top: "44%", right: "3%",
    logo: (
      <svg viewBox="0 0 48 48" width="28" height="28">
        <path fill="#EA4335" d="M6 40h6V22.5L4 17v20c0 1.65 1.35 3 2 3z"/>
        <path fill="#34A853" d="M36 40h6c.65 0 2-1.35 2-3V17l-8 5.5z"/>
        <path fill="#FBBC05" d="M36 10v12.5l8-5.5V11c0-3.69-4.21-5.8-7.14-3.57z"/>
        <path fill="#EA4335" d="M12 22.5V10l12 8 12-8v12.5L24 30z"/>
        <path fill="#C5221F" d="M4 11v6l8 5.5V10L9.14 7.43C6.21 5.2 4 7.31 4 11z"/>
      </svg>
    ),
  },
  {
    label: "n8n", bg: "#EA4B71",
    bottom: "13%", left: "8%",
    logo: (
      <svg viewBox="0 0 48 48" width="28" height="28" fill="none">
        <rect width="48" height="48" rx="10" fill="#EA4B71"/>
        <text x="24" y="33" textAnchor="middle" fontSize="18" fontWeight="900" fontFamily="Arial,sans-serif" fill="white">n8n</text>
      </svg>
    ),
  },
  {
    label: "Notion", bg: "#fff",
    bottom: "13%", right: "8%",
    logo: (
      <svg viewBox="0 0 100 100" width="26" height="26">
        <rect width="100" height="100" rx="15" fill="white"/>
        <path d="M23.5 18.5c3.8 3.1 5.2 2.9 12.3 2.4l66.8-4c1.4 0 1.5-.7.4-1.1L91.3 8c-2.3-1.8-5.3-3.8-11.1-3.3L16.4 9.5c-2.4.2-2.8 1.4-1.9 2.3l9 6.7z" fill="#1a1a1a"/>
        <path d="M27 29.3v62.6c0 3.3 1.6 4.6 5.3 4.3l73.2-4.2c3.7-.2 4.6-2.4 4.6-5.1V24.5c0-2.7-1.1-4.1-3.5-3.9l-76 4.3c-2.6.2-3.6 1.5-3.6 4.4z" fill="#1a1a1a"/>
        <path d="M31 30.2l69.8-4v56.5L31 86.8V30.2z" fill="white"/>
        <path d="M68.5 35.5L53 36.4v4.5l5.3-.3v29.8l-5.3.3v4.5l21.2-1.2v-4.5l-5.7.3V35.5z" fill="#1a1a1a"/>
        <path d="M36 37.2l12.5 28.6-12.5 1.5V37.2z" fill="#1a1a1a"/>
        <path d="M36 37.2l21 29.6v-29l-21-.6z" fill="#1a1a1a"/>
      </svg>
    ),
  },
];

// Telegram-style messages — FLO bot in a Telegram group
type Msg = { id: number; from: "bot" | "user"; text: string; time: string; reactions?: string };

const MESSAGES: Msg[] = [
  { id: 1,  from: "bot",  text: "🔔 New lead from Typeform\n**Sarah Chen** · sarah@acme.co\nSource: Paid Ads",           time: "9:41 AM" },
  { id: 2,  from: "bot",  text: "✅ Contact enriched\nRole: Head of Ops · Acme Corp (120 staff)\nLead score: **84/100**", time: "9:41 AM", reactions: "🔥 2" },
  { id: 3,  from: "user", text: "Create deal and send proposal",                                                          time: "9:42 AM" },
  { id: 4,  from: "bot",  text: "📋 Deal created in Pipedrive\nStage: Proposal → Value: $12,000",                         time: "9:42 AM" },
  { id: 5,  from: "bot",  text: "📧 Proposal sent to sarah@acme.co ✓",                                                    time: "9:42 AM" },
  { id: 6,  from: "bot",  text: "📁 Notion project page created\n#acme-corp-onboarding",                                  time: "9:43 AM", reactions: "✅ 1" },
  { id: 7,  from: "bot",  text: "💬 #new-clients notified in Slack ✓\nGoogle Sheets tracker updated ✓",                  time: "9:43 AM" },
  { id: 8,  from: "user", text: "Nice. Schedule a follow-up for Friday.",                                                  time: "9:44 AM" },
  { id: 9,  from: "bot",  text: "📅 Follow-up task created\nFriday 10:00 AM · Assigned to you ✓",                        time: "9:44 AM", reactions: "👍 1" },
];

function renderText(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={i}>
        {i > 0 && <br />}
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={j} style={{ fontWeight: 700, color: "oklch(1 0 0 / 0.95)" }}>{part.slice(2, -2)}</strong>
            : <span key={j}>{part}</span>
        )}
      </span>
    );
  });
}

function TelegramPhone() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleCount >= MESSAGES.length) {
      const t = setTimeout(() => setVisibleCount(0), 3000);
      return () => clearTimeout(t);
    }
    setTyping(true);
    const delay = MESSAGES[visibleCount]?.from === "bot" ? 1000 : 650;
    const t = setTimeout(() => {
      setTyping(false);
      setVisibleCount((n) => n + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [visibleCount]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount, typing]);

  const shown = MESSAGES.slice(0, visibleCount);

  return (
    <div
      style={{
        width: "192px",
        height: "380px",
        borderRadius: "34px",
        background: "#1c1c1e",
        border: "2px solid rgba(255,255,255,0.12)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 28px 56px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Dynamic island */}
      <div style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", width: "76px", height: "22px", borderRadius: "11px", background: "#000", zIndex: 10 }} />

      {/* Status bar */}
      <div style={{ position: "absolute", top: "40px", left: "14px", right: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <span style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>9:41</span>
        <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
          {[3,5,7,9].map((h,i)=>(
            <div key={i} style={{ width:"2.5px", height:`${h}px`, borderRadius:"1px", background: i<3?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.2)" }}/>
          ))}
          <div style={{ width:"16px", height:"8px", border:"1.5px solid rgba(255,255,255,0.45)", borderRadius:"2px", marginLeft:"3px", display:"flex", alignItems:"center", padding:"1px" }}>
            <div style={{ width:"65%", height:"100%", background:"#34c759", borderRadius:"1px" }}/>
          </div>
        </div>
      </div>

      {/* Telegram header */}
      <div style={{ position:"absolute", top:"58px", left:0, right:0, background:"#1f2937", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"8px 10px", display:"flex", alignItems:"center", gap:"8px", zIndex:5 }}>
        {/* Avatar */}
        <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"linear-gradient(135deg,#2AABEE,#229ED9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", flexShrink:0, color:"#fff", fontWeight:700 }}>
          ⚙
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.95)", margin:0, lineHeight:1.2 }}>FLO Bot</p>
          <p style={{ fontSize:"8px", color:"#2AABEE", margin:0, lineHeight:1.2 }}>{typing ? "typing..." : "bot"}</p>
        </div>
        {/* Telegram search icon */}
        <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>🔍</span>
      </div>

      {/* Telegram wallpaper + messages */}
      <div
        ref={scrollRef}
        style={{
          position:"absolute",
          top:"98px",
          bottom:"42px",
          left:0,
          right:0,
          overflowY:"auto",
          padding:"8px 8px 4px",
          display:"flex",
          flexDirection:"column",
          gap:"4px",
          background:"#0e1621",
          scrollbarWidth:"none",
        }}
      >
        {shown.map((msg) => {
          const isSelf = msg.from === "user";
          return (
            <div key={msg.id} style={{ display:"flex", flexDirection:"column", alignItems: isSelf ? "flex-end" : "flex-start", animation:"msgIn 200ms cubic-bezier(0.16,1,0.3,1) both" }}>
              <div
                style={{
                  maxWidth:"86%",
                  padding:"5px 8px 14px",
                  borderRadius: isSelf ? "10px 10px 3px 10px" : "10px 10px 10px 3px",
                  background: isSelf ? "#2b5278" : "#182533",
                  position:"relative",
                }}
              >
                <p style={{ fontSize:"9.5px", color:"rgba(255,255,255,0.88)", margin:0, lineHeight:1.55, fontWeight:400 }}>
                  {renderText(msg.text)}
                </p>
                {/* Time */}
                <span style={{ position:"absolute", bottom:"3px", right:"7px", fontSize:"7.5px", color:"rgba(255,255,255,0.35)", whiteSpace:"nowrap" }}>
                  {msg.time}{isSelf ? " ✓✓" : ""}
                </span>
              </div>
              {/* Reactions */}
              {msg.reactions && (
                <div style={{ fontSize:"9px", background:"rgba(255,255,255,0.06)", borderRadius:"10px", padding:"2px 6px", marginTop:"2px", color:"rgba(255,255,255,0.6)" }}>
                  {msg.reactions}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display:"flex", alignItems:"flex-start" }}>
            <div style={{ padding:"7px 10px", borderRadius:"10px 10px 10px 3px", background:"#182533", display:"flex", gap:"3px", alignItems:"center" }}>
              {[0,1,2].map(i=>(
                <div key={i} style={{ width:"4px", height:"4px", borderRadius:"50%", background:"rgba(255,255,255,0.4)", animation:`typingDot 1s ease-in-out ${i*0.2}s infinite` }}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Telegram input bar */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"42px", background:"#1f2937", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", padding:"0 8px", gap:"6px" }}>
        <span style={{ fontSize:"14px", color:"rgba(255,255,255,0.3)" }}>😊</span>
        <div style={{ flex:1, height:"24px", borderRadius:"12px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.07)" }}/>
        <span style={{ fontSize:"14px", color:"rgba(255,255,255,0.3)" }}>🎤</span>
      </div>

      <style>{`
        @keyframes msgIn {
          from { opacity:0; transform:translateY(5px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes typingDot {
          0%,60%,100% { transform:translateY(0); opacity:0.4; }
          30% { transform:translateY(-3px); opacity:1; }
        }
      `}</style>
    </div>
  );
}

function PhoneWithIcons() {
  return (
    <div
      style={{
        position:"relative",
        width:"100%",
        maxWidth:"460px",
        height:"420px",
        borderRadius:"20px",
        background:"oklch(0.19 0.006 106)",
        border:"1px solid oklch(1 0 0 / 0.08)",
        overflow:"hidden",
        flexShrink:0,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
      }}
    >
      {/* Floating app icons */}
      {APP_ICONS.map((icon, i) => (
        <div
          key={icon.label}
          style={{
            position:"absolute",
            top: icon.top,
            left: icon.left,
            right: icon.right,
            bottom: icon.bottom,
            width:"48px",
            height:"48px",
            borderRadius:"12px",
            background: icon.bg,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            boxShadow:"0 4px 20px rgba(0,0,0,0.5)",
            animation:`floatIcon ${3 + i * 0.35}s ease-in-out ${i * 0.55}s infinite`,
            zIndex:2,
            border: icon.bg === "#fff" ? "1px solid rgba(0,0,0,0.07)" : "none",
            userSelect:"none",
          }}
          title={icon.label}
        >
          {icon.logo}
        </div>
      ))}

      {/* Glow */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"180px", height:"180px", borderRadius:"50%", background:"oklch(0.567 0.15 248 / 0.07)", filter:"blur(40px)", zIndex:1, pointerEvents:"none" }}/>

      {/* Phone */}
      <div style={{ zIndex:3, position:"relative" }}>
        <TelegramPhone />
      </div>

      <style>{`
        @keyframes floatIcon {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-9px); }
        }
      `}</style>
    </div>
  );
}

export function PersonalAgentSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
          {/* Left panel */}
          <div className="flex justify-center md:justify-start" style={{ flex:"0 0 auto", width:"100%", maxWidth:"460px" }}>
            <PhoneWithIcons />
          </div>

          {/* Right text */}
          <div className="flex flex-col" style={{ flex:1 }}>
            <p style={{ fontSize:"14px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"oklch(0.95 0.15 108)", marginBottom:"12px" }}>
              Your automation system
            </p>
            <h2 style={{ fontSize:"clamp(32px, 5vw, 48px)", fontWeight:800, color:"oklch(1 0 0 / 0.9)", lineHeight:1.1, marginBottom:"16px" }}>
              Meet FLO
            </h2>
            <p style={{ fontSize:"17px", color:"oklch(1 0 0 / 0.6)", marginBottom:"32px", lineHeight:1.6, maxWidth:"400px" }}>
              A custom-built system that handles the repetitive work — intake, routing, follow-up, and reporting — so your team can focus on what matters.
            </p>

            <div className="flex flex-col gap-6 mb-8">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <span style={{ fontSize:"18px", marginTop:"2px", flexShrink:0 }}>{f.icon}</span>
                  <p style={{ fontSize:"15px", color:"oklch(1 0 0 / 0.78)", lineHeight:1.6, margin:0 }}>
                    <strong style={{ fontWeight:700, color:"oklch(1 0 0 / 0.92)" }}>{f.title}</strong>{" "}{f.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <a href="/signup" style={{ display:"inline-flex", alignItems:"center", backgroundColor:"oklch(0.95 0.15 108)", color:"oklch(0.217 0.0038309 106.715)", fontSize:"15px", fontWeight:700, padding:"0 24px", height:"44px", borderRadius:0, textDecoration:"none" }}>
                Build My System
              </a>
              <a href="/docs" style={{ display:"inline-flex", alignItems:"center", backgroundColor:"oklch(0.285 0 0)", color:"oklch(1 0 0 / 0.9)", fontSize:"15px", fontWeight:700, padding:"0 24px", height:"44px", borderRadius:0, border:"1px solid oklch(1 0 0 / 0.1)", textDecoration:"none" }}>
                How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
