'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#f2efe9] font-sans selection:bg-[#ffb91d] selection:text-black">
      <SiteHeader />

      <main className="pt-0 pb-20">
        <Container className="space-y-12">
          {/* Breadcrumbs */}
          <nav className="text-[11px] font-sans uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
            <Link href="/" className="hover:text-[#ffb91d] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#ffb91d] font-medium">Contact Us</span>
          </nav>

          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#ffb91d] block">
              WE ARE AT YOUR SERVICE
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white uppercase tracking-wider">
              Get in Touch
            </h1>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans max-w-lg mx-auto">
              For fragrance inquiries, bespoke concierge orders, and shipping assistance, connect with our dedicated team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-5xl mx-auto items-start">
            {/* Left: Direct Contact Information */}
            <div className="lg:col-span-5 space-y-6 bg-[#0e0e0e] border border-white/10 p-6 sm:p-8">
              <div>
                <h3 className="text-xs uppercase tracking-[0.25em] text-[#ffb91d] font-mono mb-2">
                  WHATSAPP & PHONE
                </h3>
                <a
                  href="https://wa.me/971585719731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base sm:text-lg font-mono text-white hover:text-[#ffb91d] transition-colors block"
                >
                  +971 58 571 9731
                </a>
                <span className="text-[11px] text-white/50 block mt-0.5">
                  Direct WhatsApp chat for instant order assistance & concierge
                </span>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs uppercase tracking-[0.25em] text-[#ffb91d] font-mono mb-2">
                  CUSTOMER CALLS
                </h3>
                <a
                  href="tel:+971585719731"
                  className="text-base sm:text-lg font-mono text-white hover:text-[#ffb91d] transition-colors block"
                >
                  +971 58 571 9731
                </a>
                <span className="text-[11px] text-white/50 block mt-0.5">
                  Monday to Saturday: 10:00 AM – 8:00 PM GST (Gulf Standard Time)
                </span>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs uppercase tracking-[0.25em] text-[#ffb91d] font-mono mb-2">
                  MAIL US
                </h3>
                <a
                  href="mailto:hello.oudnomaddubai@gmail.com"
                  className="text-sm sm:text-base font-mono text-white hover:text-[#ffb91d] transition-colors block"
                >
                  hello.oudnomaddubai@gmail.com
                </a>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase text-[#ffb91d] tracking-wider block">
                      REGISTERED ADDRESS & CONTACT
                    </span>
                    <span className="text-[10px] text-[#ffb91d]/80 font-sans" dir="rtl">
                      العنوان المسجل ورقم التواصل
                    </span>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    VUET1829, COMPASS BUILDING- AL HULAILA, AL HULAILA INDUSTRIAL ZONE-FZ, RAS AL KHAIMAH, Ras Al Khaimah
                  </p>
                  <p className="text-white font-semibold mt-1">
                    +971 58 571 9731
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Interactive Contact Form */}
            <div className="lg:col-span-7 bg-[#0e0e0e] border border-white/10 p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-serif uppercase tracking-wider text-white">
                Send Us a Message
              </h2>

              {submitted ? (
                <div className="py-12 text-center space-y-3 bg-[#141414] border border-[#53ff73]/30 p-8">
                  <span className="text-3xl text-[#53ff73]">✓</span>
                  <h3 className="text-lg text-white font-serif">Message Received</h3>
                  <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting Oud Nomad Dubai. Our client care team will respond to your email or WhatsApp within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', phone: '', message: '' });
                    }}
                    className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest font-mono"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1 font-mono">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your Full Name"
                      className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1 font-mono">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1 font-mono">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+971 58 571 9731"
                        className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1 font-mono">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How may our fragrance concierges assist you today?"
                      className="w-full bg-[#141414] border border-white/15 p-3 text-white outline-none focus:border-[#ffb91d] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#d89528] hover:bg-[#ffb91d] text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-98"
                  >
                    Send Message
                  </button>

                  <p className="text-[10px] text-white/40 text-center font-mono pt-2">
                    This site is protected by reCAPTCHA and privacy policies apply.
                  </p>
                </form>
              )}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
