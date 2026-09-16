import React from 'react';

export const metadata = {
  title: 'Terms of Service | OudNomad',
  description: 'OudNomad Terms of Service governing storefront orders, pricing, liability, user reviews, and account usage.',
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-stone-800">
      {/* Attorney Review Disclaimer Banner */}
      <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-sm rounded">
        <strong>DRAFT — NOT LEGAL ADVICE — REQUIRES ATTORNEY REVIEW BEFORE PUBLISHING</strong>
        <p className="mt-1">
          Enforceability, dispute-resolution terms, and consumer protection clauses vary significantly by jurisdiction. A qualified attorney must review and fill in all [TODO] markers before launch.
        </p>
      </div>

      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-6">Terms of Service</h1>
      <p className="text-sm text-stone-500 mb-8">Last Updated: September 13, 2026</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="text-stone-600 leading-relaxed">
            By using OudNomad or placing an order, you agree to these Terms of Service. Placing an order requires explicit checkbox acceptance at checkout.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Products, Pricing & Country of Origin</h2>
          <p className="text-stone-600 leading-relaxed">
            All prices are listed in USD / INR and include applicable sales tax / GST disclosures. In compliance with India's Consumer Protection (E-Commerce) Rules 2020, total prices, breakup of charges, and country of origin are displayed on product detail and checkout pages.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Orders & Payment Processing</h2>
          <p className="text-stone-600 leading-relaxed">
            Orders are binding upon confirmation email dispatch. Payments are processed securely via Stripe. We reserve the right to cancel orders due to pricing errors or inventory stock unavailability.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. User Accounts & Moderation</h2>
          <p className="text-stone-600 leading-relaxed">
            We reserve the right to block accounts violating terms or attempting fraudulent activity. User-submitted reviews are subject to automated rating calculations and admin moderation.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Governing Law & Dispute Resolution</h2>
          <p className="text-stone-600 leading-relaxed">
            [TODO: Attorney to specify governing jurisdiction and dispute resolution rules].
          </p>
        </div>
      </section>
    </div>
  );
}
