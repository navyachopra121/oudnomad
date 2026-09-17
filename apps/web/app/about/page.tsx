'use client';

import Header from '../components/Header';
import HeritageSection from '../components/home/HeritageSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory text-espresso selection:bg-aged-gold/30 selection:text-espresso">
      <Header />
      <div className="pt-8">
        <HeritageSection />
      </div>
    </div>
  );
}
