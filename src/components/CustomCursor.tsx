"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    document.body.style.cursor = "none";

    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    }

    function onMouseEnterDrag(e: Event) {
      gsap.to(cursor, { width: 80, height: 80, duration: 0.3, ease: "power2.out" });
      gsap.to(label, { opacity: 1, duration: 0.2 });
    }

    function onMouseLeaveDrag() {
      gsap.to(cursor, { width: 16, height: 16, duration: 0.3, ease: "power2.out" });
      gsap.to(label, { opacity: 0, duration: 0.2 });
    }

    function onMouseEnterLink() {
      gsap.to(cursor, { width: 40, height: 40, duration: 0.3, ease: "power2.out" });
    }

    function onMouseLeaveLink() {
      gsap.to(cursor, { width: 16, height: 16, duration: 0.3, ease: "power2.out" });
    }

    // Lerp animation loop
    function tick() {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;
      if (cursor) {
        cursor.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(tick);
    }
    const raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMouseMove);

    // Drag cursor on swipers
    const dragElements = document.querySelectorAll(".swiper, [data-cursor-drag]");
    dragElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterDrag);
      el.addEventListener("mouseleave", onMouseLeaveDrag);
    });

    // Larger cursor on links/buttons
    const linkElements = document.querySelectorAll("a, button");
    linkElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterLink);
      el.addEventListener("mouseleave", onMouseLeaveLink);
    });

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      dragElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterDrag);
        el.removeEventListener("mouseleave", onMouseLeaveDrag);
      });
      linkElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterLink);
        el.removeEventListener("mouseleave", onMouseLeaveLink);
      });
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999] flex items-center justify-center rounded-full border border-white/40 bg-white/5 backdrop-blur-sm"
      style={{
        width: 16,
        height: 16,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s",
        willChange: "transform",
        mixBlendMode: "difference",
      }}
    >
      <span
        ref={labelRef}
        className="text-[8px] font-normal uppercase tracking-[0.15em] text-white"
        style={{ opacity: 0 }}
      >
        Drag
      </span>
    </div>
  );
}
