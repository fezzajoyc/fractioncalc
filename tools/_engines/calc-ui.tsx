"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/site";

/** FractionCalc 引擎共用的轻量 UI 原语与取词助手(全部客户端组件)。 */

export const INTL_LOCALES: Record<Locale, string> = {
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  es: "es-ES",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ru: "ru-RU",
  it: "it-IT",
  tr: "tr-TR",
  ko: "ko-KR",
  ar: "ar-SA",
  hi: "hi-IN",
  id: "id-ID",
  vi: "vi-VN",
};

/** 引擎内的每语言短文案:按 locale 取,缺省回退英文。 */
export function pick(locale: Locale, rec: Record<string, string>): string {
  return rec[locale] ?? rec.en;
}

export function fmtNum(n: number, locale: Locale): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(INTL_LOCALES[locale] ?? "en-US", { maximumFractionDigits: 0 }).format(n);
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="block text-[13px] font-medium text-[var(--color-sub)]">{label}</span>
      {children}
    </div>
  );
}

/** 整数输入(分子/分母/整数部)。空串原样上抛,由引擎解析。 */
export function NumIn({
  value,
  onChange,
  aria,
  invalid = false,
}: {
  value: string;
  onChange: (v: string) => void;
  aria: string;
  invalid?: boolean;
}) {
  return (
    <input
      type="number"
      step="1"
      className={`field mono w-full ${invalid ? "border-[var(--color-bad)]" : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={aria}
      inputMode="numeric"
    />
  );
}

export type FracParts = { num: string; den: string };

/** a/b 一对整数输入,中间一条分数线。 */
export function FracIn({
  parts,
  onChange,
  ariaNum,
  ariaDen,
  invalid = false,
}: {
  parts: FracParts;
  onChange: (p: FracParts) => void;
  ariaNum: string;
  ariaDen: string;
  invalid?: boolean;
}) {
  return (
    <div className="inline-flex flex-col items-center gap-1" dir="ltr">
      <NumIn value={parts.num} onChange={(v) => onChange({ ...parts, num: v })} aria={ariaNum} invalid={invalid} />
      <span aria-hidden className="h-px w-14 bg-[var(--color-ink)] opacity-40" />
      <NumIn value={parts.den} onChange={(v) => onChange({ ...parts, den: v })} aria={ariaDen} invalid={invalid} />
    </div>
  );
}

/** 大号只读结果(主答案位)。 */
export function BigOut({ children, label }: { children: ReactNode; label: string }) {
  return (
    <output
      aria-live="polite"
      aria-label={label}
      className="mono mt-5 block rounded-xl border hairline bg-[var(--color-surface)] px-4 py-3.5 text-lg font-semibold"
      dir="ltr"
    >
      {children}
    </output>
  );
}

/** 分段胶囊切换。 */
export function Tabs({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2" role="tablist">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
            value === o.id
              ? "border-transparent bg-[var(--color-ink)] text-white"
              : "hairline hover:bg-[var(--color-surface)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Stats({
  items,
  cols = "sm:grid-cols-2",
}: {
  items: { label: string; value: string; tone?: "good" | "accent" }[];
  cols?: string;
}) {
  const tone = (t?: string) =>
    t === "good" ? "text-[var(--color-good)]" : t === "accent" ? "text-[var(--color-accent-strong)]" : "text-[var(--color-ink)]";
  return (
    <div className={`grid grid-cols-2 gap-3 ${cols}`}>
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border hairline px-3.5 py-3">
          <div className="text-[12.5px] font-medium text-[var(--color-sub)]">{it.label}</div>
          <div className={`mono mt-1 text-[17px] font-semibold leading-6 ${tone(it.tone)}`} aria-live="polite" dir="ltr">
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-[13px] leading-5 text-[var(--color-sub)]">{children}</p>;
}

/** 错误提示行(与 Note 视觉区分)。 */
export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-[13px] leading-5 font-medium text-[var(--color-bad)]">
      {children}
    </p>
  );
}

/** 分数排版:numerator/denominator 竖式(monospace)。 */
export function Frac({ num, den }: { num: ReactNode; den: ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center align-middle leading-tight" dir="ltr">
      <span>{num}</span>
      <span aria-hidden className="my-0.5 h-px w-full min-w-6 bg-current opacity-50" />
      <span>{den}</span>
    </span>
  );
}

/** 循环小数的上标记法:prefix + overline(repetend)。 */
export function RepeatingDecimal({ prefix, repetend }: { prefix: string; repetend: string }) {
  return (
    <span dir="ltr">
      {prefix}
      <span style={{ textDecoration: "overline" }}>{repetend}</span>
    </span>
  );
}

/** 步骤列表:结构化步骤的统一渲染(带编号)。 */
export function StepList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="mt-3 space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--color-surface)] text-[11px] font-semibold text-[var(--color-sub)]"
          >
            {i + 1}
          </span>
          <div className="min-w-0 text-[14.5px] leading-6">{it}</div>
        </li>
      ))}
    </ol>
  );
}

export function parseNum(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : NaN;
}
