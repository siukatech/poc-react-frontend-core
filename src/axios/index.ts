import AxiosInterceptor from './components/AxiosInterceptor';

import {
  preEncryptedDataObjProcessor,
  postEncryptedDataRetProcessor,
} from './processors/ProcessorEncrypted';

import {
  preDataObjProcessor,
  postDataRetProcessor,
  initReqConfigProcessors,
  // ProcessorAxiosRequestConfig,
} from './processors/ProcessorGeneral';
import type {
  ProcessorAxiosRequestConfig,
} from './processors/ProcessorGeneral';
import {
  preProtectedDataObjProcessor,
  postProtectedDataRetProcessor,
} from './processors/ProcessorProtected';

import {
  prePublicDataObjProcessor,
  postPublicDataRetProcessor,
} from './processors/ProcessorPublic';

import axiosService from './services/axiosService';

import {
  // ResponseErr,
  // ServerErr,
  resolveServerErr,
} from './services/AxiosErrorHandler';
import type {
  ResponseErr,
  ServerErr,
} from './services/AxiosErrorHandler';

export {
  AxiosInterceptor,
  preEncryptedDataObjProcessor,
  postEncryptedDataRetProcessor,
  preDataObjProcessor,
  postDataRetProcessor,
  initReqConfigProcessors,
  preProtectedDataObjProcessor,
  postProtectedDataRetProcessor,
  prePublicDataObjProcessor,
  postPublicDataRetProcessor,
  axiosService,
  resolveServerErr,
};
export type { ProcessorAxiosRequestConfig, ResponseErr, ServerErr };
