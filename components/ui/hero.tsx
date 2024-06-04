"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useParams, useRouter } from 'next/navigation';
import { validLocale } from '@/lib/locale';

interface HeroProps {
  titleFirst: string;
  titleSecond: string;
  description: string;
}

export default function Hero({ titleFirst, titleSecond, description }: HeroProps) {
  const [username, setUsername] = React.useState('');
  const router = useRouter();
  const params = useParams<{ locale: string; }>();
  const locale = validLocale(params.locale);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    router.replace(`/${locale}?username=${encodeURIComponent(username)}`);
  };

  return (
    <Box
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography
            gap={2}
            component="h4"
            variant="h4"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            {titleFirst} <b>{titleSecond}</b>
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
            }}
            gutterBottom
          >
            {description}
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
            <form onSubmit={handleSubmit}>
              <TextField
                id="outlined-basic"
                hiddenLabel
                size="small"
                variant="outlined"
                aria-label="Enter your username"
                placeholder="Your username"
                value={username}
                onChange={handleInputChange}
                inputProps={{
                  autoComplete: 'off',
                  'aria-label': 'Enter your username',
                }}
              />
              <Button variant="contained" color="primary" type="submit">
                Find
              </Button>
            </form>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
