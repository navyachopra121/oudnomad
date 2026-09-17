'use client';

import Header from '../components/Header';
import TestimonialsSection from '../components/home/TestimonialsSection';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-ivory text-espresso selection:bg-aged-gold/30 selection:text-espresso">
      <Header />
      <div className="pt-8">
        <TestimonialsSection />
      </div>
    </div>
  );
}
