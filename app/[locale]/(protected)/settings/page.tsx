import * as React from 'react';
import { Typography } from '@mui/material';
import SettingsAuthForm from '@/components/layout/form/auth/settings-auth-form';
import SettingsAuthPasswordForm from '@/components/layout/form/auth/settings-auth-password-form';
import EditThemeForm from '@/components/layout/form/theme/edit-theme-form';
import EditLanguageForm from '@/components/layout/form/language/edit-language-form';
import { LanguageParams } from '@/types/general';
import { dataLocale, validLocale } from '@/lib/locale';

export default function Settings({ params }: { readonly params: LanguageParams }) {
  const locale = validLocale(params.locale);
  const t = dataLocale[locale].settings;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {t.title}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {t.public_profile.title}
      </Typography>
      <SettingsAuthForm />
      <br />
      <Typography variant="h6" gutterBottom>
        {t.change_password.title}
      </Typography>
      <SettingsAuthPasswordForm />
      <br />
      <Typography variant="h6" gutterBottom>
        {t.theme.title}
      </Typography>
      <EditThemeForm />
      <br />
      <Typography variant="h6" gutterBottom>
        {t.language.title}
      </Typography>
      <EditLanguageForm />
    </>
  );
}
