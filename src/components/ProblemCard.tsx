import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { BoardItem } from '../lib/types';
import { OP_SYMBOL } from '../lib/types';
import { formatNum } from '../lib/generator';
import { cn } from '../utils/cn';

interface ProblemCardProps {
  index: number;
  item: BoardItem;
  active: boolean;
  onSelect: () => void;
}

export default function ProblemCard({ index, item, active, onSelect }: ProblemCardProps) {
  const { problem, input, status } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.035 }}
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer rounded-2xl border px-4 py-3.5 md:px-5',
        'bg-gradient-to-br from-navy-800/80 to-navy-900/90 backdrop-blur-sm',
        'transition-all duration-200',
        active
          ? 'border-gold-400/90 shadow-neon-gold -translate-y-0.5'
          : 'border-navy-600/50 hover:border-maroon-400/50 hover:-translate-y-0.5',
        status === 'correct' && 'border-emerald-400/70',
        status === 'wrong' && active === false && 'border-maroon-500/40',
      )}
    >
      <div className="flex items-center gap-3 md:gap-4">
        {/* nomor soal */}
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-sm font-bold',
            active
              ? 'border-gold-400/80 bg-maroon-900/80 text-gold-300 shadow-neon-gold'
              : 'border-maroon-700/70 bg-maroon-950/80 text-maroon-300',
          )}
        >
          {index + 1}
        </span>

        {/* ekspresi */}
        <div className="flex-1 font-display text-xl md:text-2xl font-bold tracking-wider text-blue-100 whitespace-nowrap">
          <span className="text-glow-blue">{formatNum(problem.a)}</span>
          <span className="mx-2 text-maroon-400 text-glow-red">{OP_SYMBOL[problem.op]}</span>
          <span className="text-glow-blue">{formatNum(problem.b)}</span>
          <span className="mx-2 text-navy-600">=</span>
        </div>

        {/* kotak jawaban */}
        <div
          key={item.shakeKey}
          className={cn(
            item.shakeKey > 0 && status === 'wrong' && 'animate-shake',
            'relative flex h-12 w-[5.6rem] md:w-28 items-center justify-center rounded-xl border-2 font-display text-2xl md:text-[1.65rem] font-extrabold tracking-widest',
            status === 'correct' &&
              'border-emerald-400 bg-emerald-950/60 text-emerald-300 shadow-neon-green',
            status === 'wrong' && 'border-maroon-400 bg-maroon-950/70 text-maroon-300 shadow-neon-red',
            status === 'idle' &&
              (active
                ? 'border-gold-400 bg-navy-950/80 text-gold-200 shadow-neon-gold'
                : 'border-navy-600 bg-navy-950/60 text-gold-200/90'),
          )}
        >
          {input === '' ? (
            active ? (
              <span className="inline-block h-7 w-[3px] animate-pulse rounded bg-gold-400 shadow-neon-gold" />
            ) : (
              <span className="text-navy-600 text-xl">?</span>
            )
          ) : (
            input
          )}
        </div>

        {/* ikon status */}
        <div className="w-8 shrink-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {status === 'correct' && (
              <motion.span
                key="ok"
                initial={{ scale: 0, rotate: -60 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              >
                <CheckCircle2
                  size={30}
                  className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                  strokeWidth={2.4}
                />
              </motion.span>
            )}
            {status === 'wrong' && (
              <motion.span
                key="no"
                initial={{ scale: 0, rotate: 60 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              >
                <XCircle
                  size={30}
                  className="text-maroon-400 drop-shadow-[0_0_10px_rgba(255,59,92,0.9)]"
                  strokeWidth={2.4}
                />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
