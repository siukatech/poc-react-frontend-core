import React, { useState, useContext, useEffect } from 'react';

import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import { 
  // Theme, 
  styled, useTheme, 
  // CSSObject,
} from '@mui/material/styles';
import type { Theme, CSSObject } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
  useScrollTrigger,
  Fab,
  Fade,
} from '@mui/material';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  MoveToInbox as MoveToInboxIcon,
  Mail as MailIcon,
  Home as HomeIcon,
  Adb as AdbIcon,
  Smartphone as SmartphoneIcon,
  Event as EventIcon,
  Storefront as StorefrontIcon,
  AssignmentInd as AssignmentIndIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Inbox as InboxIcon,
} from '@mui/icons-material';

// import logo192 from '../../../assets/logo192.png';

import { useAuthContext } from '../../auth';

import {
  ImgComponent,
  DrawerHeader,
} from '../../ui';

import NavLang from './NavLang';
import NavNoti, { NavNotiDisplayType } from './NavNoti';
import NavSetting from './NavSetting';
import ScrollTop from './ScrollTop';
import DrawerMenu from './DrawerMenu';
import { useLayoutConfig } from '../hooks/useLayoutConfig';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const LayoutMini = () => {
  const theme = useTheme();
  const [drawerToggle, setDrawerToggle] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { logoSrc } = useLayoutConfig();

  const handleDrawerToggle = () => {
    setDrawerToggle(!drawerToggle);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={drawerToggle}>
        <Toolbar
          sx={{
            // p: '0 !important',
            pl: '12px !important',
          }}
        >
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
              ...(drawerToggle && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Mini variant drawer
          </Typography> */}
          <Box
            sx={{
              flexGrow: 1,
              // display: { xs: 'none', md: 'flex' },
              display: 'flex',
            }}
          >
            <IconButton
              size="small"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 0, ...(drawerToggle && { display: 'none' }) }}
            >
              {/* <MenuIcon /> */}
              <ImgComponent
                src={logoSrc}
                sx={{
                  width: 45,
                  mr: 1,
                  ...(drawerToggle && { display: 'none' }),
                }}
              />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              noWrap
              // href="/" // not-working
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  cursor: 'pointer',
                },
                ...(!drawerToggle && { mt: 1.5 }),
              }}
              onClick={() => navigate('/')}
            >
              {t('app.title')} [{`${drawerToggle}`}]
            </Typography>
          </Box>

          <NavLang />
          <NavNoti displayType={NavNotiDisplayType.MENU} />
          <NavNoti displayType={NavNotiDisplayType.POPPER} />
          <NavSetting />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={drawerToggle}>
        <DrawerMenu theme={theme} handleDrawerToggle={handleDrawerToggle} />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

export default LayoutMini;
