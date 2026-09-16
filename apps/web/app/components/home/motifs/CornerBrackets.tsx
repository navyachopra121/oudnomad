type Props = { className?: string };

const BRACKET = (
  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-antique-gold/70" aria-hidden>
    <path d="M1 8 V1 H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M1 1 L6 6" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />
  </svg>
);

/** Ornate mirror-frame corners — no full border */
export default function CornerBrackets({ className = '' }: Props) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${className}`} aria-hidden>
      <div className="absolute top-2 left-2">{BRACKET}</div>
      <div className="absolute top-2 right-2 rotate-90">{BRACKET}</div>
      <div className="absolute bottom-2 left-2 -rotate-90">{BRACKET}</div>
      <div className="absolute bottom-2 right-2 rotate-180">{BRACKET}</div>
    </div>
  );
}
