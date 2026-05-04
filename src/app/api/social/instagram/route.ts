import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!token || !accountId) {
    return NextResponse.json({
      configured: false,
      message: "Instagram Graph API not configured.",
      setupSteps: [
        "Create a Meta developer app at developers.facebook.com (free)",
        "Add the Instagram Graph API product",
        "Connect your Instagram Business Account (@bajabluetours) via Facebook Page",
        "Generate a long-lived access token (60-day, then refresh)",
        "Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID to Vercel env vars",
        "Redeploy — live follower + post stats auto-activate",
      ],
    });
  }

  try {
    const base = "https://graph.facebook.com/v19.0";
    const accountFields = "followers_count,follows_count,media_count,name,username,profile_picture_url,biography";
    const mediaFields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count";

    const [accountRes, mediaRes] = await Promise.all([
      fetch(`${base}/${accountId}?fields=${accountFields}&access_token=${token}`),
      fetch(`${base}/${accountId}/media?fields=${mediaFields}&limit=12&access_token=${token}`),
    ]);

    if (!accountRes.ok) {
      const err = await accountRes.text();
      return NextResponse.json({ configured: true, error: `Account fetch failed: ${err}` }, { status: 502 });
    }

    const account = await accountRes.json();
    const media = mediaRes.ok ? await mediaRes.json() : { data: [] };

    const posts = (media.data ?? []).map((p: Record<string, unknown>) => ({
      id: p.id,
      caption: p.caption,
      type: p.media_type,
      mediaUrl: p.media_url || p.thumbnail_url,
      permalink: p.permalink,
      timestamp: p.timestamp,
      likes: p.like_count || 0,
      comments: p.comments_count || 0,
      engagement: (Number(p.like_count) || 0) + (Number(p.comments_count) || 0),
    }));

    const avgEngagement = posts.length
      ? Math.round(posts.reduce((s: number, p: { engagement: number }) => s + p.engagement, 0) / posts.length)
      : 0;

    const engagementRate =
      account.followers_count && posts.length
        ? Number(((avgEngagement / account.followers_count) * 100).toFixed(2))
        : 0;

    return NextResponse.json({
      configured: true,
      account,
      posts,
      avgEngagement,
      engagementRate,
    });
  } catch (e) {
    return NextResponse.json({ configured: true, error: String(e) }, { status: 502 });
  }
}
