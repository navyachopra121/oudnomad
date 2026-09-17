import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import Preloader from "./components/Preloader"


const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ui = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
});

const arabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "OudNomad | Artisanal Luxury Fragrances & Pure Attars",
    template: "%s | OudNomad",
  },
  description: "Bespoke luxury oud oils, aged pure attars, and artisanal oriental fragrances crafted for connoisseurs worldwide.",
  metadataBase: new URL("https://oudnomad.com"),
  openGraph: {
    title: "OudNomad | Artisanal Luxury Fragrances & Pure Attars",
    description: "Bespoke luxury oud oils, aged pure attars, and artisanal oriental fragrances.",
    url: "https://oudnomad.com",
    siteName: "OudNomad",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OudNomad",
    url: "https://oudnomad.com",
    logo: "https://oudnomad.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@oudnomad.com",
      contactType: "customer service",
    },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <Preloader />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
