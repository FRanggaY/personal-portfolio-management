import * as React from 'react';
import { Avatar, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginForm from '@/components/layout/form/auth/login-form';
import Copyright from '@/components/ui/copyright';

export default async function Login() {
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
        <Typography component="h1" variant="h5">
          Login
        </Typography>
      </Box>
      <LoginForm />
      <Copyright  sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
