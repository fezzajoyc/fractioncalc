import { z } from "zod";
import {
  addSubSteps,
  divide,
  formatFraction,
  formatMixed,
  formatRaw,
  frac,
  fromDecimal,
  gcd,
  mulDivSteps,
  multiply,
  normalize,
  parseDecimalString,
  toDecimal,
  toMixed,
  type Fraction,
} from "../tools/_lib/fraction";

/**
 * FractionCalc MCP 工具注册表:把 tools/_lib/fraction.ts 的纯函数暴露为 AI 可执行工具。
 * 站上的同名工具在浏览器里跑(交互式),这里跑同一份经过测试的实现——
 * 人和 AI 用同一套逻辑,而不是两套各写各的。
 *
 * 输入回显保持用户原样(仅统一符号,不约分):8/12 就显示 8/12,
 * 由 GCD 行解释约分——教学价值来自原始数字。
 */

const json = (v: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(v, null, 2) }] });
const bad = (t: string) => ({ content: [{ type: "text" as const, text: t }], isError: true as const });

/** 回显形态:原始 num/den + 原样字符串(不约分)。 */
function shape(f: Fraction) {
  return { num: f.num, den: f.den, fraction: formatRaw(f) };
}

/** mixed 值:仅当真有整数部(否则 null,避免 "0 5/6" 这种噪音)。 */
function mixedShape(f: Fraction): { whole: number; num: number; den: number; mixed: string } | null {
  const m = toMixed(f);
  if (!m || m.whole === 0) return null;
  return { whole: m.whole, num: m.num, den: m.den, mixed: formatMixed(m) };
}

export type McpToolDef = {
  name: string;
  title: string;
  description: string;
  schema: Record<string, any>;
  run: (args: any) => { content: { type: "text"; text: string }[]; isError?: boolean };
};

const numDen = {
  num1: z.number().int().describe("numerator of the first fraction (integer, may be negative)"),
  den1: z.number().int().describe("denominator of the first fraction (integer, never 0)"),
  num2: z.number().int().describe("numerator of the second fraction (integer, may be negative)"),
  den2: z.number().int().describe("denominator of the second fraction (integer, never 0)"),
};

/** 签名规整(不约分)的输入构建;den 0 / 非整数 / 超界 → 错误文案。 */
function buildFraction(num: number, den: number, label: string): Fraction | string {
  const f = normalize({ num, den });
  if (!f) return `${label} is invalid — the denominator cannot be 0 and both values must be integers within ±2^53`;
  return f;
}

export const MCP_TOOLS: McpToolDef[] = [
  {
    name: "fraction_add",
    title: "Add or subtract fractions",
    description:
      "Exact addition or subtraction of two fractions: finds the least common denominator (LCM), rewrites both fractions as equivalents over it, combines the numerators and simplifies by the GCD. Returns the simplified fraction, the mixed-number form when improper, the decimal with the repeating part detected, and the four work steps. Inputs are echoed as entered (sign-normalized only); denominators cannot be 0.",
    schema: {
      ...numDen,
      op: z.enum(["add", "subtract"]).default("add").describe("operation to perform"),
    },
    run: (a) => {
      const fa = buildFraction(a.num1, a.den1, "fraction 1");
      if (typeof fa === "string") return bad(fa);
      const fb = buildFraction(a.num2, a.den2, "fraction 2");
      if (typeof fb === "string") return bad(fb);
      const steps = addSubSteps(fa, fb, a.op === "subtract" ? "-" : "+");
      if (!steps) return bad("input out of range — keep numerators and denominators within ±2^53 so results stay exact");
      const result = steps.result;
      return json({
        operation: a.op === "subtract" ? "subtract" : "add",
        left: shape(fa),
        right: shape(fb),
        result: shape(result),
        mixed: mixedShape(result),
        decimal: toDecimal(result),
        steps: [
          `LCD of ${fa.den} and ${fb.den} is ${steps.lcm}`,
          `${formatRaw(fa)} = ${formatRaw(steps.eq1)} and ${formatRaw(fb)} = ${formatRaw(steps.eq2)}`,
          `${formatRaw(steps.eq1)} ${steps.op === "-" ? "-" : "+"} ${formatRaw(steps.eq2)} = ${formatRaw(steps.combined)}`,
          steps.gcdUsed > 1
            ? `Divide numerator and denominator by GCD ${steps.gcdUsed}: ${formatRaw(steps.combined)} = ${formatFraction(result)}`
            : `${formatFraction(result)} is already in lowest terms`,
        ],
      });
    },
  },
  {
    name: "fraction_multiply",
    title: "Multiply or divide fractions",
    description:
      "Exact multiplication or division of two fractions. Cross-simplifies first (each numerator against the other denominator by the GCD) to keep numbers small; for division the second fraction is flipped to its reciprocal first. Returns the simplified result, the mixed-number form when improper, the decimal with repeating part, and the work steps. Division by zero (second numerator 0) is refused.",
    schema: {
      ...numDen,
      op: z.enum(["multiply", "divide"]).default("multiply").describe("operation to perform"),
    },
    run: (a) => {
      const fa = buildFraction(a.num1, a.den1, "fraction 1");
      if (typeof fa === "string") return bad(fa);
      const fb = buildFraction(a.num2, a.den2, "fraction 2");
      if (typeof fb === "string") return bad(fb);
      if (a.op === "divide" && fb.num === 0) {
        return bad("division by zero — the second fraction has numerator 0, and no fraction times 0 gives a defined value");
      }
      const raw = a.op === "divide" ? divide(fa, fb) : multiply(fa, fb);
      const steps = mulDivSteps(fa, fb, a.op === "divide" ? "÷" : "×");
      if (!raw || !steps) return bad("input out of range — keep numerators and denominators within ±2^53 so results stay exact");
      const other = steps.reciprocal ?? fb;
      return json({
        operation: a.op === "divide" ? "divide" : "multiply",
        left: shape(fa),
        right: shape(fb),
        reciprocal: steps.reciprocal ? shape(steps.reciprocal) : null,
        result: shape(raw),
        mixed: mixedShape(raw),
        decimal: toDecimal(raw),
        steps: [
          ...(steps.reciprocal
            ? [`Dividing by ${formatRaw(fb)} is multiplying by its reciprocal ${formatFraction(steps.reciprocal)}`]
            : []),
          `Cross-simplify: ${formatRaw(fa)} → ${formatRaw(steps.aReduced)} and ${formatRaw(other)} → ${formatRaw(steps.bReduced)}`,
          `${formatRaw(steps.aReduced)} × ${formatRaw(steps.bReduced)} = ${formatRaw(steps.product)}`,
          steps.gcdProduct > 1
            ? `Divide numerator and denominator by GCD ${steps.gcdProduct}: ${formatRaw(steps.product)} = ${formatFraction(raw)}`
            : `${formatFraction(raw)} is already in lowest terms`,
        ],
      });
    },
  },
  {
    name: "fraction_simplify",
    title: "Simplify a fraction",
    description:
      "Reduces a fraction to lowest terms by dividing numerator and denominator by their greatest common divisor (Euclidean algorithm), normalizing the sign onto the numerator. Also returns the mixed-number form for improper fractions and the decimal value with repeating part detected. A zero denominator is refused; 0/n simplifies to 0/1.",
    schema: {
      num: z.number().int().describe("numerator (integer, may be negative)"),
      den: z.number().int().describe("denominator (integer, never 0)"),
    },
    run: (a) => {
      const f = normalize({ num: a.num, den: a.den });
      if (!f) return bad("invalid fraction — the denominator cannot be 0 and both values must be integers within ±2^53");
      const g = gcd(f.num, f.den);
      const simplified = frac(f.num, f.den);
      if (!simplified) return bad("could not simplify — check the inputs");
      return json({
        original: shape(f),
        simplified: shape(simplified),
        gcd_used: g,
        mixed: mixedShape(simplified),
        decimal: toDecimal(simplified),
        note:
          g > 1
            ? `Divided ${formatRaw(f)} top and bottom by ${g}`
            : `${formatRaw(f)} is already in lowest terms`,
      });
    },
  },
  {
    name: "fraction_to_decimal",
    title: "Fraction to decimal (repeating detected)",
    description:
      "Exact long division of a fraction into a decimal with cycle detection: terminating decimals return their exact digits (1/8 = 0.125); periodic ones return the repetend explicitly (1/3 = 0.3 with repeating '3'; 22/7 = 3.142857 with repeating '142857'). If the cycle is longer than max_digits the output is truncated with an ellipsis and repeating is null — never a silent rounding.",
    schema: {
      num: z.number().int().describe("numerator (integer, may be negative)"),
      den: z.number().int().describe("denominator (integer, never 0)"),
      max_digits: z.number().int().min(1).max(20).default(12).describe("maximum digits before the repetend search gives up"),
    },
    run: (a) => {
      const f = frac(a.num, a.den);
      if (!f) return bad("invalid fraction — the denominator cannot be 0 and both values must be integers within ±2^53");
      const d = toDecimal(f, a.max_digits);
      if (!d) return bad("could not compute the decimal — check the inputs");
      return json({
        input: shape(f),
        decimal: d.decimal,
        repeating: d.repeating,
        kind: d.repeating ? "repeating" : d.decimal.endsWith("…") ? "truncated" : "terminating",
      });
    },
  },
  {
    name: "fraction_from_decimal",
    title: "Decimal to fraction (best within denominator limit)",
    description:
      "Converts a decimal string to the best fraction with denominator at most max_den, via continued fractions. Exact when an exact fraction fits the limit — 0.5 → 1/2, 0.125 → 1/8; otherwise the closest approximation — 0.333 with max_den 100 → 1/3 (raise max_den to 1000 for the exact 333/1000). Returns the fraction, its decimal value and whether the match is exact.",
    schema: {
      decimal: z
        .string()
        .describe('decimal number as a string, e.g. "0.5", "-3.142857" — dot separator, at most one dot'),
      max_den: z.number().int().min(1).default(100).describe("largest denominator allowed in the answer"),
    },
    run: (a) => {
      const v = parseDecimalString(String(a.decimal));
      if (v === null) {
        return bad(`"${a.decimal}" is not a decimal number — use digits with at most one dot, like 0.75`);
      }
      if (Math.abs(v) >= 1e15) {
        return bad("value too large — stay within ±10^15 so the fraction stays meaningful");
      }
      const f = fromDecimal(v, a.max_den);
      if (!f) return bad("could not build a fraction — check the decimal and the denominator limit");
      const back = f.num / f.den;
      return json({
        decimal_in: a.decimal,
        fraction: shape(f),
        decimal_value: back,
        exact: Math.abs(back - v) < 5e-13 * Math.max(1, Math.abs(v)),
        max_den: a.max_den,
      });
    },
  },
];
