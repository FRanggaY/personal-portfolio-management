import { Metadata } from 'next'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ThemeToggle } from '@/components/theme-toggle'
import { useTranslations } from 'next-intl';
import { LanguageToggle } from '@/components/languge-toggle'

export const metadata: Metadata = {
  title: 'PPM',
  description: ''
}

export default function LandingPage() {
  const t = useTranslations('Index');
  return (
    <>
      Landing Page
    </>
  )
}