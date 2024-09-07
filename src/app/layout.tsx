import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";

// Import Google Fonts
import { Fira_Sans } from 'next/font/google';

const firaSans = Fira_Sans({
  weight: ['900'],
  style: ['italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-fira-sans",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Wayfinder - Kyle Tan",
  description: "",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${firaSans.variable} font-sans antialiased flex flex-col min-h-screen`}
        style={{
          backgroundImage: 'url("/images/contour-lines-background.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="w-full bg-white/85 flex-grow flex flex-col">
          <div className="mx-auto max-w-screen-sm w-full flex-grow flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
