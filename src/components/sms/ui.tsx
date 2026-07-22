/* eslint-disable @next/next/no-img-element */
"use client";

/** 短信接码板块的通用 UI 件：toast、品牌图标、演示二维码、数量条，
 *  以及提示音 / 文件下载两个浏览器副作用助手。 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { iconUrl, type SmsService } from "@/lib/sms-data";
import { AlertTriangle, Check } from "./icons";

/* ── toast ────────────────────────────────────────────── */

type ToastVariant = "success" | "error";

interface ToastApi {
  /** 弹出短暂 toast（自动消失），失败传 'error' */
  show: (text: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ text: string; variant: ToastVariant } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback((text: string, variant: ToastVariant = "success") => {
    setToast({ text, variant });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), variant === "error" ? 2600 : 1300);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <div
          className={"toast" + (toast.variant === "error" ? " toast--error" : "")}
          role="status"
          aria-live={toast.variant === "error" ? "assertive" : "polite"}
        >
          <span
            style={{
              color: toast.variant === "error" ? "var(--rate-bad)" : "#2bd4a0",
              display: "inline-flex",
            }}
          >
            {toast.variant === "error" ? <AlertTriangle /> : <Check />}
          </span>
          {toast.text}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

/* ── 品牌图标 ─────────────────────────────────────────── */

interface BrandIconProps {
  /** 本地品牌 SVG 地址，可能加载失败 */
  url: string;
  /** 服务名 — 驱动字母兜底与 alt */
  name: string;
  /** 品牌色（hex，无 #），字母兜底着色用 */
  hex?: string;
  /** 图形尺寸 px */
  size?: number;
  /** 外层底板尺寸 px；省略则裸图形 */
  tile?: number;
  radius?: number;
}

/** 品牌图标 + 优雅兜底：SVG 加载失败时渲染服务名首字母而不是碎图。 */
export function BrandIcon({ url, name, hex, size = 20, tile, radius = 10 }: BrandIconProps) {
  const [failed, setFailed] = useState(false);
  const letter = name.trim().charAt(0).toUpperCase() || "?";

  const glyph = failed ? (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--ff-disp)",
        fontWeight: 700,
        fontSize: size * 0.62,
        lineHeight: 1,
        color: hex ? "#" + hex : "var(--ink-2)",
      }}
    >
      {letter}
    </span>
  ) : (
    <img
      src={url}
      alt=""
      onError={() => setFailed(true)}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );

  if (!tile) return glyph;
  return (
    <span
      style={{
        width: tile,
        height: tile,
        borderRadius: radius,
        background: "#fff",
        border: "1px solid var(--line)",
        display: "grid",
        placeItems: "center",
        flex: "none",
      }}
    >
      {glyph}
    </span>
  );
}

interface ServiceIconProps {
  service: Pick<SmsService, "slug" | "hex" | "name">;
  size?: number;
  tile?: number;
  radius?: number;
}

/** 服务的品牌图标（本地 SVG + 字母兜底） */
export function ServiceIcon({ service, size = 20, tile, radius = 10 }: ServiceIconProps) {
  return (
    <BrandIcon
      url={iconUrl(service)}
      name={service.name}
      hex={service.hex}
      size={size}
      tile={tile}
      radius={radius}
    />
  );
}

/* ── 演示二维码 ───────────────────────────────────────── */

const MOD = 25;
const QUIET = 2;
const TOTAL = MOD + QUIET * 2;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function cellOn(seed: string, r: number, c: number): boolean {
  return (hash(`${seed}:${r},${c}`) & 7) < 3;
}

function inFinder(r: number, c: number): boolean {
  return (r < 8 && c < 8) || (r < 8 && c >= MOD - 8) || (r >= MOD - 8 && c < 8);
}

function Finder({ mr, mc }: { mr: number; mc: number }) {
  const x = mc + QUIET;
  const y = mr + QUIET;
  return (
    <>
      <rect x={x} y={y} width={7} height={7} fill="#0c1430" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="#0c1430" />
    </>
  );
}

/** 由字符串派生的装饰性「二维码」——不可扫描，只在支付演示里当占位图。 */
export function QrPlaceholder({ value, size = 160 }: { value: string; size?: number }) {
  const cells: ReactNode[] = [];
  for (let r = 0; r < MOD; r++) {
    for (let c = 0; c < MOD; c++) {
      if (inFinder(r, c)) continue;
      if (cellOn(value, r, c)) {
        cells.push(
          <rect key={`${r}-${c}`} x={c + QUIET} y={r + QUIET} width={1} height={1} fill="#0c1430" />,
        );
      }
    }
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${TOTAL} ${TOTAL}`}
      role="img"
      aria-label="QR"
      style={{ borderRadius: 12, display: "block" }}
    >
      <rect x={0} y={0} width={TOTAL} height={TOTAL} fill="#fff" />
      {cells}
      <Finder mr={0} mc={0} />
      <Finder mr={0} mc={MOD - 7} />
      <Finder mr={MOD - 7} mc={0} />
    </svg>
  );
}

/* ── 批量数量条 ───────────────────────────────────────── */

const QTY_PRESETS = [1, 5, 10, 20];
const QTY_MAX = 50;

interface QuantityBarProps {
  value: number;
  onChange: (n: number) => void;
  /** 提示文案里的单位词，如「号」 */
  unit: string;
}

/** 批量数量选择：预设档 + 自定义，钳制 1–50。 */
export function QuantityBar({ value, onChange, unit }: QuantityBarProps) {
  return (
    <div className="qty-bar">
      <div className="qty-bar__row">
        <span className="qty-bar__label">购买数量</span>
        <div className="qty-bar__opts">
          {QTY_PRESETS.map((n) => (
            <button
              key={n}
              className={"qty-chip" + (value === n ? " on" : "")}
              onClick={() => onChange(n)}
            >
              ×{n}
            </button>
          ))}
          <input
            className="qty-input"
            type="number"
            min={1}
            max={QTY_MAX}
            value={value}
            onChange={(e) => onChange(Math.max(1, Math.min(QTY_MAX, Number(e.target.value) || 1)))}
            aria-label="自定义数量"
          />
        </div>
      </div>
      <div className="qty-bar__hint">
        选择上方任一{unit}后，在下方结算确认
        {value > 1 ? `（一次冻结 ${value} 份，各自收码结算 / 超时退款）` : ""}
      </div>
    </div>
  );
}

/* ── 浏览器副作用助手 ─────────────────────────────────── */

let audioCtx: AudioContext | null = null;

/** WebAudio 双音提示（无需音频资源） */
export function playBeep() {
  try {
    audioCtx ??= new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const ctx = audioCtx;
    const now = ctx.currentTime;
    [
      { f: 784, t: 0 },
      { f: 1047, t: 0.12 },
    ].forEach(({ f, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.0001, now + t);
      gain.gain.exponentialRampToValueAtTime(0.18, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.22);
      osc.start(now + t);
      osc.stop(now + t + 0.24);
    });
  } catch {
    /* 音频不可用——忽略 */
  }
}

/** 客户端下载 content 为 filename（带 UTF-8 BOM，Excel 打开中文不乱码） */
export function downloadFile(filename: string, content: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob(["﻿" + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
