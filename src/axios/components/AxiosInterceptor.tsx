import React, { useContext, useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios, { 
  // InternalAxiosRequestConfig, 
  AxiosError 
} from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import axiosService from '../services/axiosService';
import {
  // ServerErr,
  isErrAuth401,
  isErrNetwork,
  resolveServerErr,
} from '../services/AxiosErrorHandler';
import type {
  ServerErr,
} from '../services/AxiosErrorHandler';

import type { ProcessorAxiosRequestConfig } from '../processors/ProcessorGeneral';
import { prePublicDataObjProcessor } from '../processors/ProcessorPublic';
import { preProtectedDataObjProcessor } from '../processors/ProcessorProtected';
import { preEncryptedDataObjProcessor } from '../processors/ProcessorEncrypted';

import { useServiceConfig } from '../../app/hooks/useServiceConfig';
import { useAuthContext } from '../../auth/hooks/useAuthContext';
import { clearAuth } from '../../auth/stores/authSlice';
import { DialogPrompt } from '../../ui';
import { useAppDispatch } from '../../layout/stores/hooks';

// enum InterceptorTypeEnum {
//   REQUEST = 'REQUEST',
//   RESPONSE = 'RESPONSE',
// }
const InterceptorTypeEnum = {
  REQUEST: 'REQUEST',
  RESPONSE: 'RESPONSE',
} as const;
type InterceptorTypeEnum = typeof InterceptorTypeEnum[keyof typeof InterceptorTypeEnum];

type InterceptorRecord = {
  id: number;
  key: string;
  type: InterceptorTypeEnum;
  ejected: boolean;
};

type AxiosInterceptorProps = {
  children?: React.ReactNode;
};

const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({ children }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loginErr, setLoginErr] = useState();
  const [serverErr, setServerErr] = useState<ServerErr>();
  const { user, doLogout } = useAuthContext();
  const dispatch = useAppDispatch();
  const { loginService } = useServiceConfig();

  const [interceptorIdMap, setInterceptorIdMap] = useState<any>({});
  const [interceptorRecords, setInterceptorRecords] = useState<
    InterceptorRecord[]
  >([]);
  // axiosService.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
  //axiosService.defaults.headers["Content-Type"] = "application/json";

  // useMemo(() => {
  useEffect(
    () => {
      let isInterceptorRegistered = false;
      // console.debug(`AxiosInterceptor - useEffect - interceptor.request - 1 - axiosService.interceptors: `, axiosService.interceptors);
      const interceptorKey = 'request-1';
      const existingInterceptorId = interceptorIdMap[interceptorKey];
      // console.debug(
      //   `AxiosInterceptor - useEffect - interceptor.request - 1 - existingInterceptorId: [${existingInterceptorId}], interceptorIdMap: `,
      //   interceptorIdMap
      // );
      if (existingInterceptorId == null) {
        // Reference:
        // https://axios-http.com/docs/req_config
        const interceptorId = axiosService.interceptors.request.use(
          (config: InternalAxiosRequestConfig): ProcessorAxiosRequestConfig => {
            let configProcessed = preEncryptedDataObjProcessor(
              config as ProcessorAxiosRequestConfig
            );
            configProcessed.loginService = loginService;
            // console.debug(
            //   `AxiosInterceptor - useEffect - interceptor.request - 1 - configProcessed: `,
            //   configProcessed
            // );
            return configProcessed;
          },
          undefined,
          { synchronous: true }
        );
        // console.debug(
        //   `AxiosInterceptor - useEffect - interceptor.request - 1 - interceptorId: [${interceptorId}], isInterceptorRegistered: [${isInterceptorRegistered}]`
        // );
        setInterceptorIdMap((prev: any) => ({
          ...prev,
          [interceptorKey]: interceptorId,
        }));
        setInterceptorRecords((prev) => {
          prev.push({
            id: interceptorId,
            key: interceptorKey,
            type: InterceptorTypeEnum.REQUEST,
            ejected: false,
          });
          return prev;
        });
      }
      // return interceptorId;
      return () => {
        // axiosService.interceptors.request.eject(interceptorId);
        isInterceptorRegistered = true;
      };
    },
    [
      // interceptorIdMap
    ]
  );

  // useMemo(() => {
  useEffect(
    () => {
      const interceptorKey = 'request-2';
      const existingInterceptorId = interceptorIdMap[interceptorKey];
      // console.debug(
      //   `AxiosInterceptor - useEffect - interceptor.request - 2 - existingInterceptorId: [${existingInterceptorId}], interceptorIdMap: `,
      //   interceptorIdMap
      // );
      if (existingInterceptorId == null) {
        const interceptorId = axiosService.interceptors.request.use(
          (config: InternalAxiosRequestConfig): ProcessorAxiosRequestConfig => {
            let configProcessed = preProtectedDataObjProcessor(
              config as ProcessorAxiosRequestConfig
            );
            configProcessed.loginService = loginService;
            // console.debug(`AxiosInterceptor - useEffect - interceptor.request - 2 - configProcessed: `, configProcessed);
            return configProcessed;
          },
          undefined,
          { synchronous: true }
        );
        // console.debug(
        //   `AxiosInterceptor - useEffect - interceptor.request - 2 - interceptorId: [${interceptorId}]`
        // );
        setInterceptorIdMap((prev: any) => ({
          ...prev,
          [interceptorKey]: interceptorId,
        }));
        setInterceptorRecords((prev) => {
          prev.push({
            id: interceptorId,
            key: interceptorKey,
            type: InterceptorTypeEnum.REQUEST,
            ejected: false,
          });
          return prev;
        });
      }
      // return interceptorId;
      return () => {
        // axiosService.interceptors.request.eject(interceptorId);
      };
    },
    [
      // interceptorIdMap
    ]
  );

  // useMemo(() => {
  useEffect(
    () => {
      const interceptorKey = 'request-3';
      const existingInterceptorId = interceptorIdMap[interceptorKey];
      // console.debug(
      //   `AxiosInterceptor - useEffect - interceptor.request - 3 - existingInterceptorId: [${existingInterceptorId}], interceptorIdMap: `,
      //   interceptorIdMap
      // );
      if (existingInterceptorId == null) {
        const interceptorId = axiosService.interceptors.request.use(
          (config: InternalAxiosRequestConfig): ProcessorAxiosRequestConfig => {
            let configProcessed = prePublicDataObjProcessor(
              config as ProcessorAxiosRequestConfig
            );
            configProcessed.loginService = loginService;
            // console.debug(`AxiosInterceptor - useEffect - interceptor.request - 3 - configProcessed: `, configProcessed);
            return configProcessed;
          },
          undefined,
          { synchronous: true }
        );
        // console.debug(
        //   `AxiosInterceptor - useEffect - interceptor.request - 3 - interceptorId: [${interceptorId}]`
        // );
        setInterceptorIdMap((prev: any) => ({
          ...prev,
          [interceptorKey]: interceptorId,
        }));
        setInterceptorRecords((prev) => {
          prev.push({
            id: interceptorId,
            key: interceptorKey,
            type: InterceptorTypeEnum.REQUEST,
            ejected: false,
          });
          return prev;
        });
      }
      // return interceptorId;
      return () => {
        // axiosService.interceptors.request.eject(interceptorId);
      };
    },
    [
      // interceptorIdMap
    ]
  );

  // useMemo(() => {
  useEffect(
    () => {
      const interceptorKey = 'response-1';
      const existingInterceptorId = interceptorIdMap[interceptorKey];
      // console.debug(
      //   `AxiosInterceptor - useEffect - interceptor.response - 1 - existingInterceptorId: [${existingInterceptorId}], interceptorIdMap: `,
      //   interceptorIdMap
      // );
      if (existingInterceptorId == null) {
        const interceptorId = axiosService.interceptors.response.use(
          (response) => {
            // console.debug(
            //   `AxiosInterceptor - useEffect - interceptor.response.normal - 1 - response: `,
            //   response
            // );
            // console.debug(
            //   `AxiosInterceptor - useEffect - interceptor.response.normal - 1 - length: [${response?.data?.length}], data: `,
            //   response?.data
            // );
            if (response) {
              const processedConfig: ProcessorAxiosRequestConfig =
                response.config as ProcessorAxiosRequestConfig;
              response.data = processedConfig.processors?.postDataRetProcessor(
                response.data,
                processedConfig
              );
            }
            // console.debug(
            //   `AxiosInterceptor - useEffect - interceptor.response.normal - 1 - processedConfig: `,
            //   processedConfig
            // );
            return response;
          },
          // async (err): Promise<any> => {
          async (err) => {
            // console.debug(
            //   `AxiosInterceptor - useEffect - interceptor.response.err - 1 - err: `,
            //   err
            // );
            const serverErr = resolveServerErr(err);
            const { responseErr } = serverErr;
            let retStatus = responseErr?.status;
            let errorCode = responseErr?.errCode;
            const errAuth401 = isErrAuth401(serverErr);
            const errNetwork = isErrNetwork(serverErr);
            console.debug(
              `AxiosInterceptor - useEffect - interceptor.response.err - 1 - retStatus: [${retStatus}]` +
                `, errorCode: [${errorCode}], errAuth401: [${errAuth401}], errNetwork: [${errNetwork}]` +
                `, err: `,
              err
            );
            if (errAuth401) {
              try {
                // const tokensRefreshed = await loginService.doRefreshToken();
                // if (tokensRefreshed != null) {
                const refreshTokenResult: any = await loginService.doRefreshToken();
                // console.debug(
                //   'AxiosInterceptor - useEffect - interceptor.response.err - 1 - 401 - refreshTokenResult: ',
                //   refreshTokenResult
                // );
                if (!(refreshTokenResult instanceof AxiosError)) {
                  const tokensRefreshed = refreshTokenResult;
                  // console.debug(
                  //   'AxiosInterceptor - useEffect - interceptor.response.err - 1 - 401 - tokensRefreshed: ',
                  //   tokensRefreshed
                  // );
                  err.config.headers[
                    'Authorization'
                  ] = `Bearer ${tokensRefreshed.access_token}`;
                  //
                  //
                  // the created axios instance (axiosService, not axios) MUST be used.
                  // because the interceptor(s) of request and response are required for the follow-up.
                  //
                  //// return axios(err.config);
                  // const axiosResRefreshed = await axios(err.config);
                  const axiosResRefreshed = await axiosService(err.config);
                  // console.debug(
                  //   `AxiosInterceptor - useEffect - interceptor.response.err - 1 - 401 - axiosResRefreshed: `,
                  //   axiosResRefreshed
                  // );
                  return axiosResRefreshed;
                }
                // console.debug(
                //   `AxiosInterceptor - useEffect - interceptor.response.err - 1 - 401 - end`
                // );
              } catch (doRefreshTokenErr) {
                const isAxiosError = doRefreshTokenErr instanceof AxiosError;
                // console.debug(
                //   `AxiosInterceptor - useEffect - interceptor.response.err - 1 - 401 - err - isAxiosError: [${isAxiosError}], doRefreshTokenErr`,
                //   doRefreshTokenErr
                // );
                // return Promise.reject(doRefreshTokenErr);
                let rejectData;
                let doRefreshTokenServerErr;
                if (isAxiosError) {
                  rejectData = doRefreshTokenErr.response?.data;
                  doRefreshTokenServerErr = resolveServerErr(doRefreshTokenErr);
                }
                rejectData =
                  !isAxiosError || rejectData == null ? '401' : rejectData;
                // console.debug(
                //   `AxiosInterceptor - useEffect - interceptor.response.err - 1 - rejectData: `,
                //   rejectData
                // );
                setLoginErr(rejectData);
                //
                // console.debug(
                //   `AxiosInterceptor - useEffect - interceptor.response.err - 1 - doRefreshTokenServerErr: `,
                //   doRefreshTokenServerErr
                // );
                setServerErr(doRefreshTokenServerErr);
                //
                // return Promise.reject(rejectData);
                return Promise.reject(err);
              }
            } else {
              setServerErr(serverErr);
              return Promise.reject(err);
            }
          }
        );
        // console.debug(
        //   `AxiosInterceptor - useEffect - interceptor.response - 1 - interceptorId: [${interceptorId}]`
        // );
        setInterceptorIdMap((prev: any) => ({
          ...prev,
          [interceptorKey]: interceptorId,
        }));
        setInterceptorRecords((prev) => {
          prev.push({
            id: interceptorId,
            key: interceptorKey,
            type: InterceptorTypeEnum.RESPONSE,
            ejected: false,
          });
          return prev;
        });
      }
      // return interceptorId;
      return () => {
        // axiosService.interceptors.response.eject(interceptorId);
      };
    },
    [
      // interceptorIdMap, doLogout
    ]
  );

  /**
   * Dont update the interceptorRecords
   * That will cause the redundant update by useEffect failure.
   * And lead to the interceptors' ejection failure.
   */
  useEffect(() => {
    // setInterceptorRecords((prev: InterceptorRecord[]) => {
    // const interceptorRecords = prev;
    // console.debug(
    //   `AxiosInterceptor - useEffect - interceptorRecords - length: [${interceptorRecords.length}]`
    // );
    for (let ccc = 0; ccc < interceptorRecords.length; ccc++) {
      const interceptorRecord = interceptorRecords[ccc];
      const registeredInterceptorId = interceptorIdMap[interceptorRecord.key];
      // console.debug(
      //   `AxiosInterceptor - useEffect - interceptorRecords - ccc: [${ccc}], interceptorRecord: `,
      //   interceptorRecord
      // );
      if (registeredInterceptorId != interceptorRecord.id) {
        if (interceptorRecord.type == InterceptorTypeEnum.REQUEST) {
          axiosService.interceptors.request.eject(interceptorRecord.id);
        } else {
          axiosService.interceptors.response.eject(interceptorRecord.id);
        }
        interceptorRecord.ejected = true;
      }
    }
    const updatedRecords = interceptorRecords.filter((ir) => !ir.ejected);
    // // setInterceptorRecords(updatedRecords);
    // return updatedRecords;
    // });
  }, [interceptorRecords.length]);

  const showDialog = serverErr != null;
  const dialogTitleKey = serverErr ? serverErr.responseErr.handler.title : '';
  const canLogout = serverErr?.responseErr?.handler?.canLogout;
  console.debug(`AxiosInterceptor - showDialog: [${showDialog}], canLogout: [${canLogout}], dialogTitleKey: ${dialogTitleKey}`);

  // console.debug(
  //   `AxiosInterceptor - axiosService.interceptors: `,
  //   axiosService.interceptors
  // );
  // console.debug(`AxiosInterceptor - interceptorRecords: `, interceptorRecords);

  return (
    <>
      {showDialog && (
        <DialogPrompt
          open={true}
          title={`${t(dialogTitleKey)} (${
            serverErr.responseErr.status || serverErr.responseErr.errCode
          })`}
          message={JSON.stringify(serverErr)}
          onOk={() => {
            console.debug(`AxiosInterceptor - DialogPrompt - canLogout: [${canLogout}]`);
            if (canLogout) {
              doLogout();
              dispatch(clearAuth({}));
            }
            const path = serverErr?.responseErr?.handler.path;
            setLoginErr(undefined);
            setServerErr(undefined);
            // if (path) {
            //   navigate(path);
            // }
          }}
        />
      )}
      {children}
    </>
  );
};

export default AxiosInterceptor;
