'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/header/SiteHeader';
import Container from '../../components/Container';
import { useAuth } from '../../components/auth/AuthContext';

interface AddressItem {
  id: string;
  label: string;
  name: string;
  line1: string;
  city: string;
  emirate: string;
  country: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: 'addr-1',
    label: 'Primary Residence',
    name: 'Tariq Al-Mansoor',
    line1: 'Villa 14, Al Safa 2, Jumeirah Beach Road',
    city: 'Dubai',
    emirate: 'Dubai',
    country: 'United Arab Emirates',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'International Atelier',
    name: 'Tariq Al-Mansoor',
    line1: '45 Mayfair Square, Flat 3B',
    city: 'London',
    emirate: 'Greater London',
    country: 'United Kingdom',
    isDefault: false,
  },
];

export default function AddressBookPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Address Form State
  const [label, setLabel] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: AddressItem = {
      id: `addr-${Date.now()}`,
      label: label || 'New Address',
      name: user?.name || 'Tariq Al-Mansoor',
      line1,
      city,
      emirate: city,
      country,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, newAddress]);
    setShowAddModal(false);
    setLabel('');
    setLine1('');
    setCity('');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif">
      <SiteHeader />

      <main className="flex-1 w-full py-6 sm:py-2">
        <Container className="space-y-10">
          {/* Breadcrumbs */}
          <nav className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] sm:tracking-[0.2em] text-muted flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed py-1">
            <Link href="/" className="hover:text-espresso transition-colors shrink-0">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/account" className="hover:text-espresso transition-colors shrink-0">Account</Link>
            <span className="opacity-50">/</span>
            <span className="text-antique-gold font-medium shrink-0">Address Book</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-antique-gold font-medium">
                Delivery Destinations
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">Address Book</h1>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-aged-gold hover:bg-antique-gold text-accent-on-fill text-xs uppercase tracking-[0.2em] font-sans font-medium transition-colors shadow-sm"
            >
              + Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-6 border bg-surface-muted/40 space-y-4 transition-all relative ${addr.isDefault ? 'border-antique-gold ring-1 ring-antique-gold/30' : 'border-border'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg text-espresso font-normal">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 bg-aged-gold text-accent-on-fill text-[9px] uppercase tracking-wider font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-xs text-muted hover:text-brick-oxblood transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="text-xs text-espresso/80 space-y-1">
                  <p className="font-semibold text-espresso">{addr.name}</p>
                  <p>{addr.line1}</p>
                  <p>{addr.city}, {addr.country}</p>
                </div>

                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[10px] uppercase tracking-wider text-antique-gold hover:underline font-semibold"
                  >
                    Set as Default Delivery Destination
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm font-sans">
              <div className="bg-ivory border border-border p-8 max-w-md w-full shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h3 className="font-display text-xl text-espresso">Add Delivery Address</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-muted hover:text-espresso">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                      Label (e.g. Home, Office, Beach Residence)
                    </label>
                    <input
                      type="text"
                      required
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      className="w-full bg-surface-muted border border-border px-3 py-2 text-espresso outline-none focus:border-antique-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                      Street Address & Villa/Apt #
                    </label>
                    <input
                      type="text"
                      required
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      className="w-full bg-surface-muted border border-border px-3 py-2 text-espresso outline-none focus:border-antique-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                        City / Emirate
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-surface-muted border border-border px-3 py-2 text-espresso outline-none focus:border-antique-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                        Country
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-surface-muted border border-border px-3 py-2 text-espresso outline-none focus:border-antique-gold"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-border text-muted text-xs uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-aged-gold text-accent-on-fill text-xs uppercase tracking-wider font-medium"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
