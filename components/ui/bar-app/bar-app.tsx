"use client"

import * as React from 'react';
import BarNavigation from './bar-navigation';
import BarSide from './bar-side';
import MuiAppBar from '@mui/material/AppBar';
import { Toolbar } from '@mui/material';
import { useAuthProfile } from '@/context/AuthProfileContext';
import { AuthProfile } from '@/types/auth';

const drawerWidth: number = 240;

function BarApp() {
  const [open, setOpen] = React.useState(true);
  const authProfileData: AuthProfile = useAuthProfile();
  const toggleDrawer = () => {
    setOpen(!open);
  };

  if (!authProfileData.profile) {
    return <MuiAppBar>
      <Toolbar></Toolbar>
    </MuiAppBar>
  }
  
  return (
    <>
      <BarNavigation
        title={'PPM'}
        open={open}
        toggleDrawer={toggleDrawer}
        authProfileData={authProfileData}
      />
      <BarSide
        open={open}
        drawerWidth={drawerWidth}
        authProfileData={authProfileData}
      />
    </>
  )
}

export default BarApp
