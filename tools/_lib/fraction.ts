/**
 * FractionCalc core: exact rational arithmetic on integers (no floats in results).
 *
 * Conventions (contract, mirrored by tests/fraction.test.ts):
 * - `Fraction` is always normalized: den > 0, the sign lives on num, num/den in
 *   lowest terms (0/x → 0/1).
 * - Every public function returns `null` for invalid input (zero denominator,
 *   non-integers, non-finite values, or any intermediate leaving the
 *   Number.isSafeInteger range). Nothing throws; engines decide how to present it.
 * - Inputs are safe integers. All results stay exact for |num|,|den| ≤ 10^6
 *   (worst-case products ≈ 10^12, far below 2^53).
 * - `toMixed` puts the sign on BOTH whole and num so the value round-trips as
 *   whole + num/den: -7/3 → { whole: -2, num: -1, den: 3 } (read "−2 1/3";
 *   formatMixed renders the single leading minus).
 */

export type Fraction = { num: number; den: number };
export type Mixed = { whole: number; num: number; den: number };

/** Largest magnitude we accept for any single integer value. */
const SAFE_LIMIT = Number.MAX_SAFE_INTEGER;

export function gcd(a: number, b: number): number {
  if (!Number.isInteger(a) || !Number.isInteger(b)) return NaN;
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function lcm(a: number, b: number): number {
  if (!Number.isInteger(a) || !Number.isInteger(b)) return NaN;
  if (a === 0 || b === 0) return 0;
  const g = gcd(a, b);
  const l = Math.abs(a / g) * Math.abs(b);
  return Number.isSafeInteger(l) ? l : Infinity;
}

/** Structural validity: finite integers, den !== 0, within safe-integer range. */
export function isFraction(f: unknown): f is Fraction {
  if (typeof f !== "object" || f === null) return false;
  const { num, den } = f as Record<string, unknown>;
  return (
    typeof num === "number" && typeof den === "number" &&
    Number.isInteger(num) && Number.isInteger(den) &&
    den !== 0 &&
    Math.abs(num) <= SAFE_LIMIT && Math.abs(den) <= SAFE_LIMIT
  );
}

function same(f: Fraction): boolean {
  return isFraction(f);
}

/** Reduce to lowest terms and force den > 0. Null for invalid input. */
export function simplify(f: Fraction): Fraction | null {
  if (!same(f)) return null;
  let { num, den } = f;
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  // gcd(num, den) is 0 only when num === 0 && den === 0; den !== 0 here, so g ≥ 1
  const n = num / g;
  const d = den / g;
  return { num: n === 0 ? 0 : n, den: d };
}

/** Construct + normalize. Null for invalid input (e.g. den === 0, non-integers). */
export function frac(num: number, den: number): Fraction | null {
  if (!Number.isInteger(num) || !Number.isInteger(den)) return null;
  if (!Number.isFinite(num) || !Number.isFinite(den)) return null;
  if (den === 0) return null;
  if (Math.abs(num) > SAFE_LIMIT || Math.abs(den) > SAFE_LIMIT) return null;
  return simplify({ num, den });
}

/**
 * Sign-normalize WITHOUT reducing (den > 0). Used for step displays, where the
 * user's raw numbers must stay visible (2/4 stays 2/4; the GCD line explains the
 * reduction). Null for invalid input.
 */
export function normalize(f: Fraction): Fraction | null {
  if (!same(f)) return null;
  return f.den < 0 ? { num: -f.num, den: -f.den } : { num: f.num, den: f.den };
}

/** Raw "num/den" rendering without reduction — for echoing user input and step forms. */
export function formatRaw(f: Fraction): string {
  return `${f.num}/${f.den}`;
}

function binop(
  a: Fraction,
  b: Fraction,
  combine: (numA: number, denA: number, numB: number, denB: number) => [number, number] | null,
): Fraction | null {
  if (!same(a) || !same(b)) return null;
  const raw = combine(a.num, a.den, b.num, b.den);
  if (!raw) return null;
  const [num, den] = raw;
  if (den === 0 || !Number.isSafeInteger(num) || !Number.isSafeInteger(den)) return null;
  return simplify({ num, den });
}

/** a + b, lowest terms. */
export function add(a: Fraction, b: Fraction): Fraction | null {
  return binop(a, b, (n1, d1, n2, d2) => {
    const L = lcm(d1, d2);
    if (!Number.isSafeInteger(L)) return null;
    const num = n1 * (L / d1) + n2 * (L / d2);
    if (!Number.isSafeInteger(num)) return null;
    return [num, L];
  });
}

/** a − b, lowest terms. */
export function subtract(a: Fraction, b: Fraction): Fraction | null {
  return binop(a, b, (n1, d1, n2, d2) => {
    const L = lcm(d1, d2);
    if (!Number.isSafeInteger(L)) return null;
    const num = n1 * (L / d1) - n2 * (L / d2);
    if (!Number.isSafeInteger(num)) return null;
    return [num, L];
  });
}

/** a × b, lowest terms. */
export function multiply(a: Fraction, b: Fraction): Fraction | null {
  return binop(a, b, (n1, d1, n2, d2) => {
    const num = n1 * n2;
    const den = d1 * d2;
    if (!Number.isSafeInteger(num) || !Number.isSafeInteger(den)) return null;
    return [num, den];
  });
}

/** a ÷ b (reciprocal of b). Null when b.num === 0 — division by zero. */
export function divide(a: Fraction, b: Fraction): Fraction | null {
  if (!same(b)) return null;
  if (b.num === 0) return null;
  return multiply(a, { num: b.den, den: b.num });
}

/**
 * Improper → mixed. whole = truncated integer part, num keeps the fraction's
 * sign so whole + num/den reconstructs f exactly:
 * 7/3 → { 2, 1, 3 }; -7/3 → { -2, -1, 3 }; 2/3 → { 0, 2, 3 }; 0 → { 0, 0, 1 }.
 */
export function toMixed(f: Fraction): Mixed | null {
  const s = simplify(f);
  if (!s) return null;
  const raw = Math.trunc(s.num / s.den);
  const whole = raw === 0 ? 0 : raw; // normalize -0 → 0 (proper fractions like -2/3)
  const num = s.num - whole * s.den;
  return { whole, num, den: s.den };
}

/** Mixed → improper: (whole·den + num) / den, lowest terms. */
export function fromMixed(whole: number, num: number, den: number): Fraction | null {
  if (!Number.isInteger(whole) || !Number.isInteger(num) || !Number.isInteger(den)) return null;
  if (den === 0) return null;
  const n = whole * den + num;
  if (!Number.isSafeInteger(n)) return null;
  return frac(n, den);
}

/** "−2 1/3" style plain-ASCII rendering ("-2 1/3"); integers render without the part. */
export function formatMixed(m: Mixed): string {
  const sign = m.whole < 0 || (m.whole === 0 && m.num < 0) ? "-" : "";
  const w = Math.abs(m.whole);
  const n = Math.abs(m.num);
  if (m.num === 0) return `${sign}${w}`;
  if (w === 0) return `${sign}${n}/${m.den}`;
  return `${sign}${w} ${n}/${m.den}`;
}

/** "5/6" plain-ASCII rendering; integers render bare ("2", "-3"). */
export function formatFraction(f: Fraction): string {
  const s = simplify(f);
  if (!s) return "—";
  return s.den === 1 ? String(s.num) : `${s.num}/${s.den}`;
}

/**
 * Fraction → decimal by long division with remainder-cycle detection.
 * - Terminating: `decimal` is exact ("0.125"), `repeating` null.
 * - Periodic: `repeating` holds the repetend ("3" for 1/3, "142857" for 22/7);
 *   `decimal` carries the digits up to the detected cycle (repetend appended once more).
 * - Period longer than maxDigits: `decimal` is the first maxDigits digits with a
 *   trailing "…", `repeating` null (honest truncation, never a wrong "exact").
 * maxDigits is clamped to 1–20; the repetend of n/d never exceeds d−1 digits.
 */
export function toDecimal(
  f: Fraction,
  maxDigits: number = 12,
): { decimal: string; repeating: string | null } | null {
  const s = simplify(f);
  if (!s) return null;
  const limit = Math.min(20, Math.max(1, Math.trunc(maxDigits) || 12));
  const sign = s.num < 0 ? "-" : "";
  const n = Math.abs(s.num);
  const d = s.den;
  const intPart = Math.floor(n / d);
  let r = n % d;
  if (r === 0) return { decimal: `${sign}${intPart}`, repeating: null };

  const digits: number[] = [];
  const seen = new Map<number, number>();
  let cycleStart = -1;
  while (digits.length < limit) {
    if (seen.has(r)) {
      cycleStart = seen.get(r)!;
      break;
    }
    seen.set(r, digits.length);
    const t = r * 10;
    digits.push(Math.floor(t / d));
    r = t % d;
    if (r === 0) break;
  }

  if (r === 0) {
    return { decimal: `${sign}${intPart}.${digits.join("")}`, repeating: null };
  }
  if (cycleStart === -1) {
    // cycle not reached within limit — truncated, unknown repetend
    return { decimal: `${sign}${intPart}.${digits.join("")}…`, repeating: null };
  }
  const repetend = digits.slice(cycleStart).join("");
  return { decimal: `${sign}${intPart}.${digits.join("")}`, repeating: repetend };
}

/** Parse a decimal string ("-12.75", "0.333", ".5") into a Number; null when not a clean decimal. */
export function parseDecimalString(input: string): number | null {
  const t = input.trim().replace(/^−/u, "-");
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

/**
 * Decimal → best fraction with denominator ≤ maxDen, via continued fractions
 * (convergents + capped semiconvergent; the two candidates are compared by
 * actual distance so float noise can never beat a clean convergent).
 * Exact when the exact fraction fits the limit (0.125 → 1/8); otherwise the
 * closest fraction within the limit (0.333 with maxDen 100 → 1/3).
 */
export function fromDecimal(dec: number, maxDen: number = 100): Fraction | null {
  if (typeof dec !== "number" || !Number.isFinite(dec)) return null;
  if (!Number.isInteger(maxDen) || maxDen < 1) return null;
  const sign = dec < 0 ? -1 : 1;
  let b = Math.abs(dec);

  // integers are already exact
  if (Number.isInteger(b)) {
    return Math.abs(b) > SAFE_LIMIT ? null : { num: sign * b, den: 1 };
  }

  let hPrev = 0; // h_{k-2}
  let hCurr = 1; // h_{k-1}
  let kPrev = 1;
  let kCurr = 0;
  let lastH = 0;
  let lastK = 1;
  let capped: Fraction | null = null;

  for (let i = 0; i < 64; i++) {
    const a = Math.floor(b);
    const h = a * hCurr + hPrev;
    const k = a * kCurr + kPrev;
    if (!Number.isSafeInteger(h) || !Number.isSafeInteger(k)) break;
    if (k > maxDen) {
      // largest m keeping the semiconvergent (m·h_{k-1} + h_{k-2}) / (m·k_{k-1} + k_{k-2}) ≤ maxDen
      if (kCurr > 0) {
        const m = Math.floor((maxDen - kPrev) / kCurr);
        if (m >= 1) {
          const sh = m * hCurr + hPrev;
          const sk = m * kCurr + kPrev;
          if (Number.isSafeInteger(sh) && Number.isSafeInteger(sk)) capped = { num: sh, den: sk };
        }
      }
      break;
    }
    lastH = h;
    lastK = k;
    hPrev = hCurr;
    hCurr = h;
    kPrev = kCurr;
    kCurr = k;
    const rest = b - a;
    if (rest === 0) break; // exact
    b = 1 / rest;
    if (!Number.isFinite(b)) break;
  }

  const convergent: Fraction = { num: lastH, den: lastK };
  const candidates = capped ? [convergent, capped] : [convergent];
  let best: Fraction | null = null;
  let bestErr = Infinity;
  for (const c of candidates) {
    const s = simplify(c);
    if (!s) continue;
    const err = Math.abs(Math.abs(dec) - s.num / s.den);
    if (err < bestErr - 1e-18 || (err === bestErr && best !== null && s.den < best.den)) {
      best = s;
      bestErr = err;
    }
  }
  if (!best) return null;
  return { num: sign * best.num || 0, den: best.den };
}

/* ──────────────────────────────────────────────────────────────────── */
/* Step-by-step builders: structured, locale-free, engine renders them. */
/* ──────────────────────────────────────────────────────────────────── */

export type AddSubSteps = {
  op: "+" | "-";
  lcm: number;
  mult1: number;
  mult2: number;
  /** Equivalent fractions over the common denominator — intentionally NOT reduced (that is the point of the step). */
  eq1: Fraction;
  eq2: Fraction;
  /** Sum/difference over the common denominator, before simplifying. */
  combined: Fraction;
  gcdUsed: number;
  result: Fraction;
};

/** LCD → equivalent fractions → combine → simplify. Hand-checkable at every step. */
export function addSubSteps(a: Fraction, b: Fraction, op: "+" | "-"): AddSubSteps | null {
  if (!same(a) || !same(b)) return null;
  if (op !== "+" && op !== "-") return null;
  const L = lcm(a.den, b.den);
  if (!Number.isSafeInteger(L)) return null;
  const m1 = L / a.den;
  const m2 = L / b.den;
  const eq1: Fraction = { num: a.num * m1, den: L };
  const eq2: Fraction = { num: b.num * m2, den: L };
  const combinedNum = a.num * m1 + (op === "-" ? -1 : 1) * b.num * m2;
  if (!Number.isSafeInteger(combinedNum)) return null;
  const combined: Fraction = { num: combinedNum, den: L };
  const result = simplify(combined);
  if (!result) return null;
  return {
    op,
    lcm: L,
    mult1: m1,
    mult2: m2,
    eq1,
    eq2,
    combined,
    gcdUsed: gcd(Math.abs(combinedNum), L),
    result,
  };
}

export type MulDivSteps = {
  op: "×" | "÷";
  a: Fraction;
  b: Fraction;
  reciprocal: Fraction | null; // ÷ only: b flipped
  crossGcd1: number; // gcd(a.num, other.den)
  crossGcd2: number; // gcd(b.num, a.den)
  /** Cross-division results, intentionally NOT reduced further (like eq1/eq2 above):
   * vertical cancellation (e.g. 3/3) belongs to the final GCD step, so every
   * displayed line is mechanical, checkable arithmetic. */
  aReduced: Fraction;
  bReduced: Fraction;
  product: Fraction; // raw product of the cross-simplified factors
  gcdProduct: number;
  result: Fraction;
};

/** Cross-simplify → multiply → simplify. For ÷, b is flipped first. */
export function mulDivSteps(a: Fraction, b: Fraction, op: "×" | "÷"): MulDivSteps | null {
  if (!same(a) || !same(b)) return null;
  if (op !== "×" && op !== "÷") return null;
  let other = b;
  let reciprocal: Fraction | null = null;
  if (op === "÷") {
    if (b.num === 0) return null;
    reciprocal = simplify({ num: b.den, den: b.num });
    if (!reciprocal) return null;
    other = reciprocal;
  }
  const g1 = gcd(a.num, other.den);
  const g2 = gcd(other.num, a.den);
  // g1, g2 ≥ 1 (a.den/other.den are nonzero), so the divisions below never hit 0
  // and keep den > 0; signs stay on the numerators. Not simplified — see type docs.
  const aReduced: Fraction = { num: a.num / g1, den: a.den / g2 };
  const bReduced: Fraction = { num: other.num / g2, den: other.den / g1 };
  if (!isFraction(aReduced) || !isFraction(bReduced)) return null;
  const productNum = aReduced.num * bReduced.num;
  const productDen = aReduced.den * bReduced.den;
  if (!Number.isSafeInteger(productNum) || !Number.isSafeInteger(productDen)) return null;
  const product: Fraction = { num: productNum, den: productDen };
  const result = simplify(product);
  if (!result) return null;
  return {
    op,
    a,
    b,
    reciprocal,
    crossGcd1: g1,
    crossGcd2: g2,
    aReduced,
    bReduced,
    product,
    gcdProduct: gcd(Math.abs(productNum), Math.abs(productDen)),
    result,
  };
}
