"use client";

import { useEffect, useId, useRef, useState, type InputHTMLAttributes } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** jQuery UI default format: mm/dd/yyyy */
export function formatDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

/** Read-only text input with a jQuery UI–style month calendar, like the source's datepicker. */
export function DatePicker({ value, onChange, className, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => new Date());
  const wrapRef = useRef<HTMLSpanElement>(null);
  const popupId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const today = formatDate(new Date());

  return (
    <span ref={wrapRef} style={{ position: "relative", display: "block" }}>
      <input
        {...props}
        type="text"
        readOnly
        value={value}
        className={`${className ?? ""}${value ? " has-value" : ""}`}
        onClick={() => {
          setOpen((o) => !o);
          if (value) setView(new Date(value));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        role="combobox"
        aria-haspopup="dialog"
        aria-controls={popupId}
        aria-expanded={open}
      />
      {open && (
        <div id={popupId} className="sl-datepicker" role="dialog" aria-label="Choose date">
          <div className="sl-datepicker__header">
            <button type="button" aria-label="Previous month" onClick={() => setView(new Date(year, month - 1, 1))}>
              ‹
            </button>
            <span>
              {MONTHS[month]} {year}
            </span>
            <button type="button" aria-label="Next month" onClick={() => setView(new Date(year, month + 1, 1))}>
              ›
            </button>
          </div>
          <table>
            <thead>
              <tr>
                {DAYS.map((d) => (
                  <th key={d} scope="col">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: cells.length / 7 }, (_, r) => (
                <tr key={r}>
                  {cells.slice(r * 7, r * 7 + 7).map((day, c) => {
                    if (!day) return <td key={c} />;
                    const label = formatDate(new Date(year, month, day));
                    return (
                      <td key={c}>
                        <button
                          type="button"
                          className={`${label === today ? "is-today" : ""}${label === value ? " is-selected" : ""}`}
                          onClick={() => {
                            onChange(label);
                            setOpen(false);
                          }}
                        >
                          {day}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </span>
  );
}
