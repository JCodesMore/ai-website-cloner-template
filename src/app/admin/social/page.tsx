"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/admin/GlassCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from "recharts";

type IGLive =
  | { configured: false; message: string; setupSteps: string[] }
  | {
      configured: true;
      account: { followers_count: number; media_count: number; username: string; name: string; profile_picture_url?: string; biography?: string };
      posts: Array<{ id: string; caption?: string; mediaUrl?: string; permalink: string; timestamp: string; likes: number; comments: number; engagement: number; type: string }>;
      avgEngagement: number;
      engagementRate: number;
    };

const followerGrowth = [
  { month: "Oct", ig: 3200, fb: 520 },
  { month: "Nov", ig: 3450, fb: 545 },
  { month: "Dec", ig: 3600, fb: 560 },
  { month: "Jan", ig: 3800, fb: 580 },
  { month: "Feb", ig: 4000, fb: 600 },
  { month: "Mar", ig: 4150, fb: 625 },
  { month: "Apr", ig: 4313, fb: 645 },
];

const contentMix = [
  { name: "Reels", value: 60, color: "#4A9DB2" },
  { name: "Carousels", value: 25, color: "#36859A" },
  { name: "Static", value: 15, color: "#1A3A4A" },
];

const engagementByType = [
  { type: "Reels", likes: 340, comments: 28, shares: 45 },
  { type: "Carousels", likes: 180, comments: 15, shares: 12 },
  { type: "Static", likes: 95, comments: 8, shares: 5 },
  { type: "Stories", likes: 0, comments: 0, shares: 22 },
];

const weeklyPosts = [
  { week: "W1", posts: 3 },
  { week: "W2", posts: 4 },
  { week: "W3", posts: 5 },
  { week: "W4", posts: 3 },
  { week: "W5", posts: 4 },
  { week: "W6", posts: 4 },
  { week: "W7", posts: 2 },
  { week: "W8", posts: 4 },
];

const pillarDistribution = [
  { name: "Encounter", value: 40, color: "#4A9DB2" },
  { name: "Guest", value: 20, color: "#FFF9F0" },
  { name: "Guide", value: 15, color: "#FBBF24" },
  { name: "Life", value: 15, color: "#C084FC" },
  { name: "Proof", value: 10, color: "#F472B6" },
];

const GlassTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color?: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs font-body">
      <p className="text-warm-white/60 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#4A9DB2" }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function AdminSocialPage() {
  const [live, setLive] = useState<IGLive | null>(null);

  useEffect(() => {
    fetch("/api/social/instagram")
      .then((r) => r.json())
      .then((d) => setLive(d));
  }, []);

  return (
    <div>
      <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">SOCIAL MEDIA</h1>
      <p className="text-warm-white/40 text-sm font-body mb-10">Live Instagram data + content strategy metrics</p>

      {/* LIVE Instagram Graph API section */}
      {live && live.configured === false && (
        <GlassCard variant="warning" className="p-6 mb-8">
          <h2 className="text-amber-400 text-base font-body font-medium mb-3">Live Instagram data — setup pending</h2>
          <p className="text-warm-white/60 text-sm font-body mb-4">{live.message}</p>
          <ol className="space-y-2 text-sm font-body text-warm-white/70">
            {live.setupSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-teal-light font-medium flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </GlassCard>
      )}

      {live && live.configured === true && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-teal-light animate-pulse" />
            <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase">Live data · Instagram Graph API</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <GlassCard variant="stat" className="p-5">
              <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">@{live.account.username}</p>
              <p className="text-display text-3xl text-warm-white relative z-10">{live.account.followers_count.toLocaleString()}</p>
              <p className="text-warm-white/40 text-xs font-body mt-1 relative z-10">followers</p>
            </GlassCard>
            <GlassCard variant="stat" className="p-5">
              <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Posts</p>
              <p className="text-display text-3xl text-warm-white relative z-10">{live.account.media_count.toLocaleString()}</p>
            </GlassCard>
            <GlassCard variant="stat" className="p-5">
              <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Avg. Engagement</p>
              <p className="text-display text-3xl text-warm-white relative z-10">{live.avgEngagement.toLocaleString()}</p>
              <p className="text-warm-white/40 text-xs font-body mt-1 relative z-10">likes + comments / post</p>
            </GlassCard>
            <GlassCard variant="stat" className="p-5">
              <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Engagement Rate</p>
              <p className="text-display text-3xl text-teal-light relative z-10">{live.engagementRate}%</p>
            </GlassCard>
          </div>

          {live.posts.length > 0 && (
            <GlassCard className="p-6 mb-8">
              <h3 className="text-warm-white text-sm font-body font-medium mb-4">Recent posts · sorted by engagement</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[...live.posts]
                  .sort((a, b) => b.engagement - a.engagement)
                  .slice(0, 8)
                  .map((p) => (
                    <a
                      key={p.id}
                      href={p.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-stat p-0 overflow-hidden rounded-sm hover:opacity-90 transition-opacity"
                    >
                      {p.mediaUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.mediaUrl} alt="" className="w-full aspect-square object-cover" />
                      )}
                      <div className="p-3 relative z-10">
                        <p className="text-warm-white/70 text-xs font-body">
                          <span className="text-teal-light">{p.likes.toLocaleString()} likes</span>
                          <span className="ml-2 text-warm-white/50">{p.comments} comments</span>
                        </p>
                        <p className="text-warm-white/30 text-[10px] font-body mt-1">
                          {new Date(p.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </a>
                  ))}
              </div>
            </GlassCard>
          )}
        </>
      )}

      <div className="my-10 border-t border-teal/10 pt-8">
        <p className="text-warm-white/40 text-[10px] font-body tracking-[0.3em] uppercase mb-6">Strategy Reference (from posting-strategy.md)</p>
      </div>

      {/* Content strategy + Pillars */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <GlassCard className="p-6">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Posting Strategy</h3>
          <div className="space-y-3 text-sm font-body">
            <InfoRow label="Frequency" value="5 posts/week (post-algorithm rewrite)" />
            <InfoRow label="Content Mix" value="70% Reels, 20% Carousels, 10% Static/Stories" />
            <InfoRow label="Best Time" value="6-8 PM CST" />
            <InfoRow label="Hashtag Sets" value="3 rotating (8-10 niche tags each)" />
            <InfoRow label="Cross-promo" value="Weekly IG Collab with @laventanahostel" />
            <InfoRow label="Every Reel CTA" value="Send this to your dive buddy (drives DM shares)" />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Content Pillar Split</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={pillarDistribution} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                {pillarDistribution.map((entry, i) => <Cell key={i} fill={entry.color} opacity={0.8} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 justify-center">
            {pillarDistribution.map((c) => (
              <span key={c.name} className="text-[9px] font-body text-warm-white/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: c.color }} />
                {c.name} {c.value}%
              </span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recommended platforms */}
      <GlassCard className="p-6">
        <h3 className="text-warm-white text-sm font-body font-medium mb-4">Recommended Platforms (Not Active)</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <PlatformCard name="TikTok" reason="Perfect for marine wildlife reels. First-mover in niche. Zero competitors on TikTok." priority="high" />
          <PlatformCard name="YouTube" reason="Long-form expedition footage. The team has 8-12 min raw video. Repurpose into channel content." priority="medium" />
          <PlatformCard name="Google Business" reason="Created, pending phone verification. Enables Maps visibility + reviews." priority="high" />
        </div>
      </GlassCard>
    </div>
  );
}

function AccountCard({ platform, handle, followers, posts, engagement, status, adSpend }: {
  platform: string; handle: string; followers: string; posts: string; engagement: string; status: string; adSpend: string;
}) {
  return (
    <GlassCard variant="stat" className="p-6">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-warm-white text-sm font-body font-medium">{platform}</h3>
          <p className="text-teal-light text-xs font-body">{handle}</p>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider ${
          status === "active" ? "bg-teal/20 text-teal-light" : "bg-amber-400/20 text-amber-400"
        }`}>{status}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center relative z-10">
        <div><p className="text-display text-xl text-warm-white">{followers}</p><p className="text-warm-white/30 text-[9px] font-body uppercase">Followers</p></div>
        <div><p className="text-display text-xl text-warm-white">{posts}</p><p className="text-warm-white/30 text-[9px] font-body uppercase">Posts</p></div>
        <div><p className="text-display text-xl text-warm-white">{engagement}</p><p className="text-warm-white/30 text-[9px] font-body uppercase">Engage</p></div>
      </div>
      <p className="text-warm-white/30 text-xs font-body mt-4 border-t border-white/[0.05] pt-3 relative z-10">Ads: {adSpend}</p>
    </GlassCard>
  );
}

function PlatformCard({ name, reason, priority }: { name: string; reason: string; priority: string }) {
  return (
    <div className="bg-white/[0.03] p-4 rounded-sm">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-warm-white text-sm font-body font-medium">{name}</h4>
        <span className={`text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider ${
          priority === "high" ? "bg-amber-400/20 text-amber-400" : "bg-warm-gray text-warm-white/40"
        }`}>{priority}</span>
      </div>
      <p className="text-warm-white/40 text-xs font-body leading-relaxed">{reason}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1 border-b border-white/[0.05]">
      <span className="text-warm-white/40">{label}</span>
      <span className="text-warm-white/70">{value}</span>
    </div>
  );
}
