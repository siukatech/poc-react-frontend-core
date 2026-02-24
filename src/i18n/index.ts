
import type { I18nResource } from './models';

import I18nLoader from './plugins/I18nLoader';

import {
  STORAGE_KEY_I18NRESOURCES,
  STORAGE_KEY_I18N,
  LNG_EN, LNG_TC, LNG_SC,
  LNG_MUI_LOCALE_MAP,
} from './plugins/I18nLoader';

import { getI18nResources } from './services/I18nService';

export type {
  I18nResource
}
export {
  I18nLoader, 
  getI18nResources,
  STORAGE_KEY_I18NRESOURCES,
  STORAGE_KEY_I18N,
  LNG_EN, LNG_TC, LNG_SC,
  LNG_MUI_LOCALE_MAP,
}
