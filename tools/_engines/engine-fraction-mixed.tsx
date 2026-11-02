"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ToolPanel } from "@/components/ui";
import { BigOut, ErrorNote, Field, Frac, FracIn, Note, NumIn, StepList, Tabs, parseNum, pick, type FracParts } from "./calc-ui";
import { add, divide, frac, formatFraction, formatMixed, fromMixed, multiply, subtract, toDecimal, toMixed, type Mixed } from "../_lib/fraction";
import type { Locale } from "@/lib/site";

/**
 * 带分数引擎:
 * - 换算:假分数 ⇄ 带分数(双向独立面板)。
 * - 运算:两个带分数加减乘除,结果同时给出带分数、假分数与小数。
 * 计算全部走 tools/_lib/fraction.ts。
 */

const S = {
  convert: { en: "Convert", zh: "换算", ja: "変換", es: "Convertir", pt: "Converter" },
  arithmetic: { en: "Arithmetic", zh: "运算", ja: "計算", es: "Operaciones", pt: "Operações" },
  improper: { en: "Improper fraction", zh: "假分数", ja: "仮分数", es: "Fracción impropia", pt: "Fração imprópria" },
  mixedLabel: { en: "Mixed number", zh: "带分数", ja: "帯分数", es: "Número mixto", pt: "Número misto" },
  whole: { en: "Whole", zh: "整数部", ja: "整数部", es: "Entero", pt: "Inteiro" },
  num: { en: "Numerator", zh: "分子", ja: "分子", es: "Numerador", pt: "Numerador" },
  den: { en: "Denominator", zh: "分母", ja: "分母", es: "Denominador", pt: "Denominador" },
  iToM: { en: "Improper → mixed", zh: "假分数 → 带分数", ja: "仮分数 → 帯分数", es: "Impropia → mixto", pt: "Imprópria → misto" },
  mToI: { en: "Mixed → improper", zh: "带分数 → 假分数", ja: "帯分数 → 仮分数", es: "Mixto → impropia", pt: "Misto → imprópria" },
  result: { en: "Result", zh: "结果", ja: "結果", es: "Resultado", pt: "Resultado" },
  asImproper: { en: "As an improper fraction", zh: "化为假分数", ja: "仮分数で", es: "Como fracción impropia", pt: "Como fração imprópria" },
  asDecimal: { en: "As a decimal", zh: "化为小数", ja: "小数で", es: "Como decimal", pt: "Como decimal" },
  asMixed: { en: "As a mixed number", zh: "化为带分数", ja: "帯分数で", es: "Como número mixto", pt: "Como número misto" },
  steps: { en: "Step by step", zh: "计算步骤", ja: "計算の過程", es: "Paso a paso", pt: "Passo a passo" },
  toImproperStep: { en: "Convert both mixed numbers to improper fractions", zh: "把两个带分数都化成假分数", ja: "両方の帯分数を仮分数に直す", es: "Convierta ambos números mixtos a fracciones impropias", pt: "Converta ambos os números mistos em frações impróprias" },
  computeStep: { en: "Compute with the fraction rules", zh: "按分数法则计算", ja: "分数の規則で計算する", es: "Calcule con las reglas de las fracciones", pt: "Calcule com as regras das frações" },
  backToMixed: { en: "Convert the result back to a mixed number", zh: "把结果化回带分数", ja: "結果を帯分数に戻す", es: "Convierta el resultado a número mixto", pt: "Converta o resultado em número misto" },
  plus: { en: "Add (+)", zh: "加(+)", ja: "足し算(+)", es: "Sumar (+)", pt: "Somar (+)" },
  minus: { en: "Subtract (−)", zh: "减(−)", ja: "引き算(−)", es: "Restar (−)", pt: "Subtrair (−)" },
  times: { en: "Multiply (×)", zh: "乘(×)", ja: "かけ算(×)", es: "Multiplicar (×)", pt: "Multiplicar (×)" },
  divided: { en: "Divide (÷)", zh: "除(÷)", ja: "わり算(÷)", es: "Dividir (÷)", pt: "Dividir (÷)" },
  first: { en: "First", zh: "第一个", ja: "1 番目", es: "Primera", pt: "Primeira" },
  second: { en: "Second", zh: "第二个", ja: "2 番目", es: "Segunda", pt: "Segunda" },
  negSignNote: {
    en: "Negative mixed numbers keep one minus in front: −2 1/3 means −(2 + 1/3).",
    zh: "负带分数只在最前面放一个负号:−2 1/3 表示 −(2 + 1/3)。",
    ja: "負の帯分数は先頭に符号を一つだけ置きます。−2 1/3 は −(2 + 1/3) の意味です。",
    es: "Los números mixtos negativos llevan un solo signo delante: −2 1/3 es −(2 + 1/3).",
    pt: "Números mistos negativos levam um único sinal na frente: −2 1/3 é −(2 + 1/3).",
  },
  mixedExplainer: {
    en: "A mixed number bundles a whole part with a leftover fraction. To go improper: whole × denominator + numerator over the same denominator — 2 1/3 → (2 × 3 + 1)/3 = 7/3. To go back: divide; the quotient is the whole part and the remainder stays on top.",
    zh: "带分数 = 整数部分 + 余下的分数。化假分数:整数 × 分母 + 分子,分母不变——2 1/3 → (2 × 3 + 1)/3 = 7/3。化回来:做除法,商是整数部,余数留在分子。",
    ja: "帯分数は整数部と余りの分数を合わせた形です。仮分数にするには:整数 × 分母 + 分子を分母の上に——2 1/3 → (2 × 3 + 1)/3 = 7/3。戻すには割り算をし、商が整数部、余りが分子になります。",
    es: "Un número mixto junta una parte entera con una fracción sobrante. A impropia: entero × denominador + numerador sobre el mismo denominador — 2 1/3 → (2 × 3 + 1)/3 = 7/3. De vuelta: divida; el cociente es la parte entera y el resto se queda arriba.",
    pt: "Um número misto junta uma parte inteira com uma fração que sobra. Para imprópria: inteiro × denominador + numerador sobre o mesmo denominador — 2 1/3 → (2 × 3 + 1)/3 = 7/3. Para voltar: divida; o quociente é a parte inteira e o resto fica em cima.",
  },
  errDen: {
    en: "Denominators can't be zero.",
    zh: "分母不能为 0。",
    ja: "分母は 0 にできません。",
    es: "Los denominadores no pueden ser cero.",
    pt: "Os denominadores não podem ser zero.",
  },
  errWhole: {
    en: "The whole part must be a whole number.",
    zh: "整数部必须是整数。",
    ja: "整数部は整数で入力してください。",
    es: "La parte entera debe ser un entero.",
    pt: "A parte inteira deve ser um inteiro.",
  },
  errGeneral: {
    en: "Enter whole numbers in every field.",
    zh: "请在每个输入框里输入整数。",
    ja: "すべての欄に整数を入力してください。",
    es: "Escriba enteros en todos los campos.",
    pt: "Informe inteiros em todos os campos.",
  },
  errZeroDiv: {
    en: "Division by zero is undefined — the second number can't be 0.",
    zh: "除以 0 没有意义——第二个数不能为 0。",
    ja: "0 で割ることは定義されていません。2 番目の数は 0 にできません。",
    es: "Dividir entre cero no está definido: el segundo número no puede ser 0.",
    pt: "Divisão por zero não existe: o segundo número não pode ser 0.",
  },
};

type MixedParts = { whole: string; num: string; den: string };

function fill(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

function parseParts(p: FracParts): { num: number; den: number; complete: boolean } {
  const num = parseNum(p.num);
  const den = parseNum(p.den);
  return { num: num ?? 0, den: den ?? 0, complete: num !== null && den !== null };
}

function parseMixedParts(p: MixedParts): { whole: number; num: number; den: number; complete: boolean } {
  const whole = parseNum(p.whole);
  const num = parseNum(p.num);
  const den = parseNum(p.den);
  return {
    whole: whole ?? 0,
    num: num ?? 0,
    den: den ?? 0,
    complete: whole !== null && num !== null && den !== null,
  };
}

/**
 * 带分数输入 → 假分数。书写约定:−2 1/3 表示 −(2 + 1/3) = −7/3,
 * 所以整数部为负时,分数部同取负(lib 的 fromMixed 本身保持 whole + num/den 语义)。
 */
function mixedToFraction(p: MixedParts): { f: ReturnType<typeof fromMixed>; complete: boolean; denZero: boolean } {
  const m = parseMixedParts(p);
  if (!m.complete) return { f: null, complete: false, denZero: false };
  if (m.den === 0) return { f: null, complete: true, denZero: true };
  const signedNum = m.whole < 0 && m.num > 0 ? -m.num : m.num;
  return { f: fromMixed(m.whole, signedNum, m.den), complete: true, denZero: false };
}

function MixedIn({
  parts,
  onChange,
  locale,
}: {
  parts: MixedParts;
  onChange: (p: MixedParts) => void;
  locale: Locale;
}) {
  return (
    <div className="flex items-start gap-3" dir="ltr">
      <div className="w-20">
        <NumIn value={parts.whole} onChange={(v) => onChange({ ...parts, whole: v })} aria={pick(locale, S.whole)} />
      </div>
      <div className="inline-flex flex-col items-center gap-1">
        <NumIn value={parts.num} onChange={(v) => onChange({ ...parts, num: v })} aria={pick(locale, S.num)} />
        <span aria-hidden className="h-px w-14 bg-[var(--color-ink)] opacity-40" />
        <NumIn value={parts.den} onChange={(v) => onChange({ ...parts, den: v })} aria={pick(locale, S.den)} />
      </div>
    </div>
  );
}

export function MixedEngine() {
  const { locale } = useI18n();
  const [mode, setMode] = useState<"convert" | "arithmetic">("convert");

  // 换算:假分数 → 带分数
  const [imp, setImp] = useState<FracParts>({ num: "7", den: "3" });
  const pi = parseParts(imp);
  const impVal = pi.complete && pi.den !== 0 ? frac(pi.num, pi.den) : null;
  const impMixed: Mixed | null = impVal ? toMixed(impVal) : null;

  // 换算:带分数 → 假分数
  const [mix, setMix] = useState<MixedParts>({ whole: "2", num: "1", den: "3" });
  const mixParsed = parseMixedParts(mix);
  const mixConv = mixedToFraction(mix);
  const mixF = mixConv.f;

  // 运算
  const [op, setOp] = useState<"+" | "-" | "×" | "÷">("+");
  const [m1, setM1] = useState<MixedParts>({ whole: "1", num: "1", den: "2" });
  const [m2, setM2] = useState<MixedParts>({ whole: "2", num: "1", den: "3" });
  const s1 = mixedToFraction(m1);
  const s2 = mixedToFraction(m2);
  const opReady = s1.complete && s2.complete && s1.f && s2.f;
  const combined = opReady
    ? op === "+"
      ? add(s1.f!, s2.f!)
      : op === "-"
        ? subtract(s1.f!, s2.f!)
        : op === "×"
          ? multiply(s1.f!, s2.f!)
          : divide(s1.f!, s2.f!)
    : null;
  const resultMixed = combined ? toMixed(combined) : null;
  const resultDec = combined ? toDecimal(combined) : null;
  const zeroDivCase = opReady && op === "÷" && s2.f!.num === 0;

  const stepItems = combined
    ? [
        <span key="c1" className="inline-flex flex-wrap items-center gap-2" dir="ltr">
          {pick(locale, S.toImproperStep)}: <Frac num={s1.f!.num} den={s1.f!.den} />
          <span className="px-1">·</span>
          <Frac num={s2.f!.num} den={s2.f!.den} />
        </span>,
        <span key="c2" dir="ltr">
          {pick(locale, S.computeStep)}: {formatFraction(combined)}
        </span>,
        <span key="c3" dir="ltr">
          {pick(locale, S.backToMixed)}: {resultMixed ? formatMixed(resultMixed) : "—"}
        </span>,
      ]
    : [];

  const opTab = (o: "+" | "-" | "×" | "÷", label: string) => ({ id: o, label });

  return (
    <ToolPanel>
      <Tabs
        options={[
          { id: "convert", label: pick(locale, S.convert) },
          { id: "arithmetic", label: pick(locale, S.arithmetic) },
        ]}
        value={mode}
        onChange={(id) => setMode(id as "convert" | "arithmetic")}
      />

      {mode === "convert" ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={pick(locale, S.iToM)}>
              <FracIn
                parts={imp}
                onChange={setImp}
                ariaNum={`${pick(locale, S.improper)} — ${pick(locale, S.num)}`}
                ariaDen={`${pick(locale, S.improper)} — ${pick(locale, S.den)}`}
                invalid={pi.complete && pi.den === 0}
              />
              <div className="mono mt-3 text-[17px] font-semibold" aria-live="polite" dir="ltr">
                {impMixed ? formatMixed(impMixed) : "—"}
              </div>
            </Field>
            <Field label={pick(locale, S.mToI)}>
              <MixedIn parts={mix} onChange={setMix} locale={locale} />
              <div className="mono mt-3 text-[17px] font-semibold" aria-live="polite" dir="ltr">
                {mixF ? `${mixF.num}/${mixF.den}` : "—"}
              </div>
            </Field>
          </div>

          {(pi.complete && pi.den === 0) || (mixParsed.complete && mixParsed.den === 0) ? (
            <div className="mt-4">
              <ErrorNote>{pick(locale, S.errDen)}</ErrorNote>
            </div>
          ) : !pi.complete || !mixParsed.complete ? (
            <div className="mt-4">
              <Note>{pick(locale, S.errGeneral)}</Note>
            </div>
          ) : null}

          <div className="mt-4">
            <Note>{pick(locale, S.mixedExplainer)}</Note>
          </div>
          <div className="mt-2">
            <Note>{pick(locale, S.negSignNote)}</Note>
          </div>
        </>
      ) : (
        <>
          <Tabs
            options={[
              opTab("+", pick(locale, S.plus)),
              opTab("-", pick(locale, S.minus)),
              opTab("×", pick(locale, S.times)),
              opTab("÷", pick(locale, S.divided)),
            ]}
            value={op}
            onChange={(id) => setOp(id as "+" | "-" | "×" | "÷")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={pick(locale, S.first)}>
              <MixedIn parts={m1} onChange={setM1} locale={locale} />
            </Field>
            <Field label={pick(locale, S.second)}>
              <MixedIn parts={m2} onChange={setM2} locale={locale} />
            </Field>
          </div>

          {!s1.complete || !s2.complete ? (
            <div className="mt-5">
              <Note>{pick(locale, S.errGeneral)}</Note>
            </div>
          ) : s1.denZero || s2.denZero ? (
            <div className="mt-5">
              <ErrorNote>{pick(locale, S.errDen)}</ErrorNote>
            </div>
          ) : zeroDivCase ? (
            <div className="mt-5">
              <ErrorNote>{pick(locale, S.errZeroDiv)}</ErrorNote>
            </div>
          ) : !combined ? (
            <div className="mt-5">
              <ErrorNote>{pick(locale, S.errWhole)}</ErrorNote>
            </div>
          ) : (
            <>
              <BigOut label={pick(locale, S.result)}>
                <span className="inline-flex items-center gap-3">
                  {resultMixed ? formatMixed(resultMixed) : "—"}
                  {resultDec ? (
                    <span className="text-[15px] font-medium text-[var(--color-sub)]">≈ {resultDec.decimal}</span>
                  ) : null}
                </span>
              </BigOut>
              <div className="mt-5">
                <Field label={pick(locale, S.asImproper)}>
                  <p className="mono text-[17px] font-semibold" dir="ltr">
                    {formatFraction(combined)}
                  </p>
                </Field>
              </div>
              {resultDec ? (
                <div className="mt-3">
                  <Field label={pick(locale, S.asDecimal)}>
                    <p className="mono text-[17px] font-semibold" dir="ltr">
                      {resultDec.decimal}
                    </p>
                  </Field>
                </div>
              ) : null}

              <div className="mt-6 rounded-xl border hairline px-4 py-4">
                <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-sub)]">
                  {pick(locale, S.steps)}
                </h3>
                <StepList items={stepItems} />
              </div>
            </>
          )}

          <div className="mt-4">
            <Note>{pick(locale, S.negSignNote)}</Note>
          </div>
        </>
      )}
    </ToolPanel>
  );
}
