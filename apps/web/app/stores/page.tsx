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
  country: string;
  address: string;
  district: string;
  phone: string;
  email: string;
  hours: string;
  image: string;
  type: 'Flagship Atelier' | 'Private Salon' | 'Partner Vault';
  amenities: string[];
}

const BOUTIQUES: Boutique[] = [
  {
    id: 'dubai-flagship',
    name: 'The Dubai Flagship Atelier & Private Vault',
    city: 'Dubai',
    country: 'United Arab Emirates',
    address: 'Sheikh Mohammed bin Rashid Blvd, Opera District',
    district: 'Downtown Dubai',
    phone: '+971 4 398 2100',
    email: 'dubai@oudnomad.com',
    hours: 'Daily: 10:00 AM – 11:00 PM (Private salons by appointment)',
    image: 'https://picsum.photos/seed/dubai-atelier/900/600',
    type: 'Flagship Atelier',
    amenities: ['VIP Private Scent Chamber', 'Bespoke Flacon Engraving', 'Master Distiller Masterclasses', 'Complimentary Valet'],
  },
  {
    id: 'london-mayfair',
    name: 'Mayfair Fragrance Salon',
    city: 'London',
    country: 'United Kingdom',
    address: '42 Mount Street, Mayfair',
    district: 'West End',
    phone: '+44 20 7946 0850',
    email: 'mayfair@oudnomad.com',
    hours: 'Monday – Saturday: 10:00 AM – 7:00 PM | Sunday: 12:00 PM – 6:00 PM',
    image: 'https://picsum.photos/seed/london-salon/900/600',
    type: 'Private Salon',
    amenities: ['Private Olfactory Consultations', 'Same-Day Courier in London', 'Rare Vintage Vault Tasting'],
  },
  {
    id: 'paris-vendome',
    name: 'Place Vendôme Partner Vault',
    city: 'Paris',
    country: 'France',
    address: '18 Place Vendôme',
    district: '1er Arrondissement',
    phone: '+33 1 42 68 55 90',
    email: 'paris@oudnomad.com',
    hours: 'Tuesday – Saturday: 11:00 AM – 7:30 PM (Private appointments preferred)',
    image: 'https://picsum.photos/seed/paris-vault/900/600',
    type: 'Partner Vault',
    amenities: ['Diplomatic Delivery Service', 'Champagne Scent Pairing', 'Bespoke Carboy Sampling'],
  },
];

export default function StoresPage() {
  const [selectedBoutique, setSelectedBoutique] = useState<Boutique | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('14:00');
  const [collectorName, setCollectorName] = useState('');
  const [collectorEmail, setCollectorEmail] = useState('');
  const [scentInterest, setScentInterest] = useState('Wild Assam & Cambodian Oud');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedBoutique(null);
      setCollectorName('');
      setCollectorEmail('');
      setAppointmentDate('');
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-8 sm:py-16">
        <Container className="space-y-12 sm:space-y-16">
          {/* Breadcrumbs */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.16em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">Atelier Boutiques</span>
          </nav>

          {/* Hero Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4 font-sans">
            <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-semibold block">
              Physical Sanctuaries & Salons
            </span>
            <h1 className="font-display text-3xl sm:text-5xl text-espresso tracking-tight">
              Atelier Flagships & Salons
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Step into an intimate olfactory sanctuary. Experience vintage agarwood tears, uncut botanical attars, and private nose consultations.
            </p>
          </div>

          {/* Boutiques List */}
          <div className="space-y-10 font-sans">
            {BOUTIQUES.map((boutique) => (
              <div
                key={boutique.id}
                className="bg-surface-muted/30 border border-border hover:border-antique-gold/50 transition-all p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
              >
                {/* Image Gallery Thumbnail */}
                <div className="w-full lg:w-96 aspect-[16/10] bg-espresso/5 border border-border relative overflow-hidden shrink-0">
                  <Image
                    src={boutique.image}
                    alt={boutique.name}
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-espresso/80 backdrop-blur-sm border border-antique-gold/40 text-[9px] uppercase tracking-widest text-antique-gold font-medium">
                    {boutique.type}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold block">
                      {boutique.city}, {boutique.country}
                    </span>
                    <h2 className="font-display text-2xl text-espresso mt-1">{boutique.name}</h2>
                    <p className="text-xs text-muted font-sans mt-0.5">{boutique.address}, {boutique.district}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-border/70">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted block mb-1">Hours</span>
                      <p className="text-espresso">{boutique.hours}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted block mb-1">Atelier Contact</span>
                      <p className="font-mono text-espresso">{boutique.phone}</p>
                      <p className="text-muted">{boutique.email}</p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted block mb-1.5">Sanctuary Amenities</span>
                    <div className="flex flex-wrap gap-2">
                      {boutique.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-ivory border border-border text-[10px] text-muted">
                          ✦ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full lg:w-auto shrink-0 flex flex-col gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-border">
                  <button
                    onClick={() => setSelectedBoutique(boutique)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.2em] font-medium transition-colors shadow-sm text-center"
                  >
                    Reserve Consultation
                  </button>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(boutique.name + ' ' + boutique.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 border border-border hover:border-antique-gold text-espresso text-xs uppercase tracking-[0.2em] font-medium transition-colors text-center"
                  >
                    Atelier Directions ↗
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Consultation Modal */}
          {selectedBoutique && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm font-sans">
              <div className="bg-ivory border border-border p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-antique-gold font-medium block">
                      Private Olfactory Consultation
                    </span>
                    <h3 className="font-display text-xl text-espresso">{selectedBoutique.city} Atelier</h3>
                  </div>
                  <button onClick={() => setSelectedBoutique(null)} className="text-muted hover:text-espresso text-lg">
                    ✕
                  </button>
                </div>

                {bookingSuccess ? (
                  <div className="p-6 bg-deep-emerald/10 border border-deep-emerald/30 text-center space-y-2">
                    <div className="text-2xl text-deep-emerald">✓</div>
                    <p className="font-serif text-base text-espresso">Your Private Consultation is Reserved</p>
                    <p className="text-xs text-muted">
                      An invitation dossier and calendar confirmation have been dispatched to your email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                        Collector Name
                      </label>
                      <input
                        type="text"
                        required
                        value={collectorName}
                        onChange={(e) => setCollectorName(e.target.value)}
                        placeholder="Sheikh / Madame / Your Name"
                        className="w-full bg-background border border-border p-2.5 text-xs text-espresso focus:outline-none focus:border-antique-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={collectorEmail}
                        onChange={(e) => setCollectorEmail(e.target.value)}
                        placeholder="collector@domain.com"
                        className="w-full bg-background border border-border p-2.5 text-xs text-espresso focus:outline-none focus:border-antique-gold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          required
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          className="w-full bg-background border border-border p-2 text-xs text-espresso focus:outline-none focus:border-antique-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                          Time Slot
                        </label>
                        <select
                          value={appointmentTime}
                          onChange={(e) => setAppointmentTime(e.target.value)}
                          className="w-full bg-background border border-border p-2 text-xs text-espresso focus:outline-none focus:border-antique-gold"
                        >
                          <option value="11:00">11:00 AM (Morning Air)</option>
                          <option value="14:00">02:00 PM (Afternoon Salon)</option>
                          <option value="16:30">04:30 PM (Twilight Tasting)</option>
                          <option value="19:00">07:00 PM (Evening Vault Session)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">
                        Olfactory Focus & Interests
                      </label>
                      <select
                        value={scentInterest}
                        onChange={(e) => setScentInterest(e.target.value)}
                        className="w-full bg-background border border-border p-2 text-xs text-espresso focus:outline-none focus:border-antique-gold"
                      >
                        <option value="Wild Assam & Cambodian Oud">Wild Assam & Cambodian Oud (Single-Tree Extracts)</option>
                        <option value="Artisanal Pure Attars">Artisanal Pure Attars (Hydro-Distilled Over Sandalwood)</option>
                        <option value="Layered Mukhallats">Layered Mukhallat Compositions (Taif Rose & Ambergris)</option>
                        <option value="Bespoke Vault Discovery">Bespoke Full Atelier Discovery</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedBoutique(null)}
                        className="px-4 py-2 border border-border text-xs uppercase tracking-wider text-muted hover:text-espresso"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-wider font-medium transition-colors shadow-sm"
                      >
                        Confirm Reservation
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
