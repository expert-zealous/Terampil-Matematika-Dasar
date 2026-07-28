import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Cpu,
  Divide,
  FileDown,
  Hash,
  Minus,
  Plus,
  RefreshCw,
  Shuffle,
  Trophy,
  X,
  XCircle,
} from 'lucide-react';
import type { NumberMode, OpChoice } from '../lib/types';
import { cn } from '../utils/cn';

interface Stats {
  correct: number;
  wrong: number;
  remaining: number;
}

interface TopBarProps {
  view: 'latihan' | 'tes';
  onViewChange: (v: 'latihan' | 'tes') => void;
  opChoice: OpChoice;
  onOpChange: (op: OpChoice) => void;
  numberMode: NumberMode;
  onNumberModeChange: (m: NumberMode) => void;
  min: number;
  max: number;
  onRangeChange: (min: number, max: number) => void;
  onGenerate: () => void;
  onPrint: () => void;
  settingsDisabled: boolean;
  stats: Stats;
}

const OP_OPTIONS: { value: OpChoice; label: string; icon: React.ReactNode }[] = [
  { value: 'add', label: 'Penjumlahan', icon: <Plus size={16} /> },
  { value: 'sub', label: 'Pengurangan', icon: <Minus size={16} /> },
  { value: 'mul', label: 'Perkalian', icon: <X size={16} /> },
  { value: 'div', label: 'Pembagian', icon: <Divide size={16} /> },
  { value: 'random', label: 'Acak (Semua)', icon: <Shuffle size={16} /> },
];

function OperationSelect({ value, onChange, disabled }: { value: OpChoice; onChange: (v: OpChoice) => void; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const current = OP_OPTIONS.find((o) => o.value === value)!;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 rounded-xl border border-navy-600/70 bg-navy-900/80 px-3 py-2 text-sm font-semibold text-blue-100',
          'hover:border-gold-400/70 hover:shadow-neon-gold transition-all cursor-pointer disabled:cursor-not-allowed',
          open && 'border-gold-400/80 shadow-neon-gold',
        )}
      >
        <span className="text-maroon-400">{current.icon}</span>
        <span className="whitespace-nowrap">{current.label}</span>
        <ChevronDown size={15} className={cn('text-gold-400 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-gold-400/40 bg-navy-900/95 shadow-neon-gold backdrop-blur-md"
          >
            {OP_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-left transition-colors cursor-pointer',
                    opt.value === value
                      ? 'bg-maroon-900/80 text-gold-300'
                      : 'text-blue-100 hover:bg-navy-700/70 hover:text-gold-200',
                  )}
                >
                  <span className="text-maroon-400">{opt.icon}</span>
                  {opt.label}
                  {opt.value === value && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-400 shadow-neon-gold" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TopBar(props: TopBarProps) {
  const {
    view, onViewChange, opChoice, onOpChange, numberMode, onNumberModeChange,
    min, max, onRangeChange, onGenerate, onPrint, settingsDisabled, stats,
  } = props;

  return (
    <header className="sticky top-0 z-40 border-b border-navy-700/60 bg-navy-950/85 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5">
          {/* Brand */}
          <div className="flex items-center gap-2.5 mr-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-maroon-700 via-maroon-500 to-maroon-800 shadow-neon-red ring-1 ring-gold-400/40">
              <Cpu size={21} className="text-gold-300" strokeWidth={2.2} />
            </span>
            <div className="leading-tight">
              <h1 className="font-display text-[13px] md:text-[15px] font-extrabold tracking-wide text-gold-300 text-glow-gold whitespace-nowrap">
                TERAMPIL MATEMATIKA DASAR
              </h1>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-blue-300/80 uppercase">
                Latihan Operasi Hitung • Bilangan Bulat
              </p>
            </div>
          </div>

          {/* Tab mode */}
          <nav className="flex items-center rounded-xl border border-navy-600/70 bg-navy-900/80 p-1">
            {(
              [
                { v: 'latihan' as const, label: 'Latihan', icon: <BookOpenCheck size={15} /> },
                { v: 'tes' as const, label: 'Tes', icon: <Trophy size={15} /> },
              ]
            ).map((t) => (
              <button
                key={t.v}
                type="button"
                onClick={() => onViewChange(t.v)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold transition-all cursor-pointer',
                  view === t.v
                    ? 'bg-gradient-to-r from-maroon-700 to-maroon-500 text-gold-200 shadow-neon-red'
                    : 'text-blue-200/70 hover:text-gold-200',
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </nav>

          <span className="hidden lg:block h-8 w-px bg-navy-700/70" />

          {/* Pengaturan soal */}
          <div
            className={cn(
              'flex flex-wrap items-center gap-2',
              settingsDisabled && 'pointer-events-none opacity-35 saturate-50',
            )}
            title={settingsDisabled ? 'Pengaturan ditentukan oleh level tes' : undefined}
          >
            <OperationSelect value={opChoice} onChange={onOpChange} disabled={settingsDisabled} />

            {/* jenis bilangan */}
            <div className="flex items-center rounded-xl border border-navy-600/70 bg-navy-900/80 p-1">
              {(
                [
                  { v: 'asli' as const, label: 'Asli' },
                  { v: 'bulat' as const, label: 'Bulat' },
                ]
              ).map((m) => (
                <button
                  key={m.v}
                  type="button"
                  onClick={() => onNumberModeChange(m.v)}
                  className={cn(
                    'rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer',
                    numberMode === m.v
                      ? 'bg-navy-600 text-gold-300 shadow-neon-blue'
                      : 'text-blue-200/70 hover:text-gold-200',
                  )}
                >
                  Bil. {m.label}
                </button>
              ))}
            </div>

            {/* rentang angka */}
            <div className="flex items-center gap-1.5 rounded-xl border border-navy-600/70 bg-navy-900/80 px-2.5 py-1.5">
              <Hash size={14} className="text-maroon-400" />
              <input
                type="number"
                value={min}
                onChange={(e) => onRangeChange(Number(e.target.value), max)}
                className="w-14 rounded-md border border-navy-600/70 bg-navy-950/80 px-1.5 py-1 text-center font-display text-xs font-bold text-gold-200 outline-none focus:border-gold-400"
                aria-label="Angka minimum"
              />
              <span className="text-blue-300/70 text-xs font-bold">–</span>
              <input
                type="number"
                value={max}
                onChange={(e) => onRangeChange(min, Number(e.target.value))}
                className="w-14 rounded-md border border-navy-600/70 bg-navy-950/80 px-1.5 py-1 text-center font-display text-xs font-bold text-gold-200 outline-none focus:border-gold-400"
                aria-label="Angka maksimum"
              />
            </div>
          </div>

          {/* aksi */}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onGenerate}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-gold-300 to-gold-600 px-3.5 py-2 text-sm font-extrabold text-navy-950 shadow-neon-gold transition-all hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <RefreshCw size={15} strokeWidth={2.6} />
              <span className="hidden sm:inline">Soal Baru</span>
              <span className="sm:hidden">Acak</span>
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="flex items-center gap-1.5 rounded-xl border border-maroon-400/60 bg-gradient-to-b from-maroon-700 to-maroon-900 px-3.5 py-2 text-sm font-extrabold text-gold-200 shadow-neon-red transition-all hover:brightness-125 active:scale-95 cursor-pointer"
            >
              <FileDown size={15} strokeWidth={2.4} />
              <span className="hidden sm:inline">Cetak PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>

        {/* statistik */}
        <div className="flex items-center gap-2 border-t border-navy-800/80 py-1.5 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-950/50 px-2.5 py-0.5 text-emerald-300">
            <CheckCircle2 size={12} /> Benar {stats.correct}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-maroon-400/40 bg-maroon-950/50 px-2.5 py-0.5 text-maroon-300">
            <XCircle size={12} /> Salah {stats.wrong}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/30 bg-navy-900/70 px-2.5 py-0.5 text-blue-200/80">
            <CircleDashed size={12} /> Sisa {stats.remaining}
          </span>
          <span className="ml-auto hidden md:block text-blue-300/50 tracking-wide">
            Klik kotak jawaban → ketik lewat keyboard di bawah → tekan OK
          </span>
        </div>
      </div>
      <div className="neon-hairline h-[2px] w-full" />
    </header>
  );
}
