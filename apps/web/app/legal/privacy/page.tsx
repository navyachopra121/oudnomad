import React from 'react';

export const metadata = {
  title: 'Privacy Policy | OudNomad',
  description: 'OudNomad Privacy Policy detailing data collection, processing, GDPR, CCPA, and India DPDPA 2023 compliance.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-stone-800">
      {/* Attorney Review Disclaimer Banner */}
      <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-sm rounded">
        <strong>DRAFT — NOT LEGAL ADVICE — REQUIRES ATTORNEY REVIEW BEFORE PUBLISHING</strong>
        <p className="mt-1">
          This document is a structural starting point. Because OudNomad sells to customers in India and internationally, GDPR (EU/EEA), CCPA/CPRA (California), and India's DPDPA 2023 may all apply. A qualified attorney must review and complete all [TODO] sections prior to commercial launch.
        </p>
      </div>

      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-6">Privacy Policy</h1>
      <p className="text-sm text-stone-500 mb-8">Last Updated: September 13, 2026</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Who We Are</h2>
          <p className="text-stone-600 leading-relaxed">
            OudNomad ([TODO: Legal Business Entity Name, Registered Address, Country of Incorporation, Contact Email: privacy@oudnomad.com]).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 text-stone-600">
            <li><strong>Account Information:</strong> Name, email address, hashed password, phone number [TODO: Confirm exact fields].</li>
            <li><strong>Order Information:</strong> Shipping and billing address, order history, purchased items.</li>
            <li><strong>Payment Information:</strong> Full credit card details are never stored on our servers. Payments are processed securely via Stripe, Inc. (PCI-DSS SAQ A compliant).</li>
            <li><strong>Usage & Technical Data:</strong> IP address, device specifications, browser type, and page interaction logs.</li>
            <li><strong>Cookies:</strong> Essential session cookies, analytical cookies, and preference cookies.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <p className="text-stone-600 leading-relaxed">
            We use collected data to process orders, issue shipping notifications via email (Resend/Amazon SES), prevent fraudulent transactions, recompute personalized recommendations, and respond to customer service inquiries.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Legal Basis for Processing (GDPR)</h2>
          <p className="text-stone-600 leading-relaxed">
            For EU/EEA residents, processing is based on contractual necessity (order fulfillment), legitimate interests (fraud detection and security), and explicit consent (marketing communications).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. International Data Transfers & Third Parties</h2>
          <p className="text-stone-600 leading-relaxed">
            Data may be shared with payment processors (Stripe), cloud infrastructure (Hostinger VPS, Cloudflare), and image delivery networks (Cloudinary). Cross-border transfers follow standard contractual clauses.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Statutory Rights & Grievance Officer (India DPDPA 2023 / IT Rules)</h2>
          <p className="text-stone-600 leading-relaxed">
            Customers have the right to access, rectify, or erase their personal data. For grievances under Indian law, contact our Grievance Officer:
          </p>
          <div className="mt-3 p-4 bg-stone-100 rounded text-sm text-stone-700">
            <p><strong>Grievance Officer:</strong> [TODO: Name & Designation]</p>
            <p><strong>Email:</strong> grievance@oudnomad.com</p>
            <p><strong>Address:</strong> [TODO: Registered Corporate Office Address, India]</p>
          </div>
        </div>
      </section>
    </div>
  );
}
