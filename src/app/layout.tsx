import type { Metadata } from "next";
import { Poppins, Orienta } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const orienta = Orienta({
  variable: "--font-orienta",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "playte",
  description: "The dinner table game where you and your crew rank the different elements of your meal — then see if your taste lines up.",
  metadataBase: new URL("https://letsplayte.com"),
  openGraph: {
    title: "playte",
    description: "The dinner table game where you and your crew rank the different elements of your meal — then see if your taste lines up.",
    url: "https://letsplayte.com",
    siteName: "playte",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "playte",
    description: "The dinner table game where you and your crew rank the different elements of your meal — then see if your taste lines up.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2FJ3EWCN0E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2FJ3EWCN0E');
          `}
        </Script>
      </head>
      <body className={`${poppins.variable} ${orienta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
