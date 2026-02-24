// import { deepMergeObject } from '../../utils/object';

import type { ProcessorAxiosRequestConfig } from './ProcessorGeneral';
import { initReqConfigProcessors } from './ProcessorGeneral';
import { preDataObjProcessor, postDataRetProcessor } from './ProcessorGeneral';

import { envConfig } from '../../config/envConfig';

const prePublicDataObjProcessor = (
  reqConfig: ProcessorAxiosRequestConfig
): ProcessorAxiosRequestConfig => {
  // console.debug('prePublicDataObjProcessor - 1');
  //
  reqConfig = preDataObjProcessor(reqConfig);
  //
  // if (reqConfig.url.indexOf(envConfig.API_PATH_V1_PUBLIC) >= 0) {
  // reqConfig.processors = deepMergeObject(
  //   reqConfig.processors,
  //   {
  //     postDataRetProcessor: postPublicDataRetProcessor,
  //   },
  // );
  if (reqConfig === null) reqConfig = initReqConfigProcessors(reqConfig);
  if (reqConfig.processors != null) {
    reqConfig.processors.postDataRetProcessor = postPublicDataRetProcessor;
  }
  // }
  // console.debug('prePublicDataObjProcessor - 1 - reqConfig: ', reqConfig);
  return reqConfig;
};

const postPublicDataRetProcessor = (
  dataRet: any,
  reqConfig: ProcessorAxiosRequestConfig
): any => {
  return postDataRetProcessor(dataRet, reqConfig);
};

export { prePublicDataObjProcessor, postPublicDataRetProcessor };
