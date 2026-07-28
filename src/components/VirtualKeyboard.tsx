import { motion } from 'framer-motion';
import { Check, Delete } from 'lucide-react';
import { cn } from '../utils/cn';

interface VirtualKeyboardProps {
  onDigit: (d: string) => void;
  onMinus: () => void;
  onDelete: () => void;
  onOk: () => void;
  disabled?: boolean;
}

function Key({
  children,
  onClick,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  ariaLabel: string;
}) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      onClick={onClick}
      className={cn(
        'select-none rounded-2xl border font-display text-2xl md:text-[1.7rem] font-bold',
        'h-14 md:h-16 flex items-center justify-center cursor-pointer',
        'transition-[box-shadow,background-color,border-color] duration-150 outline-none',
        'focus-visible:ring-2 focus-visible:ring-gold-400/70',
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

const digitCls =
  'bg-navy-800/85 border-navy-600/70 text-gold-200 hover:border-gold-400/80 hover:text-gold-300 hover:shadow-neon-gold active:bg-navy-700';

export default function VirtualKeyboard({ onDigit, onMinus, onDelete, onOk, disabled }: VirtualKeyboardProps) {
  const rows: string[][] = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-4 gap-2.5 md:gap-3 w-full max-w-xl mx-auto',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      {/* baris 1 + tombol hapus */}
      {rows[0].map((d) => (
        <Key key={d} ariaLabel={`Angka ${d}`} onClick={() => onDigit(d)} className={digitCls}>
          {d}
        </Key>
      ))}
      <Key
        ariaLabel="Hapus"
        onClick={onDelete}
        className="bg-maroon-900/70 border-maroon-700/80 text-maroon-300 hover:border-maroon-400 hover:text-maroon-400 hover:shadow-neon-red"
      >
        <Delete size={26} strokeWidth={2.2} />
      </Key>

      {/* baris 2 + tombol minus */}
      {rows[1].map((d) => (
        <Key key={d} ariaLabel={`Angka ${d}`} onClick={() => onDigit(d)} className={digitCls}>
          {d}
        </Key>
      ))}
      <Key
        ariaLabel="Tanda minus"
        onClick={onMinus}
        className="bg-navy-800/85 border-blue-700/60 text-blue-300 hover:border-blue-400 hover:shadow-neon-blue hover:text-blue-200"
      >
        <span className="flex items-center gap-0.5 text-3xl leading-none">−</span>
      </Key>

      {/* baris 3 + OK (memanjang 2 baris) */}
      {rows[2].map((d) => (
        <Key key={d} ariaLabel={`Angka ${d}`} onClick={() => onDigit(d)} className={digitCls}>
          {d}
        </Key>
      ))}
      <Key
        ariaLabel="OK - periksa jawaban"
        onClick={onOk}
        className="row-span-2 h-full bg-gradient-to-b from-gold-300 via-gold-400 to-gold-600 border-gold-200 text-navy-950 shadow-neon-gold hover:brightness-110 flex-col gap-1"
      >
        <Check size={30} strokeWidth={3.2} />
        <span className="text-lg tracking-[0.2em]">OK</span>
      </Key>

      {/* baris 4 : angka 0 lebar */}
      <Key ariaLabel="Angka 0" onClick={() => onDigit('0')} className={cn(digitCls, 'col-span-3')}>
        0
      </Key>
    </div>
  );
}
