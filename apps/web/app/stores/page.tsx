'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';

interface Boutique {
  id: string;
  name: string;
  city: string;
  region: 'Dubai' | 'Delhi NCR' | 'Chandigarh' | 'Mumbai' | 'Bangalore';
  country: string;
  address: string;
  landmark: string;
  phone: string;
  hours: string;
  image: string;
}

const BOUTIQUES: Boutique[] = [
  {
    id: 'dubai-flagship',
    name: 'Oud Arabia Dubai Flagship Boutique',
    city: 'Dubai',
    region: 'Dubai',
    country: 'United Arab Emirates',
    address: 'Shop 7, Alfaidi Street, Al Fahidi Historical District',
    landmark: 'Near Dubai Museum',
    phone: '+91-9888881908',
    hours: 'Daily: 10:00 AM – 11:00 PM GST',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Jannat-e-zuhur-1.jpg?v=1692390618',
  },
  {
    id: 'chandigarh-elante',
    name: 'Oud Arabia Chandigarh Boutique',
    city: 'Chandigarh',
    region: 'Chandigarh',
    country: 'India',
    address: 'Ground Floor, Elante Mall, Industrial Area Phase I',
    landmark: 'Next to Luxury Atrium',
    phone: '+91-9888881908',
    hours: 'Daily: 11:00 AM – 9:30 PM IST',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Voice_of_the_soul_1.jpg?v=1692390886',
  },
  {
    id: 'mohali-headquarters',
    name: 'Oud Arabia Experience Center & Hub',
    city: 'Mohali',
    region: 'Chandigarh',
    country: 'India',
    address: '2266 Phase 7, SAS Nagar, Mohali',
    landmark: 'Punjab 160062',
    phone: '+91-9888881908',
    hours: 'Monday – Saturday: 10:00 AM – 7:30 PM IST',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Nadeem_1.jpg?v=1692390847',
  },
  {
    id: 'delhi-dlf',
    name: 'Oud Arabia Delhi NCR Boutique',
    city: 'Noida / Delhi NCR',
    region: 'Delhi NCR',
    country: 'India',
    address: 'DLF Mall of India, Sector 18',
    landmark: 'First Floor Luxury Fragrance Wing',
    phone: '+91-9888881908',
    hours: 'Daily: 11:00 AM – 10:00 PM IST',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Oud_Arabia_No_1.jpg?v=1692390950',
  },
  {
    id: 'mumbai-palladium',
    name: 'Oud Arabia Mumbai Boutique',
    city: 'Mumbai',
    region: 'Mumbai',
    country: 'India',
    address: 'Phoenix Palladium, Senapati Bapat Marg, Lower Parel',
    landmark: 'Grand Galleria Floor',
    phone: '+91-9888881908',
    hours: 'Daily: 11:00 AM – 10:00 PM IST',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Artboard_1_copy_3_3adc834e-2708-444e-a224-0d3149cc0981.png?v=1764672655',
  },
  {
    id: 'bangalore-marketcity',
    name: 'Oud Arabia Bangalore Boutique',
    city: 'Bangalore',
    region: 'Bangalore',
    country: 'India',
    address: 'Phoenix Marketcity, Whitefield Main Road',
    landmark: 'Upper Ground Floor, Central Atrium',
    phone: '+91-9888881908',
    hours: 'Daily: 10:30 AM – 9:30 PM IST',
    image: 'https://cdn.shopify.com/s/files/1/0812/5077/9453/files/Bakhoor_Burner_Set.jpg?v=1692391200',
  },
];

export default function StoresPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [consultationModal, setConsultationModal] = useState<Boutique | null>(null);
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultDate, setConsultDate] = useState('');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const filteredBoutiques =
    selectedRegion === 'all'
      ? BOUTIQUES
      : BOUTIQUES.filter((b) => b.region.toLowerCase() === selectedRegion.toLowerCase());

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setConsultationModal(null);
      setConsultName('');
      setConsultPhone('');
      setConsultDate('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#f2efe9] flex flex-col font-sans selection:bg-[#ffb91d] selection:text-black">
      <SiteHeader />

      <main className="flex-1 w-full pt-28 pb-20">
        <Container className="space-y-12">
          {/* Breadcrumbs */}
          <nav className="text-[11px] font-sans uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
            <Link href="/" className="hover:text-[#ffb91d] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#ffb91d] font-medium">Store Locator</span>
          </nav>

          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#ffb91d] block">
              EXPERIENCE THE SCENTS IN PERSON
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white uppercase tracking-wider">
              Store Locator
            </h1>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans max-w-xl mx-auto">
              Visit our luxury boutique style retail outlets for the most luxurious hands-on sensory experience of our pure attars, extraits, and sacred bakhoors.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Locations' },
              { id: 'Dubai', label: 'Dubai (UAE)' },
              { id: 'Chandigarh', label: 'Chandigarh & Mohali' },
              { id: 'Delhi NCR', label: 'Delhi NCR' },
              { id: 'Mumbai', label: 'Mumbai' },
              { id: 'Bangalore', label: 'Bangalore' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRegion(tab.id)}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-all font-medium border ${
                  selectedRegion.toLowerCase() === tab.id.toLowerCase()
                    ? 'bg-[#ffb91d] text-black border-[#ffb91d] shadow-md'
                    : 'bg-transparent text-white/70 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBoutiques.map((b) => (
              <div
                key={b.id}
                className="border border-white/10 bg-[#0e0e0e] hover:border-[#ffb91d]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Store Thumbnail */}
                <div className="relative aspect-[16/10] w-full bg-[#141414] overflow-hidden">
                  <Image
                    src={b.image}
                    alt={b.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-[#ffb91d] text-[10px] font-mono tracking-widest px-2.5 py-1 border border-white/10">
                    {b.city} • {b.country}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg text-white leading-snug">{b.name}</h3>
                    <p className="text-xs text-white/70 font-sans leading-relaxed">
                      {b.address}, {b.landmark}
                    </p>
                    <div className="pt-2 text-[11px] font-mono text-white/50 space-y-1">
                      <p>
                        <strong className="text-white/80 font-sans">Hours:</strong> {b.hours}
                      </p>
                      <p>
                        <strong className="text-white/80 font-sans">Phone:</strong>{' '}
                        <a href={`tel:${b.phone}`} className="text-[#ffb91d] hover:underline">
                          {b.phone}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10 flex gap-2">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(b.name + ' ' + b.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 text-center text-xs uppercase tracking-wider font-semibold border border-white/20 hover:border-[#ffb91d] text-white hover:text-[#ffb91d] transition-all"
                    >
                      Get Directions
                    </a>
                    <button
                      type="button"
                      onClick={() => setConsultationModal(b)}
                      className="px-4 py-2.5 bg-[#d89528] hover:bg-[#ffb91d] text-black text-xs uppercase tracking-wider font-semibold transition-all shadow"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>

      {/* Book Consultation Modal */}
      {consultationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setConsultationModal(null)}
        >
          <div
            className="relative w-full max-w-md bg-[#111111] border border-[#ffb91d]/40 p-6 sm:p-8 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setConsultationModal(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-xl p-2"
              aria-label="Close"
            >
              ✕
            </button>

            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#ffb91d] block mb-1">
              VIP FRAGRANCE CONSULTATION
            </span>
            <h3 className="text-xl font-serif text-white tracking-wide mb-1">
              {consultationModal.name}
            </h3>
            <p className="text-xs text-white/60 font-sans mb-5">
              Book a complimentary private scent profiling with our master fragrance advisors.
            </p>

            {bookedSuccess ? (
              <div className="p-4 bg-[#53ff73]/10 border border-[#53ff73]/30 text-[#53ff73] text-xs text-center font-mono">
                ✓ Consultation request received. Our boutique manager will confirm via WhatsApp shortly.
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-1 font-mono">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white outline-none focus:border-[#ffb91d]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-1 font-mono">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={consultPhone}
                    onChange={(e) => setConsultPhone(e.target.value)}
                    placeholder="+91-9888881908"
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white outline-none focus:border-[#ffb91d]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-1 font-mono">
                    Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    required
                    value={consultDate}
                    onChange={(e) => setConsultDate(e.target.value)}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white outline-none focus:border-[#ffb91d]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#d89528] hover:bg-[#ffb91d] text-black font-semibold uppercase tracking-[0.2em] transition-all shadow-md active:scale-98"
                >
                  Confirm Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
