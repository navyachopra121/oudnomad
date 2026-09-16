type Props = { className?: string };

/** Quiet oud-drop mark for philosophy / dividers */
export default function OudEmblem({ className = 'w-5 h-8' }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10 2c4 6 8 12 8 18a8 8 0 1 1-16 0c0-6 4-12 8-18z"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-antique-gold"
      />
      <path d="M10 12v8" stroke="currentColor" strokeWidth="0.8" className="text-champagne-sand/80" />
    </svg>
  );
}
