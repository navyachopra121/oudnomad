import Container from '../Container';
import { TRUST_PILLARS } from './data';
import CornerBrackets from './motifs/CornerBrackets';
import Reveal from './Reveal';

function TrustIcon({ id }: { id: string }) {
  const paths: Record<string, string> = {
    aged: 'M12 4v16M8 8h8M6 20h12',
    sourced: 'M4 12c4-6 12-6 16 0M4 12c0 4 3 8 8 8s8-4 8-8',
    gift: 'M6 10h12v10H6zM12 10V6M8 6h8a2 2 0 0 1 0 4H8a2 2 0 0 1 0-4z',
    delivery: 'M3 8h11v9H3zM14 11h4l3 3v3h-7V11zM7 18a1.5 1.5 0 1 0 0 .1M17 18a1.5 1.5 0 1 0 0 .1',
  };
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-7 h-7 text-antique-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <path d={paths[id] ?? paths.aged} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CraftTrustSection() {
  return (
    <section
      className="bg-surface-muted/20 text-espresso border-t border-border relative overflow-hidden"
      style={{ paddingBlock: 'var(--section-py)' }}
    >
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {TRUST_PILLARS.map((item, i) => (
            <Reveal key={item.id} delayMs={i * 70}>
              <div className="group relative p-6 sm:p-7 bg-ivory border border-border hover:border-antique-gold/40 rounded-sm h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-400">
                <CornerBrackets />
                <div>
                  <div
                    className="mb-5 inline-flex p-3 bg-surface-muted border border-border rounded-sm transition-transform duration-[450ms] group-hover:-translate-y-1"
                    style={{ transitionTimingFunction: 'var(--ease-luxury)' }}
                  >
                    <TrustIcon id={item.id} />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-espresso group-hover:text-antique-gold transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed font-light">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
