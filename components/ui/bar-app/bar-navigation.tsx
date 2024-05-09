"use client"

import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import { Avatar, Box, Button, Divider, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import { removeAccessToken } from '@/actions/auth/auth-action';
import { toast } from 'sonner';
import { AuthProfile } from '@/types/auth';
import { useRouter, useParams } from 'next/navigation'
import { useAuthProfile } from '@/context/AuthProfileContext';
import { dataLocale, validLocale } from '@/lib/locale';

export default function BarNavigation({ title, open, toggleDrawer }: any) {
  const params = useParams<{ locale: string; }>();
  const locale = validLocale(params.locale);
  const t = dataLocale[locale].navbar;
  const router = useRouter();
  const authProfileData: AuthProfile = useAuthProfile();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (!authProfileData.profile) {
    return <MuiAppBar>
      <Toolbar></Toolbar>
    </MuiAppBar>
  }

  return (
    <MuiAppBar style={{ zIndex: 2 }}>
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
        }}
      >
        <Tooltip title={open ? 'Collapse Menu' : 'Expand Menu'}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        <Button variant='contained' href={`/${params.locale}`}>
          {title}
        </Button>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Account">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={authProfileData?.profile.name} src={authProfileData?.profile.image_url} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem>
              <Grid container spacing={2} alignItems={'center'}>
                <Grid item>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={authProfileData?.profile.name} src={authProfileData?.profile?.image_url} />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography textAlign="left">
                    {authProfileData?.profile?.name}
                  </Typography>
                  <Typography textAlign="left">
                    @{authProfileData?.profile.username}
                  </Typography>
                </Grid>
              </Grid>
            </MenuItem>
            <Divider />
            <MenuItem onClick={async () => {
              router.push(`/${params.locale}/settings`);
              handleCloseUserMenu();
            }}>
              <Typography textAlign="center">{t.settings.title}</Typography>
            </MenuItem>
            <MenuItem onClick={async () => {
              await removeAccessToken();
              router.push(`/${params.locale}/auth/login`);
              toast.success('logout successfully');
            }}>
              <Typography textAlign="center">{t.log_out.title}</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </MuiAppBar >
  )
}
