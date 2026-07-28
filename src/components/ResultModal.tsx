import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Frown, LayoutGrid, PartyPopper, RotateCcw, Target } from 'lucide-react';
import { PASS_SCORE } from '../lib/types';
import Stars from './Stars';

interface ResultModalProps {
  open: boolean;
  level: number;
  score: number;
  total: number;
  passed: boolean;
  onRetry: () => void;
  onNext: () => void;
  onExit: () => void;
}

export default function ResultModal({ open, level, score, total, passed, onRetry, onNext, onExit }: ResultModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.85, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="neon-panel w-full max-w-md rounded-3xl p-7 text-center"
          >
            <span
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
                passed
                  ? 'bg-gradient-to-br from-gold-300 to-gold-600 shadow-neon-gold'
                  : 'bg-gradient-to-br from-maroon-600 to-maroon-900 shadow-neon-red'
              }`}
            >
              {passed ? (
                <PartyPopper size={30} className="text-navy-950" strokeWidth={2.2} />
              ) : (
                <Frown size={30} className="text-gold-200" strokeWidth={2.2} />
              )}
            </span>

            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-300/70">
              Hasil Tes Level {level}
            </p>
            <div className="mt-2 flex justify-center">
              <Stars count={level} filled={passed} size={20} />
            </div>

            <h2
              className={`mt-3 font-display text-4xl font-black tracking-wide ${
                passed ? 'text-gold-300 text-glow-gold' : 'text-maroon-300 text-glow-red'
              }`}
            >
              {score}
              <span className="text-blue-200/50 text-2xl">/{total}</span>
            </h2>

            <p className="mt-2 text-sm text-blue-200/75">
              {passed
                ? 'Hebat! Kamu lulus level ini' + (level < 5 ? ' dan level berikutnya terbuka.' : '. Semua level selesai — luar biasa!')
                : `Belum lulus. Butuh minimal ${PASS_SCORE} jawaban benar. Ayo coba lagi!`}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-maroon-400/60 bg-maroon-900/70 px-3 py-2.5 text-sm font-bold text-maroon-300 transition-all hover:shadow-neon-red cursor-pointer"
              >
                <RotateCcw size={15} /> Ulangi
              </button>
              {passed && level < 5 ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-gold-300 to-gold-600 px-3 py-2.5 text-sm font-extrabold text-navy-950 shadow-neon-gold transition-all hover:brightness-110 cursor-pointer"
                >
                  Level {level + 1} <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onExit}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-gold-300 to-gold-600 px-3 py-2.5 text-sm font-extrabold text-navy-950 shadow-neon-gold transition-all hover:brightness-110 cursor-pointer"
                >
                  <LayoutGrid size={15} /> Pilih Level
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onExit}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-blue-300/70 transition-colors hover:text-gold-200 cursor-pointer"
            >
              <Target size={13} /> Kembali ke daftar level
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
