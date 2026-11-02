"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { BigOut, ErrorNote, Field, Frac, FracIn, Note, Stats, StepList, Tabs, parseNum, pick, type FracParts } from "./calc-ui";
import { frac, formatMixed, mulDivSteps, normalize, toDecimal, toMixed } from "../_lib/fraction";

/**
 * 乘除引擎:两个分数 + 运算符(×/÷)→ 交叉约分 → 相乘 → 最简结果,
 * 附带分数、小数。计算全部走 tools/_lib/fraction.ts。
 */

const S = {
  first: { en: "First fraction", zh: "第一个分数", ja: "1 番目の分数", es: "Primera fracción", pt: "Primeira fração" },
  second: { en: "Second fraction", zh: "第二个分数", ja: "2 番目の分数", es: "Segunda fracción", pt: "Segunda fração" },
  num: { en: "Numerator", zh: "分子", ja: "分子", es: "Numerador", pt: "Numerador" },
  den: { en: "Denominator", zh: "分母", ja: "分母", es: "Denominador", pt: "Denominador" },
  times: { en: "Multiply (×)", zh: "乘(×)", ja: "かけ算(×)", es: "Multiplicar (×)", pt: "Multiplicar (×)" },
  divided: { en: "Divide (÷)", zh: "除(÷)", ja: "わり算(÷)", es: "Dividir (÷)", pt: "Dividir (÷)" },
  result: { en: "Result", zh: "结果", ja: "結果", es: "Resultado", pt: "Resultado" },
  asMixed: { en: "As a mixed number", zh: "化为带分数", ja: "帯分数で", es: "Como número mixto", pt: "Como número misto" },
  asDecimal: { en: "As a decimal", zh: "化为小数", ja: "小数で", es: "Como decimal", pt: "Como decimal" },
  steps: { en: "Step by step", zh: "计算步骤", ja: "計算の過程", es: "Paso a paso", pt: "Passo a passo" },
  flip: { en: "Dividing by {a}/{b} is multiplying by {c}/{d}", zh: "除以 {a}/{b} 等于乘以 {c}/{d}", ja: "{a}/{b} で割ることは {c}/{d} をかけること", es: "Dividir entre {a}/{b} es multiplicar por {c}/{d}", pt: "Dividir por {a}/{b} é multiplicar por {c}/{d}" },
  crossSimplify: { en: "Cross-simplify before multiplying", zh: "先交叉约分再相乘", ja: "かける前にたすき掛けで約分", es: "Simplifique en cruz antes de multiplicar", pt: "Simplifique em cruz antes de multiplicar" },
  multiplyReduced: { en: "Multiply the reduced fractions", zh: "约分后的分数相乘", ja: "約分した分数をかける", es: "Multiplique las fracciones simplificadas", pt: "Multiplique as frações reduzidas" },
  alreadyLowest: { en: "already in lowest terms", zh: "已是最简分数", ja: "すでに既約", es: "ya está en términos mínimos", pt: "já está irredutível" },
  divideByGcd: { en: "Divide top and bottom by {n}", zh: "分子分母同除以 {n}", ja: "分子と分母を {n} で割る", es: "Divida numerador y denominador entre {n}", pt: "Divida numerador e denominador por {n}" },
  errDen: {
    en: "Denominators can't be zero — enter a whole number other than 0 for each denominator.",
    zh: "分母不能为 0——请为每个分母输入一个非 0 的整数。",
    ja: "分母は 0 にできません。0 以外の整数を入力してください。",
    es: "Los denominadores no pueden ser cero: escriba un entero distinto de 0.",
    pt: "Os denominadores não podem ser zero: informe um inteiro diferente de 0.",
  },
  errZeroDiv: {
    en: "Division by zero is undefined — the second fraction needs a numerator other than 0.",
    zh: "除以 0 没有意义——第二个分数的分子不能为 0。",
    ja: "0 で割ることは定義されていません。2 番目の分子に 0 以外を入力してください。",
    es: "Dividir entre cero no está definido: el numerador de la segunda fracción no puede ser 0.",
    pt: "Divisão por zero não existe: o numerador da segunda fração não pode ser 0.",
  },
  errGeneral: {
    en: "Enter whole numbers for both numerators and denominators.",
    zh: "分子和分母请输入整数。",
    ja: "分子と分母には整数を入力してください。",
    es: "Escriba enteros en numeradores y denominadores.",
    pt: "Informe inteiros para numeradores e denominadores.",
  },
  pick2: { en: "Enter both fractions to see the result.", zh: "输入两个分数即可看到结果。", ja: "両方の分数を入力すると結果が出ます。", es: "Introduzca ambas fracciones para ver el resultado.", pt: "Informe as duas frações para ver o resultado." },
};

function fill(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

function parseParts(p: FracParts): { num: number; den: number; complete: boolean } {
  const num = parseNum(p.num);
  const den = parseNum(p.den);
  return { num: num ?? 0, den: den ?? 0, complete: num !== null && den !== null };
}

export function MulDivEngine() {
  const { locale } = useI18n();
  const [op, setOp] = useState<"×" | "÷">("×");
  const [f1, setF1] = useState<FracParts>({ num: "2", den: "4" });
  const [f2, setF2] = useState<FracParts>({ num: "3", den: "6" });

  const p1 = parseParts(f1);
  const p2 = parseParts(f2);
  const ready = p1.complete && p2.complete;
  const denZero = (p1.complete && p1.den === 0) || (p2.complete && p2.den === 0);
  const valid = ready && !denZero && frac(p1.num, p1.den) !== null && frac(p2.num, p2.den) !== null;

  // 步骤展示用原始输入(仅统一符号,不约分):交叉约分的故事需要原始数字
  const a = valid ? normalize({ num: p1.num, den: p1.den }) : null;
  const b = valid ? normalize({ num: p2.num, den: p2.den }) : null;
  const steps = a && b ? mulDivSteps(a, b, op) : null;
  const result = steps?.result ?? null;
  const mixed = result ? toMixed(result) : null;
  const decimal = result ? toDecimal(result) : null;

  const stepItems = steps
    ? [
        steps.reciprocal ? (
          <span key="flip" dir="ltr">
            {fill(pick(locale, S.flip), {
              a: b!.num,
              b: b!.den,
              c: steps.reciprocal.num,
              d: steps.reciprocal.den,
            })}
          </span>
        ) : null,
        <span key="cross" className="inline-flex flex-wrap items-center gap-2" dir="ltr">
          {pick(locale, S.crossSimplify)}:{" "}
          <Frac num={a!.num} den={a!.den} /> → <Frac num={steps.aReduced.num} den={steps.aReduced.den} />
          <span className="px-1">·</span>
          <Frac num={(steps.reciprocal ?? b!).num} den={(steps.reciprocal ?? b!).den} /> →{" "}
          <Frac num={steps.bReduced.num} den={steps.bReduced.den} />
        </span>,
        <span key="mul" className="inline-flex flex-wrap items-center gap-2" dir="ltr">
          {pick(locale, S.multiplyReduced)}: <Frac num={steps.aReduced.num} den={steps.aReduced.den} /> ×{" "}
          <Frac num={steps.bReduced.num} den={steps.bReduced.den} /> ={" "}
          <Frac num={steps.product.num} den={steps.product.den} />
        </span>,
        steps.gcdProduct > 1 ? (
          <span key="simp" className="inline-flex flex-wrap items-center gap-2" dir="ltr">
            {fill(pick(locale, S.divideByGcd), { n: steps.gcdProduct })}:{" "}
            <Frac num={steps.product.num} den={steps.product.den} /> = <Frac num={steps.result.num} den={steps.result.den} />
          </span>
        ) : (
          <span key="simp">{pick(locale, S.alreadyLowest)}</span>
        ),
      ].filter((x): x is ReactElement => x !== null)
    : [];

  return (
    <ToolPanel>
      <Tabs
        options={[
          { id: "×", label: pick(locale, S.times) },
          { id: "÷", label: pick(locale, S.divided) },
        ]}
        value={op}
        onChange={(id) => setOp(id as "×" | "÷")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={pick(locale, S.first)}>
          <FracIn
            parts={f1}
            onChange={setF1}
            ariaNum={`${pick(locale, S.first)} — ${pick(locale, S.num)}`}
            ariaDen={`${pick(locale, S.first)} — ${pick(locale, S.den)}`}
            invalid={p1.complete && p1.den === 0}
          />
        </Field>
        <Field label={pick(locale, S.second)}>
          <FracIn
            parts={f2}
            onChange={setF2}
            ariaNum={`${pick(locale, S.second)} — ${pick(locale, S.num)}`}
            ariaDen={`${pick(locale, S.second)} — ${pick(locale, S.den)}`}
            invalid={p2.complete && p2.den === 0}
          />
        </Field>
      </div>

      {!ready ? (
        <div className="mt-5">
          <Note>{pick(locale, S.pick2)}</Note>
        </div>
      ) : denZero ? (
        <div className="mt-5">
          <ErrorNote>{pick(locale, S.errDen)}</ErrorNote>
        </div>
      ) : !result || !steps ? (
        <div className="mt-5">
          <ErrorNote>{op === "÷" ? pick(locale, S.errZeroDiv) : pick(locale, S.errGeneral)}</ErrorNote>
        </div>
      ) : (
        <>
          <BigOut label={pick(locale, S.result)}>
            <span className="inline-flex items-center gap-3">
              <Frac num={result.num} den={result.den} />
              {decimal ? <span className="text-[15px] font-medium text-[var(--color-sub)]">≈ {decimal.decimal}</span> : null}
            </span>
          </BigOut>
          {mixed && mixed.num !== 0 ? (
            <div className="mt-5">
              <Stats
                items={[
                  { label: pick(locale, S.asMixed), value: formatMixed(mixed) },
                  { label: pick(locale, S.asDecimal), value: decimal?.decimal ?? "—" },
                ]}
              />
            </div>
          ) : null}

          <div className="mt-6 rounded-xl border hairline px-4 py-4">
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-sub)]">{pick(locale, S.steps)}</h3>
            <StepList items={stepItems} />
          </div>
        </>
      )}

      <div className="mt-4">
        <Note>
          {locale === "zh"
            ? "乘法先交叉约分可以让数字变小:分子与对方的分母约,分母与对方的分子约。"
            : locale === "ja"
              ? "かけ算の前にたすき掛けで約分すると、数が小さくなります。"
              : locale === "es"
                ? "Simplificar en cruz antes de multiplicar mantiene los números pequeños."
                : locale === "pt"
                  ? "Simplificar em cruz antes de multiplicar mantém os números pequenos."
                  : "Cross-simplifying before multiplying keeps every number small: each numerator cancels against the other denominator."}
        </Note>
      </div>
    </ToolPanel>
  );
}
