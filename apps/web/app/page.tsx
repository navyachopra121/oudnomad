'use client';

import Header from './components/Header';
import MinimalHomepage from './components/home/MinimalHomepage';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-foreground">
      {/* transparentMode: hides the 80px spacer so video hero starts at y=0 behind the transparent header */}
      <Header transparentMode />
      <MinimalHomepage />
    </div>
  );
}