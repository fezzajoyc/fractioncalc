"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { BigOut, ErrorNote, Field, Frac, FracIn, Note, Stats, StepList, Tabs, parseNum, pick, type FracParts } from "./calc-ui";
import { addSubSteps, formatMixed, normalize, frac, toDecimal, toMixed } from "../_lib/fraction";
import type { Locale } from "@/lib/site";

/**
 * 加减引擎:两个分数 + 运算符 → 最简分数、带分数、小数,以及
 * LCD → 同分母 → 合并 → 约分的完整步骤。计算全部走 tools/_lib/fraction.ts。
 */

const S = {
  first: { en: "First fraction", zh: "第一个分数", ja: "1 番目の分数", es: "Primera fracción", pt: "Primeira fração" },
  second: { en: "Second fraction", zh: "第二个分数", ja: "2 番目の分数", es: "Segunda fracción", pt: "Segunda fração" },
  num: { en: "Numerator", zh: "分子", ja: "分子", es: "Numerador", pt: "Numerador" },
  den: { en: "Denominator", zh: "分母", ja: "分母", es: "Denominador", pt: "Denominador" },
  plus: { en: "Add (+)", zh: "加(+)", ja: "足し算(+)", es: "Sumar (+)", pt: "Somar (+)" },
  minus: { en: "Subtract (−)", zh: "减(−)", ja: "引き算(−)", es: "Restar (−)", pt: "Subtrair (−)" },
  result: { en: "Result", zh: "结果", ja: "結果", es: "Resultado", pt: "Resultado" },
  asMixed: { en: "As a mixed number", zh: "化为带分数", ja: "帯分数で", es: "Como número mixto", pt: "Como número misto" },
  asDecimal: { en: "As a decimal", zh: "化为小数", ja: "小数で", es: "Como decimal", pt: "Como decimal" },
  steps: { en: "Step by step", zh: "计算步骤", ja: "計算の過程", es: "Paso a paso", pt: "Passo a passo" },
  lcdOf: { en: "Least common denominator of {a} and {b}: {c}", zh: "{a} 和 {b} 的最小公分母:{c}", ja: "{a} と {b} の最小公分母:{c}", es: "Mínimo común denominador de {a} y {b}: {c}", pt: "Mínimo denominador comum de {a} e {b}: {c}" },
  equivalent: { en: "Equivalent fractions over the common denominator", zh: "化成同分母的等价分数", ja: "共通分母での同値な分数", es: "Fracciones equivalentes con el denominador común", pt: "Frações equivalentes com o denominador comum" },
  combine: { en: "Combine the numerators", zh: "分子相加减", ja: "分子を足す(引く)", es: "Combine los numeradores", pt: "Combine os numeradores" },
  alreadyLowest: { en: "already in lowest terms", zh: "已是最简分数", ja: "すでに既約", es: "ya está en términos mínimos", pt: "já está irredutível" },
  divideByGcd: { en: "Divide top and bottom by {n}", zh: "分子分母同除以 {n}", ja: "分子と分母を {n} で割る", es: "Divida numerador y denominador entre {n}", pt: "Divida numerador e denominador por {n}" },
  mixedNote: {
    en: "Negative mixed numbers keep the minus in front: −7/3 reads as −2 1/3.",
    zh: "负数的带分数把负号放最前面:−7/3 读作负 2 又 1/3。",
    ja: "負の帯分数は符号を先頭に置きます:−7/3 は「マイナス 2 と 1/3」です。",
    es: "Los números mixtos negativos llevan el signo delante: −7/3 se lee −2 1/3.",
    pt: "Números mistos negativos trazem o sinal na frente: −7/3 lê-se −2 1/3.",
  },
  errDen: {
    en: "Denominators can't be zero — enter a whole number other than 0 for each denominator.",
    zh: "分母不能为 0——请为每个分母输入一个非 0 的整数。",
    ja: "分母は 0 にできません。0 以外の整数を入力してください。",
    es: "Los denominadores no pueden ser cero: escriba un entero distinto de 0.",
    pt: "Os denominadores não podem ser zero: informe um inteiro diferente de 0.",
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

function parseParts(p: FracParts): { num: number; den: number; complete: boolean; valid: boolean } {
  const num = parseNum(p.num);
  const den = parseNum(p.den);
  const complete = num !== null && den !== null;
  return { num: num ?? 0, den: den ?? 0, complete, valid: complete && den !== 0 };
}

export function AddSubEngine() {
  const { locale } = useI18n();
  const [op, setOp] = useState<"+" | "-">("+");
  const [f1, setF1] = useState<FracParts>({ num: "1", den: "2" });
  const [f2, setF2] = useState<FracParts>({ num: "1", den: "3" });

  const p1 = parseParts(f1);
  const p2 = parseParts(f2);
  const ready = p1.complete && p2.complete;
  const denZero = (p1.complete && p1.den === 0) || (p2.complete && p2.den === 0);
  const valid = ready && !denZero && frac(p1.num, p1.den) !== null && frac(p2.num, p2.den) !== null;

  // 步骤展示用原始输入(仅统一符号,不约分):2/4 就以 2/4 参与通分
  const a = valid ? normalize({ num: p1.num, den: p1.den }) : null;
  const b = valid ? normalize({ num: p2.num, den: p2.den }) : null;
  const steps = a && b ? addSubSteps(a, b, op) : null;
  const result = steps?.result ?? null;
  const mixed = result ? toMixed(result) : null;
  const decimal = result ? toDecimal(result) : null;

  const stepItems = steps
    ? [
        fill(pick(locale, S.lcdOf), { a: a!.den, b: b!.den, c: steps.lcm }),
        <span key="eq" className="inline-flex flex-wrap items-center gap-2" dir="ltr">
          <Frac num={a!.num} den={a!.den} /> = <Frac num={steps.eq1.num} den={steps.eq1.den} />
          <span className="px-1">·</span>
          <Frac num={b!.num} den={b!.den} /> = <Frac num={steps.eq2.num} den={steps.eq2.den} />
        </span>,
        <span key="comb" className="inline-flex flex-wrap items-center gap-2" dir="ltr">
          <Frac num={steps.eq1.num} den={steps.eq1.den} /> {steps.op === "-" ? "−" : "+"} <Frac num={steps.eq2.num} den={steps.eq2.den} /> ={" "}
          <Frac num={steps.combined.num} den={steps.combined.den} />
        </span>,
        steps.gcdUsed > 1 ? (
          <span key="simp" className="inline-flex flex-wrap items-center gap-2" dir="ltr">
            {fill(pick(locale, S.divideByGcd), { n: steps.gcdUsed })}:{" "}
            <Frac num={steps.combined.num} den={steps.combined.den} /> = <Frac num={steps.result.num} den={steps.result.den} />
          </span>
        ) : (
          <span key="simp">{pick(locale, S.alreadyLowest)}</span>
        ),
      ]
    : [];

  return (
    <ToolPanel>
      <Tabs
        options={[
          { id: "+", label: pick(locale, S.plus) },
          { id: "-", label: pick(locale, S.minus) },
        ]}
        value={op}
        onChange={(id) => setOp(id as "+" | "-")}
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
          <ErrorNote>{pick(locale, S.errGeneral)}</ErrorNote>
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
        <Note>{pick(locale, S.mixedNote)}</Note>
      </div>
    </ToolPanel>
  );
}
