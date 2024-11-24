'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const t = useTranslations('auth');
  const pathname = usePathname();
  const isAuthenticated = pathname.includes('/dashboard');
  const currentLocale = pathname.split('/')[1];
  const targetLocale = currentLocale === 'en' ? 'es' : 'en';
  
  const newPath = pathname.replace(`/${currentLocale}`, `/${targetLocale}`);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = `/${currentLocale}/login`;
  };

  return (
    <nav className="bg-orng border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link 
              href={`/${currentLocale}`} 
              className="text-lg sm:text-2xl font-bold text-white  transition-colors"
            >
              Auth App
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href={newPath} 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change Language</span>
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>{t('logout')}</span>
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href={`/${currentLocale}/register`}>
                  <Button variant="ghost">{t('register')}</Button>
                </Link>
                <Link href={`/${currentLocale}/login`}>
                  <Button>{t('login')}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}