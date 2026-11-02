"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { BigOut, ErrorNote, Field, Frac, FracIn, Note, RepeatingDecimal, Tabs, parseNum, pick, type FracParts } from "./calc-ui";
import { frac, fromDecimal, parseDecimalString, toDecimal } from "../_lib/fraction";

/**
 * 分数 ⇄ 小数双向引擎:
 * - 分数 → 小数:长除法 + 余数循环检测,循环位带上划线记法。
 * - 小数 → 分数:连分数逼近,分母不超过所选上限,能精确则精确。
 * 计算全部走 tools/_lib/fraction.ts。
 */

const S = {
  fToD: { en: "Fraction → decimal", zh: "分数 → 小数", ja: "分数 → 小数", es: "Fracción → decimal", pt: "Fração → decimal" },
  dToF: { en: "Decimal → fraction", zh: "小数 → 分数", ja: "小数 → 分数", es: "Decimal → fracción", pt: "Decimal → fração" },
  fractionLabel: { en: "Fraction", zh: "分数", ja: "分数", es: "Fracción", pt: "Fração" },
  num: { en: "Numerator", zh: "分子", ja: "分子", es: "Numerador", pt: "Numerador" },
  den: { en: "Denominator", zh: "分母", ja: "分母", es: "Denominador", pt: "Denominador" },
  decimalLabel: { en: "Decimal", zh: "小数", ja: "小数", es: "Decimal", pt: "Decimal" },
  repeating: { en: "Repeating part", zh: "循环部分", ja: "循環節", es: "Período", pt: "Período" },
  repeatsForever: { en: "repeats forever", zh: "无限循环", ja: "ずっと繰り返す", es: "se repite para siempre", pt: "repete para sempre" },
  terminates: { en: "The decimal terminates — the value is exact.", zh: "这是有限小数——精确值。", ja: "有限小数なので、値は正確です。", es: "El decimal termina: el valor es exacto.", pt: "O decimal termina: o valor é exato." },
  truncated: { en: "Cycle longer than the preview — digits shown are truncated.", zh: "循环节比预览更长——显示的位数已截断。", ja: "循環節がプレビューより長いため、表示桁を切り詰めています。", es: "El período es más largo que la vista previa: dígitos truncados.", pt: "O período é mais longo que a prévia: dígitos truncados." },
  decimalIn: { en: "Decimal", zh: "小数", ja: "小数", es: "Decimal", pt: "Decimal" },
  maxDen: { en: "Max denominator", zh: "分母上限", ja: "分母の上限", es: "Denominador máximo", pt: "Denominador máximo" },
  fractionOut: { en: "Fraction", zh: "分数", ja: "分数", es: "Fracción", pt: "Fração" },
  check: { en: "Check", zh: "验算", ja: "検算", es: "Comprobación", pt: "Verificação" },
  exact: { en: "exact", zh: "精确", ja: "正確", es: "exacta", pt: "exata" },
  approx: { en: "closest within the limit", zh: "上限内最接近", ja: "上限内で最も近い", es: "la más cercana dentro del límite", pt: "a mais próxima dentro do limite" },
  decNote: {
    en: "Type a decimal like 0.5, 0.333 or 3.142857 — a dot as the separator. The tool returns the exact fraction when one fits your denominator limit, otherwise the closest one.",
    zh: "输入类似 0.5、0.333 或 3.142857 的小数(用点作小数点)。工具优先给出分母上限内精确的分数,否则给出最接近的分数。",
    ja: "0.5、0.333、3.142857 のような小数を入力してください(小数点はドット)。分母の上限内で正確な分数があればそれを、なければ最も近い分数を出します。",
    es: "Escriba un decimal como 0.5, 0.333 o 3.142857, con punto como separador. La herramienta devuelve la fracción exacta si cabe en su límite de denominador; si no, la más cercana.",
    pt: "Digite um decimal como 0.5, 0.333 ou 3.142857, com ponto como separador. A ferramenta devolve a fração exata se ela couber no limite de denominador; senão, a mais próxima.",
  },
  repNote: {
    en: "A bar over a digit means it repeats forever: 1/3 = 0.3̄. Every fraction becomes a terminating or a repeating decimal — never anything else.",
    zh: "数字上方的横线表示无限循环:1/3 = 0.3̄(3 循环)。任何分数的小数要么有限,要么循环,不会有别的形态。",
    ja: "数字の上のバーは無限に繰り返すことを示します。1/3 = 0.3̄。分数の小数は有限小数か循環小数のどちらかです。",
    es: "La barra sobre un dígito indica que se repite para siempre: 1/3 = 0.3̄. Toda fracción da un decimal terminante o periódico, nunca otra cosa.",
    pt: "A barra sobre um dígito indica que ele repete para sempre: 1/3 = 0.3̄. Toda fração gera um decimal exato ou periódico, nunca outra coisa.",
  },
  errDen: {
    en: "The denominator can't be zero.",
    zh: "分母不能为 0。",
    ja: "分母は 0 にできません。",
    es: "El denominador no puede ser cero.",
    pt: "O denominador não pode ser zero.",
  },
  errDec: {
    en: "That isn't a decimal number — use digits with at most one dot, like 0.75.",
    zh: "这不是有效小数——请用数字加至多一个小数点,如 0.75。",
    ja: "小数として認識できません。0.75 のように数字と小数点を 1 つだけ使ってください。",
    es: "Eso no es un decimal: use dígitos con a lo sumo un punto, como 0.75.",
    pt: "Isso não é um decimal: use dígitos com no máximo um ponto, como 0.75.",
  },
  errRange: {
    en: "Please stay within ±10^15 — larger values lose precision.",
    zh: "请保持在 ±10¹⁵ 以内——更大的数会损失精度。",
    ja: "±10^15 以内で入力してください。それを超えると精度が落ちます。",
    es: "Manténgase dentro de ±10^15: los valores mayores pierden precisión.",
    pt: "Mantenha-se dentro de ±10^15: valores maiores perdem precisão.",
  },
  emptyF: { en: "Enter a fraction to see its decimal.", zh: "输入一个分数即可看到小数。", ja: "分数を入力すると小数が出ます。", es: "Introduzca una fracción para ver su decimal.", pt: "Informe uma fração para ver seu decimal." },
  emptyD: { en: "Type a decimal to see the fraction.", zh: "输入一个小数即可看到分数。", ja: "小数を入力すると分数が出ます。", es: "Escriba un decimal para ver la fracción.", pt: "Digite um decimal para ver a fração." },
};

const MAX_DEN_OPTIONS = [10, 100, 1000, 10000];

function parseParts(p: FracParts): { num: number; den: number; complete: boolean } {
  const num = parseNum(p.num);
  const den = parseNum(p.den);
  return { num: num ?? 0, den: den ?? 0, complete: num !== null && den !== null };
}

export function DecimalEngine() {
  const { locale } = useI18n();
  const [mode, setMode] = useState<"f2d" | "d2f">("f2d");

  // 分数 → 小数
  const [f, setF] = useState<FracParts>({ num: "1", den: "3" });
  const pf = parseParts(f);
  const fVal = pf.complete && pf.den !== 0 ? frac(pf.num, pf.den) : null;
  const dec = fVal ? toDecimal(fVal, 12) : null;
  const repPrefix =
    dec?.decimal && dec.repeating ? dec.decimal.slice(0, dec.decimal.length - dec.repeating.length) : null;

  // 小数 → 分数
  const [decIn, setDecIn] = useState("0.333");
  const [maxDen, setMaxDen] = useState(100);
  const decVal = parseDecimalString(decIn);
  const decOutOfRange = decVal !== null && Math.abs(decVal) >= 1e15;
  const fOut = decVal !== null && !decOutOfRange ? fromDecimal(decVal, maxDen) : null;
  const fOutDec = fOut ? toDecimal(fOut, 12) : null;
  const exact =
    fOut && decVal !== null
      ? Math.abs(fOut.num / fOut.den - decVal) < 5e-13 * Math.max(1, Math.abs(decVal))
      : false;

  return (
    <ToolPanel>
      <Tabs
        options={[
          { id: "f2d", label: pick(locale, S.fToD) },
          { id: "d2f", label: pick(locale, S.dToF) },
        ]}
        value={mode}
        onChange={(id) => setMode(id as "f2d" | "d2f")}
      />

      {mode === "f2d" ? (
        <>
          <div className="max-w-[240px]">
            <Field label={pick(locale, S.fractionLabel)}>
              <FracIn
                parts={f}
                onChange={setF}
                ariaNum={pick(locale, S.num)}
                ariaDen={pick(locale, S.den)}
                invalid={pf.complete && pf.den === 0}
              />
            </Field>
          </div>

          {!pf.complete ? (
            <div className="mt-5">
              <Note>{pick(locale, S.emptyF)}</Note>
            </div>
          ) : pf.den === 0 ? (
            <div className="mt-5">
              <ErrorNote>{pick(locale, S.errDen)}</ErrorNote>
            </div>
          ) : !fVal || !dec ? (
            <div className="mt-5">
              <ErrorNote>{pick(locale, S.errDen)}</ErrorNote>
            </div>
          ) : (
            <>
              <BigOut label={pick(locale, S.decimalLabel)}>
                {dec.repeating && repPrefix !== null ? (
                  <RepeatingDecimal prefix={repPrefix} repetend={dec.repeating} />
                ) : (
                  dec.decimal
                )}
              </BigOut>
              <div className="mt-4">
                <Note>
                  {dec.repeating
                    ? `${pick(locale, S.repeating)}: ${dec.repeating} — ${pick(locale, S.repeatsForever)}`
                    : dec.decimal.endsWith("…")
                      ? pick(locale, S.truncated)
                      : pick(locale, S.terminates)}
                </Note>
              </div>
            </>
          )}

          <div className="mt-4">
            <Note>{pick(locale, S.repNote)}</Note>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={pick(locale, S.decimalIn)}>
              <input
                type="text"
                inputMode="decimal"
                dir="ltr"
                className="field mono w-full"
                value={decIn}
                onChange={(e) => setDecIn(e.target.value)}
                aria-label={pick(locale, S.decimalIn)}
                placeholder="0.333"
              />
            </Field>
            <Field label={pick(locale, S.maxDen)}>
              <select
                className="field mono w-full"
                value={maxDen}
                onChange={(e) => setMaxDen(Number(e.target.value))}
                aria-label={pick(locale, S.maxDen)}
              >
                {MAX_DEN_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    ≤ {n}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {decIn.trim() === "" ? (
            <div className="mt-5">
              <Note>{pick(locale, S.emptyD)}</Note>
            </div>
          ) : decVal === null ? (
            <div className="mt-5">
              <ErrorNote>{pick(locale, S.errDec)}</ErrorNote>
            </div>
          ) : decOutOfRange || !fOut ? (
            <div className="mt-5">
              <ErrorNote>{pick(locale, S.errRange)}</ErrorNote>
            </div>
          ) : (
            <>
              <BigOut label={pick(locale, S.fractionOut)}>
                <Frac num={fOut.num} den={fOut.den} />
              </BigOut>
              <div className="mt-5 max-w-md">
                <Field label={pick(locale, S.check)}>
                  <p className="mono text-[15px] font-semibold" dir="ltr">
                    {fOut.num}/{fOut.den} = {fOutDec?.decimal ?? "—"}{" "}
                    <span className={exact ? "text-[var(--color-good)]" : "text-[var(--color-accent-strong)]"}>
                      ({exact ? pick(locale, S.exact) : pick(locale, S.approx)})
                    </span>
                  </p>
                </Field>
              </div>
            </>
          )}

          <div className="mt-4">
            <Note>{pick(locale, S.decNote)}</Note>
          </div>
        </>
      )}
    </ToolPanel>
  );
}
