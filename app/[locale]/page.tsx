import * as React from 'react';
import { Button } from '@mui/material';
import { LanguageParams } from '@/types/general';

export default function Home({ params }: { readonly params: LanguageParams }) {
  return (
    <main>
      <Button sx={{ mt: 2, mb: 2 }}
        href={`/${params.locale}/auth/login`}
        variant="contained"
        color="primary"
      >
        Login
      </Button>
    </main>
  );
}
