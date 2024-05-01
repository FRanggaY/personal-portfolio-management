import * as React from 'react';
import Box from '@mui/material/Box';
import type { Metadata } from "next";
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Copyright from '@/components/ui/copyright';
import BarApp from '@/components/ui/bar-app/bar-app';
import { AuthProfileProvider } from '@/context/AuthProfileContext';
import ThemeProvider from '@/providers/theme';

export const metadata: Metadata = {
  title: "Personal Portfolio - Panel",
  description: "Portfolio management for personal",
};

export default function ManageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ThemeProvider>
        <AuthProfileProvider>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <BarApp />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
              }}
            >
              <Toolbar />
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {children}
                <Copyright sx={{ pt: 4 }} />
              </Container>
            </Box>
          </Box>
        </AuthProfileProvider>
      </ThemeProvider>
    </div>
  );
}
