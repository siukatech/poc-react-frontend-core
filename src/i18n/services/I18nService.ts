import axiosService from '../../axios/services/axiosService';
import type { I18nResource } from '../models';
import { envConfig } from '../../config/envConfig';

// for typescript, "import './i18n';" will be ok.
// xxxxx - typescript is required to wrap a function to call in index.tsx
// const initI18n = () => {
  const i18nUrl: string =
  (envConfig.API_PATH_WEB_PREFIX as string) +
  (envConfig.API_PATH_V1_PUBLIC as string) +
  // (envConfig.API_PATH_I18N_LANG as string)
  (envConfig.API_PATH_I18N_ALL as string)
;


const getI18nResources = async (lng: string): Promise<I18nResource[]> => {
// const getI18nResources = async (lng: string): Promise<any> => {
    // {{lng}}
  // console.debug(`getI18nResources - i18nUrl: [${i18nUrl}]`)
  const { data } = await axiosService.get(`${i18nUrl}`);
  const i18nResources: I18nResource[] = [];
  for (const lng in data) {
    const resource = data[lng];
    i18nResources.push({
      lng,
      resource,
    } as I18nResource);
  }
  return i18nResources;
  // let i18nResources: any = {};
  // for (const lng in data) {
  //   const resource = data[lng];
  //   i18nResources[lng] = {
  //     'translation': resource,
  //   };
  // }
  // return i18nResources;
}

export {
  getI18nResources
}

