import React from 'react';

export const metadata = {
  title: 'Refund & Return Policy | OudNomad',
  description: 'OudNomad Refund & Return Policy detailing statutory withdrawal windows, return procedures, and Stripe refund processing.',
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-stone-800">
      {/* Attorney Review Disclaimer Banner */}
      <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-sm rounded">
        <strong>DRAFT — NOT LEGAL ADVICE — REQUIRES ATTORNEY REVIEW BEFORE PUBLISHING</strong>
        <p className="mt-1">
          Return/refund windows and disclosure requirements are specifically regulated under India's Consumer Protection (E-Commerce) Rules 2020 and statutory rights in destination countries (e.g. EU 14-day withdrawal right). Must be reviewed by a lawyer before publishing.
        </p>
      </div>

      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-6">Refund & Return Policy</h1>
      <p className="text-sm text-stone-500 mb-8">Last Updated: September 13, 2026</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Return Window</h2>
          <p className="text-stone-600 leading-relaxed">
            Items may be returned within 14 days of delivery. For EU residents, a non-waivable 14-day statutory right of withdrawal applies.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Condition & Eligibility</h2>
          <p className="text-stone-600 leading-relaxed">
            Perfumes, attars, and luxury items must be unused, sealed in original packaging, with intact security tags to qualify for a full refund.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Refund Processing</h2>
          <p className="text-stone-600 leading-relaxed">
            Approved refunds are credited to the original payment method via Stripe. Order status transitions to <code>REFUNDED</code> once Stripe webhook verification completes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Damaged or Defective Goods</h2>
          <p className="text-stone-600 leading-relaxed">
            If an item arrives damaged, report to <code>support@oudnomad.com</code> within 48 hours with photograph evidence for immediate replacement or full refund.
          </p>
        </div>
      </section>
    </div>
  );
}
