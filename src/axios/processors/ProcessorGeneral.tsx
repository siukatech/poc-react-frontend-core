import type { LoginService } from '../../auth';
import { parseDateToUtc, parseUtcToDate } from '../../utils/date';
// import { deepMergeObject } from '../../utils/object';

import type { InternalAxiosRequestConfig } from 'axios';

import { envConfig } from '../../config/envConfig';

const marshellDataObj = (dataObj: any) => {
  dataObj = marshallDateStr2DateObj(dataObj);
  return dataObj;
};

const marshallDateStr2DateObj = (dataObj: any) => {
  let keyList = [];
  let valueList = [];
  for (const key in dataObj) {
    if (
      key.toLocaleLowerCase().indexOf('date') >= 0 ||
      key.toLocaleLowerCase().indexOf('datetime') >= 0
    ) {
      keyList.push(key);
      valueList.push(dataObj[key]);
    }
  }
  keyList.forEach((key, i) => {
    try {
      const dataValOri = dataObj[key];
      if (dataValOri != null) {
        console.debug(
          'processor-general - marshallDate2DateObj - i: [' + i + '], key: [' + key + '], dataValOri: ',
          dataValOri
        );
      }
      // const dataVal = dataValOri == null ? null : parseDateToUtc(dataValOri);
      const dataVal = dataValOri == null ? null : parseUtcToDate(dataValOri);
      // console.debug(
      //   'processor-general - marshallDate2DateObj - i: [' + i + '], key: [' + key + '], dataVal: ',
      //   dataVal
      // );
      dataObj[key + '-ori'] = dataValOri;
      dataObj[key] = dataVal;
    } catch (err) {
      console.error(
        'lib/api - marshallDateStr2DateObj - i: [' +
          i +
          '], key: [' +
          key +
          '], err: [' +
          err +
          ']'
      );
    }
  });
  return dataObj;
};

///////////////////////////////////////////////////////////////////////////////

interface ProcessorAxiosRequestConfig<D = any>
  extends InternalAxiosRequestConfig<D> {
  cipherInfo?: {
    key: any;
    iv: any;
    salt: any;
  };
  interceptors?: {};
  processors?: {
    preDataObjProcessor: (
      reqConfig: ProcessorAxiosRequestConfig
    ) => ProcessorAxiosRequestConfig;
    postDataRetProcessor: (
      dataRet: any,
      reqConfig: ProcessorAxiosRequestConfig
    ) => ProcessorAxiosRequestConfig;
  };
  loginService?: LoginService;
}

///////////////////////////////////////////////////////////////////////////////

const initReqConfigProcessors = (
  reqConfig: ProcessorAxiosRequestConfig
): ProcessorAxiosRequestConfig => {
  reqConfig.processors =
    reqConfig.processors == null
      ? {
          preDataObjProcessor: (reqConfig: ProcessorAxiosRequestConfig) =>
            reqConfig,
          postDataRetProcessor: postDataRetProcessor,
        }
      : reqConfig.processors;
  return reqConfig;
};

///////////////////////////////////////////////////////////////////////////////

const preDataObjProcessor = (
  reqConfig: ProcessorAxiosRequestConfig
): ProcessorAxiosRequestConfig => {
  reqConfig = initReqConfigProcessors(reqConfig);
  return reqConfig;
};

///////////////////////////////////////////////////////////////////////////////

const postDataRetProcessor = (
  // dataRet: object[] | string | object,
  dataRet: any,
  reqConfig: ProcessorAxiosRequestConfig
  // ): object[] | string | object => {
): any => {
  if (dataRet != null) {
    const typeofStr = typeof dataRet;
    // console.debug(`postDataRetProcessor - typeof: [${typeofStr}]`);
    if (Array.isArray(dataRet)) {
      return postDataArrayProcessor(dataRet, reqConfig);
    } else if (typeof dataRet === 'string') {
      return postDataStringProcessor(dataRet, reqConfig);
    } else if (dataRet instanceof ArrayBuffer || dataRet instanceof Blob) {
      // This is the critical part!!! The ArrayBuffer cannot be modified for download
      return postDataBinaryProcessor(dataRet, reqConfig);
    } else {
      return postDataObjProcessor(dataRet, reqConfig);
    }
  }
};

const postDataArrayProcessor = (
  dataRet: object[],
  reqConfig: ProcessorAxiosRequestConfig
): object[] => {
  const loadedList = [];
  for (const key in dataRet) {
    const dataObj = {
      id: key,
      ...dataRet[key],
    };
    loadedList.push(marshellDataObj(dataObj));
  }
  return loadedList;
};

const postDataStringProcessor = (
  dataRet: string,
  reqConfig: ProcessorAxiosRequestConfig
): string => {
  return dataRet;
};

const postDataObjProcessor = (
  dataRet: object,
  reqConfig: ProcessorAxiosRequestConfig
): object => {
  const loadedObj = marshellDataObj({ ...dataRet });
  return loadedObj;
};

/**
 * This is the critical part!!! The ArrayBuffer cannot be modified for download
 *
 * @param dataRet
 * @param reqConfig
 * @returns
 */
const postDataBinaryProcessor = (
  dataRet: ArrayBuffer | Blob,
  reqConfig: ProcessorAxiosRequestConfig
): ArrayBuffer | Blob => {
  return dataRet;
};

export { preDataObjProcessor, postDataRetProcessor, initReqConfigProcessors };
export type { ProcessorAxiosRequestConfig };
