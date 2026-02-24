import React, { useState } from 'react';
import { enUS, zhCN, zhTW } from '@mui/material/locale';

import { STORAGE_KEY_TOKENS } from '../../auth';
// import { useServiceConfig } from '../../auth';
import { getI18nResources } from '../services/I18nService';
import type { I18nResource } from '../models';
import i18n
// , { BackendModule, InitOptions, Module, Services } 
from 'i18next';
import type { BackendModule, InitOptions, Module, Services } from 'i18next';

import '../hacks/StorageEventProxy';

/**
 * https://stackoverflow.com/a/26974487
 */
// This is not working!!!
// let oriSessionStorageSetItem = sessionStorage.setItem;
// sessionStorage.setItem = (key, value) => {
//   const event = new Event('itemInserted');
//   const oldValue = sessionStorage.getItem(key);
//   document.dispatchEvent(new StorageEvent('itemInserted', { key: key, oldValue: oldValue, newValue: value }));
//   oriSessionStorageSetItem.apply(this, [key, value]);
// };

const STORAGE_KEY_I18NRESOURCES = 'i18nResources';
const STORAGE_KEY_I18N = 'i18nlng';
// const [LNG_EN, LNG_TC, LNG_SC] = ['en', 'tc', 'sc'];
const [LNG_EN, LNG_TC, LNG_SC] = ['en', 'zh-TW', 'zh-CN'];
const LNG_MUI_LOCALE_MAP = {
  [LNG_EN]: enUS,
  [LNG_TC]: zhTW,
  [LNG_SC]: zhCN,
};

let globalStorageKey: string | undefined = undefined;

const I18nLoader: BackendModule = {
  type: 'backend',
  init: (
    services: Services,
    backendOptions: any,
    i18nextOptions: InitOptions
  ) => {
    //
    // const { loginService } = useServiceConfig();
    // console.debug(`I18nLoader - init - services: `, services);
    // console.debug(`I18nLoader - init - backendOptions: `, backendOptions);
    // console.debug(`I18nLoader - init - i18nextOptions: `, i18nextOptions);
    const fetchI18n = async (lng: string) => {
      const i18nResources = await getI18nResources(lng);
      // console.debug(
      //   `I18nLoader - init - fetchI18n - i18nResources: `,
      //   i18nResources
      // );
      const token: string = sessionStorage.getItem(
        STORAGE_KEY_TOKENS
        // loginService.getStorageKeyTokens()
      ) as string;
      localStorage.setItem(
        STORAGE_KEY_I18NRESOURCES,
        JSON.stringify(i18nResources)
      );
      loadResources(lng, token, i18nResources, 'event');
    };
    const handleStorageEvent = (evt: StorageEvent) => {
      handleStorageChange(evt);
    };
    const handleStorageCustom = (evt: any) => {
      handleStorageChange(evt.detail);
    };
    const handleStorageChange = (evt: StorageEvent | any) => {
      console.debug(`I18nLoader - init - handleStorageChange - 1 - evt.key: [${evt.key}], evt: `, evt);
      // const storageKeyTokens = loginService.getStorageKeyTokens();
      const i18nResourcesStr = localStorage.getItem(STORAGE_KEY_I18NRESOURCES);
      console.debug(`I18nLoader - init - handleStorageChange - 2 - globalStorageKey: [${globalStorageKey}], i18nResourcesStr : `, (i18nResourcesStr == null));
      if (
        // evt.storageArea === sessionStorage 
        // && evt.key === STORAGE_KEY_TOKENS
        (i18nResourcesStr == null && globalStorageKey == undefined) 
        // || (evt.storageArea === sessionStorage && evt.key === STORAGE_KEY_I18NRESOURCES)
      ) {
        globalStorageKey = STORAGE_KEY_I18NRESOURCES;
        // Something on another page changed the stored value.
        // console.debug(
        //   `I18nLoader - init - handleStorageChange - 2 - evt: `,
        //   evt
        // );
        let lng: string | undefined = i18nextOptions.lng;
        if (
          i18nextOptions.fallbackLng &&
          i18nextOptions?.fallbackLng?.length != null
        ) {
          lng = i18nextOptions?.fallbackLng as string;
        }
        if (lng != null) {
          fetchI18n(lng);
        }
      }
    };
    // window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('storagecustom', handleStorageCustom);
    // console.debug(`I18nLoader - init - storagecustom added`);
  },
  read: (language: string, namespace: string) => {
    // const { loginService } = useServiceConfig();
    // const storageKeyTokens = loginService.getStorageKeyTokens();
    const token = sessionStorage.getItem(
      STORAGE_KEY_TOKENS
      // storageKeyTokens
    );
    const i18nResourcesStr = localStorage.getItem(STORAGE_KEY_I18NRESOURCES);
    const i18nResources = i18nResourcesStr
      ? JSON.parse(i18nResourcesStr)
      : null;
    // console.debug(
    //   `I18nLoader - read - language: [${language}], namespace: [${namespace}], token is not null: [${
    //     token != null
    //   }], i18nResources: `,
    //   i18nResources
    // );
    loadResources(language, token, i18nResources, 'read');
    return new Promise((resolve) => {
      resolve(i18nResources);
    });
  },
};

const loadResources = (
  lng: string,
  token: string | null,
  i18nResources: I18nResource[] | null,
  // i18nResources: any | null,
  callee: string
) => {
  // console.debug(
  //   `I18nLoader - loadResources - lng: [${lng}], token is not null: [${
  //     token != null
  //   }], callee: [${callee}]`
  // );
  console.debug(`I18nLoader - loadResources - lng: [${lng}]`);
  if (i18nResources != null) {
    // for (const lng in i18nResources) {
    //   const resource = i18nResources[lng]['translation'];
    //   i18n.addResourceBundle(lng, 'translation', resource, false, true);
    // }
    for (let ccc = 0; ccc < i18nResources?.length; ccc++) {
      const lng2 = i18nResources[ccc].lng;
      const resource2 = i18nResources[ccc].resource;
      i18n.addResourceBundle(lng2, 'translation', resource2, false, true);
    }
    i18n.changeLanguage(lng);
  }
};

export default I18nLoader;
export {
  STORAGE_KEY_I18NRESOURCES,
  STORAGE_KEY_I18N,
  LNG_EN, LNG_TC, LNG_SC,
  LNG_MUI_LOCALE_MAP,
}
