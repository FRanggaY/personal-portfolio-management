import { Metadata } from 'next'
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Panel User',
  description: ''
}

export default function PanelUserPage() {
  const t = useTranslations('PanelUser');
  return (
    <div className='flex-col md:flex'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>{t('title')}</h2>
        </div>
      </div>
    </div>
  )
}