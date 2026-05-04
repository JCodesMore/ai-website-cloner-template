"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/admin/GlassCard";

type Booking = {
  id: string;
  guest: string;
  tour: string;
  date: string;
  guests: number;
  revenue: number;
  source: string;
  status?: "confirmed" | "pending" | "cancelled";
};

type BookingsResponse = {
  configured: boolean;
  setup?: string;
  bookings: Booking[];
  totals?: {
    confirmed: number;
    pending: number;
    revenue_mtd: number;
    revenue_ytd: number;
    upcoming: number;
  };
};

export default function AdminBookingsPage() {
  const [data, setData] = useState<BookingsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then(setData)
      .catch(() =>
        setData({
          configured: false,
          setup: "WeTravel webhook not yet wired. Once /api/webhooks/wetravel is connected, real bookings appear here automatically.",
          bookings: [],
        })
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">BOOKINGS</h1>
        <p className="text-warm-white/40 text-sm font-body">Loading…</p>
      </div>
    );
  }

  const bookings = data?.bookings ?? [];
  const totals = data?.totals;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <h1 className="text-display text-warm-white text-3xl tracking-wide">BOOKINGS</h1>
        <span
          className={`text-[10px] font-body px-3 py-1.5 rounded-sm uppercase tracking-wider border ${
            data?.configured
              ? "bg-teal/20 text-teal-light border-teal/30"
              : "bg-white/[0.04] text-warm-white/50 border-white/10"
          }`}
        >
          {data?.configured ? "Live · WeTravel" : "Webhook pending"}
        </span>
      </div>
      <p className="text-warm-white/40 text-sm font-body mb-10">
        Live reservation feed from WeTravel
      </p>

      {!data?.configured ? (
        <GlassCard className="p-12 text-center">
          <p className="text-warm-white/40 text-sm font-body mb-3 max-w-lg mx-auto leading-relaxed">
            {data?.setup ?? "Bookings will populate here once WeTravel is connected."}
          </p>
          <p className="text-warm-white/30 text-xs font-body italic max-w-md mx-auto">
            Setup: enable webhooks in WeTravel admin → point them at /api/webhooks/wetravel → add WETRAVEL_WEBHOOK_SECRET to Vercel env vars.
          </p>
        </GlassCard>
      ) : (
        <>
          {/* Real totals */}
          {totals && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <StatCard label="Confirmed" value={totals.confirmed} />
              <StatCard label="Pending" value={totals.pending} color="amber" />
              <StatCard label="Upcoming" value={totals.upcoming} />
              <StatCard label="Revenue MTD" value={`$${totals.revenue_mtd.toLocaleString()}`} color="teal" />
              <StatCard label="Revenue YTD" value={`$${totals.revenue_ytd.toLocaleString()}`} color="teal" />
            </div>
          )}

          {bookings.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <p className="text-warm-white/40 text-sm font-body">
                No bookings yet. New WeTravel reservations will land here in real time.
              </p>
            </GlassCard>
          ) : (
            <GlassCard variant="table" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="text-warm-white/30 text-[10px] tracking-[0.2em] uppercase border-b border-teal/10">
                      <th className="text-left p-4">Guest</th>
                      <th className="text-left p-4">Tour</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Guests</th>
                      <th className="text-left p-4">Revenue</th>
                      <th className="text-left p-4">Source</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors">
                        <td className="p-4 text-warm-white/80">{b.guest}</td>
                        <td className="p-4 text-warm-white/60">{b.tour}</td>
                        <td className="p-4 text-warm-white/50">{b.date}</td>
                        <td className="p-4 text-warm-white/50">{b.guests}</td>
                        <td className="p-4 text-teal-light">${b.revenue.toLocaleString()}</td>
                        <td className="p-4 text-warm-white/40 text-xs uppercase tracking-wider">{b.source}</td>
                        <td className="p-4">
                          <span
                            className={`text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider ${
                              b.status === "confirmed"
                                ? "bg-teal/20 text-teal-light"
                                : b.status === "pending"
                                ? "bg-amber-400/20 text-amber-400"
                                : "bg-warm-gray text-warm-white/40"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "default",
}: {
  label: string;
  value: string | number;
  color?: "default" | "teal" | "amber";
}) {
  const valueClass =
    color === "teal" ? "text-teal-light" : color === "amber" ? "text-amber-400" : "text-warm-white";
  return (
    <GlassCard variant="stat" className="p-5">
      <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">{label}</p>
      <p className={`text-display text-3xl ${valueClass} relative z-10`}>{value}</p>
    </GlassCard>
  );
}
