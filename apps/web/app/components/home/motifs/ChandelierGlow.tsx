type Props = {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'dramatic';
};

export default function ChandelierGlow({ className = '', intensity = 'medium' }: Props) {
  const intensityMap = {
    subtle: 'opacity-40',
    medium: 'opacity-70',
    dramatic: 'opacity-100',
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 h-[480px] overflow-hidden ${intensityMap[intensity]} ${className}`}
    >
      {/* Central downward cone simulating crystal chandelier warmth */}
      <div
        className="mx-auto h-full w-full max-w-5xl"
        style={{
          background:
            'radial-gradient(ellipse 55% 55% at 50% 0%, rgba(229, 211, 161, 0.22) 0%, rgba(212, 175, 55, 0.08) 45%, transparent 75%)',
        }}
      />
      {/* Secondary ambient warm glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle 600px at 50% -100px, rgba(142, 90, 40, 0.15), transparent 70%)',
        }}
      />
      {/* Delicate horizontal light beam */}
      <div className="absolute top-0 left-1/2 h-[1px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
    </div>
  );
}
