import { describe, expect, it } from "vitest";
import {
  add,
  addSubSteps,
  divide,
  formatFraction,
  formatMixed,
  frac,
  fromDecimal,
  fromMixed,
  gcd,
  isFraction,
  lcm,
  mulDivSteps,
  multiply,
  normalize,
  parseDecimalString,
  simplify,
  subtract,
  toDecimal,
  toMixed,
  type Fraction,
} from "@/tools/_lib/fraction";

/**
 * FractionCalc 核心:全部期望值手算,绝不用实现生成。
 * 基准:1/2+1/3=5/6(LCD 6);2/4×3/6=1/4(交叉约分);3/4÷2/5=15/8=1 7/8;
 * 8/12→2/3(GCD 4);7/3→2 1/3;1/3→0.3̄;1/8→0.125;22/7→3.142857(142857 循环);
 * 0.5→1/2;0.125→1/8;0.333(maxDen 100)→1/3。
 */

const f = (num: number, den: number): Fraction => ({ num, den });
const eq = (a: Fraction | null, num: number, den: number) => {
  expect(a, `${a ? `${a.num}/${a.den}` : "null"} != ${num}/${den}`).toEqual({ num, den });
};

describe("gcd / lcm", () => {
  it("computes Euclidean GCDs (hand-checked)", () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(8, 12)).toBe(4);
    expect(gcd(36, 48)).toBe(12);
    expect(gcd(1, 99)).toBe(1);
    expect(gcd(-12, 8)).toBe(4); // sign never leaks
    expect(gcd(12, -8)).toBe(4);
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(5, 0)).toBe(5);
    expect(gcd(0, 0)).toBe(0);
    expect(gcd(999983, 999979)).toBe(1); // distinct large primes
  });

  it("returns NaN for non-integers instead of throwing", () => {
    expect(gcd(1.5, 2)).toBeNaN();
    expect(gcd(2, NaN)).toBeNaN();
  });

  it("computes LCMs (hand-checked)", () => {
    expect(lcm(4, 6)).toBe(12);
    expect(lcm(3, 5)).toBe(15);
    expect(lcm(1, 97)).toBe(97);
    expect(lcm(-4, 6)).toBe(12);
    expect(lcm(0, 7)).toBe(0);
    expect(lcm(999983, 999979)).toBe(999962000357); // (10^6−17)(10^6−21), still a safe integer
  });
});

describe("frac + simplify (lowest terms, sign on numerator)", () => {
  it("normalizes and reduces", () => {
    eq(frac(1, 2), 1, 2);
    eq(frac(2, 4), 1, 2); // 2/4 → 1/2, GCD 2
    eq(frac(8, 12), 2, 3); // GCD 4
    eq(frac(-3, -6), 1, 2); // minus over minus
    eq(frac(3, -6), -1, 2); // sign moves to numerator
    eq(frac(6, 3), 2, 1); // integers keep den 1
    eq(frac(0, 5), 0, 1); // zero → 0/1
    eq(frac(0, -5), 0, 1);
  });

  it("rejects zero denominators, non-integers, non-finites", () => {
    expect(frac(1, 0)).toBeNull();
    expect(frac(0, 0)).toBeNull();
    expect(frac(1.5, 2)).toBeNull();
    expect(frac(1, 2.5)).toBeNull();
    expect(frac(NaN, 2)).toBeNull();
    expect(frac(1, Infinity)).toBeNull();
  });

  it("simplifies signed fractions exactly (8/12 → 2/3)", () => {
    eq(simplify(f(8, 12)), 2, 3);
    eq(simplify(f(-8, 12)), -2, 3);
    eq(simplify(f(8, -12)), -2, 3);
    eq(simplify(f(2, 3)), 2, 3); // already lowest — untouched
    eq(simplify(f(0, 40)), 0, 1);
    eq(simplify(f(7, 1)), 7, 1);
    expect(simplify(f(1, 0))).toBeNull();
  });
});

describe("add — LCD arithmetic (1/2 + 1/3 = 5/6)", () => {
  it("adds over the least common denominator", () => {
    eq(add(f(1, 2), f(1, 3)), 5, 6); // 3/6 + 2/6
    eq(add(f(1, 4), f(1, 2)), 3, 4); // 1/4 + 2/4, LCD is the larger den
    eq(add(f(2, 3), f(1, 6)), 5, 6); // 4/6 + 1/6
    eq(add(f(1, 6), f(1, 6)), 1, 3); // 2/6 simplifies
    eq(add(f(1, 2), f(-1, 2)), 0, 1);
  });

  it("handles negatives and signs", () => {
    eq(add(f(-1, 2), f(-1, 3)), -5, 6);
    eq(add(f(-1, 2), f(1, 3)), -1, 6); // -3/6 + 2/6
    eq(add(f(3, -4), f(1, 4)), -1, 2); // sign-normalized input
  });

  it("keeps 10^6-scale inputs exact", () => {
    eq(add(f(1, 999983), f(2, 999983)), 3, 999983); // same den, gcd(3, 999983)=1 (digit sum 47)
    const big = add(f(999999, 999998), f(999999, 999997));
    expect(big).not.toBeNull();
    // 手算:num = 999999·999997 + 999999·999998 = 1999993000005;den = 999998·999997 = 999995000006
    expect(Math.abs(big!.num / big!.den - 1999993000005 / 999995000006)).toBeLessThan(1e-12);
  });

  it("returns null on invalid input without throwing", () => {
    expect(add(f(1, 0), f(1, 2))).toBeNull();
    expect(add(f(1, 2), f(0.5, 2) as unknown as Fraction)).toBeNull();
    expect(add(f(1, 2), { num: NaN, den: 2 } as unknown as Fraction)).toBeNull();
  });
});

describe("subtract — negative results (1/2 − 3/4 = −1/4)", () => {
  it("lands below zero correctly", () => {
    eq(subtract(f(1, 2), f(3, 4)), -1, 4); // 2/4 − 3/4
    eq(subtract(f(3, 4), f(1, 2)), 1, 4);
    eq(subtract(f(1, 3), f(1, 3)), 0, 1);
    eq(subtract(f(1, 2), f(1, 3)), 1, 6);
    eq(subtract(f(5, 6), f(1, 3)), 1, 2); // 5/6 − 2/6 = 3/6
    eq(subtract(f(-1, 6), f(1, 6)), -1, 3); // −2/6
    eq(subtract(f(1, 2), f(-1, 3)), 5, 6); // 3/6 + 2/6
  });
});

describe("multiply — straight across (2/4 × 3/6 = 1/4)", () => {
  it("multiplies and simplifies", () => {
    eq(multiply(f(2, 4), f(3, 6)), 1, 4); // 1/2 × 1/2
    eq(multiply(f(3, 4), f(2, 3)), 1, 2); // 6/12
    eq(multiply(f(5, 1), f(2, 3)), 10, 3); // whole × fraction
    eq(multiply(f(0, 1), f(5, 7)), 0, 1);
  });

  it("follows the minus-times-minus rule", () => {
    eq(multiply(f(1, 2), f(-2, 3)), -1, 3);
    eq(multiply(f(-1, 2), f(-2, 3)), 1, 3);
  });

  it("stays exact at the 10^6 boundary", () => {
    // (10^6−17)² = 999966000289 — hand-computed, below 2^53
    eq(multiply(f(999983, 1), f(999983, 1)), 999966000289, 1);
    const sq = multiply(f(999983, 999979), f(999983, 999979));
    expect(sq).not.toBeNull();
    expect(Math.abs(sq!.num / sq!.den - (999983 * 999983) / (999979 * 999979))).toBeLessThan(1e-12);
  });
});

describe("divide — flip and multiply (3/4 ÷ 2/5 = 15/8)", () => {
  it("multiplies by the reciprocal", () => {
    eq(divide(f(3, 4), f(2, 5)), 15, 8); // 3/4 × 5/2
    eq(divide(f(1, 2), f(1, 2)), 1, 1);
    eq(divide(f(-1, 2), f(1, 4)), -2, 1);
    eq(divide(f(2, 3), f(-4, 5)), -5, 6); // 2/3 × (−5/4) = −10/12
    eq(divide(f(0, 1), f(5, 7)), 0, 1); // zero numerator is fine
  });

  it("refuses division by zero", () => {
    expect(divide(f(3, 4), f(0, 5))).toBeNull();
    expect(divide(f(1, 2), f(0, 1))).toBeNull();
  });
});

describe("toMixed — improper → mixed (7/3 → 2 1/3)", () => {
  it("splits whole and remainder", () => {
    expect(toMixed(f(7, 3))).toEqual({ whole: 2, num: 1, den: 3 });
    expect(toMixed(f(5, 2))).toEqual({ whole: 2, num: 1, den: 2 });
    expect(toMixed(f(4, 2))).toEqual({ whole: 2, num: 0, den: 1 });
    expect(toMixed(f(2, 3))).toEqual({ whole: 0, num: 2, den: 3 }); // proper stays
    expect(toMixed(f(0, 5))).toEqual({ whole: 0, num: 0, den: 1 });
  });

  it("keeps negatives reconstructable (whole + num/den)", () => {
    expect(toMixed(f(-7, 3))).toEqual({ whole: -2, num: -1, den: 3 }); // −(2 + 1/3)
    expect(toMixed(f(-2, 3))).toEqual({ whole: 0, num: -2, den: 3 });
    expect(toMixed(f(-5, 2))).toEqual({ whole: -2, num: -1, den: 2 });
  });

  it("round-trips through fromMixed", () => {
    for (const x of [f(7, 3), f(-7, 3), f(22, 7), f(-22, 7), f(5, 2), f(0, 1), f(-1, 3), f(9, 3)]) {
      const m = toMixed(x)!;
      // fromMixed returns lowest terms per the contract: 9/3 round-trips as 3/1
      const s = simplify(x)!;
      eq(fromMixed(m.whole, m.num, m.den), s.num, s.den);
    }
  });

  it("rejects invalid input", () => {
    expect(toMixed(f(1, 0))).toBeNull();
  });
});

describe("fromMixed — mixed → improper", () => {
  it("applies whole × den + num", () => {
    eq(fromMixed(2, 1, 3), 7, 3); // (2×3+1)/3
    eq(fromMixed(0, 5, 6), 5, 6);
    eq(fromMixed(1, 5, 3), 8, 3); // fractional part may be improper
    eq(fromMixed(1, 0, 4), 1, 1);
    eq(fromMixed(3, 0, 1), 3, 1);
  });

  it("supports the written sign convention −2 1/3 = −(2+1/3)", () => {
    eq(fromMixed(-2, -1, 3), -7, 3);
    // UI 层把 −2 1/3 传成 whole=-2, num=-1;lib 本身保持 whole + num/den 语义
    expect(fromMixed(-2, 1, 3)).toEqual({ num: -5, den: 3 }); // −2 + 1/3
  });

  it("rejects zero denominators and non-integers", () => {
    expect(fromMixed(1, 1, 0)).toBeNull();
    expect(fromMixed(1.5, 1, 2)).toBeNull();
    expect(fromMixed(1, 0.5, 2)).toBeNull();
  });
});

describe("formatting helpers", () => {
  it("formatFraction renders lowest terms, integers bare", () => {
    expect(formatFraction(f(5, 6))).toBe("5/6");
    expect(formatFraction(f(2, 1))).toBe("2");
    expect(formatFraction(f(-1, 4))).toBe("-1/4");
    expect(formatFraction(f(2, 4))).toBe("1/2");
    expect(formatFraction(f(0, 1))).toBe("0");
    expect(formatFraction(f(1, 0))).toBe("—"); // invalid → em dash, never throws
  });

  it("formatMixed renders the single leading minus", () => {
    expect(formatMixed({ whole: 2, num: 1, den: 3 })).toBe("2 1/3");
    expect(formatMixed({ whole: -2, num: -1, den: 3 })).toBe("-2 1/3");
    expect(formatMixed({ whole: 0, num: 5, den: 6 })).toBe("5/6");
    expect(formatMixed({ whole: 0, num: -5, den: 6 })).toBe("-5/6");
    expect(formatMixed({ whole: 2, num: 0, den: 1 })).toBe("2");
    expect(formatMixed({ whole: 0, num: 0, den: 1 })).toBe("0");
  });
});

describe("toDecimal — long division with cycle detection", () => {
  it("terminating decimals are exact", () => {
    expect(toDecimal(f(1, 8))).toEqual({ decimal: "0.125", repeating: null });
    expect(toDecimal(f(1, 2))).toEqual({ decimal: "0.5", repeating: null });
    expect(toDecimal(f(7, 8))).toEqual({ decimal: "0.875", repeating: null });
    expect(toDecimal(f(3, 6))).toEqual({ decimal: "0.5", repeating: null }); // simplified first
    expect(toDecimal(f(2, 1))).toEqual({ decimal: "2", repeating: null });
    expect(toDecimal(f(-7, 2))).toEqual({ decimal: "-3.5", repeating: null });
    expect(toDecimal(f(0, 7))).toEqual({ decimal: "0", repeating: null });
  });

  it("detects the repetend (1/3 = 0.3̄, 22/7 = 3.142857̄)", () => {
    expect(toDecimal(f(1, 3))).toEqual({ decimal: "0.3", repeating: "3" });
    expect(toDecimal(f(22, 7))).toEqual({ decimal: "3.142857", repeating: "142857" });
    expect(toDecimal(f(1, 7))).toEqual({ decimal: "0.142857", repeating: "142857" });
    expect(toDecimal(f(1, 6))).toEqual({ decimal: "0.16", repeating: "6" }); // prefix then cycle
    expect(toDecimal(f(5, 6))).toEqual({ decimal: "0.83", repeating: "3" }); // 0.8333…
    expect(toDecimal(f(-1, 3))).toEqual({ decimal: "-0.3", repeating: "3" });
  });

  it("truncates honestly when the cycle exceeds the digit budget", () => {
    const t = toDecimal(f(1, 97), 5)!; // 1/97 = 0.0103092783…, cycle length 96
    expect(t.decimal).toBe("0.01030…");
    expect(t.repeating).toBeNull();
    const t20 = toDecimal(f(1, 97), 20)!;
    expect(t20.repeating).toBeNull();
    expect(t20.decimal.startsWith("0.0103092783")).toBe(true);
    expect(t20.decimal.endsWith("…")).toBe(true);
    // 1/3 with a 1-digit budget cannot confirm the cycle either
    expect(toDecimal(f(1, 3), 1)).toEqual({ decimal: "0.3…", repeating: null });
  });

  it("rejects invalid fractions and clamps the budget", () => {
    expect(toDecimal(f(1, 0))).toBeNull();
    expect(toDecimal(f(1, 0), 12)).toBeNull();
  });
});

describe("fromDecimal — continued fractions within a denominator limit", () => {
  it("is exact when an exact fraction fits the limit", () => {
    eq(fromDecimal(0.5, 1000), 1, 2);
    eq(fromDecimal(0.125, 1000), 1, 8);
    eq(fromDecimal(0.75, 100), 3, 4);
    eq(fromDecimal(0.875, 100), 7, 8);
    eq(fromDecimal(-0.75, 100), -3, 4);
    eq(fromDecimal(0, 100), 0, 1);
    eq(fromDecimal(5, 100), 5, 1);
    eq(fromDecimal(2.5, 100), 5, 2);
    eq(fromDecimal(0.2, 100), 1, 5);
  });

  it("returns the closest fraction when the decimal never ends", () => {
    eq(fromDecimal(0.333, 100), 1, 3); // |0.333 − 1/3| ≈ 0.00033 beats 33/100
    eq(fromDecimal(0.333, 1000), 333, 1000); // limit raised → the exact 333/1000 fits
    eq(fromDecimal(0.3333333333333333, 1000), 1, 3); // the double nearest 1/3
    eq(fromDecimal(3.142857, 100), 22, 7); // the classic approximation, err ≈ 1.4e-7
    eq(fromDecimal(0.6667, 100), 2, 3);
  });

  it("respects tight limits", () => {
    eq(fromDecimal(0.4, 1), 0, 1); // only 0/1 and 1/1 available; 0/1 closer
    eq(fromDecimal(0.6, 1), 1, 1);
    eq(fromDecimal(0.999, 2), 1, 1); // err 0.001 beats 1/2
  });

  it("rejects invalid input", () => {
    expect(fromDecimal(NaN, 100)).toBeNull();
    expect(fromDecimal(Infinity, 100)).toBeNull();
    expect(fromDecimal(0.5, 0)).toBeNull();
    expect(fromDecimal(0.5, -3)).toBeNull();
    expect(fromDecimal(0.5, 1.5)).toBeNull();
  });

  it("round-trips terminating decimals (decimal → fraction → decimal)", () => {
    for (const x of [0.5, 0.125, 0.75, 0.1, -2.5, 3, 0.875, 0.0625]) {
      const fr = fromDecimal(x, 1000)!;
      const d = toDecimal(fr)!;
      expect(d.repeating, `${x} → ${fr.num}/${fr.den} → ${d.decimal}`).toBeNull();
      expect(Number(d.decimal)).toBe(x);
    }
  });
});

describe("step builders — the LCD and cross-simplify work is verifiable", () => {
  it("walks 1/2 + 1/3 through LCD 6", () => {
    const s = addSubSteps(f(1, 2), f(1, 3), "+")!;
    expect(s.lcm).toBe(6);
    expect(s.mult1).toBe(3);
    expect(s.mult2).toBe(2);
    eq(s.eq1, 3, 6); // unsimplified on purpose — that is the pedagogical point
    eq(s.eq2, 2, 6);
    eq(s.combined, 5, 6);
    expect(s.gcdUsed).toBe(1);
    eq(s.result, 5, 6);
  });

  it("walks 1/6 + 1/6 to a simplification step (GCD 2)", () => {
    const s = addSubSteps(f(1, 6), f(1, 6), "+")!;
    eq(s.combined, 2, 6);
    expect(s.gcdUsed).toBe(2);
    eq(s.result, 1, 3);
  });

  it("walks 1/2 − 3/4 through LCD 4 into negative territory", () => {
    const s = addSubSteps(f(1, 2), f(3, 4), "-")!;
    expect(s.lcm).toBe(4);
    eq(s.eq1, 2, 4);
    eq(s.eq2, 3, 4);
    eq(s.combined, -1, 4);
    eq(s.result, -1, 4);
  });

  it("reduces 0/4 to 0/1 with the GCD named", () => {
    const s = addSubSteps(f(1, 4), f(1, 4), "-")!;
    eq(s.combined, 0, 4);
    expect(s.gcdUsed).toBe(4); // gcd(0, 4) = 4 — the reduction 0/4 → 0/1 is real
    eq(s.result, 0, 1);
  });

  it("cross-simplifies 2/4 × 3/6 down to 1/4", () => {
    const s = mulDivSteps(f(2, 4), f(3, 6), "×")!;
    expect(s.crossGcd1).toBe(2); // gcd(2, 6)
    expect(s.crossGcd2).toBe(1); // gcd(3, 4)
    eq(s.aReduced, 1, 4);
    eq(s.bReduced, 3, 3); // cross-division raw — the 3/3 is cancelled in the final GCD step
    eq(s.product, 3, 12); // 1×3 / 4×3, before any vertical cancellation
    expect(s.gcdProduct).toBe(3);
    eq(s.result, 1, 4);
    expect(s.reciprocal).toBeNull();
  });

  it("flips before dividing 3/4 ÷ 2/5 and lands on 15/8", () => {
    const s = mulDivSteps(f(3, 4), f(2, 5), "÷")!;
    eq(s.reciprocal!, 5, 2);
    eq(s.aReduced, 3, 4);
    eq(s.bReduced, 5, 2);
    eq(s.product, 15, 8);
    eq(s.result, 15, 8);
  });

  it("handles whole-number outcomes in division steps (2/4 ÷ 3/6 = 1)", () => {
    const s = mulDivSteps(f(2, 4), f(3, 6), "÷")!;
    eq(s.reciprocal!, 2, 1);
    eq(s.result, 1, 1);
  });

  it("returns null for invalid input or bad operators", () => {
    expect(addSubSteps(f(1, 0), f(1, 2), "+")).toBeNull();
    expect(addSubSteps(f(1, 2), f(1, 3), "*" as "+" | "-")).toBeNull();
    expect(mulDivSteps(f(1, 2), f(0, 5), "÷")).toBeNull();
    expect(mulDivSteps(f(1, 2), f(1, 3), "^" as "×" | "÷")).toBeNull();
  });
});

describe("normalize / isFraction / parseDecimalString", () => {
  it("normalize fixes the sign without reducing (step displays keep raw numbers)", () => {
    eq(normalize(f(2, -4)), -2, 4); // sign moved, 2/4 NOT reduced
    eq(normalize(f(2, 4)), 2, 4);
    eq(normalize(f(-3, -6)), 3, 6);
    expect(normalize(f(1, 0))).toBeNull();
    expect(normalize(null as unknown as Fraction)).toBeNull();
  });

  it("isFraction is the structural guard", () => {
    expect(isFraction({ num: 1, den: 2 })).toBe(true);
    expect(isFraction({ num: 1, den: 0 })).toBe(false);
    expect(isFraction({ num: 1.5, den: 2 })).toBe(false);
    expect(isFraction({ num: NaN, den: 2 })).toBe(false);
    expect(isFraction({ num: 1, den: Infinity })).toBe(false);
    expect(isFraction(null)).toBe(false);
    expect(isFraction("1/2")).toBe(false);
  });

  it("parseDecimalString accepts clean decimals only", () => {
    expect(parseDecimalString("0.5")).toBe(0.5);
    expect(parseDecimalString(" -3.25 ")).toBe(-3.25);
    expect(parseDecimalString("−2.5")).toBe(-2.5); // typographic minus
    expect(parseDecimalString(".5")).toBe(0.5);
    expect(parseDecimalString("5.")).toBe(5);
    expect(parseDecimalString("0x10")).toBeNull();
    expect(parseDecimalString("1.2.3")).toBeNull();
    expect(parseDecimalString("1,5")).toBeNull();
    expect(parseDecimalString("")).toBeNull();
    expect(parseDecimalString("abc")).toBeNull();
    expect(parseDecimalString("1e3")).toBeNull();
  });
});

describe("invariants — the contract holds across the operation matrix", () => {
  const SAMPLES = [
    f(1, 2), f(-1, 3), f(2, 4), f(-7, 3), f(0, 1), f(5, 1), f(22, 7), f(-9, 12), f(100, 75),
  ];

  it("every op output is normalized: den > 0, gcd(num, den) ∈ {0, 1}, safe integers", () => {
    for (const a of SAMPLES) {
      for (const b of SAMPLES) {
        for (const r of [add(a, b), subtract(a, b), multiply(a, b), divide(a, b)]) {
          if (r === null) continue;
          expect(Number.isSafeInteger(r.num)).toBe(true);
          expect(Number.isSafeInteger(r.den)).toBe(true);
          expect(r.den).toBeGreaterThan(0);
          const g = gcd(r.num, r.den);
          expect(r.num === 0 ? g : g).toBe(r.num === 0 ? r.den : 1); // 0/x → 0/1; else lowest terms
        }
      }
    }
  });

  it("subtraction is addition of the negation (a − b = a + (−b))", () => {
    for (const a of SAMPLES) {
      for (const b of SAMPLES) {
        const s = subtract(a, b);
        const alt = add(a, f(-b.num, b.den));
        expect(s).toEqual(alt);
      }
    }
  });

  it("division undoes multiplication wherever b ≠ 0: (a×b)÷b = a", () => {
    for (const a of SAMPLES) {
      for (const b of SAMPLES) {
        if (b.num === 0) continue;
        const p = multiply(a, b)!;
        // value equality: both sides come back in lowest terms, so 2/4 compares as 1/2
        const s = simplify(a)!;
        eq(divide(p, b), s.num, s.den);
      }
    }
  });

  it("value is preserved by simplification: num/den unchanged as a double", () => {
    for (const x of SAMPLES) {
      const s = simplify(x)!;
      expect(s.num / s.den).toBeCloseTo(x.num / x.den, 12);
      expect(s.den).toBeGreaterThan(0);
    }
  });

  it("toDecimal + fromDecimal agree on the repetend fractions within a generous limit", () => {
    // 1/3 → "0.3"/"3" → fromDecimal(0.3333…, 100) → 1/3
    const back = fromDecimal(Number("0.333333333333333"), 100)!;
    eq(back, 1, 3);
    // 22/7 → 3.142857 repeating → fromDecimal(3.142857142857143, 100) → 22/7
    eq(fromDecimal(22 / 7, 100), 22, 7);
  });
});
