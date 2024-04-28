import SkillLayout from '@/components/layout/skill/skill-layout';
import { Metadata } from 'next'
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Panel Skill',
  description: ''
}

export default function PanelSkillPage() {
  const t = useTranslations('PanelSkill');
  return (
    <div className='flex-col md:flex'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>{t('title')}</h2>
        </div>
        
        <SkillLayout />
      </div>
    </div>
  )
}
