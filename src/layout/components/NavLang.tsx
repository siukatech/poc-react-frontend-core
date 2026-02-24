import { useState, useContext, useEffect } from 'react';

import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import {
  Box,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import { Language as LanguageIcon } from '@mui/icons-material';

import { useAuthContext } from '../../auth';

import {
  STORAGE_KEY_I18NRESOURCES,
  STORAGE_KEY_I18N,
  LNG_EN, LNG_TC, LNG_SC,
  LNG_MUI_LOCALE_MAP,
} from '../../i18n';
import { useLayoutConfig } from '../hooks/useLayoutConfig';
import type { LangItem } from '../models';


const convertToLangMap = (langItems: LangItem[]) => {
  const langItemMap: any = langItems.reduce(
    (accumulator, langItem) => ({ ...accumulator, [langItem.lang]: langItem }),
    {}
  );
  return langItemMap;
}

const NavLang = () => {
  const { t, i18n, ready } = useTranslation();
  const { langItems } = useLayoutConfig();
  const langItemMap = convertToLangMap(langItems);

  const langSelected = langItemMap[i18n.language];

  const handleLanguageChange = (lng: string) => {
    // console.debug('handleLanguageChange - ready: ', ready);
    if (ready) {
      i18n.changeLanguage(lng);
      localStorage.setItem(STORAGE_KEY_I18N, lng);
    }
  };

  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

  const handleLangMenuOpen = (evt: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(evt.currentTarget);
  };
  const handleLangMenuClose = () => {
    setAnchorElLang(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip
          // title={t('menu.lang')}
          title={t(`${langSelected?.i18n}`)}
        >
          <IconButton
            onClick={handleLangMenuOpen}
            size="large"
            aria-label={t('menu.lang')}
            aria-controls="menu-lang"
            aria-haspopup="true"
            color="inherit"
            sx={{ p: 1 }}
          >
            <LanguageIcon />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-lang"
          anchorEl={anchorElLang}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElLang)}
          onClose={handleLangMenuClose}
        >
          {langItems.map((langItem: LangItem, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                handleLangMenuClose();
                handleLanguageChange(langItem.lang);
              }}
              sx={{
                backgroundColor:
                  langItem.lang === i18n.language
                    ? 'rgba(0,0,0,0.04)'
                    : 'transparent',
              }}
            >
              <Typography textAlign="center">{t(`${langItem.i18n}`)}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );
};

export default NavLang;
