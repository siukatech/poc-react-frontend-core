import DrawerMenu from './components/DrawerMenu';
import LayoutLeft from './components/LayoutLeft';
import LayoutMini from './components/LayoutMini';
import MiniVariantDrawerLeft from './components/MiniVariantDrawerLeft';
import NavLang from './components/NavLang';
import NavNoti from './components/NavNoti';
import NavSetting from './components/NavSetting';
import PersistentDrawerLeft from './components/PersistentDrawerLeft';
import ScrollTop from './components/ScrollTop';

import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import RouterMain from './pages/RouterMain';

// import router from './routes/router';

import { useAppDispatch, useAppSelector } from './stores/hooks';

import shadeColor from './themes/shade-color';
import themeOptions, { themeFormReadonlyOptions } from './themes/theme-options';

// import {
//   DATE_FORMAT_DEFAULT,
//   DATE_TIME_FORMAT_DEFAULT,
//   TIMEZONE_DEFAULT,
//   formatDate,
//   formatDatetime,
//   parseDateToUtc,
// } from '../utils/date';
// import { deepMergeObject } from '../utils/object';
// import { recursiveCloneChildren } from '../utils/render';
// import { restoreJsonStr, saveJsonObj } from '../utils/storage';

export {
  DrawerMenu,
  LayoutLeft,
  LayoutMini,
  MiniVariantDrawerLeft,
  NavLang,
  NavNoti,
  NavSetting,
  PersistentDrawerLeft,
  ScrollTop,
  ErrorPage,
  Home,
  NotFound,
  // router,
  RouterMain,
  useAppDispatch, 
  useAppSelector,
  shadeColor,
  themeOptions,
  themeFormReadonlyOptions,
  // DATE_FORMAT_DEFAULT,
  // DATE_TIME_FORMAT_DEFAULT,
  // TIMEZONE_DEFAULT,
  // formatDate,
  // formatDatetime,
  // parseDateToUtc,
  // deepMergeObject,
  // recursiveCloneChildren,
  // restoreJsonStr,
  // saveJsonObj,
};
