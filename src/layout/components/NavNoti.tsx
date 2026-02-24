import { useState, useContext, useEffect } from 'react';

import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import { 
  // Theme, 
  styled, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import {
  Box,
  Tooltip,
  Icon,
  IconButton,
  Badge,
  Menu,
  MenuList,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem as ListItemMui,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Popper,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  ClickAwayListener,
} from '@mui/material';

import {
  Mail as MailIcon,
  AssignmentInd as AssignmentIndIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  CloseOutlined as CloseOutlinedIcon,
} from '@mui/icons-material';

import { useAuthContext } from '../../auth';
import { IconComponent } from '../../ui';
import { formatDate, formatDatetime } from '../../utils/date';

const notiIcons = [
  // <MailIcon />,
  // <AssignmentIndIcon />,
  // <PersonIcon />,
  // <DashboardIcon />,
  // <LoginIcon />,
  // <LogoutIcon />,
  // <NotificationsIcon />,
  // <CloseOutlinedIcon />,
  'Mail',
  'AssignmentInd',
  'Person',
  'Dashboard',
  'Login',
  'Logout',
  'Notifications',
  'CloseOutlined',
];

const ListItem = styled(ListItemMui)(({ theme }) => ({
  '&:hover': {
    cursor: 'pointer',
    // backgroundColor: theme.palette.primary.main,
    // backgroundColor: '#f1f1f1',
    // backgroundColor: 'rgba(0, 0, 0, 0.04)',
    //
    // Reference:
    // https://mui.com/material-ui/customization/dark-mode/
    // use theme.palette.action.hover instead of hard-coding
    backgroundColor: theme.palette.action.hover,
  },
}));

const displayWidth = 350;
const innerHeight = 350;

// enum NavNotiDisplayType {
//   MENU = 'MENU',
//   POPPER = 'POPPER',
// }
const NavNotiDisplayType = {
  MENU: 'MENU',
  POPPER: 'POPPER',
} as const;
type NavNotiDisplayType = typeof NavNotiDisplayType[keyof typeof NavNotiDisplayType];

type NavNotiProps = {
  displayType: NavNotiDisplayType;
};

const NavNoti: React.FC<NavNotiProps> = ({ displayType }) => {
  const { t, i18n } = useTranslation();
  const [notis, setNotis] = useState<any[]>([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    let notisTemp: any[] = [];
    for (let i = 0; i < 20; i++) {
      notisTemp.push({
        message: `Notification Item ${i + 1} Notification Item ${
          i + 1
        } Notification Item ${i + 1}`,
        href: `/notification/${i + 1}`,
        datetime: new Date(),
        icon: notiIcons[i % notiIcons.length],
      });
    }
    setNotis(notisTemp);
  }, []);

  const [anchorElNoti, setAnchorElNoti] = useState<null | HTMLElement>(null);

  const handleNotiMenuOpen = (evt: React.MouseEvent<HTMLElement>) => {
    // console.debug(
    //   'NavNoti - handleNotiMenuOpen - evt.currentTarget: ',
    //   evt.currentTarget
    // );
    // setAnchorElNoti(evt.currentTarget);
    handleNotiElementOpen(evt.currentTarget);
  };
  // const handleNotiMenuClose = () => {
  //   setAnchorElNoti(null);
  // };
  const handleNotiElementOpen = (currentTarget: null | HTMLElement) => {
    // console.debug(
    //   'NavNoti - handleNotiMenuOpen - currentTarget: ',
    //   currentTarget
    // );
    setAnchorElNoti((prevState) => {
      if (prevState == null) return currentTarget;
      else return null;
    });
  };

  const [notiDialogOpen, setNotiDialogOpen] = useState(false);
  const handleNotiDialogOpen = () => {
    setNotiDialogOpen(true);
  };
  const handleNotiDialogClose = () => {
    setNotiDialogOpen(false);
  };
  const handleNotiOneClick = (noti: any) => {
    navigate(noti.href);
  };
  const handleNotiAllClear = () => {};

  return (
    <>
      {user && (
        <ClickAwayListener
          onClickAway={() => {
            // console.debug('NavNoti - ClickAwayListener - clicked');
            handleNotiElementOpen(null);
          }}
        >
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={t('menu.noti.tooltip')}>
              <IconButton
                // id="long-button"
                onClick={handleNotiMenuOpen}
                size="large"
                aria-label={`${t('menu.noti')}-${displayType}`}
                aria-controls={`menu-noti-${displayType}`}
                aria-haspopup="true"
                aria-describedby={`menu-noti-${displayType}`}
                color="inherit"
                sx={{ p: 1 }}
              >
                <Badge color="secondary" badgeContent={notis.length} max={9}>
                  {/* <MailIcon /> */}
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {displayType === NavNotiDisplayType.MENU && (
              <Menu
                // // sx={{ mt: 7, maxHeight: '400px' }}
                sx={{
                  mt: 7,
                  maxWidth: displayWidth,
                  //   // , maxHeight: 500
                }}
                id={`menu-noti-${displayType}`}
                // MenuListProps={{
                //   'aria-labelledby': 'long-button',
                // }}
                anchorEl={anchorElNoti}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                // keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNoti)}
                onClose={handleNotiMenuOpen}
                // Popover={{
                //   style: {
                //     // maxHeight: notis.length * 4.5,
                //     maxHeight: '400px',
                //     width: '20ch',
                //   },
                // }}
              >
                <MenuItem
                  sx={
                    {
                      // backgroundColor: (theme) => theme.palette.primary.main,
                      // color: (theme) => theme.palette.primary.contrastText,
                    }
                  }
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      margin: 'auto',
                      // backgroundColor: (theme) => theme.palette.primary.main,
                      // color: (theme) => theme.palette.primary.contrastText,
                    }}
                  >
                    {t('menu.noti.title')}
                  </Typography>
                </MenuItem>
                <MenuItem sx={{ padding: 0 }}>
                  <Box
                    sx={{
                      mt: 0,
                      overflow: 'hidden auto',
                      maxHeight: innerHeight,
                      // minWidth: 250,
                    }}
                  >
                    <MenuList
                      sx={
                        {
                          // maxWidth: 285
                        }
                      }
                    >
                      {notis.map((noti, idx) => (
                        <MenuItem
                          key={`type-2-${idx}`}
                          onClick={() => {
                            handleNotiElementOpen(null);
                          }}
                          sx={{ paddingLeft: 1 }}
                        >
                          <IconButton size="small">
                            <IconComponent name={noti.icon} />
                          </IconButton>
                          <Box sx={{ overflowX: 'hidden', p: 1 }}>
                            <Typography
                              // component="span"
                              // textAlign="left"
                              variant="subtitle1"
                              textAlign="left"
                              // sx={{ overflowX: 'hidden' }}
                            >
                              {noti.message}
                            </Typography>
                            <Typography
                              // textAlign="right"
                              variant="body1"
                              textAlign="right"
                              fontSize={'0.85rem'}
                            >
                              {formatDatetime(noti.datetime)}
                            </Typography>
                          </Box>
                          <IconButton size="small">
                            <IconComponent name={noti.icon} />
                          </IconButton>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      width: '100%',
                      // justifyContent: 'right',
                    }}
                  >
                    {t('button.mark.as.read')}
                  </Button>
                </MenuItem>
              </Menu>
            )}

            {displayType === NavNotiDisplayType.POPPER && (
              <Popper
                sx={{ p: 0, width: displayWidth }}
                id={`menu-noti-${displayType}`}
                // placement={matchesXs ? 'bottom' : 'bottom-end'}
                placement={'bottom-end'}
                // placement={'bottom'}
                // placement={'auto-end'}
                open={anchorElNoti != null}
                anchorEl={anchorElNoti}
                // role={undefined}
                // transition
                // disablePortal
                popperOptions={{
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        // offset: [matchesXs ? -5 : 0, 9],
                        // offset: [0, 9],
                        offset: [0, 19],
                        zIndex: 1,
                      },
                    },
                  ],
                }}
              >
                <Card variant="outlined">
                  <CardHeader
                    sx={{
                      p: 1,
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.primary.contrastText,
                    }}
                    title={
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          textAlign: 'center',
                          '&:hover': { cursor: 'pointer' },
                          fontColor: (theme) => theme.palette.primary.main,
                        }}
                        onClick={() => navigate('/notis')}
                      >
                        {t('menu.noti.title')}
                      </Typography>
                    }
                    action={
                      <IconButton onClick={() => handleNotiElementOpen(null)}>
                        <CloseOutlinedIcon />
                      </IconButton>
                    }
                  />
                  <Divider />
                  <CardContent
                    sx={{
                      maxHeight: innerHeight,
                      overflowX: 'hidden',
                      overflowY: 'auto',
                      pt: 0,
                      pb: 0,
                      // pl: 2,
                      // pr: 1,
                      pl: 0,
                      pr: 0,
                    }}
                    color="text.secondary"
                  >
                    <List>
                      {notis.map((noti, idx) => (
                        <div key={`type-3-${idx}`}>
                          <ListItem
                            key={`type-3-${idx}`}
                            sx={{
                              pt: 0,
                              pb: 0,
                              pl: 2,
                              pr: 2,
                              overflowX: 'hidden',
                            }}
                          >
                            <ListItemIcon>
                              <IconButton size="small">
                                <IconComponent name={noti.icon} />
                              </IconButton>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  // component="div"
                                  variant="subtitle1"
                                  textAlign="left"
                                  // sx={{ whiteSpace: 'nowrap', overflowX: 'hidden' }}
                                >
                                  {noti.message}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  // component="body"
                                  variant="body1"
                                  textAlign="right"
                                  fontSize={'0.85rem'}
                                >
                                  {formatDatetime(noti.datetime)}
                                </Typography>
                              }
                            />
                            <ListItemButton>
                              <IconButton size="small">
                                <IconComponent name={noti.icon} />
                              </IconButton>
                            </ListItemButton>
                          </ListItem>
                          {idx < notis.length - 1 && <Divider />}
                        </div>
                      ))}
                    </List>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button
                      variant="contained"
                      // color="primary"
                      sx={{
                        width: '100%',
                        // justifyContent: 'right',
                        fontColor: (theme) => theme.palette.primary.main,
                      }}
                    >
                      {t('button.mark.as.read')}
                    </Button>
                  </CardActions>
                </Card>
              </Popper>
            )}

            {/* <Tooltip title={t('menu.noti.tooltip')}>
            <IconButton
              onClick={handleNotiMenuOpen}
              size="large"
              aria-label={t('menu.noti')}
              aria-controls="menu-noti-2"
              aria-haspopup="true"
              color="inherit"
              sx={{ p: 1 }}
            >
              <Badge color="secondary" badgeContent={notis.length} max={9}>
                <MailIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px', maxWidth: 250 }}
            id="menu-noti-2"
            anchorEl={anchorElNoti}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            // keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElNoti)}
            onClose={handleNotiMenuClose}
          >
            <MenuItem>
              <Typography textAlign="center">{t('menu.noti.title')}</Typography>
            </MenuItem>
            <Box
              sx={{
                mt: 0,
                overflow: 'hidden auto',
                maxHeight: 290,
              }}
            >
              {notis.map((noti, idx) => (
                <MenuItem
                  key={idx}
                  onClick={() => {
                    handleNotiMenuClose();
                  }}
                >
                  <Typography textAlign="center">{noti.message}</Typography>
                </MenuItem>
              ))}
            </Box>
            <Divider />
            <MenuItem>
              <Button
                color="primary"
                sx={{
                  width: '100%',
                  // justifyContent: 'right',
                }}
              >
                {t('button.mark.as.read')}
              </Button>
            </MenuItem>
          </Menu> */}

            {/* <Tooltip title={t('menu.noti.tooltip')}>
            <IconButton
              onClick={handleNotiDialogOpen}
              size="large"
              aria-label={t('menu.noti')}
              aria-controls="menu-noti-dialog"
              aria-haspopup="true"
              color="inherit"
              sx={{ p: 1 }}
            >
              <Badge color="secondary" badgeContent={notis.length} max={9}>
                <MailIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Dialog
            onClose={handleNotiDialogClose}
            open={notiDialogOpen}
            fullWidth={true}
            //
            // Reference:
            // https://stackoverflow.com/a/69231667
            PaperProps={{
              sx: {
                width: '60%',
                maxHeight: 350,
                position: 'relative',
              },
            }}
          >
            <DialogTitle>{t('menu.noti.title')}</DialogTitle>
            <DialogContent>
              <List sx={{ pt: 0 }}>
                {notis.map((noti, idx) => (
                  <ListItem disableGutters key={idx}>
                    <ListItemButton onClick={() => handleNotiOneClick(noti)}>
                      <ListItemText primary={noti.message} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                sx={{
                  width: '100%',
                  // justifyContent: 'right',
                }}
                onClick={handleNotiAllClear}
              >
                {t('button.mark.as.read')}
              </Button>
            </DialogActions>
          </Dialog> */}
          </Box>
        </ClickAwayListener>
      )}
    </>
  );
};

export default NavNoti;

export { NavNotiDisplayType };

export type { NavNotiProps };
