import { motion } from 'framer-motion';
import { BadgeCheck, Divide, Lock, Minus, Play, Plus, Shuffle, X } from 'lucide-react';
import { LEVELS, PASS_SCORE } from '../lib/types';
import Stars from './Stars';

import { cn } from '../utils/cn';

export interface Progress {
  unlocked: number;
  best: Record<number, number>;
}

interface TestLevelsProps {
  progress: Progress;
  onStart: (level: number) => void;
}

const LEVEL_ICONS = [
  <Plus key="1" size={26} />,
  <Minus key="2" size={26} />,
  <X key="3" size={26} />,
  <Divide key="4" size={26} />,
  <Shuffle key="5" size={26} />,
];

export default function TestLevels({ progress, onStart }: TestLevelsProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7 text-center"
      >
        <span className="mx-auto mb-3 flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-2xl bg-white shadow-neon-gold ring-1 ring-gold-400/50 p-1 animate-floaty">
          <img src="/logo.png" alt="Expert Zealous" className="block h-full w-full object-contain"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        </span>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-maroon-300">
          Expert Zealous
        </p>
        <h2 className="font-display text-xl md:text-2xl font-extrabold text-gold-300 text-glow-gold tracking-wide">
          PILIH LEVEL TES
        </h2>
        <p className="mx-auto mt-1.5 max-w-xl text-sm text-blue-200/70">
          Jawab minimal <span className="font-bold text-gold-300">{PASS_SCORE} dari 10 soal</span> dengan benar untuk
          membuka level berikutnya. Jumlah bintang menunjukkan tingkat levelmu!
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEVELS.map((lv, i) => {
          const locked = lv.level > progress.unlocked;
          const best = progress.best[lv.level] ?? 0;
          const completed = best >= PASS_SCORE;

          return (
            <motion.div
              key={lv.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className={cn(
                'group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200',
                locked
                  ? 'border-navy-700/60 bg-navy-900/50 opacity-60'
                  : completed
                    ? 'cursor-pointer border-gold-400/60 bg-gradient-to-br from-navy-800/90 to-maroon-950/60 hover:shadow-neon-gold hover:-translate-y-1'
                    : 'cursor-pointer border-maroon-500/50 bg-gradient-to-br from-navy-800/90 to-navy-900/90 hover:border-gold-400/70 hover:shadow-neon-gold hover:-translate-y-1',
              )}
              onClick={() => !locked && onStart(lv.level)}
            >
              {/* dekorasi pojok */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-maroon-700/20 blur-2xl" />

              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl border font-display',
                    locked
                      ? 'border-navy-600 bg-navy-800 text-navy-600'
                      : 'border-gold-400/50 bg-maroon-900/80 text-gold-300 shadow-neon-red',
                  )}
                >
                  {locked ? <Lock size={22} /> : LEVEL_ICONS[i]}
                </span>
                <Stars count={lv.level} filled={!locked && completed} size={15} />
              </div>

              <h3 className="mt-3.5 font-display text-lg font-extrabold tracking-wide text-blue-50">
                LEVEL {lv.level}
              </h3>
              <p className={cn('text-sm font-bold', locked ? 'text-navy-600' : 'text-gold-300')}>{lv.label}</p>
              <p className="mt-0.5 text-xs text-blue-200/60">{lv.desc}</p>

              <div className="mt-4 flex items-center justify-between border-t border-navy-700/60 pt-3">
                {completed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
                    <BadgeCheck size={14} className="drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    Lulus • Terbaik {best}/10
                  </span>
                ) : locked ? (
                  <span className="text-xs font-semibold text-navy-600">Selesaikan level sebelumnya</span>
                ) : (
                  <span className="text-xs font-semibold text-blue-200/60">
                    {best > 0 ? `Terbaik ${best}/10` : 'Belum dicoba'}
                  </span>
                )}
                {!locked && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-b from-gold-300 to-gold-600 px-2.5 py-1 text-[11px] font-extrabold text-navy-950 transition-transform group-hover:scale-105">
                    <Play size={11} strokeWidth={3} /> MULAI
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* kartu info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-navy-800/80 to-navy-900/90 p-5"
        >
          <Stars count={5} filled size={15} />
          <h3 className="mt-3 font-display text-base font-extrabold text-blue-100">Cara Bermain</h3>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-blue-200/70">
            <li>• Setiap level berisi 10 soal acak.</li>
            <li>• Ketik jawaban lewat keyboard angka di bawah soal.</li>
            <li>• Centang hijau = benar, silang merah = coba lagi.</li>
            <li>• Kumpulkan semua 5 bintang level!</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
