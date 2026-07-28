import { Star } from 'lucide-react';
import { cn } from '../utils/cn';

interface StarsProps {
  count: number;
  filled?: boolean;
  size?: number;
  className?: string;
}

/** Barisan bintang penanda level — level 1 = 1 bintang, dst. */
export default function Stars({ count, filled = true, size = 14, className }: StarsProps) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            filled
              ? 'fill-gold-400 text-gold-300 drop-shadow-[0_0_6px_rgba(255,209,102,0.8)]'
              : 'text-navy-600 fill-navy-800',
          )}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
