"use client";

import { useState } from "react";
import { PlayIcon } from "./icons";
import { upload } from "./site-link";

type Props = { label: string; image: string; id: string; url: string };

/** Video tile from the "Traveler Tales" pages: click swaps the thumbnail for the YouTube player. */
export function VideoCard({ label, image, id, url }: Props) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="col-lg-3 col-12 video-review-wrapper">
      <div className="video-container">
        <div className="video-inner-wrapper">
          <div className="bg-image" role="img" aria-label={label} style={{ backgroundImage: `url('${upload(image)}')` }} />
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${id}?autoplay=1`}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={label}
            />
          ) : (
            <a
              href={url}
              className="video-thumbnail"
              aria-label={`Watch video: ${label}`}
              onClick={(e) => {
                e.preventDefault();
                setPlaying(true);
              }}
            >
              <span className="play-wrapper">
                <PlayIcon />
              </span>
            </a>
          )}
          <a href={url} className="see-yt" target="youtube" rel="noopener">
            <span className="border-after">
              View in Youtube<span className="sr-only">: {label}</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
