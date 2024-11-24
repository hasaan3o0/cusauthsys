'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
            <Button onClick={handleLogout} variant="outline">
              {t('logout')}
            </Button>
          </div>
          <p className="text-gray-600">
            {t('protected')}
          </p>
        </div>
      </div>
    </div>
  );
}