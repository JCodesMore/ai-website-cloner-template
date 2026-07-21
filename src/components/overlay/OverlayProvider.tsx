"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AnimeCardData, AnimeDetail, EpisodeData } from "@/types/anime";
import { resolveDetail, resolveSimilar } from "./resolveDetail";
import { getDetail, getSeasonEpisodes, type MediaType } from "@/lib/tmdb";
import { getStreamUrls, type StreamType } from "@/lib/providers";

/* ----------------------------------------------------------------
   Context
   ---------------------------------------------------------------- */
interface OverlayApi {
  /** Open the cinematic "More Info" overlay for a card (triggered by clicking a title). */
  openDetail: (card: AnimeCardData) => void;
  /** Open the episode menu directly. */
  openEpisodes: (card: AnimeCardData) => void;
  close: () => void;
}

const OverlayCtx = createContext<OverlayApi | null>(null);

export function useOverlay(): OverlayApi {
  const ctx = useContext(OverlayCtx);
  if (!ctx) throw new Error("useOverlay must be used within <OverlayProvider>");
  return ctx;
}

/* ----------------------------------------------------------------
   Icons
   ---------------------------------------------------------------- */
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 17.8 5.9 20.6 7.2 13.8 2.2 9.1l6.8-.8L12 2z" />
  </svg>
);
const ListIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.1C.4 8.9 1.6 5.3 5 4.6c2-.4 3.7.6 4.7 2 .5.7.8 1 1.3 1s.8-.3 1.3-1c1-1.4 2.7-2.4 4.7-2 3.4.7 4.6 4.3 3 7.3C19.5 16.4 12 21 12 21z" />
  </svg>
);
const FilmIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4" />
  </svg>
);

/* ----------------------------------------------------------------
   What to play — season/episode target (season/episode ignored for movies)
   ---------------------------------------------------------------- */
interface PlayTarget {
  season: number;
  episode: number;
}

/* ----------------------------------------------------------------
   Video player — real streaming embed with a live source switcher.
   Ported from Zynema: builds provider embed URLs from the TMDB id and
   loads the selected one into a fullscreen iframe.
   ---------------------------------------------------------------- */
function VideoPlayer({
  detail,
  target,
  open,
  onClose,
}: {
  detail: AnimeDetail | null;
  target: PlayTarget;
  open: boolean;
  onClose: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  const isMovie = detail?.mediaType === "movie";

  const providers = useMemo(() => {
    if (!detail?.tmdbId) return [];
    const type: StreamType = isMovie ? "movie" : "tv";
    return getStreamUrls(type, detail.tmdbId, target.season, target.episode);
  }, [detail?.tmdbId, isMovie, target.season, target.episode]);

  // Reset to the first (fastest) source whenever the target changes.
  useEffect(() => {
    setActiveIdx(0);
  }, [detail?.tmdbId, target.season, target.episode]);

  if (!detail) return null;
  const active = providers[activeIdx];

  return (
    <div
      className={`video-player${open ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      <div className="vp-topbar">
        <button className="vp-close" onClick={onClose} aria-label="Close player">
          <CloseIcon />
        </button>
        <div className="vp-title">
          {detail.title}
          {!isMovie && (
            <span className="vp-ep">
              {" "}
              · S{target.season} · E{target.episode}
            </span>
          )}
        </div>
      </div>

      <div className="vp-stage">
        {open && active ? (
          <iframe
            key={active.url}
            className="vp-frame"
            src={active.url}
            title={detail.title}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="origin"
          />
        ) : (
          <div className="vp-empty">
            {detail.tmdbId ? "Loading source…" : "No source available"}
          </div>
        )}
      </div>

      {providers.length > 0 && (
        <div className="vp-sources">
          <div className="vp-sources-label">Sources</div>
          <div className="vp-sources-row">
            {providers.map((p, i) => (
              <button
                key={p.name}
                className={`vp-source-btn${i === activeIdx ? " active" : ""}`}
                onClick={() => setActiveIdx(i)}
              >
                <span className="vp-source-name">{p.name}</span>
                {p.status && <span className="vp-source-status">{p.status}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   Episode menu
   ---------------------------------------------------------------- */
function EpisodesOverlay({
  detail,
  open,
  onClose,
  onPlay,
}: {
  detail: AnimeDetail | null;
  open: boolean;
  onClose: () => void;
  onPlay: (season: number, episode: number) => void;
}) {
  // Season list pulled from the real TMDB detail (falls back to a single season).
  const seasonList = useMemo(() => {
    if (detail?.seasons && detail.seasons.length > 0) {
      return detail.seasons.map((s) => ({
        num: s.seasonNumber ?? 1,
        label: s.title || `Season ${s.seasonNumber ?? 1}`,
      }));
    }
    return [{ num: 1, label: "Season 1" }];
  }, [detail?.seasons]);

  const [season, setSeason] = useState(seasonList[0]?.num ?? 1);
  const [episodes, setEpisodes] = useState<EpisodeData[]>([]);
  const [loading, setLoading] = useState(false);

  // Reset to the first season whenever a new title is opened.
  useEffect(() => {
    setSeason(seasonList[0]?.num ?? 1);
  }, [detail?.tmdbId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch real episode data for the selected season.
  useEffect(() => {
    if (!open || !detail?.tmdbId || detail.mediaType === "movie") {
      setEpisodes([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getSeasonEpisodes(detail.tmdbId, season)
      .then((eps) => {
        if (!cancelled) setEpisodes(eps);
      })
      .catch(() => {
        if (!cancelled) setEpisodes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, detail?.tmdbId, detail?.mediaType, season]);

  if (!detail) return null;

  return (
    <div className={`episodes-overlay${open ? " open" : ""}`}>
      <div
        className="eo-backdrop"
        style={{ backgroundImage: `url(${detail.backdrop})` }}
        aria-hidden="true"
      />
      <div className="eo-header">
        <button className="eo-close" onClick={onClose} aria-label="Close episodes">
          <CloseIcon />
        </button>
      </div>
      <div className="eo-scroll">
        <div className="eo-hero">
          <div className="eo-poster">
            <img src={detail.poster} alt={detail.title} />
          </div>
          <div className="eo-title-block">
            <h2 className="eo-title">{detail.title}</h2>
            <div className="eo-meta">
              {detail.year} · {detail.format} · {detail.episodeCount} Episodes
            </div>
          </div>
        </div>
        <div className="eo-body">
          {seasonList.length > 1 && (
            <div className="eo-season-bar">
              {seasonList.map((s) => (
                <button
                  key={s.num}
                  className={`eo-season-btn${s.num === season ? " active" : ""}`}
                  onClick={() => setSeason(s.num)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
          {loading && <div className="eo-loading">Loading episodes…</div>}
          <div className="eo-episode-grid">
            {episodes.map((ep) => (
              <button
                key={ep.number}
                className="eo-ep-card"
                onClick={() => onPlay(season, ep.number)}
              >
                <div className="eo-ep-img">
                  <img
                    src={ep.still || detail.backdrop}
                    alt={ep.title || `Episode ${ep.number}`}
                    loading="lazy"
                  />
                  <div className="eo-ep-play">
                    <PlayIcon />
                  </div>
                </div>
                <div className="eo-ep-info">
                  <div className="eo-ep-num">Episode {ep.number}</div>
                  <div className="eo-ep-title">
                    {ep.title || `${detail.title} — Ep. ${ep.number}`}
                  </div>
                  {ep.overview && (
                    <div className="eo-ep-desc">{ep.overview}</div>
                  )}
                  <div className="eo-ep-meta">
                    {ep.runtime ? `${ep.runtime}m` : `${detail.duration ?? 24}m`}
                    {ep.airDate ? ` · ${ep.airDate}` : ""}
                  </div>
                </div>
              </button>
            ))}
            {!loading && episodes.length === 0 && (
              <div className="eo-empty">No episode data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Cinematic "More Info" overlay
   ---------------------------------------------------------------- */
function CinematicOverlay({
  detail,
  similar,
  open,
  onClose,
  onOpenEpisodes,
  onPlay,
  onSelectSimilar,
}: {
  detail: AnimeDetail | null;
  similar: AnimeCardData[];
  open: boolean;
  onClose: () => void;
  onOpenEpisodes: () => void;
  onPlay: () => void;
  onSelectSimilar: (c: AnimeCardData) => void;
}) {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!detail) return null;
  const rating = detail.score != null ? (detail.score / 10).toFixed(1) : "—";

  return (
    <div className={`cinematic-overlay${open ? " open" : ""}`}>
      <div className="co-backdrop-layer">
        <div
          className="co-backdrop-image"
          style={{ backgroundImage: `url(${detail.backdrop})` }}
        />
        <div className="co-backdrop-blur" />
        <div className="co-backdrop-vignette" />
      </div>

      <button className="co-close" onClick={onClose} aria-label="Close">
        <CloseIcon />
      </button>

      <div className="co-scroll">
        <div className="co-banner-spacer" />
        <div className="co-panel">
          <div className="co-hero">
            <div className="co-poster-wrap">
              <img src={detail.poster} alt={detail.title} />
            </div>
            <div className="co-info">
              <h1 className="co-title">{detail.title}</h1>

              <div className="co-match-meta">
                {detail.score != null && (
                  <span className="co-match">{detail.score}% Match</span>
                )}
              </div>

              <div className="co-meta-row">
                <span className="co-meta-item star">
                  <StarIcon />
                  {rating}
                </span>
                {detail.year && <span className="co-meta-item">{detail.year}</span>}
                <span className="co-meta-item">{detail.format}</span>
                {detail.episodeCount && (
                  <span className="co-meta-item">{detail.episodeCount} eps</span>
                )}
                <span className="co-meta-item">{detail.status.replace(/_/g, " ")}</span>
              </div>

              <div className="co-actions">
                <button className="co-play-btn" onClick={onPlay}>
                  <PlayIcon />
                  Play
                </button>
                <button className="co-trailer-btn" onClick={onPlay}>
                  <FilmIcon />
                  Trailer
                </button>
                <button className="co-episodes-btn" onClick={onOpenEpisodes}>
                  <ListIcon />
                  Episodes
                </button>
                <button
                  className={`co-icon-btn co-watchlist-btn${saved ? " watchlist-saved" : ""}`}
                  onClick={() => setSaved((v) => !v)}
                  aria-label="Add to watchlist"
                >
                  {saved ? <CheckIcon /> : <ListIcon />}
                </button>
                <button
                  className={`co-icon-btn co-like-btn${liked ? " liked" : ""}`}
                  onClick={() => setLiked((v) => !v)}
                  aria-label="Like"
                >
                  <HeartIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="co-body">
            <div className="co-overview">
              <div className="co-section-header">Overview</div>
              <p className="co-overview-text">{detail.synopsis}</p>
            </div>

            {detail.genres.length > 0 && (
              <div className="co-meta-row" style={{ margin: "0 0 8px" }}>
                {detail.genres.map((g) => (
                  <span className="co-meta-item" key={g}>
                    {g}
                  </span>
                ))}
              </div>
            )}

            {detail.cast && detail.cast.length > 0 && (
              <div className="co-cast-section">
                <div className="co-cast-label">Cast</div>
                <div className="co-cast-row">
                  {detail.cast.map((c) => (
                    <div className="co-cast-person" key={c.name}>
                      <div className="co-cast-avatar">
                        {c.avatar ? (
                          <img src={c.avatar} alt={c.name} />
                        ) : (
                          <span>{c.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="co-cast-name">{c.name}</div>
                      <div className="co-cast-char">{c.character}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {similar.length > 0 && (
              <div className="co-similar-section">
                <div className="co-similar-header">More Like This</div>
                <div className="co-similar-scroll">
                  {similar.map((c) => (
                    <button
                      className="co-similar-card"
                      key={c.id}
                      onClick={() => onSelectSimilar(c)}
                    >
                      <img src={c.poster} alt={c.title} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Provider
   ---------------------------------------------------------------- */
export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [card, setCard] = useState<AnimeCardData | null>(null);
  const [detail, setDetail] = useState<AnimeDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [episodesOpen, setEpisodesOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playTarget, setPlayTarget] = useState<PlayTarget>({ season: 1, episode: 1 });

  // Resolve the full detail whenever a card is selected. We show an instant
  // synchronous fallback, then swap in real TMDB data once it arrives.
  useEffect(() => {
    if (!card) {
      setDetail(null);
      return;
    }
    setDetail(resolveDetail(card));
    if (!card.tmdbId) return;
    const type: MediaType = card.mediaType === "movie" ? "movie" : "tv";
    let cancelled = false;
    getDetail(type, card.tmdbId)
      .then((d) => {
        if (!cancelled) setDetail(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [card]);

  const similar = useMemo(
    () =>
      detail?.similar && detail.similar.length > 0
        ? detail.similar
        : card
          ? resolveSimilar(card)
          : [],
    [detail?.similar, card],
  );

  const openDetail = useCallback((c: AnimeCardData) => {
    setCard(c);
    setDetailOpen(true);
    setEpisodesOpen(false);
    setPlayerOpen(false);
  }, []);

  const openEpisodes = useCallback((c: AnimeCardData) => {
    setCard(c);
    setEpisodesOpen(true);
  }, []);

  const play = useCallback((season: number, episode: number) => {
    setPlayTarget({ season, episode });
    setPlayerOpen(true);
  }, []);

  const close = useCallback(() => {
    setDetailOpen(false);
    setEpisodesOpen(false);
    setPlayerOpen(false);
  }, []);

  const anyOpen = detailOpen || episodesOpen || playerOpen;

  // Lock body scroll + close on Escape while any overlay is open.
  useEffect(() => {
    if (!anyOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (playerOpen) setPlayerOpen(false);
      else if (episodesOpen) setEpisodesOpen(false);
      else close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [anyOpen, playerOpen, episodesOpen, close]);

  const api = useMemo<OverlayApi>(
    () => ({ openDetail, openEpisodes, close }),
    [openDetail, openEpisodes, close],
  );

  return (
    <OverlayCtx.Provider value={api}>
      {children}

      <CinematicOverlay
        detail={detail}
        similar={similar}
        open={detailOpen && !episodesOpen && !playerOpen}
        onClose={close}
        onOpenEpisodes={() => setEpisodesOpen(true)}
        onPlay={() => play(1, 1)}
        onSelectSimilar={(c) => openDetail(c)}
      />

      <EpisodesOverlay
        detail={detail}
        open={episodesOpen && !playerOpen}
        onClose={() => (detailOpen ? setEpisodesOpen(false) : close())}
        onPlay={play}
      />

      <VideoPlayer
        detail={detail}
        target={playTarget}
        open={playerOpen}
        onClose={() => setPlayerOpen(false)}
      />
    </OverlayCtx.Provider>
  );
}
