import { useState, useContext, useEffect } from 'react';

import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import {
  Box,
  IconButton,
  Typography,
  Divider,
  Paper,
  Menu,
  MenuList,
  MenuItem,
  Tooltip,
  Avatar,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import {
  AssignmentInd as AssignmentIndIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import { useAuthContext, useAuthSelector } from '../../auth';
import { useAppSelector } from '../stores/hooks';
import { useLayoutConfig } from '../hooks/useLayoutConfig';
import type { SettingItem } from '../models';


const NavSetting = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { settingItems } = useLayoutConfig();
  const { user: userCtx } = useAuthContext();
  // const userRedux = useAuthSelector((state) => state.user);
  const userRedux = useAppSelector((state) => state.auth?.user);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (evt: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(evt.currentTarget);
  };
  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  let user = null;
  // user = userCtx;
  user = userRedux;

  console.debug(`NavSetting - userCtx: `, userCtx);
  console.debug(`NavSetting - userRedux: `, userRedux);

  return (
    <>
      {!user && (
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title={t('menu.login.tooltip')}>
            <IconButton
              onClick={() => navigate('/login')}
              size="large"
              aria-label={t('menu.login')}
              aria-controls="menu-login"
              aria-haspopup="true"
              color="inherit"
              sx={{ p: 1 }}
            >
              <LoginIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      {user && (
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title={t('menu.user.tooltip')}>
            <IconButton
              onClick={handleUserMenuOpen}
              size="large"
              aria-label={t('menu.user')}
              aria-controls="menu-user"
              aria-haspopup="true"
              color="inherit"
              sx={{ p: 1 }}
            >
              <Avatar
                alt={user?.userId}
                // src="/static/images/avatar/2.jpg"
                sx={{ width: 24, height: 24 }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-user"
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
            onClose={handleUserMenuClose}
          >
            {settingItems.map((settingItem: SettingItem, idx) => (
              <div key={idx}>
                {!settingItem.divider && (
                  <MenuItem
                    onClick={() => {
                      handleUserMenuClose();
                      navigate(`${settingItem.link}`);
                    }}
                  >
                    <ListItemIcon>{settingItem.icon}</ListItemIcon>
                    <ListItemText>{t(`${settingItem.i18n}`)}</ListItemText>
                  </MenuItem>
                )}
                {settingItem.divider && <Divider key={idx} />}
              </div>
            ))}
          </Menu>
        </Box>
      )}
    </>
  );
};

export default NavSetting;
