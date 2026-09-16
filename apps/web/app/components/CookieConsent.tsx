'use client';

import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'true') {
      setAccepted(true);
    } else if (consent === 'false') {
      setAccepted(false);
    } else {
      setAccepted(null);
    }
  }, []);

  if (accepted !== null) return null;

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setAccepted(true);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'false');
    setAccepted(false);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 bg-stone-900 text-white p-4 border-t border-stone-800 z-50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
      <div className="max-w-4xl">
        We use essential cookies to fulfill orders and analytical cookies to improve user experience in accordance with our{' '}
        <a href="/legal/privacy" className="underline text-amber-400">Privacy Policy</a>.
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleDecline}
          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300 font-medium"
        >
          Decline Non-Essential
        </button>
        <button
          onClick={handleAccept}
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
