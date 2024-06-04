import * as React from 'react';
import { Avatar, Box, Typography, Container, Button, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginForm from '@/components/layout/form/auth/login-form';
import Copyright from '@/components/ui/copyright';
import { LanguageParams } from '@/types/general';

export default async function Login({ params }: { readonly params: LanguageParams }) {
  return (
    <Container component="main" maxWidth="xs">

      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Link href={'/'} style={{ textDecoration: 'none' }}>
          PPM
        </Link>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
      </Box>
      <LoginForm />
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
