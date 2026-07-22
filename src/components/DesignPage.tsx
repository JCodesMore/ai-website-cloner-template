"use client";

import { useEffect, useRef } from "react";
import type { BootStep } from "@/lib/design";

/**
 * Renders a reference design's body markup, then runs its original boot steps
 * (lucide icons, site.js behaviours, demo stores, page-specific inline script)
 * sequentially in document order. External scripts are awaited before the next
 * step so dependencies (e.g. FaorbitStore before the page inline script) resolve.
 *
 * Navigation between pages uses full-page <a> loads, so this mounts once per page
 * visit and the imperative scripts initialise exactly like the static prototype.
 */
export default function DesignPage({
  body,
  steps,
}: {
  body: string;
  steps: BootStep[];
}) {
  const ran = useRef(false);
  const host = useRef<HTMLDivElement>(null);
  const isMerchantSurface = /class=["'][^"']*\b(?:dash|auth)\b[^"']*["']/.test(body);

  useEffect(() => {
    if (ran.current) return; // guard against double-invoke in dev strict mode
    ran.current = true;

    let cancelled = false;
    const controller = new AbortController();

    function enhanceMerchantUi() {
      const root = host.current;
      const dash = root?.querySelector<HTMLElement>(".dash");
      if (!root || !dash) return;

      // Keep the original navigation in the DOM and turn it into an off-canvas
      // drawer on narrow screens. No routes or view-switch hooks are replaced.
      const top = dash.querySelector<HTMLElement>(".dash-top");
      const side = dash.querySelector<HTMLElement>(".dash-side");
      if (top && side && !top.querySelector(".merchant-mobile-toggle")) {
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "icon-btn merchant-mobile-toggle";
        toggle.setAttribute("aria-label", "打开主导航");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';

        const overlay = document.createElement("button");
        overlay.type = "button";
        overlay.className = "merchant-mobile-overlay";
        overlay.setAttribute("aria-label", "关闭主导航");
        overlay.tabIndex = -1;

        const setOpen = (open: boolean) => {
          dash.classList.toggle("mobile-nav-open", open);
          toggle.setAttribute("aria-expanded", String(open));
          toggle.setAttribute("aria-label", open ? "关闭主导航" : "打开主导航");
        };

        toggle.addEventListener("click", () => setOpen(!dash.classList.contains("mobile-nav-open")), { signal: controller.signal });
        overlay.addEventListener("click", () => setOpen(false), { signal: controller.signal });
        side.addEventListener("click", (event) => {
          const target = event.target;
          if (target instanceof Element && target.closest("a")) setOpen(false);
        }, { signal: controller.signal });
        document.addEventListener("keydown", (event) => {
          if (event.key !== "Escape") return;
          if (dash.classList.contains("mobile-nav-open")) {
            setOpen(false);
            toggle.focus();
            return;
          }

          // The original wallet/team scripts close drawers when their overlay
          // is clicked. Reuse that path so Escape never bypasses their cleanup.
          const openOverlay = root.querySelector<HTMLElement>(
            ".alloc-overlay.on, .ldg-overlay.on, .drawer-overlay.open"
          );
          openOverlay?.click();
        }, { signal: controller.signal });

        top.prepend(toggle);
        dash.appendChild(overlay);
      }

      // Supply accessible names for existing icon-only actions without
      // changing their data hooks or visible contents.
      const iconLabels: Record<string, string> = {
        bell: "查看通知",
        x: "关闭",
        "more-horizontal": "更多操作",
        "chevron-right": "查看详情",
        copy: "复制",
        eye: "查看",
        "eye-off": "隐藏",
        download: "下载",
        search: "搜索",
        trash: "删除",
        "trash-2": "删除",
      };
      root.querySelectorAll<HTMLElement>("button.icon-btn, a.icon-btn").forEach((control) => {
        if (control.hasAttribute("aria-label") || control.textContent?.trim()) return;
        const icon = control.querySelector<HTMLElement>("[data-lucide]");
        const iconName = icon?.getAttribute("data-lucide") || "";
        control.setAttribute("aria-label", control.getAttribute("title") || iconLabels[iconName] || "操作");
      });

      root.querySelectorAll<HTMLElement>("a:not([href])").forEach((control) => {
        control.setAttribute("role", "button");
        control.tabIndex = 0;
        control.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          control.click();
        }, { signal: controller.signal });
      });

      // Preserve the existing click handlers while making custom selectors
      // keyboard-operable. Disabled card-program options remain unfocusable.
      root.querySelectorAll<HTMLElement>(".pay-opt, .bin-pill, .switch[data-switch]").forEach((control) => {
        if (control.matches("button, a, input, select") || control.classList.contains("is-full") || control.classList.contains("is-blocked")) return;
        const isSwitch = control.classList.contains("switch");
        control.setAttribute("role", isSwitch ? "switch" : "button");
        control.tabIndex = 0;
        if (isSwitch) {
          control.setAttribute("aria-checked", String(control.classList.contains("on")));
          const label = control.closest(".set-row")?.querySelector<HTMLElement>(".sl")?.textContent?.trim();
          if (label) control.setAttribute("aria-label", label);
        } else {
          control.setAttribute("aria-pressed", String(control.classList.contains("on")));
        }
        control.addEventListener("click", () => {
          requestAnimationFrame(() => {
            control.setAttribute(isSwitch ? "aria-checked" : "aria-pressed", String(control.classList.contains("on")));
          });
        }, { signal: controller.signal });
        control.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          control.click();
        }, { signal: controller.signal });
      });

      root.querySelectorAll<HTMLElement>(".drawer, .alloc, .ldg, .pp-modal, .wd-modal").forEach((dialog) => {
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");
      });

      // 顶栏搜索框：Chrome / 密码管理器会把已保存的登录邮箱自动填进这个同源页面里唯一的文本输入框。
      // readonly 状态下浏览器不会自动填充；首次聚焦（点击或 Tab）再解除，用户输入完全不受影响。
      const search = root.querySelector<HTMLInputElement>("[data-search-input]");
      if (search) {
        search.value = "";
        search.setAttribute("readonly", "");
        const unlock = () => search.removeAttribute("readonly");
        search.addEventListener("pointerdown", unlock, { signal: controller.signal });
        search.addEventListener("focus", unlock, { signal: controller.signal });
      }
    }

    enhanceMerchantUi();

    function loadSrc(url: string): Promise<void> {
      return new Promise((resolve) => {
        const s = document.createElement("script");
        s.src = url;
        s.async = false;
        s.onload = () => resolve();
        s.onerror = () => resolve(); // never block the chain on a CDN hiccup
        document.body.appendChild(s);
      });
    }

    function runInline(code: string) {
      const s = document.createElement("script");
      s.textContent = code;
      document.body.appendChild(s);
    }

    (async () => {
      for (const step of steps) {
        if (cancelled) return;
        if (step.type === "src") {
          await loadSrc(step.url);
        } else {
          runInline(step.code);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [steps]);

  return (
    <div
      ref={host}
      className={isMerchantSurface ? "merchant-surface" : undefined}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
