import axios, { 
  // InternalAxiosRequestConfig, 
  AxiosError 
} from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import { parseDateToUtc } from '../../utils/date';
// import { deepMergeObject } from '../../utils/object';

import type { ProcessorAxiosRequestConfig } from '../processors/ProcessorGeneral';
import { prePublicDataObjProcessor } from '../processors/ProcessorPublic';
import { preProtectedDataObjProcessor } from '../processors/ProcessorProtected';
import { preEncryptedDataObjProcessor } from '../processors/ProcessorEncrypted';
import { useServiceConfig } from '../../app';
import { envConfig } from '../../config/envConfig';


const axiosService = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  // Reference:
  // https://stackoverflow.com/a/43842920
  validateStatus: function (status) {
    // console.debug(`axiosService - validateStatus - status: [${status}]`);
    // return status >= 200;
    return status >= 200 && status < 300; // default
  },
});

// // axiosService.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
// //axiosService.defaults.headers["Content-Type"] = "application/json";

// // Reference:
// // https://axios-http.com/docs/req_config
// axiosService.interceptors.request.use(
//   (config: InternalAxiosRequestConfig): ProcessorAxiosRequestConfig => {
//     const { loginService } = useServiceConfig();
//     // console.debug('interceptor.request - 1');
//     // const tokens = loginService.restoreTokens();
//     // // config.headers.common = config.headers.common ?? {};
//     // // config.headers.common['Authorization'] = `bearer ${tokens.access_token}`;
//     // config.headers['Authorization'] = `Bearer ${tokens.access_token}`;
//     // // config.processors = config.processors ?? {};
//     // if (config.url.indexOf(envConfig.API_PATH_V1_PUBLIC) >= 0) {
//     //   config.processors = deepMergeObject(
//     //     {
//     //       postDataRetProcessor: postPublicDataRetProcessor,
//     //     },
//     //     config.processors
//     //   );
//     // }
//     // // config.interceptors = config.interceptors ?? [];
//     // // config.interceptors.push(1);
//     // config = prePublicDataObjProcessor(config);
//     let configProcessed = preEncryptedDataObjProcessor(
//       config as ProcessorAxiosRequestConfig
//     );
//     // console.debug('interceptor.request - 1 - configProcessed: ', configProcessed);
//     return configProcessed;
//   },
//   undefined,
//   { synchronous: true }
// );
// axiosService.interceptors.request.use(
//   (config: InternalAxiosRequestConfig): ProcessorAxiosRequestConfig => {
//     // console.debug(
//     //   'interceptor.request - 2 - config.interceptors: ',
//     //   config.interceptors
//     // );
//     // if (config.url.indexOf(envConfig.API_PATH_V1_PROTECTED) >= 0) {
//     //   config.processors = deepMergeObject(
//     //     {
//     //       postDataRetProcessor: postProtectedDataRetProcessor,
//     //       preDataObjProcessor: preDataObjProcessor,
//     //     },
//     //     config.processors
//     //   );
//     // }
//     // // config.interceptors = config.interceptors ?? [];
//     // // config.interceptors.push(2);
//     let configProcessed = preProtectedDataObjProcessor(
//       config as ProcessorAxiosRequestConfig
//     );
//     // console.debug('interceptor.request - 2 - configProcessed: ', configProcessed);
//     return configProcessed;
//   },
//   undefined,
//   { synchronous: true }
// );
// axiosService.interceptors.request.use(
//   (config: InternalAxiosRequestConfig): ProcessorAxiosRequestConfig => {
//     // console.debug(
//     //   'interceptor.request - 3 - config.interceptors: ',
//     //   config.interceptors
//     // );
//     // if (config.url.indexOf(envConfig.API_PATH_V1_ENCRYPTED) >= 0) {
//     //   config.processors = deepMergeObject(
//     //     {
//     //       postDataRetProcessor: postEncryptedDataRetProcessor,
//     //       preDataObjProcessor: preDataObjProcessor,
//     //     },
//     //     config.processors
//     //   );
//     // }
//     // // config.interceptors = config.interceptors ?? [];
//     // // config.interceptors.push(3);
//     let configProcessed = prePublicDataObjProcessor(
//       config as ProcessorAxiosRequestConfig
//     );
//     // console.debug('interceptor.request - 3 - configProcessed: ', configProcessed);
//     return configProcessed;
//   },
//   undefined,
//   { synchronous: true }
// );

// axiosService.interceptors.response.use(
//   (response) => {
//     // console.debug('interceptor.response.normal - 1');
//     const processedConfig: ProcessorAxiosRequestConfig =
//       response.config as ProcessorAxiosRequestConfig;
//     response.data = processedConfig.processors?.postDataRetProcessor(
//       response.data,
//       processedConfig
//     );
//     // console.debug(
//     //   'interceptor.response.normal - 1 - processedConfig: ',
//     //   processedConfig
//     // );
//     return response;
//   },
//   // async (err): Promise<any> => {
//   async (err) => {
//     console.debug('interceptor.response.err - 1 - err: ', err);
//     let retStatus = err.response?.status;
//     let errorCode = err.code;
//     if (
//       retStatus === 401 ||
//       errorCode == 'ERR_NETWORK' ||
//       (retStatus === 500 && errorCode == 'ERR_CANCELED')
//     ) {
//       const { loginService } = useServiceConfig();

//       // const tokens = loginService.restoreTokens();
//       // const payload = {
//       //   access_token: tokens?.access_token,
//       //   refresh_token: tokens?.refresh_token,
//       // };

//       // let tokenRefreshUrl =
//       //   envConfig.API_PATH_MY_PREFIX +
//       //   envConfig.API_PATH_V1_PUBLIC +
//       //   envConfig.API_OAUTH_REFRESH_TOKEN;
//       // tokenRefreshUrl = tokenRefreshUrl.replace(
//       //   '{0}',
//       //   envConfig.API_OAUTH_CLIENT_NAME
//       // );
//       // console.debug(
//       //   'axiosService - response.use - tokenRefreshUrl: [' +
//       //     tokenRefreshUrl +
//       //     ']'
//       // );
//       // let apiResponse = await axios.post(tokenRefreshUrl, payload);
//       // sessionStorage.setItem('tokens', JSON.stringify(apiResponse.data));

//       try {
//         // const tokensRefreshed = await loginService.doRefreshToken();
//         // if (tokensRefreshed != null) {
//         const refreshTokenResult: any = await loginService.doRefreshToken();
//         console.debug(
//           'interceptor.response.err - 1 - refreshTokenResult: ',
//           refreshTokenResult
//         );
//         if (!(refreshTokenResult instanceof AxiosError)) {
//           const tokensRefreshed = refreshTokenResult;
//           console.debug(
//             'interceptor.response.err - 1 - tokensRefreshed: ',
//             tokensRefreshed
//           );
//           err.config.headers[
//             'Authorization'
//           ] = `Bearer ${tokensRefreshed.access_token}`;
//           //
//           //
//           // the created axios instance (axiosService, not axios) MUST be used.
//           // because the interceptor(s) of request and response are required for the follow-up.
//           //
//           //// return axios(err.config);
//           // const axiosResRefreshed = await axios(err.config);
//           const axiosResRefreshed = await axiosService(err.config);
//           console.debug(
//             `interceptor.response.err - 1 - axiosResRefreshed: `,
//             axiosResRefreshed
//           );
//           return axiosResRefreshed;
//         }
//         console.debug('interceptor.response.err - 1 - end');
//       } catch (doRefreshTokenErr) {
//         console.debug(
//           'interceptor.response.err - 1 - doRefreshTokenErr: ',
//           doRefreshTokenErr
//         );
//         return Promise.reject(doRefreshTokenErr);
//       }
//     } else {
//       return Promise.reject(err);
//     }
//   }
// );
// // axiosService.interceptors.response.use(
// //   (response) => {
// //     console.debug('interceptor.response.normal - 2');
// //     console.debug(
// //       'interceptor.response.normal - 2 - response.config: ',
// //       response.config
// //     );
// //     return response;
// //   },
// //   async (err): Promise<any> => {
// //     console.debug('interceptor.response.err - 2');
// //     console.debug('interceptor.response.err - 2 - err: ', err);
// //     return Promise.reject(err);
// //   }
// // );
// // axiosService.interceptors.response.use(
// //   (response) => {
// //     console.debug('interceptor.response.normal - 3');
// //     console.debug(
// //       'interceptor.response.normal - 3 - response.config: ',
// //       response.config
// //     );
// //     return response;
// //   },
// //   async (err): Promise<any> => {
// //     console.debug('interceptor.response.err - 3');
// //     console.debug('interceptor.response.err - 3 - err: ', err);
// //     return Promise.reject(err);
// //   }
// // );

export default axiosService;
