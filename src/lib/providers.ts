// Streaming provider embed URLs — ported from Zynema's server.mjs getStreamUrls().
// Movies embed by tmdb id; TV embeds include season + episode.
export interface StreamProvider {
  name: string;
  url: string;
  status?: string;
}

export type StreamType = "tv" | "movie";

/**
 * Build the ordered list of embed providers for a given TMDB title.
 * @param type   "tv" | "movie"
 * @param tmdbId TMDB numeric id
 * @param season season number (TV only, default 1)
 * @param episode episode number (TV only, default 1)
 */
export function getStreamUrls(
  type: StreamType,
  tmdbId: number | string,
  season = 1,
  episode = 1,
): StreamProvider[] {
  const id = String(tmdbId);
  const s = String(season);
  const e = String(episode);

  if (type === "movie") {
    return [
      { name: "VidLink", url: `https://vidlink.pro/movie/${id}`, status: "Fast · 1080p" },
      { name: "VidSrc", url: `https://vidsrc.to/embed/movie/${id}`, status: "HD · Multi" },
      { name: "EmbedSU", url: `https://embed.su/embed/movie/${id}`, status: "HD" },
      { name: "AutoEmbed", url: `https://player.autoembed.cc/embed/movie/${id}`, status: "HD" },
      { name: "SuperEmbed", url: `https://multiembed.mom/directstream.php?video_id=${id}&tmdb=1`, status: "Multi" },
      { name: "VidBinge", url: `https://vidbinge.dev/embed/movie/${id}`, status: "HD" },
      { name: "2Embed", url: `https://www.2embed.cc/embed/${id}`, status: "Backup" },
      { name: "VidSrcMe", url: `https://vidsrc.me/embed/movie?tmdb=${id}`, status: "HD" },
      { name: "VidSrcCC", url: `https://vidsrc.cc/v2/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcPro", url: `https://vidsrc.pro/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcNet", url: `https://vidsrc.net/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcXYZ", url: `https://vidsrc.xyz/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcICU", url: `https://vidsrc.icu/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcStream", url: `https://vidsrc.stream/embed/movie/${id}`, status: "HD" },
      { name: "SmashyStream", url: `https://embed.smashystream.com/playere.php?tmdb=${id}`, status: "HD" },
      { name: "VidSrcSU", url: `https://vidsrc.su/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcVIP", url: `https://vidsrc.vip/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcCC2", url: `https://vidsrc.cc/v3/embed/movie/${id}`, status: "HD" },
      { name: "Cineby", url: `https://player.cineby.app/embed/movie/${id}`, status: "HD" },
      { name: "MoviesApiTo", url: `https://moviesapi.to/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcWTF", url: `https://vidsrc.wtf/api/2/movie/?id=${id}`, status: "Backup" },
      { name: "2EmbedTo", url: `https://www.2embed.to/embed/${id}`, status: "Backup" },
      { name: "VidLinkCC", url: `https://vidlink.cc/movie/${id}`, status: "HD" },
      { name: "AutoEmbedCC", url: `https://autoembed.cc/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcDad", url: `https://vidsrc.dad/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcRip", url: `https://vidsrc.rip/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcNu", url: `https://vidsrc.nu/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcShow", url: `https://vidsrc.show/embed/movie/${id}`, status: "HD" },
      { name: "VidSrcClick", url: `https://vidsrc.click/embed/movie/${id}`, status: "HD" },
      { name: "GDrivePlayer", url: `https://gdriveplayer.to/embed/movie/${id}`, status: "Mirror" },
      { name: "FlixHQ", url: `https://embed.flixhq.to/embed/movie/${id}`, status: "HD" },
    ];
  }

  // TV — season + episode aware.
  return [
    { name: "VidLink", url: `https://vidlink.pro/tv/${id}/${s}/${e}`, status: "Fast · 1080p" },
    { name: "VidSrc", url: `https://vidsrc.to/embed/tv/${id}/${s}/${e}`, status: "HD · Multi" },
    { name: "EmbedSU", url: `https://embed.su/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "AutoEmbed", url: `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "SuperEmbed", url: `https://multiembed.mom/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}`, status: "Multi" },
    { name: "VidBinge", url: `https://vidbinge.dev/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "2Embed", url: `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, status: "Backup" },
    { name: "VidSrcMe", url: `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`, status: "HD" },
    { name: "VidSrcCC", url: `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcPro", url: `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcNet", url: `https://vidsrc.net/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcXYZ", url: `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcICU", url: `https://vidsrc.icu/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcStream", url: `https://vidsrc.stream/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "SmashyStream", url: `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${s}&episode=${e}`, status: "HD" },
    { name: "VidSrcSU", url: `https://vidsrc.su/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcVIP", url: `https://vidsrc.vip/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcCC2", url: `https://vidsrc.cc/v3/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "Cineby", url: `https://player.cineby.app/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "MoviesApiTo", url: `https://moviesapi.to/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcWTF", url: `https://vidsrc.wtf/api/2/tv/?id=${id}&s=${s}&e=${e}`, status: "Backup" },
    { name: "VidLinkCC", url: `https://vidlink.cc/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "AutoEmbedCC", url: `https://autoembed.cc/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcDad", url: `https://vidsrc.dad/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcRip", url: `https://vidsrc.rip/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcNu", url: `https://vidsrc.nu/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcShow", url: `https://vidsrc.show/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "VidSrcClick", url: `https://vidsrc.click/embed/tv/${id}/${s}/${e}`, status: "HD" },
    { name: "GDrivePlayer", url: `https://databasegdriveplayer.xyz/embed/tv/${id}/${s}/${e}`, status: "Mirror" },
    { name: "WarezCDN", url: `https://embed.warezcdn.com/embed/tv/${id}/${s}/${e}`, status: "Backup" },
    { name: "HQEmbed", url: `https://embed.hqembed.com/embed/tv/${id}/${s}/${e}`, status: "HD" },
  ];
}
