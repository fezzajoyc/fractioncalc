import { describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "@/mcp/server";

async function connect() {
  const server = createServer();
  const client = new Client({ name: "test", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

/**
 * 与 tests/fraction.test.ts 同一套手算基准:
 * 1/2 + 1/3 = 5/6(LCD 6);2/4 × 3/6 = 1/4(交叉约分);
 * 3/4 ÷ 2/5 = 15/8 = 1 7/8;8/12 → 2/3(GCD 4);22/7 → 3.142857(142857 循环)。
 */
describe("fractioncalc MCP server", () => {
  it("exposes exactly the five FractionCalc tools", async () => {
    const client = await connect();
    const { tools } = await client.listTools();
    expect(tools.length).toBe(5);
    expect(new Set(tools.map((t) => t.name))).toEqual(
      new Set(["fraction_add", "fraction_multiply", "fraction_simplify", "fraction_to_decimal", "fraction_from_decimal"]),
    );
    // 每个工具都有 schema 与说明,AI 客户端靠它们路由
    for (const tool of tools) {
      expect(tool.description?.length ?? 0).toBeGreaterThan(20);
      expect(tool.inputSchema).toBeTruthy();
    }
    await client.close();
  });

  it("adds 1/2 + 1/3 = 5/6 with the LCD worked out in the steps", async () => {
    const client = await connect();
    const r = await client.callTool({ name: "fraction_add", arguments: { num1: 1, den1: 2, num2: 1, den2: 3 } });
    expect((r as any).isError).toBeUndefined();
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.result).toMatchObject({ num: 5, den: 6, fraction: "5/6" });
    expect(parsed.decimal).toEqual({ decimal: "0.83", repeating: "3" });
    expect(parsed.steps[0]).toBe("LCD of 2 and 3 is 6");
    expect(parsed.steps[1]).toBe("1/2 = 3/6 and 1/3 = 2/6");
    expect(parsed.steps[2]).toBe("3/6 + 2/6 = 5/6");
    expect(parsed.steps[3]).toBe("5/6 is already in lowest terms");
    await client.close();
  });

  it("subtracts into negative territory: 1/2 − 3/4 = −1/4", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "fraction_add",
      arguments: { num1: 1, den1: 2, op: "subtract", num2: 3, den2: 4 },
    });
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.result).toMatchObject({ num: -1, den: 4, fraction: "-1/4" });
    expect(parsed.steps[2]).toBe("2/4 - 3/4 = -1/4");
    await client.close();
  });

  it("cross-simplifies before multiplying: 2/4 × 3/6 = 1/4", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "fraction_multiply",
      arguments: { num1: 2, den1: 4, num2: 3, den2: 6 },
    });
    expect((r as any).isError).toBeUndefined();
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.result).toMatchObject({ num: 1, den: 4, fraction: "1/4" });
    expect(parsed.decimal).toEqual({ decimal: "0.25", repeating: null });
    expect(parsed.steps).toContain("Cross-simplify: 2/4 → 1/4 and 3/6 → 3/3");
    expect(parsed.steps).toContain("1/4 × 3/3 = 3/12");
    expect(parsed.steps).toContain("Divide numerator and denominator by GCD 3: 3/12 = 1/4");
    await client.close();
  });

  it("divides by flipping: 3/4 ÷ 2/5 = 15/8 = 1 7/8", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "fraction_multiply",
      arguments: { num1: 3, den1: 4, op: "divide", num2: 2, den2: 5 },
    });
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.result).toMatchObject({ num: 15, den: 8, fraction: "15/8" });
    expect(parsed.reciprocal).toMatchObject({ num: 5, den: 2, fraction: "5/2" });
    expect(parsed.mixed).toMatchObject({ whole: 1, num: 7, den: 8, mixed: "1 7/8" });
    expect(parsed.steps[0]).toBe("Dividing by 2/5 is multiplying by its reciprocal 5/2");
    await client.close();
  });

  it("refuses division by zero with a human-readable isError", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "fraction_multiply",
      arguments: { num1: 3, den1: 4, op: "divide", num2: 0, den2: 5 },
    });
    expect((r as any).isError).toBe(true);
    expect((r.content as any)[0].text).toContain("division by zero");
    await client.close();
  });

  it("simplifies 8/12 → 2/3 with GCD 4, and 7/3 as the mixed number 2 1/3", async () => {
    const client = await connect();
    const r = await client.callTool({ name: "fraction_simplify", arguments: { num: 8, den: 12 } });
    expect((r as any).isError).toBeUndefined();
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.simplified).toMatchObject({ num: 2, den: 3, fraction: "2/3" });
    expect(parsed.gcd_used).toBe(4);
    expect(parsed.mixed).toBeNull(); // proper fraction — no mixed form noise
    expect(parsed.decimal).toEqual({ decimal: "0.6", repeating: "6" });
    expect(parsed.note).toBe("Divided 8/12 top and bottom by 4");

    const imp = await client.callTool({ name: "fraction_simplify", arguments: { num: 7, den: 3 } });
    const p2 = JSON.parse((imp.content as any)[0].text);
    expect(p2.gcd_used).toBe(1);
    expect(p2.mixed).toMatchObject({ whole: 2, num: 1, den: 3, mixed: "2 1/3" });
    await client.close();
  });

  it("detects repeating digits: 1/3 → 0.3̄, 1/8 → 0.125, 22/7 → 3.142857̄", async () => {
    const client = await connect();
    const third = await client.callTool({ name: "fraction_to_decimal", arguments: { num: 1, den: 3 } });
    const t = JSON.parse((third.content as any)[0].text);
    expect(t.decimal).toBe("0.3");
    expect(t.repeating).toBe("3");
    expect(t.kind).toBe("repeating");

    const eighth = await client.callTool({ name: "fraction_to_decimal", arguments: { num: 1, den: 8 } });
    const e = JSON.parse((eighth.content as any)[0].text);
    expect(e).toEqual({ input: { num: 1, den: 8, fraction: "1/8" }, decimal: "0.125", repeating: null, kind: "terminating" });

    const pi = await client.callTool({ name: "fraction_to_decimal", arguments: { num: 22, den: 7 } });
    const p = JSON.parse((pi.content as any)[0].text);
    expect(p.decimal).toBe("3.142857");
    expect(p.repeating).toBe("142857");
    await client.close();
  });

  it("truncates honestly when the cycle exceeds max_digits (1/97, max 5)", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "fraction_to_decimal",
      arguments: { num: 1, den: 97, max_digits: 5 },
    });
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.decimal).toBe("0.01030…");
    expect(parsed.repeating).toBeNull();
    expect(parsed.kind).toBe("truncated");
    await client.close();
  });

  it("converts decimals back: 0.5 → 1/2 exact, 0.125 → 1/8 exact", async () => {
    const client = await connect();
    const half = await client.callTool({ name: "fraction_from_decimal", arguments: { decimal: "0.5" } });
    const h = JSON.parse((half.content as any)[0].text);
    expect(h.fraction).toMatchObject({ num: 1, den: 2, fraction: "1/2" });
    expect(h.exact).toBe(true);

    const eighth = await client.callTool({ name: "fraction_from_decimal", arguments: { decimal: "0.125" } });
    const e = JSON.parse((eighth.content as any)[0].text);
    expect(e.fraction).toMatchObject({ num: 1, den: 8, fraction: "1/8" });
    expect(e.exact).toBe(true);
    await client.close();
  });

  it("approximates 0.333 as 1/3 within max_den 100, exactly 333/1000 at 1000", async () => {
    const client = await connect();
    const near = await client.callTool({
      name: "fraction_from_decimal",
      arguments: { decimal: "0.333", max_den: 100 },
    });
    const n = JSON.parse((near.content as any)[0].text);
    expect(n.fraction).toMatchObject({ num: 1, den: 3, fraction: "1/3" });
    expect(n.exact).toBe(false);

    const exact = await client.callTool({
      name: "fraction_from_decimal",
      arguments: { decimal: "0.333", max_den: 1000 },
    });
    const x = JSON.parse((exact.content as any)[0].text);
    expect(x.fraction).toMatchObject({ num: 333, den: 1000, fraction: "333/1000" });
    expect(x.exact).toBe(true);
    await client.close();
  });

  it("guards both layers: schema violations and invalid logic input", async () => {
    const client = await connect();
    // 逻辑层:分母 0 被 frac() 拒绝 → isError,而不是 JSON 里静默变 null
    const zeroDen = await client.callTool({ name: "fraction_add", arguments: { num1: 1, den1: 0, num2: 1, den2: 3 } });
    expect((zeroDen as any).isError).toBe(true);
    expect((zeroDen.content as any)[0].text).toContain("denominator cannot be 0");
    // 逻辑层:除以 0 → isError
    const divZero = await client.callTool({
      name: "fraction_multiply",
      arguments: { num1: 1, den1: 2, op: "divide", num2: 0, den2: 3 },
    });
    expect((divZero as any).isError).toBe(true);
    // 逻辑层:非法小数字符串 → isError
    const badDec = await client.callTool({ name: "fraction_from_decimal", arguments: { decimal: "abc" } });
    expect((badDec as any).isError).toBe(true);
    // schema 层:非整数分子被 zod 拒绝 → SDK 返回 isError(-32602)
    const schemaBad = await client.callTool({
      name: "fraction_add",
      arguments: { num1: 1.5, den1: 2, num2: 1, den2: 3 },
    });
    expect((schemaBad as any).isError).toBe(true);
    expect((schemaBad.content as any)[0].text).toContain("-32602");
    // schema 层:op 枚举外 → isError
    const badOp = await client.callTool({
      name: "fraction_add",
      arguments: { num1: 1, den1: 2, num2: 1, den2: 3, op: "xor" },
    });
    expect((badOp as any).isError).toBe(true);
    await client.close();
  });
});
