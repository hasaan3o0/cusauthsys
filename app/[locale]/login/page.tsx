'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePathname } from 'next/navigation';

export default function LoginPage() {
  const t = useTranslations('auth');
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];
  const router = useRouter();
  const { toast } = useToast();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('errors.emailInvalid'))
      .required(t('errors.emailRequired')),
    password: Yup.string()
      .min(8, t('errors.passwordLength'))
      .required(t('errors.passwordRequired')),
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            {t('loginTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const res = await fetch('/api/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(values),
                });

                const result = await res.json();

                if (result.error) {
                  toast({
                    variant: 'destructive',
                    title: t('errors.invalidCredentials'),
                  });
                } else {
                  router.push('/dashboard');
                }
              } catch (error) {
                toast({
                  variant: 'destructive',
                  title: 'An error occurred',
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    className={errors.email && touched.email ? 'border-red-500' : ''}
                  />
                  {errors.email && touched.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    className={errors.password && touched.password ? 'border-red-500' : ''}
                  />
                  {errors.password && touched.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-orng hover:bg-orng/80"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Loading...' : t('login')}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  {t('noAccount')}{' '}
                  <Link 
                    href={`/${currentLocale}/register`}
                    className="text-primary hover:underline text-orng"
                  >
                    {t('signUp')}
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}