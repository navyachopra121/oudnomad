'use client';

import Header from '../components/Header';
import CraftTrustSection from '../components/home/CraftTrustSection';

export default function CraftPage() {
  return (
    <div className="min-h-screen bg-ivory text-espresso selection:bg-aged-gold/30 selection:text-espresso">
      <Header />
      <div className="pt-8">
        <CraftTrustSection />
      </div>
    </div>
  );
}
