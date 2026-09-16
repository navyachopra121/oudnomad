type Props = {
  className?: string;
  opacity?: number;
};

export default function ChinoiseriePattern({ className = '', opacity = 0.08 }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="chinoiserie-damask"
            width="140"
            height="140"
            patternUnits="userSpaceOnUse"
          >
            {/* Elegant botanical vine & blooming rose silhouetted motif */}
            <path
              d="M70 10 C65 25, 50 35, 45 50 C40 65, 55 80, 70 85 C85 80, 100 65, 95 50 C90 35, 75 25, 70 10 Z"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.8"
            />
            <path
              d="M70 20 C62 32, 54 44, 70 58 C86 44, 78 32, 70 20 Z"
              fill="none"
              stroke="#E8D7A7"
              strokeWidth="0.6"
              strokeDasharray="2 3"
            />
            {/* Curving vine flourishes */}
            <path
              d="M45 50 C30 45, 15 55, 10 70 C5 85, 20 100, 35 95 C50 90, 55 75, 45 50"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.75"
            />
            <path
              d="M95 50 C110 45, 125 55, 130 70 C135 85, 120 100, 105 95 C90 90, 85 75, 95 50"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.75"
            />
            {/* Small floral buds and leaves */}
            <circle cx="70" cy="85" r="3" fill="#D4AF37" />
            <circle cx="10" cy="70" r="2.5" fill="#D4AF37" />
            <circle cx="130" cy="70" r="2.5" fill="#D4AF37" />
            <path
              d="M70 85 C60 105, 50 120, 70 135 C90 120, 80 105, 70 85"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.6"
            />
            <circle cx="70" cy="135" r="2" fill="#E8D7A7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#chinoiserie-damask)" />
      </svg>
    </div>
  );
}
