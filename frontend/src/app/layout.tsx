import type { Metadata } from 'next';
import { Exo_2, Open_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import TabletHeader from '@/components/tabletHeader';
import { OpeningsHoursProvider } from '@/context/OpeningHoursContext';
import LocalStorageCleanup from '@/components/global/LocalStorageCleanup';
import { AuthProvider } from '@/contexts/AuthContext';

const exo2 = Exo_2({
  variable: '--font-exo2',
  subsets: ['latin'],
});

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Deelkast - Deelfabriek',
  description:
    'Deelkast van de Deelfabriek is een interactieve kast waaruit je spullen kunt lenen.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${exo2.variable} ${openSans.variable} antialiased bg-primarybackground`}
      >
        <AuthProvider>
          <OpeningsHoursProvider>
            <LocalStorageCleanup />
            {children}
          </OpeningsHoursProvider>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
