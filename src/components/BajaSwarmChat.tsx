"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { WaterDroplet } from "@/components/WaterDroplet";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "What's the closest airport?",
  "Tell me about the rooms",
  "What can I do in La Ventana?",
  "I want to book a room",
];

const STORAGE_KEY = "baja-swarm-chat-v2";
const DEFAULT_BOOKING_URL = "https://hotels.cloudbeds.com/reservation/rmDkzN";

// Phrases that signal the user wants to book — auto-pop the booking CTA
const BOOKING_INTENT_RE =
  /\b(book|booking|reserve|reservation|i want to (?:book|stay|reserve)|how do i book|check availability|stay (?:there|here)|make a reservation|secure (?:a|my) (?:room|spot|bed)|hold a room|sign me up)\b/i;

export function BajaSwarmChat({
  bookingUrl = DEFAULT_BOOKING_URL,
  apiPath = "/api/chat",
  storageKey = STORAGE_KEY,
}: {
  /** Where the booking-intent CTA sends users */
  bookingUrl?: string;
  /** Backend chat endpoint */
  apiPath?: string;
  /** sessionStorage key — change per-site to keep histories separate */
  storageKey?: string;
} = {}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [bookingOffered, setBookingOffered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore conversation history per session
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setMessages(parsed.messages || []);
        setBookingOffered(parsed.bookingOffered || false);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ messages, bookingOffered }),
      );
    } catch {
      // ignore
    }
  }, [messages, bookingOffered]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  function goToBooking() {
    // Track the conversion + redirect
    try {
      window.localStorage.setItem("baja-swarm-last-booking-redirect", new Date().toISOString());
    } catch {}
    window.location.href = bookingUrl;
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setInput("");

    const newMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(newMessages);

    // Booking-intent check — if user said something book-y, offer the redirect
    if (BOOKING_INTENT_RE.test(trimmed) && !bookingOffered) {
      setBookingOffered(true);
      // Skip Claude — answer directly with a booking CTA
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Awesome — let's get you set up. The booking page opens dates and availability live (secure checkout via Cloudbeds). Want me to take you there now?",
        },
      ]);
      return;
    }

    setStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        acc += chunk;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      }

      // Post-stream: also re-check the assistant's reply for booking offer
      if (BOOKING_INTENT_RE.test(acc) && !bookingOffered) {
        setBookingOffered(true);
      }
    } catch (e) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content:
            "Sorry — I'm having trouble right now. WhatsApp the team directly at **+52 612 120 8803** and they'll get back to you fast.",
        };
        return next;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      {/* Floating button — bottom-LEFT (WhatsApp keeps bottom-right) */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Baja Swarm chat" : "Open Baja Swarm chat"}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#7ECBE6] to-[#2D7A99] shadow-[0_8px_28px_rgba(45,122,153,0.45)] hover:shadow-[0_14px_36px_rgba(45,122,153,0.55)] transition-shadow"
      >
        {!open && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#9CCB6F] ring-2 ring-white animate-pulse" />
        )}
        <WaterDroplet size={42} animated={!open} />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-28 left-6 z-40 flex flex-col w-[360px] sm:w-[400px] max-h-[640px] h-[75vh] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-[#7ECBE6] to-[#2D7A99] text-white p-4">
              <div className="bg-white/20 rounded-full p-1.5">
                <WaterDroplet size={32} animated={true} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base leading-tight">Baja Swarm</h3>
                <p className="text-xs text-white/85 leading-tight">
                  Ask anything about the hostel or La Ventana
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-white/80 hover:text-white p-1"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50">
              {messages.length === 0 && (
                <>
                  <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm p-3 text-sm text-zinc-700 max-w-[85%] leading-relaxed">
                    Hey! I&apos;m the Baja Swarm helper for La Ventana Hostel. Ask me anything about
                    the rooms, the area, the cats — whatever you&apos;re curious about.
                  </div>
                  <div className="space-y-2 pt-2">
                    {SUGGESTED.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="block w-full text-left text-sm text-[#2D7A99] bg-white border border-[#7ECBE6]/40 hover:bg-[#7ECBE6]/10 rounded-xl px-3 py-2 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-[#2D7A99] text-white rounded-br-sm"
                      : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm"
                  }`}
                >
                  {m.content || (
                    <span className="inline-flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" />
                      <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </span>
                  )}
                </div>
              ))}

              {/* Booking CTA — appears after the user expresses booking intent */}
              {bookingOffered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-br from-[#7ECBE6]/10 to-[#2D7A99]/10 border border-[#2D7A99]/30 rounded-2xl p-4 mt-2"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#2D7A99] font-semibold mb-2">
                    Ready to book?
                  </p>
                  <button
                    onClick={goToBooking}
                    className="w-full bg-[#2D7A99] hover:bg-[#1f5b73] text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Take me to booking
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setBookingOffered(false)}
                    className="w-full mt-2 text-xs text-zinc-500 hover:text-zinc-700"
                  >
                    Not yet — keep chatting
                  </button>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-zinc-200 bg-white p-3 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                disabled={streaming}
                className="flex-1 text-sm bg-zinc-100 rounded-full px-4 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7ECBE6]/60 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                aria-label="Send message"
                className="bg-[#2D7A99] hover:bg-[#1f5b73] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full p-2.5 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>

            {/* Powered-by footer */}
            <div className="border-t border-zinc-200 bg-white px-3 py-1.5 text-center">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                Powered by{" "}
                <span className="text-[#2D7A99] font-semibold">Baja Swarm</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
