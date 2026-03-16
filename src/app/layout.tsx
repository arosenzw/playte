import type { Metadata } from "next";
import { Poppins, Orienta } from "next/font/google";
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
  description: "The social plate ranking game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${orienta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
