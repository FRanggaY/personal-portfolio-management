import { AuthLoginForm } from '@/components/forms/auth/auth-login-form';
import { LanguageToggle } from '@/components/languge-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { Metadata } from 'next'
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'LOGIN | PPM',
  description: ''
}

export default function LoginPage() {
  const t = useTranslations('Login');
  return (
    <div className='m-5 flex items-center justify-center flex-col'>
      {t('title')}
      <AuthLoginForm />
      <div>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  )
}
