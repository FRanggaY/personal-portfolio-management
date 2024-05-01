"use client"

import * as React from 'react';
import BarNavigation from './bar-navigation';
import BarSide from './bar-side';

const drawerWidth: number = 240;

function BarApp() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <>
      <BarNavigation
        title={'GatSource Task'}
        open={open}
        toggleDrawer={toggleDrawer}
      />
      <BarSide
        open={open}
        drawerWidth={drawerWidth}
      />
    </>
  )
}

export default BarApp
