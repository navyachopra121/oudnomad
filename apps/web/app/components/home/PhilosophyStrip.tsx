'use client';

import { forwardRef } from 'react';
import Container from '../Container';
import IlluminatedSprig from './motifs/IlluminatedSprig';
import OudEmblem from './OudEmblem';
import Reveal from './Reveal';

const PhilosophyStrip = forwardRef<HTMLElement>(function PhilosophyStrip(_props, ref) {
  return (
    <section
      ref={ref}
      id="philosophy"
      className="bg-ivory text-espresso border-b border-border"
      style={{ paddingBlock: 'var(--section-py)' }}
    >
      <Container>
        <Reveal className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center items-center gap-3 mb-8">
            <IlluminatedSprig className="text-antique-gold" />
            <OudEmblem />
            <IlluminatedSprig className="scale-x-[-1] text-antique-gold" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.32em] text-antique-gold font-medium mb-4">
            The Nomad Creed
          </p>

          <blockquote className="font-display text-fluid-quote leading-relaxed text-espresso italic font-normal">
            &ldquo;Every flacon we seal has already lived a life — aged in sacred shadow, carried
            across trade routes in cedarwood caskets, blended by hand. We simply entrust that story to
            you.&rdquo;
          </blockquote>

          <p
            className="font-arabic text-base text-antique-gold mt-6 font-light"
            dir="rtl"
            lang="ar"
          >
            كل قطرة تجسد رحلة من الأصالة والتراث
          </p>
        </Reveal>
      </Container>
    </section>
  );
});

export default PhilosophyStrip;
