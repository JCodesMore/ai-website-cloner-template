# animesaga.net — Behavior Bible

## Global
- Native scroll (no Lenis/Locomotive). Single scroll container.
- Fixed Navbar (z1000) + fixed left icon Sidebar overlay flow content.

## Navbar
- Fixed, translucent dark; stays across routes. Search input has `Ctrl S` shortcut badge.
- Right cluster: EN language pill (green bg), bell, avatar.

## Hero (home)
- **Auto-cycling featured carousel** (time-driven) over ~6 featured titles; `1/6` counter + prev/next circular arrows bottom-left; thumbnail strip to jump.
- Backdrop = full-bleed series background image + dark gradient scrim (left + bottom) for legibility.
- Buttons: **Watch Now** (green, play) → player; **More Info** (glass, info) → detail route; mute toggle for bg.

## Card (AnimeRow poster)
- Poster ~2:3, episode badge ("Ep 14"), status badge ("RELEASING"), title below.
- Hover: (extracting exact transform/scale/shadow).
- Row = horizontal scroll carousel; "View All →" link; category badge (HOT/SEASONAL/TOP).

## More Info → Detail page (`AnimeDetailClient`)  [PRESERVE]
- Full route (not modal). Two-column: left = large poster + Score/Rank/Popularity/Favourites stat boxes + Type/Episodes/Duration/Status labels; right = title, multi-paragraph synopsis, green-outline genre pills, **Watch Now** + **Add to List** (dropdown) + **Share**, meta pills (TV / N Episodes / 24 min / RELEASING / year).
- **SEASONS, OVAs, MOVIES & SPECIALS** carousel ("49 ENTRIES") = season/episode menu. Cards: thumbnail + `SEASON · TYPE` label (e.g. SUMMER·OVA, FALL·TV [active=green border], WINTER·MOVIE) + title + year. Prev/next arrows. **This is the "episode UI/menu" to keep.**

## Responsive (to verify @768/390 in Phase 3 per-section)
- TBD per section during extraction.
