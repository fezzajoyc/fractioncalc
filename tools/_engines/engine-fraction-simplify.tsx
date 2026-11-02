"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { BigOut, ErrorNote, Field, Frac, FracIn, Note, Stats, parseNum, pick, type FracParts } from "./calc-ui";
import { frac, formatMixed, gcd, normalize, simplify, toDecimal, toMixed } from "../_lib/fraction";

/**
 * 化简引擎:任意分数 → 最简分数 + 使用的最大公约数 + 小数值;
 * 假分数同时给出带分数形式。计算全部走 tools/_lib/fraction.ts。
 */

const S = {
  input: { en: "Fraction to simplify", zh: "要化简的分数", ja: "約分する分数", es: "Fracción a simplificar", pt: "Fração a simplificar" },
  num: { en: "Numerator", zh: "分子", ja: "分子", es: "Numerador", pt: "Numerador" },
  den: { en: "Denominator", zh: "分母", ja: "分母", es: "Denominador", pt: "Denominador" },
  result: { en: "Simplified", zh: "化简结果", ja: "約分後", es: "Simplificada", pt: "Simplificada" },
  gcdUsed: { en: "GCD used", zh: "使用的最大公约数", ja: "使用した最大公約数", es: "MCD utilizado", pt: "MDC utilizado" },
  decimal: { en: "Decimal value", zh: "小数值", ja: "小数値", es: "Valor decimal", pt: "Valor decimal" },
  asMixed: { en: "As a mixed number", zh: "化为带分数", ja: "帯分数で", es: "Como número mixto", pt: "Como número misto" },
  alreadyLowest: {
    en: "This fraction is already in lowest terms — no common factor to cancel.",
    zh: "这个分数已经是最简分数——分子分母没有公因数可约。",
    ja: "この分数はすでに既約です。約分できる公約数はありません。",
    es: "Esta fracción ya está en términos mínimos: no hay factor común que cancelar.",
    pt: "Esta fração já está irredutível: não há fator comum a cancelar.",
  },
  gcdNote: {
    en: "Simplifying divides the numerator and the denominator by their greatest common divisor (GCD). The value never changes: 8/12 and 2/3 sit at the same point on the number line.",
    zh: "化简就是把分子和分母同除以它们的最大公约数(GCD)。分数值不变:8/12 和 2/3 在数轴上是同一个点。",
    ja: "約分は分子と分母を最大公約数(GCD)で割る操作です。値は変わりません。8/12 と 2/3 は数直線上の同じ点です。",
    es: "Simplificar divide numerador y denominador entre su máximo común divisor (MCD). El valor no cambia: 8/12 y 2/3 son el mismo punto en la recta numérica.",
    pt: "Simplificar divide numerador e denominador pelo máximo divisor comum (MDC). O valor não muda: 8/12 e 2/3 são o mesmo ponto na reta numérica.",
  },
  errDen: {
    en: "The denominator can't be zero — division by zero has no value.",
    zh: "分母不能为 0——除以 0 没有意义。",
    ja: "分母は 0 にできません。0 で割る値は定義されていません。",
    es: "El denominador no puede ser cero: dividir entre cero no tiene valor.",
    pt: "O denominador não pode ser zero: divisão por zero não tem valor.",
  },
  errGeneral: {
    en: "Enter whole numbers for the numerator and the denominator.",
    zh: "分子和分母请输入整数。",
    ja: "分子と分母には整数を入力してください。",
    es: "Escriba enteros en numerador y denominador.",
    pt: "Informe inteiros para numerador e denominador.",
  },
  empty: { en: "Enter a fraction to simplify it.", zh: "输入一个分数即可化简。", ja: "分数を入力すると約分します。", es: "Introduzca una fracción para simplificarla.", pt: "Informe uma fração para simplificá-la." },
};

function parseParts(p: FracParts): { num: number; den: number; complete: boolean } {
  const num = parseNum(p.num);
  const den = parseNum(p.den);
  return { num: num ?? 0, den: den ?? 0, complete: num !== null && den !== null };
}

export function SimplifyEngine() {
  const { locale } = useI18n();
  const [f, setF] = useState<FracParts>({ num: "8", den: "12" });

  const p = parseParts(f);
  // 原始输入(仅统一符号):8/12 就显示 8/12 → 2/3,GCD 4
  const raw = p.complete && p.den !== 0 ? normalize({ num: p.num, den: p.den }) : null;
  const result = raw ? simplify(raw) : null;
  const g = raw && result ? gcd(raw.num, raw.den) : null;
  const mixed = result ? toMixed(result) : null;
  const decimal = result ? toDecimal(result) : null;
  const denZero = p.complete && p.den === 0;

  return (
    <ToolPanel>
      <div className="max-w-[240px]">
        <Field label={pick(locale, S.input)}>
          <FracIn
            parts={f}
            onChange={setF}
            ariaNum={pick(locale, S.num)}
            ariaDen={pick(locale, S.den)}
            invalid={denZero}
          />
        </Field>
      </div>

      {!p.complete ? (
        <div className="mt-5">
          <Note>{pick(locale, S.empty)}</Note>
        </div>
      ) : denZero ? (
        <div className="mt-5">
          <ErrorNote>{pick(locale, S.errDen)}</ErrorNote>
        </div>
      ) : !result || raw === null ? (
        <div className="mt-5">
          <ErrorNote>{pick(locale, S.errGeneral)}</ErrorNote>
        </div>
      ) : (
        <>
          <BigOut label={pick(locale, S.result)}>
            <span className="inline-flex items-center gap-3" dir="ltr">
              <Frac num={raw.num} den={raw.den} /> = <Frac num={result.num} den={result.den} />
            </span>
          </BigOut>
          <div className="mt-5">
            <Stats
              items={[
                { label: pick(locale, S.gcdUsed), value: String(g), tone: "accent" },
                { label: pick(locale, S.decimal), value: decimal?.decimal ?? "—" },
                ...(mixed && mixed.num !== 0 ? [{ label: pick(locale, S.asMixed), value: formatMixed(mixed) }] : []),
              ]}
            />
          </div>
          <div className="mt-4">
            <Note>{g === 1 ? pick(locale, S.alreadyLowest) : pick(locale, S.gcdNote)}</Note>
          </div>
        </>
      )}
    </ToolPanel>
  );
}
