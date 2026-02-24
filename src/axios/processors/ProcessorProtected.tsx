// import { deepMergeObject } from '../../utils/object';

import {
  // ProcessorAxiosRequestConfig,
  initReqConfigProcessors,
} from './ProcessorGeneral';
import type {
  ProcessorAxiosRequestConfig,
} from './ProcessorGeneral';
import {
  prePublicDataObjProcessor,
  postPublicDataRetProcessor,
} from './ProcessorPublic';

// import { useServiceConfig } from '../../auth';

import { envConfig } from '../../config/envConfig';


const preProtectedDataObjProcessor = (
  reqConfig: ProcessorAxiosRequestConfig
): ProcessorAxiosRequestConfig => {
  // console.debug('preProtectedDataObjProcessor - 1');
  //
  reqConfig = prePublicDataObjProcessor(reqConfig);
  //
  // const { loginService } = useServiceConfig();
  const loginService = reqConfig.loginService;
  // if (reqConfig.url.indexOf(envConfig.API_PATH_V1_PROTECTED) >= 0) {
  const tokens = loginService?.restoreTokens();
  if (tokens != null) {
    // reqConfig.headers.common = reqConfig.headers.common ?? {};
    // reqConfig.headers.common['Authorization'] = `bearer ${tokens.access_token}`;
    reqConfig.headers['Authorization'] = `Bearer ${tokens.access_token}`;
    // reqConfig.processors = reqConfig.processors ?? {};
    // reqConfig.processors = deepMergeObject(
    //   reqConfig.processors,
    //   {
    //     postDataRetProcessor: postProtectedDataRetProcessor,
    //   },
    // );
    if (reqConfig === null) reqConfig = initReqConfigProcessors(reqConfig);
    if (reqConfig.processors != null) {
      reqConfig.processors.postDataRetProcessor = postProtectedDataRetProcessor;
    }
  }
  // }
  // reqConfig.interceptors = reqConfig.interceptors ?? [];
  // reqConfig.interceptors.push(1);
  // console.debug('preProtectedDataObjProcessor - 1 - reqConfig: ', reqConfig);

  return reqConfig;
};

const postProtectedDataRetProcessor = (
  dataRet: any,
  reqConfig: ProcessorAxiosRequestConfig
): any => {
  return postPublicDataRetProcessor(dataRet, reqConfig);
};

export { preProtectedDataObjProcessor, postProtectedDataRetProcessor };
