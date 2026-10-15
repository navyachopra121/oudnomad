import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import Preloader from "./components/Preloader";
import { CartProvider } from "./components/cart/CartContext";
import CartDrawer from "./components/cart/CartDrawer";
import { AuthProvider } from "./components/auth/AuthContext";
import { CurrencyProvider } from "./components/concierge/CurrencyContext";
import CurrencySelectorModal from "./components/concierge/CurrencySelectorModal";
import GccBanner from "./components/layout/GccBanner";
import EmailSignupPopup from "./components/EmailSignupPopup";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ui = Poppins({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const arabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://oudnomaddubai.com'),

  // ── Titles ──────────────────────────────────────────────────────────────────
  title: {
    default: 'Oud Nomad | Luxury Oud Perfumes for Women — Dubai & Worldwide',
    template: '%s | Oud Nomad',
  },

  // ── Primary Description ────────────────────────────────────────────────────
  description:
    'Oud Nomad is a Dubai-born luxury fragrance house for women who belong between worlds. Discover Extrait de Parfum crafted from Kashmir saffron, Taif rose and aged Assamese oud — built to endure heat, not dissolve in it.',

  // ── Keywords ──────────────────────────────────────────────────────────────
  keywords: [
    'oud perfume for women',
    'luxury oud fragrance Dubai',
    'extrait de parfum oud',
    'arabic perfume women',
    'best oud perfume UAE',
    'Taif rose fragrance',
    'Kashmir saffron perfume',
    'long lasting perfume hot weather',
    'Oud Nomad',
    'niche perfume Dubai',
    'oriental fragrance women',
    'buy oud perfume online',
    'Arabian perfume house',
    'perfume for desert climate',
    'agarwood perfume women',
  ],

  // ── Authors & Publisher ───────────────────────────────────────────────────
  authors: [{ name: 'Oud Nomad', url: 'https://oudnomaddubai.com' }],
  creator: 'Oud Nomad Parfums',
  publisher: 'Oud Nomad Parfums',
  category: 'Luxury Fragrances',

  // ── Canonical & Hreflang ───────────────────────────────────────────────────
  alternates: {
    canonical: 'https://oudnomaddubai.com',
    languages: {
      'en-US': 'https://oudnomaddubai.com',
      'en-AE': 'https://oudnomaddubai.com',
      'x-default': 'https://oudnomaddubai.com',
    },
  },

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    title: 'Oud Nomad | Luxury Oud Perfumes for Women — Dubai',
    description:
      'A fragrance house for women who don\'t fit into one world. Extrait de Parfum built from Kashmir saffron, Taif rose and Assamese oud. Crafted in Dubai. Worn worldwide.',
    url: 'https://oudnomaddubai.com',
    siteName: 'Oud Nomad',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Oud Nomad — Luxury Fragrance House for Women, Dubai',
        type: 'image/jpeg',
      },
    ],
  },

  // ── Twitter / X Cards ─────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@oudnomad',
    creator: '@oudnomad',
    title: 'Oud Nomad | Luxury Oud Perfumes for Women — Dubai',
    description:
      'Extrait de Parfum crafted from Kashmir saffron, Taif rose and aged Assamese oud. Born in Dubai. Worn worldwide.',
    images: ['/og-image.jpg'],
  },

  // ── Robots & Indexing ─────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Verification ─────────────────────────────────────────────────────────
  verification: {
    google: 'REPLACE_WITH_GOOGLE_VERIFICATION_TOKEN',
    // bing: 'REPLACE_WITH_BING_TOKEN',
  },

  // ── App / PWA ─────────────────────────────────────────────────────────────
  applicationName: 'Oud Nomad',
  appleWebApp: {
    capable: true,
    title: 'Oud Nomad',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    '@type': 'Organization',
    '@id': 'https://oudnomaddubai.com/#organization',
    name: 'Oud Nomad',
    legalName: 'Oud Nomad Parfums FZ LLC',
    url: 'https://oudnomaddubai.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://oudnomaddubai.com/camelfinallogo-transparent.png',
      width: 200,
      height: 80,
    },
    description:
      'A Dubai-born luxury fragrance house for women who belong between worlds. Extrait de Parfum crafted from Kashmir saffron, Taif rose and aged Assamese oud.',
    foundingDate: '2022',
    foundingLocation: {
      '@type': 'Place',
      name: 'Dubai, UAE',
    },
    founder: {
      '@type': 'Person',
      name: 'Navya Chopra',
      gender: 'Female',
    },
    areaServed: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'GB', 'US', 'IN'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'hello.oudnomaddubai@gmail.com',
        contactType: 'customer service',
        availableLanguage: ['English', 'Arabic'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+971585719731',
        contactType: 'customer service',
        contactOption: 'TollFree',
        availableLanguage: ['English', 'Arabic'],
        url: 'https://wa.me/971585719731',
      },
    ],
    sameAs: [
      'https://instagram.com/oudnomad',
      'https://facebook.com/oudnomad',
      'https://tiktok.com/@oudnomad',
    ],
  };

  const faqJsonLd = {
    '@type': 'FAQPage',
    '@id': 'https://oudnomaddubai.com/#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How long does Oud Nomad perfume last?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our Extrait de Parfum formulas are engineered for extreme longevity — most last 12 to 48 hours on skin and even longer on fabric. They are tested at 45°C to perform specifically in GCC desert heat without evaporating or going flat.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are Oud Nomad fragrances alcohol-free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our attar and pure oil formats are completely alcohol-free, using traditional hydro-distillation. Our Extrait de Parfum and mist collections use a carrier base. All formulas are skin-safe, halal-friendly, and free from harsh synthetics.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between an attar and an Extrait de Parfum?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Attars are pure concentrated fragrance oils — no alcohol, applied directly to pulse points with a dipstick or tola. They are intimate, skin-warming and incredibly long-lasting. Extrait de Parfum is a high-concentration alcohol-based spray with stronger projection and sillage, suited for those who want a bigger scent trail.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where does Oud Nomad source its oud?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We source aged agarwood from Assam (India) and Cambodia — two of the most prized oud origins in the world. Our Assamese oud is wild-harvested and carries a dark, resinous complexity. Our Cambodian oud has a honey-sweet warmth. Both are ethically sourced from trusted distilleries.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you ship outside the UAE?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We ship across the GCC (Saudi Arabia, Qatar, Kuwait, Bahrain, Oman) as well as internationally to the UK, USA, Europe and India. GCC orders typically arrive in 2–5 business days. International orders take 5–10 business days.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is shipping free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer complimentary shipping across the UAE and GCC. International shipping rates apply for orders outside the region and are calculated at checkout.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Taif rose and why is it special?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Taif damask rose is grown at high altitude in the mountains of Saudi Arabia and is considered the most prized rose in the perfumery world. It has a deeper, spicier, more complex character than Bulgarian or Turkish rose — and it is harvested by hand at dawn for only a few weeks each year. We use it as a heart note in several of our Extrait de Parfum formulas.',
        },
      },
      {
        '@type': 'Question',
        name: 'Will the perfume hold up in Dubai summer heat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — our formulas are specifically engineered for the GCC climate. We test every fragrance at 45°C. Rather than disappearing in the heat, our high-concentration Extrait de Parfum blooms and deepens with body warmth, making them ideal for year-round use in Dubai and across the Gulf.',
        },
      },
      {
        '@type': 'Question',
        name: 'What sizes are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our fragrances are available in 50ml and 100ml spray flacons, and our attars come in 3ml crystal dipstick tolas — ideal for travel or to sample before committing to a full bottle. Gift sets and collector editions are available seasonally.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I layer Oud Nomad fragrances?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. Layering is one of the oldest traditions in Middle Eastern perfumery. We recommend wearing an attar on pulse points first, then applying a mist over clothing for a full scent aura. Our Cèdre mist pairs beautifully with any of our oud-forward extraits.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does oud smell like?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oud (agarwood) is a resinous wood formed when the Aquilaria tree becomes infected with a specific mold. Its scent is complex — simultaneously warm, dark, woody, animalic, and sweet. The exact profile varies by origin: Indian oud tends to be earthy and medicinal, Cambodian oud is honied and soft, while Thai oud has a lighter, floral sweetness. It is one of the most expensive natural ingredients in perfumery.',
        },
      },
      {
        '@type': 'Question',
        name: 'How should I apply oud oil or attar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Apply one or two drops from the dipstick directly to warm pulse points — wrists, inner elbows, the base of the neck, and behind the ears. Do not rub; let the oil sit and warm with your skin. A small amount goes a very long way. Avoid contact with clothing as oil attars can stain.',
        },
      },
    ],
  };

  const websiteJsonLd = {
    '@type': 'WebSite',
    '@id': 'https://oudnomaddubai.com/#website',
    url: 'https://oudnomaddubai.com',
    name: 'Oud Nomad',
    description: 'Luxury oud perfumes for women — crafted in Dubai.',
    publisher: { '@id': 'https://oudnomaddubai.com/#organization' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://oudnomaddubai.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [organizationJsonLd, websiteJsonLd, faqJsonLd],
  };

  return (
    <html
      lang="en"
      className={`${display.variable} ${ui.variable} ${arabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              {/* GCC Banner — shown to international visitors only */}
              <GccBanner />
              {/* <Preloader /> */}
              <main className="flex-1">{children}</main>
              <Footer />
              <CookieConsent />
              <CartDrawer />
              <CurrencySelectorModal />
              <EmailSignupPopup />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
