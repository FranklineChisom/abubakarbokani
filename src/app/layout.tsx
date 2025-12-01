import type { Metadata, Viewport } from "next"; 
import { GoogleAnalytics } from '@next/third-parties/google'; 
import "./globals.css";
import { Providers } from "./providers";
import ClientLayout from "@/components/ClientLayout";

export const viewport: Viewport = {
  themeColor: '#0b74de',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://abubakarbokani.com'),
  title: {
    template: '%s | Dr. Abubakar Bokani',
    default: 'Dr. Abubakar Bokani | Senior Lecturer, ABU Zaria',
  },
  description: "Senior Lecturer in the Department of Private Law at Ahmadu Bello University, Zaria specializing in Land Law, Equity & Trusts, and Constitutional Law.",
  keywords: ["Land Law", "Nigeria Law", "Equity and Trusts", "Constitutional Law", "ABU Zaria", "Legal Research"],
  authors: [{ name: "Dr. Abubakar Mohammed Bokani" }],
  creator: "Dr. Abubakar Mohammed Bokani",
  
  openGraph: {
    siteName: 'Dr. Abubakar Bokani',
    locale: 'en_US',
    type: 'website',
    url: 'https://abubakarbokani.com',
    images: [
      {
        url: '/assets/imgs/abubakarbokani.jpg',
        width: 1200,
        height: 630,
        alt: 'Dr. Abubakar Bokani',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Abubakar Bokani',
    images: ['/assets/imgs/abubakarbokani.jpg'],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Georgia:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}