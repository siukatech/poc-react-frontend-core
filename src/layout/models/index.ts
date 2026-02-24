import type { ReactComponentElement } from "react";

type MenuItem = {
  i18n: string;
  link: string;
  icon: string;
}

type LangItem = {
  i18n: string;
  lang: string;
}

type SettingItem = {
  i18n?: string;
  link?: string;
  icon: JSX.Element;
  divider: boolean;
}

type LayoutConfig = {
  logoSrc: string;
  menuItems: MenuItem[];
  langItems: LangItem[];
  settingItems: SettingItem[];
}

export type {
  MenuItem,
  LangItem,
  SettingItem,
  LayoutConfig,
}