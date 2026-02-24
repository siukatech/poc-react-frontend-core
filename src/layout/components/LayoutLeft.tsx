import React, { useState, useContext, useEffect } from 'react';

import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import { 
  // Theme, 
  styled, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  AppBar as AppBarMui,
  Drawer,
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
} from '@mui/icons-material';

import { useAuthContext } from '../../auth';

import {
  ImgComponent,
  DrawerHeader,
} from '../../ui';

import NavLang from './NavLang';
import NavNoti, { NavNotiDisplayType } from './NavNoti';
import NavSetting from './NavSetting';
import ScrollTop from './ScrollTop';

// import logo192 from '../../../assets/logo192.png';
import DrawerMenu from './DrawerMenu';
import { useLayoutConfig } from '../hooks/useLayoutConfig';

const drawerWidth = 240;

const MainMd = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));
// const MainXs = styled('main', {
//   shouldForwardProp: (prop) => prop !== 'open',
// })<{ open?: boolean }>(({ theme, open }) => ({
//   flexGrow: 1,
//   padding: theme.spacing(3),
//   transition: theme.transitions.create('margin', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   // marginLeft: `-${drawerWidth}px`,
//   ...(open && {
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: 0,
//   }),
// }));
const MainXs = styled(MainMd, {
  shouldForwardProp: (prop) => prop !== 'open',
})((
  // { theme, open }
) => ({
  marginLeft: 'auto',
}));

const AppBarMd = styled(AppBarMui, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  //  sx: { display: { xs: 'none', md: 'flex' } },
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const AppBarXs = styled(AppBarMui, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // sx: { display: { xs: 'flex', md: 'none' } },
  ...(open && {
    // width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// const DrawerHeader = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   justifyContent: 'flex-end',
// }));

// type DrawerContentProps = {
//   handleDrawerToggle: () => void;
//   theme: Theme;
//   pages: any[];
// };

// const DrawerContent: React.FC<DrawerContentProps> = ({
//   handleDrawerToggle,
//   theme,
//   pages,
// }) => {
//   const { t, i18n } = useTranslation();
//   const navigate = useNavigate();

//   return (
//     <>
//       <DrawerHeader>
//         <IconButton onClick={handleDrawerToggle}>
//           {theme.direction === 'ltr' ? (
//             <ChevronLeftIcon />
//           ) : (
//             <ChevronRightIcon />
//           )}
//         </IconButton>
//       </DrawerHeader>
//       <Divider />
//       <List>
//         {pages.map((page) => (
//           <ListItem key={page.i18n} disablePadding>
//             <ListItemButton onClick={() => navigate(page.link)}>
//               <ListItemIcon>
//                 {/* <HomeIcon /> */}
//                 {/* <MailIcon /> */}
//                 {page.icon}
//               </ListItemIcon>
//               <ListItemText primary={t(`${page.i18n}`)} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </>
//   );
// };

// const pages = [
//   { i18n: 'menu.home', link: '/', icon: <HomeIcon /> },
//   { i18n: 'menu.items', link: '/items', icon: <EventIcon /> },
//   { i18n: 'menu.shops', link: '/shops', icon: <StorefrontIcon /> },
// ];

type LayoutLeftProps = {
  window?: () => Window;
  children?: React.ReactNode;
};

const LayoutLeft: React.FC<LayoutLeftProps> = (props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logoSrc } = useLayoutConfig();

  const [drawerToggle, setDrawerToggle] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setDrawerToggle(!drawerToggle);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarMd
          position="fixed"
          open={drawerToggle}
          // sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          {/* <Container maxWidth="lg"> */}
          <Toolbar>
            {/* <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: 1, ...(drawerToggle && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton> */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="small"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: 1, ...(drawerToggle && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <ImgComponent
                src={logoSrc}
                sx={{
                  width: 45,
                  mr: 1,
                  ...(drawerToggle && { display: 'none' }),
                }}
              />
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
                  ...(!drawerToggle && { mt: '6px' }),
                }}
                onClick={() => navigate('/')}
              >
                {t('app.title')} [{`${drawerToggle}`}]
              </Typography>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                alignItems: 'center',
                display: { xs: 'flex', md: 'none' },
              }}
            >
              <MenuIcon
                onClick={handleDrawerToggle}
                // edge="start"
                sx={{ mr: 1 }}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                  textOverflow: 'clip',
                  whiteSpace: 'normal',
                }}
              >
                Frontend App [{`${drawerToggle}`}]
              </Typography>
            </Box>

            <NavLang />
            <NavNoti displayType={NavNotiDisplayType.MENU} />
            <NavNoti displayType={NavNotiDisplayType.POPPER} />
            <NavSetting />
          </Toolbar>
          {/* </Container> */}
        </AppBarMd>

        <Toolbar id="back-to-top-anchor" sx={{ padding: { xs: 0, md: 0 } }} />

        <Drawer
          sx={{
            // display: { xs: 'none', md: 'block' },
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          // variant="temporary"
          anchor="left"
          open={drawerToggle}
        >
          {/* {drawerContent} */}
          <DrawerMenu theme={theme} handleDrawerToggle={handleDrawerToggle} />
        </Drawer>

        <MainMd
          open={drawerToggle}
          // sx={{
          //   display: { xs: 'none', md: 'block' },
          // }}
        >
          <DrawerHeader />
          <Outlet />
        </MainMd>
      </Box>
      <ScrollTop open={drawerToggle} {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
};

export default LayoutLeft;
