interface LogoMarkProps {
  size?: number;
  className?: string;
  /** true = versi hitam putih (untuk cetak) */
  mono?: boolean;
}

/**
 * Logo Expert Zealous berbentuk SVG inline. Tidak memakai <img> atau file eksternal,
 * sehingga selalu tampil baik di versi web, offline, maupun hasil build satu-file.
 */
export function LogoMark({ size = 40, className, mono = false }: LogoMarkProps) {
  const ink = mono ? '#111111' : '#141414';
  const red = mono ? '#ffffff' : '#E11A22';
  const gold = mono ? '#ffffff' : '#FFC709';
  const letter = mono ? '#111111' : '#E11A22';
  const tassel = mono ? '#111111' : '#FFC709';
  const line = mono ? '#111111' : 'none';
  const lw = mono ? 5 : 0;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Logo Expert Zealous"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* BUKU TERBUKA */}
      <path
        d="M12 104 C37 91 67 92 96 110 L96 183 C67 166 37 165 12 176 Z"
        fill={red}
        stroke={line}
        strokeWidth={lw}
        strokeLinejoin="round"
      />
      <path
        d="M188 104 C163 91 133 92 104 110 L104 183 C133 166 163 165 188 176 Z"
        fill={red}
        stroke={line}
        strokeWidth={lw}
        strokeLinejoin="round"
      />
      <path
        d="M30 101 C51 95 74 100 94 113 L94 169 C74 157 51 154 30 159 Z"
        fill={gold}
        stroke={line}
        strokeWidth={lw}
        strokeLinejoin="round"
      />
      <path
        d="M170 101 C149 95 126 100 106 113 L106 169 C126 157 149 154 170 159 Z"
        fill={gold}
        stroke={line}
        strokeWidth={lw}
        strokeLinejoin="round"
      />

      <path
        d="M43 118 L82 127 L82 139 L57 133.5 L57 141 L78 146 L78 157 L57 152 L57 159 L82 164.5 L82 176 L43 167 Z"
        fill={letter}
      />
      <path
        d="M118 127 L157 118 L157 129 L134 155 L157 150 L157 161 L118 171 L118 160 L141 134 L118 139 Z"
        fill={letter}
      />

      {/* TOPI TOGA: papan berada penuh di atas badan topi dan buku */}
      <path
        d="M60 54 L100 70 L140 54 L140 83 C140 95 122 104 100 104 C78 104 60 95 60 83 Z"
        fill={ink}
      />
      <path d="M100 10 L190 45 L100 79 L10 45 Z" fill={ink} />
      <circle cx="100" cy="45" r="4.5" fill={mono ? '#ffffff' : '#FFC709'} />

      {/* Tali dan jumbai pada sisi kiri topi */}
      <path
        d="M18 47 L18 88"
        stroke={tassel}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cx="18" cy="95" rx="7.5" ry="8.5" fill={tassel} />
      <path
        d="M12 99 L10 116 M16 101 L15 118 M20 101 L21 118 M24 99 L27 116"
        stroke={tassel}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface LogoFullProps {
  className?: string;
  markSize?: number;
  compact?: boolean;
}

/** Logo lengkap: lambang + teks "Expert Zealous" dan tagline */
export function LogoFull({ className, markSize = 42, compact = false }: LogoFullProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark size={markSize} className="block shrink-0" />
      {!compact && (
        <div className="leading-none">
          <p className="font-display text-[13px] font-extrabold tracking-wide text-gold-300 text-glow-gold">
            EXPERT ZEALOUS
          </p>
          <p className="mt-0.5 text-[9px] font-semibold italic tracking-wide text-maroon-300">
            Jagonya Les Private Matematika
          </p>
        </div>
      )}
    </div>
  );
}

export default LogoMark;
