import type { Metadata } from "next";
import { Archivo, Public_Sans, Martian_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

// §4c — three roles, three faces. Self-hosted via next/font (§7d).
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${publicSans.variable} ${martianMono.variable} h-full antialiased`}
    >
      {/* Browser extensions (ColorZilla, Grammarly, password managers) inject
          attributes onto <body> before React hydrates, which React reports as a
          mismatch. This suppresses the warning for this element's attributes
          only — one level deep, never for our own children. */}
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-paper text-ink"
      >
        {children}
      </body>
    </html>
  );
}
