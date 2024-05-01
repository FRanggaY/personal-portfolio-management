"use client"
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider as ThemeProviderMUI } from '@mui/material/styles';
import { PaletteMode, Theme } from '@mui/material';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const createCustomTheme = (mode: PaletteMode): Theme => {
  return createTheme({
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
    palette: {
      mode,
    },
  });
};

const ThemeProvider = ({ children }:any) => {
  const [theme, setTheme] = useState<PaletteMode>('light');
  const themeSetup = createCustomTheme(theme);

  function getTheme(){
    const existTheme = localStorage.getItem('theme');
    if(existTheme) setTheme(existTheme as PaletteMode); 
  }

  useEffect(() => {
    getTheme()
  }, [])

  return (
    <ThemeProviderMUI theme={themeSetup}>{children}</ThemeProviderMUI>
  );
};

export default ThemeProvider;
