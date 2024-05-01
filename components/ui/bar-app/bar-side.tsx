import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Tooltip } from "@mui/material"
import BuildIcon from '@mui/icons-material/Build';
// import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
// import PersonIcon from '@mui/icons-material/Person';
// import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
// import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { usePathname, useParams } from 'next/navigation'
import { dataLocale, validLocale } from '@/lib/locale';
import Link from 'next/link'

export default function BarSide({ open, drawerWidth }: any) {
  const params = useParams<{ locale: string; }>();
  const locale = validLocale(params.locale);
  const t = dataLocale[locale].sidebar;
  const pathname = usePathname();

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

  const barSideData = [
    {
      url: `/${params.locale}/dashboard`,
      title: t.dashboard.title,
      icon: <DashboardIcon />
    },
    {
      url: `/${params.locale}/panel/skill`,
      title: t.skill.title,
      icon: <BuildIcon />
    },
  ]

  return (
    <Drawer variant="permanent" open={open} sx={{ zIndex: 1 }}>
      <Toolbar />
      <List component="nav">
        {
          barSideData.map((data) => {
            return <Link style={{ textDecoration: 'none', color: pathname.includes(data.url) ? 'white' : 'inherit' }} key={data.title} href={`${data.url}`}>
              <ListItemButton
                sx={{
                  backgroundColor: pathname.includes(data.url) ? '#2196f3' : 'transparent',
                  '&:hover': {
                    backgroundColor: pathname.includes(data.url) ? '#2196f3' : '',
                  }
                }}>
                <Tooltip title={data.title}>
                  <ListItemIcon>
                    {data.icon}
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary={data.title} />
              </ListItemButton>
            </Link>
          })
        }
        <Divider sx={{ my: 1 }} />
      </List>
    </Drawer>
  )
}
