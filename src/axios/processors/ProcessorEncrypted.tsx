// import { deepMergeObject } from '../../utils/object';

import { JSEncrypt } from 'jsencrypt';
//import JSEncrypt from 'encryptlong';
import CryptoJS from 'crypto-js';
import Randomstring from 'randomstring';
import axios
// , { AxiosRequestTransformer } 
from 'axios';
import type { AxiosRequestTransformer } from 'axios';

import {
  // ProcessorAxiosRequestConfig,
  initReqConfigProcessors,
} from './ProcessorGeneral';
import type {
  ProcessorAxiosRequestConfig,
} from './ProcessorGeneral';
import {
  preProtectedDataObjProcessor,
  postProtectedDataRetProcessor,
} from './ProcessorProtected';

import { envConfig } from '../../config/envConfig';

const HEADER_X_DATA_ENC_INFO = "X-Data-Enc-Info";

const preEncryptedDataObjProcessor = (
  reqConfig: ProcessorAxiosRequestConfig
): ProcessorAxiosRequestConfig => {
  //
  reqConfig = preProtectedDataObjProcessor(reqConfig);
  //
  const apiEncryptedUriPrefix: string = envConfig.API_PREFIX_ENCRYPTED as string;
    // console.debug(`processor-encrypted - preEncryptedDataObjProcessor - start`);
  if (reqConfig.url != null && reqConfig.url.indexOf(apiEncryptedUriPrefix) >= 0) {
    // reqConfig.processors = deepMergeObject(
    //   reqConfig.processors,
    //   {
    //     postDataRetProcessor: postEncryptedDataRetProcessor,
    //   },
    // );
    if (reqConfig === null) reqConfig = initReqConfigProcessors(reqConfig);
    if (reqConfig.processors != null) {
      reqConfig.processors.postDataRetProcessor = postEncryptedDataRetProcessor;
    }
    const transformRequestForEncryption = (data: any, headers: any) => {
      return JSON.parse(data);
    }
    const transformRequests: AxiosRequestTransformer[] = new Array<AxiosRequestTransformer>();
    if (Array.isArray(axios.defaults.transformRequest)) transformRequests.concat(axios.defaults.transformRequest);
    else if (axios.defaults.transformRequest != null) transformRequests.push(axios.defaults.transformRequest);
    transformRequests.push(transformRequestForEncryption);
    reqConfig.transformRequest = transformRequests;

    const dataObj = reqConfig.data;
    const dataObjStr = dataObj == null ? '' : JSON.stringify(dataObj);
    // console.debug(`processor-encrypted - preEncryptedDataObjProcessor - dataObj: `, dataObj);
    // console.debug(`processor-encrypted - preEncryptedDataObjProcessor - dataObjStr: `, dataObjStr);
    const userStr: string = sessionStorage.getItem('user') as string;
    const user: any = JSON.parse(userStr);
    const publicKeyBase64: string = user?.publicKey;
    const randomstring = Randomstring.generate();
    const aesKeyHash = CryptoJS.SHA3(randomstring, { outputLength: 512 }); // should be something in memory
    const aesKeyBase64 = aesKeyHash.toString(CryptoJS.enc.Base64);
    const encoder = new JSEncrypt();
    encoder.setPublicKey(publicKeyBase64);
    const cipherDataParams = CryptoJS.AES.encrypt(dataObjStr, aesKeyBase64);
    const cipherInfo = {
      key: cipherDataParams.key.toString(CryptoJS.enc.Base64),
      iv: cipherDataParams.iv.toString(CryptoJS.enc.Base64),
      salt: cipherDataParams.salt.toString(CryptoJS.enc.Base64),
    };
    const cipherInfoStr = JSON.stringify(cipherInfo);
    const cipherInfoRsa = encoder.encrypt(cipherInfoStr);
    let cipherSeparator = '';
    // cipherSeparator = '|||';
    const encryptedData =
      dataObj == null
        ? ''
        : cipherDataParams.ciphertext.toString(CryptoJS.enc.Base64);
    const encryptedBodyRaw = cipherInfoRsa + cipherSeparator + encryptedData;
    const encryptedHeaderRaw = cipherInfoRsa + cipherSeparator;
    // Wa = WordArray
    const encryptedBodyWa = CryptoJS.enc.Utf8.parse(encryptedBodyRaw);
    const encryptedHeaderWa = CryptoJS.enc.Utf8.parse(encryptedHeaderRaw);
    const encryptedBody = CryptoJS.enc.Base64.stringify(encryptedBodyWa);
    const encryptedHeader = CryptoJS.enc.Base64.stringify(encryptedHeaderWa);

    // console.debug(
    //   'preEncryptedDataObjProcessor - typeof cipherInfoRsa: [' +
    //     typeof cipherInfoRsa +
    //     '], cipherInfoRsa.length: [' +
    //     (typeof cipherInfoRsa === 'string'
    //       ? cipherInfoRsa.length
    //       : cipherInfoRsa) +
    //     '], cipherInfoRsa: [' +
    //     cipherInfoRsa +
    //     '], encryptedData: [' +
    //     encryptedData +
    //     ']'
    // );

    // const reqConfig = deepMergeObject(
    //   {
    //     data: dataObj == null ? null : encryptedBody,
    //     headers: {
    //       [HEADER_X_DATA_ENC_INFO]: encryptedHeader,
    //     },
    //     cipherInfo: cipherInfo,
    //   },
    //   reqConfig
    // );
    reqConfig.data = dataObj == null ? null : encryptedBody;
    reqConfig.data = dataObj == null ? null : JSON.stringify(encryptedBody);
    reqConfig.headers[HEADER_X_DATA_ENC_INFO] = encryptedHeader;
    reqConfig.cipherInfo = cipherInfo;
  }
  return reqConfig;
};

const postEncryptedDataRetProcessor = (
  dataRet: any,
  reqConfig: ProcessorAxiosRequestConfig
): any => {
  // console.debug('postEncryptedDataRetProcessor - start');
  // console.debug('postEncryptedDataRetProcessor - dataRet: [' + dataRet + ']');
  const cipherInfo = reqConfig['cipherInfo'];
  if (dataRet != null && typeof dataRet === 'string' && cipherInfo != null) {
    // const encryptedData = {
    //   ct: dataRet,
    //   iv: cipherInfo.iv,
    //   s: cipherInfo.salt,
    // }
    // const encryptedRsaDataStr = dataRet;
    // const publicKeyBase64 = sessionStorage.getItem('publicKeyBase64');
    // const encoder = new JSEncrypt();
    // //encoder.setPublicKey(publicKeyBase64);
    // encoder.setPrivateKey(publicKeyBase64);
    // const decryptedDataBase64 = encoder.decrypt(encryptedRsaDataStr);
    const decryptedDataBase64 = dataRet;
    // console.debug(`processor-encrypted - postEncryptedDataRetProcessor - decryptedDataBase64: `, decryptedDataBase64);

    // Reference:
    // https://github.com/kyungw00k/encrypt-something-in-java-and-decrypt-it-in-javascript-by-example
    const encryptedAesData = CryptoJS.enc.Base64.parse(decryptedDataBase64);
    const decodedKey = CryptoJS.enc.Base64.parse(cipherInfo.key);
    const decodedKeyStr = decodedKey.toString(CryptoJS.enc.Base64);
    const decodedIv = CryptoJS.enc.Base64.parse(cipherInfo.iv);
    const decryptedData = CryptoJS.AES.decrypt(
      // { ciphertext: encryptedAesData },
      CryptoJS.lib.CipherParams.create({ ciphertext: encryptedAesData }),
      decodedKey,
      {
        // mode: CryptoJS.mode.ECB,
        mode: CryptoJS.mode.CBC,
        iv: decodedIv,
      }
    );
    const dataStr = decryptedData.toString(CryptoJS.enc.Utf8);
    // console.debug(
    //   'requestPublicRecord - dataRet: [' +
    //     dataRet +
    //     '], cipherInfo: [' +
    //     JSON.stringify(cipherInfo) +
    //     '], decryptedData: [' +
    //     decryptedData +
    //     '], dataStr: [' +
    //     dataStr +
    //     ']'
    // );
    dataRet = JSON.parse(dataStr);
  } else {
    //dataRet = dataRet;
  }
  // console.debug('postEncryptedDataRetProcessor - end');
  return postProtectedDataRetProcessor(dataRet, reqConfig);
};

export { preEncryptedDataObjProcessor, postEncryptedDataRetProcessor };
