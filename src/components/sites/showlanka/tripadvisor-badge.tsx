/* eslint-disable @next/next/no-img-element */
import { ASSETS, tripadvisorUrl } from "./data";

/** Static rebuild of TripAdvisor's "cdsratingsonlynarrow" widget as it renders on the source. */
export function TripadvisorBadge() {
  return (
    <div className="ta-badge">
      <div className="ta-badge__name">
        <a href={tripadvisorUrl} target="_blank" rel="nofollow noopener">
          Show Lanka Tours
        </a>
      </div>
      <div className="ta-badge__rating">
        <span className="ta-badge__bubbles" role="img" aria-label="4.9 of 5 bubbles">
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
        <br />
        <span>65 reviews</span>
      </div>
      <div className="ta-badge__logo">
        <a href="https://www.tripadvisor.com/" target="_blank" rel="noopener">
          <img src={`${ASSETS}/reviews/tripadvisor-lockup.svg`} alt="Tripadvisor" />
        </a>
      </div>
    </div>
  );
}
