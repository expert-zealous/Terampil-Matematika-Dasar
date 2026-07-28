export type Operation = 'add' | 'sub' | 'mul' | 'div';
export type OpChoice = Operation | 'random';
export type NumberMode = 'asli' | 'bulat';
export type AnswerStatus = 'idle' | 'correct' | 'wrong';

export interface Problem {
  id: number;
  a: number;
  b: number;
  op: Operation;
  answer: number;
}

export interface BoardItem {
  problem: Problem;
  input: string;
  status: AnswerStatus;
  /** dipakai sekali saja untuk memicu animasi shake */
  shakeKey: number;
}

export interface GenConfig {
  op: OpChoice;
  mode: NumberMode;
  min: number;
  max: number;
  count: number;
}

export const OP_SYMBOL: Record<Operation, string> = {
  add: '+',
  sub: '−',
  mul: '×',
  div: '÷',
};

export const OP_LABEL: Record<Operation, string> = {
  add: 'Penjumlahan',
  sub: 'Pengurangan',
  mul: 'Perkalian',
  div: 'Pembagian',
};

export const LEVELS: { level: number; label: string; desc: string; config: GenConfig }[] = [
  { level: 1, label: 'Penjumlahan', desc: 'Bilangan asli 1 – 10', config: { op: 'add', mode: 'asli', min: 1, max: 10, count: 10 } },
  { level: 2, label: 'Pengurangan', desc: 'Bilangan asli 1 – 25', config: { op: 'sub', mode: 'asli', min: 1, max: 25, count: 10 } },
  { level: 3, label: 'Perkalian', desc: 'Bilangan asli 2 – 12', config: { op: 'mul', mode: 'asli', min: 2, max: 12, count: 10 } },
  { level: 4, label: 'Pembagian', desc: 'Hasil bagi bulat 1 – 12', config: { op: 'div', mode: 'asli', min: 1, max: 12, count: 10 } },
  { level: 5, label: 'Semua Operasi', desc: 'Campuran acak 1 – 15', config: { op: 'random', mode: 'asli', min: 1, max: 15, count: 10 } },
];

export const PASS_SCORE = 8;
