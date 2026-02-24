import { useState, useContext, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { 
  // Theme, 
  styled 
} from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import {
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

// import logo192 from '../../../assets/logo192.png';

import {
  ProtectedResource,
  ProtectedResourceAccessBy,
  ProtectedResourceDisplayType,
  useAuthContext,
} from '../../auth';
// import type {
//   ProtectedResourceAccessBy,
//   ProtectedResourceDisplayType,
// } from '../../auth';

import {
  DrawerHeader,
  ImgComponent,
  IconComponent,
  // IconNames,
} from '../../ui';
import type {
  IconNames,
} from '../../ui';
import { useLayoutConfig } from '../hooks/useLayoutConfig';
import type { MenuItem } from '../models';


type DrawerMenuProps = {
  theme: Theme;
  handleDrawerToggle: () => void;
  // pages: any[];
};

const DrawerMenu: React.FC<DrawerMenuProps> = ({
  theme,
  handleDrawerToggle,
  // pages,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logoSrc, menuItems } = useLayoutConfig();

  return (
    <>
      <DrawerHeader>
        <ImgComponent
          src={logoSrc}
          sx={{ width: 45, marginLeft: 'auto', marginRight: 'auto' }}
        />
        <IconButton onClick={handleDrawerToggle}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List
        sx={{
          ml: 0.8,
        }}
      >
        {menuItems.map((menuItem: MenuItem) => (
          <ProtectedResource
            key={menuItem.i18n}
            accessBy={ProtectedResourceAccessBy.PROTECTED}
            displayType={ProtectedResourceDisplayType.DISABLED}
            resourceName={`${menuItem.i18n}`}
            accessRights={`view`}
          >
            <ListItem key={menuItem.i18n} disablePadding>
              <ListItemButton title={t(`${menuItem.i18n}`)} onClick={() => navigate(menuItem.link)}>
                <ListItemIcon >
                  <IconComponent name={menuItem.icon as IconNames} />
                </ListItemIcon>
                <ListItemText primary={t(`${menuItem.i18n}`)} />
              </ListItemButton>
            </ListItem>
          </ProtectedResource>
        ))}
      </List>
    </>
  );
};

export default DrawerMenu;
