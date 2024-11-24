import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { ReactNode } from 'react';
import '../globals.css';
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ['latin'] });

interface Props {
  children: ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}