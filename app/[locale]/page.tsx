import * as React from 'react';
import { LanguageParams } from '@/types/general';
import { getAccessToken } from '@/actions/auth/auth-action';
import Navbar from '@/components/ui/nav-bar/navbar';
import Hero from '@/components/ui/hero';
import { dataLocale, validLocale } from '@/lib/locale';
import DetailProfile from '@/components/ui/detail-profile';

export default async function Home({ params }: { readonly params: LanguageParams }) {
  const accessToken = await getAccessToken();
  const locale = validLocale(params.locale);
  const t = dataLocale[locale].landing;
  
  return (
    <main>
      <Navbar 
        buttonHref={accessToken ? `/${params.locale}/dashboard` : `/${params.locale}/auth/login` } 
        buttonTitle={accessToken ? `Dashboard` : `Login` } 
      />
      
      <Hero
        titleFirst={t.title.first}
        titleSecond={t.title.second}
        description={t.description}
      />
      
      <DetailProfile />

    </main>
  );
}
