import { Metadata } from 'next'
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'PPM',
  description: ''
}

export default function LandingPage() {
  const t = useTranslations('Landing');
  return (
    <>
      {t('title')}
    </>
  )
}