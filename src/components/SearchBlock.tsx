"use client";

import { useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/icons";

const popular = [
  { text: "Sign in to HBO Max", href: "/us/Answer/Detail/000002551" },
  { text: "Manage HBO Max subscription", href: "/us/Answer/Detail/000002529" },
  { text: "Install HBO Max on supported devices", href: "/us/Answer/Detail/000002506" },
];

export function SearchBlock() {
  const [value, setValue] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value.trim()) return;
    window.location.href = `/us/Home/Search?q=${encodeURIComponent(value)}`;
  }

  return (
    <section className="mx-[122px] max-[1100px]:mx-6 max-[640px]:mx-4">
      <h1
        className="m-0 font-medium text-black"
        style={{ fontSize: 40, lineHeight: "47px", padding: "70px 0 32px" }}
      >
        How can we help?
      </h1>

      <form onSubmit={onSubmit} role="search" className="relative w-full" style={{ paddingBottom: 32 }}>
        <label className="sr-only" htmlFor="hbo-search">Search help</label>
        <div
          className="flex items-center gap-3 w-full bg-white"
          style={{
            height: 72,
            borderRadius: 8,
            border: "2px solid #4f6984",
            paddingLeft: "35.41px",
            paddingRight: 16,
          }}
        >
          <button type="submit" aria-label="Search" className="shrink-0 text-[#545454]">
            <SearchIcon width={20} height={20} />
          </button>
          <input
            id="hbo-search"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Example: How do I sign in?"
            className="w-full bg-transparent text-[16px] leading-[22px] text-black placeholder:text-[#7a7a7a] outline-none"
          />
        </div>
      </form>

      <ul
        className="flex flex-wrap items-center gap-x-2 text-[16px] text-[#545454] list-none m-0 p-0"
        style={{ lineHeight: "28px", paddingBottom: 35 }}
      >
        <li className="font-medium text-[#0f0f0f]">Popular:</li>
        {popular.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="text-[#545454] underline underline-offset-2 hover:text-[#116fbb]">
              {l.text}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
