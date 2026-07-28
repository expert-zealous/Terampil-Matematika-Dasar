import { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, ClipboardCheck, Keyboard, Sparkles } from 'lucide-react';
import TopBar from './components/TopBar';
import ProblemCard from './components/ProblemCard';
import VirtualKeyboard from './components/VirtualKeyboard';
import TestLevels, { type Progress } from './components/TestLevels';
import ResultModal from './components/ResultModal';
import Stars from './components/Stars';

import { generateProblems } from './lib/generator';
import { exportProblemsPdf } from './lib/pdf';
import type { BoardItem, GenConfig, NumberMode, OpChoice } from './lib/types';
import { LEVELS, OP_LABEL, PASS_SCORE } from './lib/types';
import { cn } from './utils/cn';

const STORAGE_KEY = 'tmd-progress-v1';

const DEFAULT_PROGRESS: Progress = { unlocked: 1, best: {} };

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Progress;
    return { unlocked: Math.max(1, Math.min(5, parsed.unlocked || 1)), best: parsed.best || {} };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

const fireConfetti = (big = false) => {
  // Defensive: canvas-confetti dapat gagal di lingkungan file:// atau canvas diblokir.
  try {
    confetti({
      particleCount: big ? 160 : 90,
      spread: big ? 95 : 70,
      origin: { y: 0.25 },
      colors: ['#ffd166', '#ff3b5c', '#60a5fa', '#34d399', '#fff0c2'],
    });
  } catch {
    /* abaikan — efek konfeti saja */
  }
};

const buildBoard = (cfg: GenConfig): BoardItem[] =>
  generateProblems(cfg).map((p) => ({ problem: p, input: '', status: 'idle', shakeKey: 0 }));

export default function App() {
  const [view, setView] = useState<'latihan' | 'tes'>('latihan');
  const [level, setLevel] = useState<number | null>(null);

  const [opChoice, setOpChoice] = useState<OpChoice>('random');
  const [numberMode, setNumberMode] = useState<NumberMode>('asli');
  const [minVal, setMinVal] = useState(1);
  const [maxVal, setMaxVal] = useState(20);

  const [board, setBoard] = useState<BoardItem[]>([]);
  const [active, setActive] = useState(0);
  const [genTick, setGenTick] = useState(0);

  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultScore, setResultScore] = useState(0);

  const celebrated = useRef(false);

  const activeCfg: GenConfig = useMemo(() => {
    if (view === 'tes' && level !== null) return LEVELS[level - 1].config;
    return { op: opChoice, mode: numberMode, min: minVal, max: maxVal, count: 10 };
  }, [view, level, opChoice, numberMode, minVal, maxVal]);

  // bangkitkan soal baru setiap konfigurasi berubah
  useEffect(() => {
    if (view === 'tes' && level === null) return;
    setBoard(buildBoard(activeCfg));
    setActive(0);
    setResultOpen(false);
    setGenTick((t) => t + 1);
  }, [activeCfg, view, level]);

  useEffect(() => {
    celebrated.current = false;
  }, [genTick]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* abaikan */
    }
  }, [progress]);

  /* ---------------- statistik ---------------- */
  const correct = board.filter((i) => i.status === 'correct').length;
  const wrong = board.filter((i) => i.status === 'wrong').length;
  const remaining = board.length - correct - wrong;

  // rayakan saat semua jawaban latihan benar
  useEffect(() => {
    if (view === 'latihan' && board.length > 0 && correct === board.length && !celebrated.current) {
      celebrated.current = true;
      fireConfetti(false);
    }
  }, [board, view, correct]);

  /* ---------------- aksi keyboard ---------------- */
  const mutateActive = (fn: (item: BoardItem) => BoardItem) => {
    setBoard((b) => b.map((it, i) => (i === active ? fn(it) : it)));
  };

  const onDigit = (d: string) => {
    mutateActive((it) => {
      if (it.status === 'correct') return it;
      if (it.input.replace('-', '').length >= 6) return it;
      return { ...it, input: it.input + d, status: it.status === 'wrong' ? 'idle' : it.status };
    });
  };

  const onMinus = () => {
    mutateActive((it) => {
      if (it.status === 'correct') return it;
      const input = it.input.startsWith('-') ? it.input.slice(1) : '-' + it.input;
      return { ...it, input, status: it.status === 'wrong' ? 'idle' : it.status };
    });
  };

  const onDelete = () => {
    mutateActive((it) => {
      if (it.status === 'correct') return it;
      return { ...it, input: it.input.slice(0, -1), status: it.status === 'wrong' ? 'idle' : it.status };
    });
  };

  const advance = () => {
    const n = board.length;
    for (let k = 1; k <= n; k++) {
      const idx = (active + k) % n;
      if (board[idx].status !== 'correct' && idx !== active) {
        setActive(idx);
        return;
      }
    }
  };

  const onOk = () => {
    const item = board[active];
    if (!item) return;
    if (item.status === 'correct') {
      advance();
      return;
    }
    const s = item.input;
    if (s === '' || s === '-') return;
    const val = parseInt(s, 10);
    if (Number.isNaN(val)) return;
    const isRight = val === item.problem.answer;
    setBoard((b) =>
      b.map((it, i) =>
        i === active
          ? { ...it, status: isRight ? 'correct' : 'wrong', shakeKey: isRight ? it.shakeKey : it.shakeKey + 1 }
          : it,
      ),
    );
    if (isRight) advance();
  };

  // dukungan keyboard fisik (bonus di samping keyboard virtual)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (resultOpen) return;
      if (view === 'tes' && level === null) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (/^[0-9]$/.test(e.key)) onDigit(e.key);
      else if (e.key === 'Backspace') onDelete();
      else if (e.key === 'Enter') onOk();
      else if (e.key === '-') onMinus();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  /* ---------------- tes ---------------- */
  const startLevel = (lv: number) => {
    setLevel(lv);
  };

  const evaluate = () => {
    if (level === null) return;
    const score = board.filter((i) => i.status === 'correct').length;
    const passed = score >= PASS_SCORE;
    setResultScore(score);
    setResultOpen(true);
    if (passed) {
      fireConfetti(true);
      setProgress((p) => ({
        unlocked: Math.max(p.unlocked, Math.min(5, level + 1)),
        best: { ...p.best, [level]: Math.max(p.best[level] || 0, score) },
      }));
    }
  };

  /* ---------------- cetak ---------------- */
  const opText = opChoice === 'random' ? 'Campuran Acak' : OP_LABEL[opChoice];
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    if (printing) return;
    setPrinting(true);
    try {
      const inTest = view === 'tes' && level !== null;
      const lvCfg = inTest ? LEVELS[level - 1] : null;
      const title = inTest && lvCfg ? `Tes Level ${level} — ${lvCfg.label}` : 'Lembar Latihan Bebas';
      const subtitle = inTest && lvCfg
        ? `Operasi: ${lvCfg.config.op === 'random' ? 'Campuran Acak' : OP_LABEL[lvCfg.config.op]}  •  Bilangan: Asli  •  Rentang ${lvCfg.config.min} sampai ${lvCfg.config.max}  •  ${new Date().toLocaleDateString('id-ID')}`
        : `Operasi: ${opText}  •  Bilangan: ${numberMode === 'asli' ? 'Asli' : 'Bulat'}  •  Rentang ${minVal} sampai ${maxVal}  •  ${new Date().toLocaleDateString('id-ID')}`;
      await exportProblemsPdf(board.map((b) => b.problem), { title, subtitle });
    } finally {
      setPrinting(false);
    }
  };

  const regenerate = () => {
    setBoard(buildBoard(activeCfg));
    setActive(0);
    setResultOpen(false);
    setGenTick((t) => t + 1);
  };

  const inTestRun = view === 'tes' && level !== null;
  const currentLevel = inTestRun ? LEVELS[level - 1] : null;
  const answered = board.length - remaining;

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar
        view={view}
        onViewChange={(v) => {
          setView(v);
          if (v === 'latihan') setLevel(null);
        }}
        opChoice={opChoice}
        onOpChange={setOpChoice}
        numberMode={numberMode}
        onNumberModeChange={setNumberMode}
        min={minVal}
        max={maxVal}
        onRangeChange={(a, b) => {
          setMinVal(a);
          setMaxVal(b);
        }}
        onGenerate={regenerate}
        onPrint={handlePrint}
        printing={printing}
        settingsDisabled={view === 'tes'}
        stats={{ correct, wrong, remaining }}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 pb-14 pt-6 sm:px-5">
        {view === 'tes' && level === null ? (
          <TestLevels progress={progress} onStart={startLevel} />
        ) : (
          <>
            {/* ---------- kepala bagian ---------- */}
            <div className="no-print mb-5 flex flex-wrap items-center gap-3">
              {inTestRun && currentLevel ? (
                <>
                  <button
                    type="button"
                    onClick={() => setLevel(null)}
                    className="flex items-center gap-1.5 rounded-xl border border-navy-600/70 bg-navy-900/80 px-3 py-2 text-sm font-bold text-blue-200 transition-all hover:border-gold-400/70 hover:text-gold-200 cursor-pointer"
                  >
                    <ArrowLeft size={15} /> Pilih Level
                  </button>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="font-display text-lg md:text-xl font-extrabold tracking-wide text-gold-300 text-glow-gold">
                        TES LEVEL {level}
                      </h2>
                      <Stars count={level} filled={(progress.best[level!] ?? 0) >= PASS_SCORE} size={15} />
                    </div>
                    <p className="text-xs font-semibold text-blue-200/60">
                      {currentLevel.label} • {currentLevel.desc} • Lulus minimal {PASS_SCORE}/10 benar
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2.5">
                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300/60">Terjawab</p>
                      <p className="font-display text-sm font-bold text-gold-200">{answered}/10</p>
                    </div>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-navy-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-maroon-500 to-gold-400 transition-all duration-300"
                        style={{ width: `${(answered / Math.max(1, board.length)) * 100}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={evaluate}
                      disabled={remaining > 0}
                      className={cn(
                        'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-extrabold transition-all cursor-pointer',
                        remaining > 0
                          ? 'cursor-not-allowed border border-navy-600/60 bg-navy-900/70 text-navy-600'
                          : 'bg-gradient-to-b from-gold-300 to-gold-600 text-navy-950 shadow-neon-gold hover:brightness-110 active:scale-95',
                      )}
                    >
                      <ClipboardCheck size={15} /> Selesai & Nilai
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/50 bg-maroon-900/70 shadow-neon-red">
                    <Sparkles size={18} className="text-gold-300" />
                  </span>
                  <div>
                    <h2 className="font-display text-lg md:text-xl font-extrabold tracking-wide text-gold-300 text-glow-gold">
                      LEMBAR LATIHAN
                    </h2>
                    <p className="text-xs font-semibold text-blue-200/60">
                      10 soal acak • jawab lewat keyboard di bawah • bilangan {numberMode === 'asli' ? 'asli' : 'bulat'}{' '}
                      {Math.min(minVal, maxVal)} – {Math.max(minVal, maxVal)}
                    </p>
                  </div>
                  <div className="ml-auto hidden md:flex items-center gap-2">
                    <span className="rounded-full border border-maroon-400/50 bg-maroon-950/60 px-3 py-1 text-[11px] font-bold text-maroon-300">
                      {opText}
                    </span>
                    {correct === board.length && board.length > 0 && (
                      <span className="rounded-full border border-emerald-400/60 bg-emerald-950/60 px-3 py-1 text-[11px] font-bold text-emerald-300 shadow-neon-green">
                        Semua benar — luar biasa!
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ---------- kop khusus saat dicetak lewat browser ---------- */}
            <div className="print-only mb-4 border-b-2 border-black pb-2">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Expert Zealous" className="block h-11 w-11 object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                <div className="leading-tight">
                  <p className="text-base font-extrabold tracking-wide">EXPERT ZEALOUS</p>
                  <p className="text-[10px] font-semibold italic">Jagonya Les Private Matematika</p>
                </div>
                <div className="ml-auto text-right leading-tight">
                  <p className="text-sm font-extrabold">TERAMPIL MATEMATIKA DASAR</p>
                  <p className="text-[10px]">Lembar Latihan Operasi Hitung Bilangan Bulat</p>
                </div>
              </div>
              <div className="mt-2 flex gap-6 text-[11px]">
                <span>Nama : ______________________</span>
                <span>Kelas : ____________</span>
                <span>Nilai : ____________</span>
              </div>
            </div>

            {/* ---------- papan soal : 2 kolom ---------- */}
            <section className="print-board grid gap-3 md:gap-4 lg:grid-cols-2">
              {board.map((it, i) => (
                <ProblemCard
                  key={`${genTick}-${i}`}
                  index={i}
                  item={it}
                  active={i === active}
                  onSelect={() => setActive(i)}
                />
              ))}
            </section>

            {/* ---------- keyboard virtual di bawah soal ---------- */}
            <section className="no-print neon-panel mx-auto mt-7 w-full max-w-2xl rounded-3xl p-4 md:p-5">
              <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/50 bg-navy-800 shadow-neon-blue">
                  <Keyboard size={17} className="text-blue-300" />
                </span>
                <h3 className="font-display text-sm md:text-base font-extrabold tracking-[0.18em] text-blue-100 text-glow-blue">
                  KEYBOARD JAWABAN
                </h3>
                <span className="ml-auto text-[10px] md:text-[11px] font-semibold text-blue-300/60">
                  angka 0–9 • − untuk negatif • hapus • OK = periksa
                </span>
              </div>
              <VirtualKeyboard onDigit={onDigit} onMinus={onMinus} onDelete={onDelete} onOk={onOk} />
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-navy-800/70 bg-navy-950/70 py-4 text-center">
        <p className="text-[11px] font-semibold tracking-wide text-blue-300/50">
          Terampil Matematika Dasar • Latihan penjumlahan, pengurangan, perkalian & pembagian bilangan bulat
        </p>
      </footer>

      <ResultModal
        open={resultOpen}
        level={level ?? 1}
        score={resultScore}
        total={10}
        passed={resultScore >= PASS_SCORE}
        onRetry={() => regenerate()}
        onNext={() => {
          setResultOpen(false);
          setLevel((l) => (l !== null && l < 5 ? l + 1 : l));
        }}
        onExit={() => {
          setResultOpen(false);
          setLevel(null);
        }}
      />
    </div>
  );
}
