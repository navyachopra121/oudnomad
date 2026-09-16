'use client';

import Header from './components/Header';
import BannerSection from './components/home/herobannerSection';
import CraftTrustSection from './components/home/CraftTrustSection';
import GrandVitrineSection from './components/home/GrandVitrineSection';
import HeritageSection from './components/home/HeritageSection';
import HeroSection from './components/home/HeroSection';
import JoinMajlisSection from './components/home/JoinMajlisSection';
import LifestyleGallery from './components/home/LifestyleGallery';
import WaxSealDivider from './components/home/motifs/WaxSealDivider';
import OlfactoryAccordExplorer from './components/home/OlfactoryAccordExplorer';
import PhilosophyStrip from './components/home/PhilosophyStrip';
import TestimonialsSection from './components/home/TestimonialsSection';
import NotesSection from './components/home/notesSection';  

export default function Home() {
  return (
    <div className="min-h-screen bg-ivory text-espresso selection:bg-aged-gold/30 selection:text-espresso">
      <Header />
      <BannerSection
        media={{
          type: 'image',
          images: [
            {
              // Swapped from t3.ftcdn.net (not in next.config.ts remotePatterns, so
              // Next/Image was returning a 400 and the image never rendered).
              // picsum.photos IS allowlisted, same pattern as data.tsx / images.ts.
              src: '/banners.jpg',
              alt: 'New arrivals',
            },
          ],
        }}
      />
      {/* <HeroSection /> */}
      <GrandVitrineSection />
      <HeritageSection />

      <OlfactoryAccordExplorer />
      <NotesSection />
      {/* <PhilosophyStrip /> */}
      {/* <WaxSealDivider /> */}


      <CraftTrustSection />
      <TestimonialsSection />
      <LifestyleGallery />
      {/* <JoinMajlisSection /> */}
      {/* <WaxSealDivider /> */}
    </div>
  );
}