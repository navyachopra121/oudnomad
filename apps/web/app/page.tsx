'use client';

import Header from './components/Header';
import MinimalHomepage from './components/home/MinimalHomepage';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-aged-gold/30 selection:text-espresso">
      <Header />
      <MinimalHomepage />
    </div>
  );
}