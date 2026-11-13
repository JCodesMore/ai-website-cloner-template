"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Tour } from "./content/types";
import { DatePicker } from "./date-picker";
import {
  CalendarIcon,
  ChevronCircleDownIcon,
  DollarIcon,
  FilePdfIcon,
  MinusIcon,
  PlusIcon,
  RouteIcon,
} from "./icons";
import { upload } from "./site-link";
import { tourIntro } from "./subpage-parts";

const TourMap = dynamic(() => import("./tour-map").then((m) => m.TourMap), { ssr: false });

const CYCLE_MS = 4000;

/** Header image strip: the hero followed by the gallery, advancing every 4s (theme.js). */
function TourImages({ tour }: { tour: Tour }) {
  const images = [tour.hero, ...tour.gallery];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setActive((i) => (i + 1) % images.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [images.length]);
  return (
    <div className="post-image-container">
      {images.map((src, i) => (
        <img key={`${src}-${i}`} src={upload(src)} alt={i === 0 ? tour.title : ""} className={i === active ? "active" : undefined} />
      ))}
    </div>
  );
}

type PaxProps = { tour: Tour; pax: number; setPax: (update: (p: number) => number) => void };

function PriceCalculator({ tour, pax, setPax }: PaxProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const perPax = tour.calc[pax - 1] ?? 0;
  return (
    <div className="flex flex-col detail-inner">
      <button type="button" className="flex animate-trigger" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>Open price calculator</span>
        <ChevronCircleDownIcon />
      </button>
      <div className={`expand-container flex-col${open ? " expanded" : ""}`}>
        <div className="flex-col calc-outer-container">
          <div className="flex calc-top-section">
            <div className="flex flex-col calc-inner">
              <div className="flex flex-col date-container">
                <span className="label">Arrival date</span>
                <div className="date-selector">
                  <DatePicker value={date} onChange={setDate} placeholder="Select date" aria-label="Arrival date" />
                  <CalendarIcon />
                </div>
              </div>
              <div className="flex flex-col packs-container">
                <span className="label">No. of pax</span>
                <div className="flex calc-btns">
                  <button type="button" className="calc-operator minus" aria-label="Fewer travellers" onClick={() => setPax((p) => Math.max(1, p - 1))}>
                    <MinusIcon />
                  </button>
                  <input type="text" value={pax} readOnly aria-label="Number of travellers" />
                  <button type="button" className="calc-operator plus" aria-label="More travellers" onClick={() => setPax((p) => Math.min(3, p + 1))}>
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col calc-right-wrapper">
              <span className="label total-lbl">Total</span>
              <span className="flex label total-val">
                <span className="currency">US$</span>
                <span className="amount">{Math.round(perPax * pax)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Duration, per-pax price and saving; the price follows the calculator's pax count. */
function PriceSummary({ tour, pax }: { tour: Tour; pax: number }) {
  const key = String(pax) as "1" | "2" | "3";
  const price = tour.prices[key] ?? tour.prices["1"];
  return (
    <div className="flex detail-inner">
      <div className="flex flex-col detail-wrapper top-details">
        <div className="flex detail-item-wrapper">
          <CalendarIcon />
          <div className="flex flex-col detail-item">
            <span className="label">Duration</span>
            <span className="value">{tour.duration}</span>
          </div>
        </div>
        <div className="flex detail-item-wrapper">
          <DollarIcon />
          <div className="flex flex-col detail-item">
            <span className="label">Price per pax</span>
            <span className="flex value price-display">
              {price?.old && <span className="old-price">{price.old}</span>}
              <span>{price?.price}</span>
            </span>
          </div>
        </div>
        {tour.save[key] && (
          <div className="flex detail-item-wrapper">
            <p className="save-text">
              Save US$ <span className="save">{tour.save[key]}</span>
            </p>
          </div>
        )}
      </div>
      {tour.discount && (
        <div className="flex detail-wrapper discount-rate">
          <div className="flex detail-item-wrapper">
            <div className="flex flex-col detail-item">
              <span className="value">{tour.discount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Itinerary({ tour, expandAll }: { tour: Tour; expandAll: boolean | null }) {
  const [all, setAll] = useState(false);
  const refs = useRef<(HTMLDetailsElement | null)[]>([]);
  const toggleAll = (open: boolean) => {
    refs.current.forEach((d) => d && (d.open = open));
    setAll(open);
  };
  useEffect(() => {
    if (expandAll !== null) refs.current.forEach((d) => d && (d.open = expandAll));
  }, [expandAll]);
  return (
    <>
      <p style={{ marginTop: 0, marginBottom: 0 }}>
        Below are the stops on your route. If you would rather skip any of them, just let your driver know in advance.
      </p>
      <div className="flex expand-toggle-wrapper">
        {all ? (
          <button type="button" className="collapse-all" onClick={() => toggleAll(false)}>
            Collapse All
          </button>
        ) : (
          <button type="button" className="expand-all" onClick={() => toggleAll(true)}>
            Expand All
          </button>
        )}
      </div>
      {tour.itinerary.map((day, i) => (
        <details key={i} ref={(el) => void (refs.current[i] = el)}>
          <summary>{day.title}</summary>
          {day.attractions.length > 0 ? (
            <>
              <p>
                <strong>Attraction index</strong>
              </p>
              <ul>
                {day.attractions.map((a, j) => (
                  <li key={j}>{a}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>Plans for this day are arranged with your guide.</p>
          )}
          {day.overnight && <p>[{day.overnight}]</p>}
        </details>
      ))}
    </>
  );
}

export function TourDetail({ tour }: { tour: Tour }) {
  const tabs = ["Itinerary", ...tour.tabs.map((t) => t.name)];
  const [tab, setTab] = useState(0);
  const [pax, setPax] = useState(1);
  const [printing, setPrinting] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const highlights = tour.itinerary.map((d) => d.attractions[0]).filter(Boolean).slice(0, 4);

  // theme.js: expand every tab and day, render the article to a PDF, then restore. Same
  // output settings as the source's html2pdf call: letter, 0.5in margins, JPEG 0.98, scale 2.
  // html2canvas-pro is used because the template's theme colours are lab()/oklch().
  const downloadBrochure = async () => {
    setPrinting(true);
    await new Promise((r) => setTimeout(r, 500));
    try {
      const article = articleRef.current;
      if (!article) return;
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);
      const canvas = await html2canvas(article, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });

      const pdf = new jsPDF({ unit: "in", format: "letter", orientation: "portrait" });
      const margin = 0.5;
      const contentW = pdf.internal.pageSize.getWidth() - margin * 2;
      const contentH = pdf.internal.pageSize.getHeight() - margin * 2;
      const pxPerIn = canvas.width / contentW;
      const pagePx = Math.floor(contentH * pxPerIn);

      const page = document.createElement("canvas");
      page.width = canvas.width;
      const ctx = page.getContext("2d");
      for (let y = 0, n = 0; y < canvas.height; y += pagePx, n++) {
        const h = Math.min(pagePx, canvas.height - y);
        page.height = h;
        if (!ctx) break;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, page.width, h);
        ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
        if (n > 0) pdf.addPage();
        pdf.addImage(page.toDataURL("image/jpeg", 0.98), "JPEG", margin, margin, contentW, h / pxPerIn);
      }
      pdf.save(`${tour.title}.pdf`);
    } finally {
      setPrinting(false);
    }
  };

  return (
    <article className="post-page-content" ref={articleRef}>
        <TourImages tour={tour} />
        <div className="container">
          <div className="flex flex-col post-single-container">
            <h1 className="header-image-title">
              {tour.title}
              {tour.code && <span>Tour code: {tour.code}</span>}
            </h1>
            <div className="flex flex-col tour-details-container">
              <PriceSummary tour={tour} pax={pax} />
              <PriceCalculator tour={tour} pax={pax} setPax={setPax} />
              <div className="detail-inner">
                <div className="flex flex-col button-container">
                  <button type="button" className="btn common-btn download" onClick={downloadBrochure} disabled={printing}>
                    <FilePdfIcon />
                    <span>{printing ? "Preparing PDF…" : "Download Brochure"}</span>
                  </button>
                  <a className="btn common-btn map-link" href="#map">
                    <RouteIcon />
                    <span>View route on map</span>
                  </a>
                  <Link href="/contact" className="btn common-btn book-tour">
                    Book your tour
                  </Link>
                </div>
              </div>
            </div>
            <h3>Introduction</h3>
            <p>{tourIntro(tour)}</p>
            {highlights.length > 0 && (
              <>
                <h3>Highlights</h3>
                <ul>
                  {highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="gutena-tabs-block">
              <ul className="gutena-tabs-tab tab-flex" role="tablist">
                {tabs.map((name, i) => (
                  <li key={name} role="presentation" style={{ display: "contents" }}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={tab === i}
                      className={`gutena-tab-title${tab === i ? " active" : ""}`}
                      onClick={() => setTab(i)}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="gutena-tabs-content">
                <div className={`gutena-tab-block${tab === 0 || printing ? " active" : ""}`} role="tabpanel">
                  <Itinerary tour={tour} expandAll={printing ? true : null} />
                </div>
                {tour.tabs.map((t, i) => (
                  <div key={i} className={`gutena-tab-block${tab === i + 1 || printing ? " active" : ""}`} role="tabpanel">
                    <h4>{t.name}</h4>
                    <ul>
                      {t.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            {Object.keys(tour.map).length > 0 && <TourMap locations={tour.map} />}
          </div>
        </div>
      </article>
  );
}
