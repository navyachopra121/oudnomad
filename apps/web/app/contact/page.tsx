'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/header/SiteHeader';
import Container from '../components/Container';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please reach out to hello.oudnomaddubai@gmail.com directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#f2efe9] font-sans selection:bg-[#ffb91d] selection:text-black">
      <SiteHeader />

      <main className="pt-4 sm:pt-6 pb-20 sm:pb-24">
        <Container className="space-y-8 sm:space-y-10 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="text-[9px] sm:text-[10px] px-2 sm:px-4 font-sans uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
            <Link href="/" className="hover:text-[#ffb91d] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#ffb91d] font-medium">Contact Us</span>
          </nav>

          {/* Page Header */}
          <div className="text-center max-w-xl mx-auto space-y-2.5">
            <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.35em] uppercase text-[#ffb91d] block">
              WE ARE AT YOUR SERVICE
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-white uppercase tracking-wider">
              Get in Touch
            </h1>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans max-w-md mx-auto">
              For fragrance inquiries, bespoke concierge orders, and shipping assistance, connect with our atelier team.
            </p>

            {/* Quick Contact Chips */}
            {/* <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="mailto:hello.oudnomaddubai@gmail.com"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-[#ffb91d]/50 text-white/80 hover:text-[#ffb91d] text-xs transition-colors"
              >
                <span>✉</span>
                <span>hello.oudnomaddubai@gmail.com</span>
              </a>
              <a
                href="https://wa.me/971585719731"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-[#ffb91d]/50 text-white/80 hover:text-[#ffb91d] text-xs transition-colors"
              >
                <span>💬</span>
                <span>+971 58 571 9731</span>
              </a>
            </div> */}
          </div>

          {/* Centered Interactive Contact Form */}
          <div className="max-w-2xl mx-auto w-full">
            <div className=" p-2 sm:p-6 shadow-2xl space-y-6">
              {submitted ? (
                <div className="py-10 sm:py-14 text-center space-y-3.5 bg-[#141414] border border-[#ffb91d]/30 p-6 sm:p-8">
                  <div className="w-12 h-12 rounded-full bg-[#ffb91d]/10 border border-[#ffb91d]/40 flex items-center justify-center mx-auto text-[#ffb91d] text-xl">
                    ✓
                  </div>
                  <h3 className="text-lg sm:text-xl text-white font-serif uppercase tracking-wide">
                    Message Received
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 max-w-sm mx-auto leading-relaxed font-sans">
                    Thank you for contacting Oud Nomad. Our client care team will respond to your inquiry at <span className="text-[#ffb91d]">{form.email}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', phone: '', message: '' });
                    }}
                    className="mt-3 px-6 py-2.5 bg-white/5 hover:bg-[#ffb91d] hover:text-black border border-white/15 text-white text-[11px] uppercase tracking-[0.2em] font-sans transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-xs font-sans">
                  {errorMessage && (
                    <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70 mb-1.5 font-sans font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your Full Name"
                      className="w-full bg-[#141414] focus:border-[#ffb91d] px-3.5 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-white outline-none transition-colors rounded-none placeholder:text-white/25"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70 mb-1.5 font-sans font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full bg-[#141414] focus:border-[#ffb91d] px-3.5 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-white outline-none transition-colors rounded-none placeholder:text-white/25"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70 mb-1.5 font-sans font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+971 58 571 9731"
                        className="w-full bg-[#141414] focus:border-[#ffb91d] px-3.5 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-white outline-none transition-colors rounded-none placeholder:text-white/25"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70 mb-1.5 font-sans font-medium">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How may our fragrance concierges assist you today?"
                      className="w-full bg-[#141414] focus:border-[#ffb91d] px-3.5 sm:px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-white outline-none transition-colors rounded-none placeholder:text-white/25 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 sm:py-4 bg-[#ffb91d] hover:bg-[#e5a61a] disabled:opacity-50 text-black font-semibold text-xs sm:text-[12px] uppercase tracking-[0.25em] transition-all shadow-lg active:scale-[0.99] mt-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending Message...' : 'Send Message'}
                  </button>

                  <p className="text-[10px] sm:text-[11px] text-white/35 text-center font-sans pt-1">
                    Your details are handled with complete confidentiality.
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
