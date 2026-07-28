import type { GenConfig, NumberMode, Operation, Problem } from './types';

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const ALL_OPS: Operation[] = ['add', 'sub', 'mul', 'div'];

export function computeAnswer(a: number, b: number, op: Operation): number {
  switch (op) {
    case 'add': return a + b;
    case 'sub': return a - b;
    case 'mul': return a * b;
    case 'div': return b === 0 ? 0 : a / b;
  }
}

/** rentang khusus perkalian/pembagian saat mode acak agar angka tidak meledak */
function mulDivMax(hi: number): number {
  return Math.min(Math.abs(hi), 12);
}

function nonZeroInt(min: number, max: number): number {
  let v = 0;
  let guard = 0;
  while (v === 0 && guard < 60) {
    v = randInt(min, max);
    guard++;
  }
  return v === 0 ? 1 : v;
}

function makeOperands(op: Operation, mode: NumberMode, min: number, max: number, smartScale: boolean): { a: number; b: number } {
  let lo = Math.min(min, max);
  let hi = Math.max(min, max);
  if (mode === 'asli') lo = Math.max(1, lo);
  if (lo > hi) hi = lo;

  if (op === 'mul' || op === 'div') {
    if (smartScale) hi = Math.max(lo, Math.min(hi, mulDivMax(hi)));
    // hindari perkalian terlalu besar untuk rentang besar
    if (Math.abs(hi) > 25) {
      if (lo >= 1) hi = 12;
      else hi = Math.min(hi, 12);
      lo = Math.max(lo, mode === 'asli' ? 1 : -12);
    }
  }

  if (op === 'div') {
    // pembagian: pastikan hasilnya bilangan bulat -> a = pembagi × hasil
    let divisor: number;
    let quotient: number;
    if (mode === 'asli') {
      divisor = randInt(Math.max(1, lo), Math.max(1, hi));
      quotient = randInt(Math.max(1, lo), Math.max(1, hi));
    } else {
      divisor = nonZeroInt(lo, hi);
      quotient = nonZeroInt(lo, hi);
    }
    return { a: divisor * quotient, b: divisor };
  }

  return { a: randInt(lo, hi), b: randInt(lo, hi) };
}

export function generateProblems(cfg: GenConfig): Problem[] {
  const problems: Problem[] = [];
  for (let i = 0; i < cfg.count; i++) {
    const op: Operation = cfg.op === 'random' ? pick(ALL_OPS) : cfg.op;
    const { a, b } = makeOperands(op, cfg.mode, cfg.min, cfg.max, cfg.op === 'random');
    problems.push({ id: i, a, b, op, answer: computeAnswer(a, b, op) });
  }
  return problems;
}

export function formatNum(n: number): string {
  return n < 0 ? `(${n})` : `${n}`;
}
