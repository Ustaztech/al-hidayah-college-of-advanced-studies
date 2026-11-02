import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Al-Hidayah College Student/Staff Portal',
  description: 'Integrated Student and Staff Management Portal - Al-Hidayah College of Advanced Studies, Abaji, Abuja',
  icons: {
    icon: '/official-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F4F6F5] text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
