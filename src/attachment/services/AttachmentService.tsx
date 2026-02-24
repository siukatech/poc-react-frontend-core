import { uuidv4 } from 'uuidv7';
import { AxiosError, 
  // AxiosProgressEvent
} from 'axios';
import type { AxiosProgressEvent } from 'axios';
import axiosService from '../../axios/services/axiosService';
import { envConfig } from '../../config/envConfig';

import type { Attachment } from '../models';
import { at, bind } from 'lodash';

const API_DOMAIN: string = envConfig.API_PATH_WEB_PREFIX as string;
const API_UPLOAD: string =
  (API_DOMAIN as string) +
  (envConfig.API_PATH_V1_PROTECTED as string) +
  (envConfig.API_PATH_ATTACHMENT_UPLOAD as string) +
  '';
const API_DETAIL: string =
  (API_DOMAIN as string) +
  (envConfig.API_PATH_V1_PROTECTED as string) +
  (envConfig.API_PATH_ATTACHMENT_DETAIL as string) +
  '';
const API_DOWNLOAD: string =
  (API_DOMAIN as string) +
  // (envConfig.API_PATH_V1_PROTECTED as string) +
  (envConfig.API_PATH_V1_PUBLIC as string) +
  (envConfig.API_PATH_ATTACHMENT_DOWNLOAD as string) +
  '';
const API_DELETE: string =
  (API_DOMAIN as string) +
  (envConfig.API_PATH_V1_PROTECTED as string) +
  (envConfig.API_PATH_ATTACHMENT_DELETE as string) +
  '';

let FILE_UPLOAD_MAP: any = {};

const uploadAttachment = async (
  formData: FormData,
  total: number,
  pending: number
): Promise<any> => {
  const handleUploadProgress = (evt: AxiosProgressEvent) => {
    // const percentageEvt = Math.round(100 / evt.loaded / (evt?.total || 1));
    // console.debug(
    //   `AttachmentService - uploadAttachment - handleUploadProgress - evt.loaded: [${evt.loaded}]` +
    //     `, evt?.total: [${evt?.total}], percentageEvt: [${percentageEvt}]`
    // );
    const completed = total - pending;
    // const percentageExt = Math.round(100 / pending / total || 1);
    const percentageExt = Math.round((completed / total) * 100);
    // console.debug(
    //   `AttachmentService - uploadAttachment - handleUploadProgress - pending: [${pending}]` +
    //     `, completed: [${completed}], total: [${total}], pencentage: [${percentageExt}]`
    // );
  };
  try {
    const response = await axiosService.post(`${API_UPLOAD}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // mode: 'cors',
      },
      onUploadProgress: handleUploadProgress,
    });
    if (response instanceof AxiosError) {
      const err = response;
      if (err.response?.data) {
        throw new Error(JSON.stringify(err.response?.data));
      } else throw response;
    }
    return response.data;
  } catch (err) {
    throw err;
  }
};

/**
 * Reference:
 * https://www.bezkoder.com/axios-file-upload/
 * https://youtu.be/YOGgaYUW1OA?t=320
 *
 * @param attachmentList
 * @returns
 */
const uploadAttachmentList = async (attachmentList: Attachment[]) => {
  const readyToUploadList = attachmentList.filter(
    (uploadAttachment) =>
      uploadAttachment.targetFile != null && !uploadAttachment.isUploaded
  );
  const total = readyToUploadList.length;
  let pending = total;
  // console.debug(
  //   `AttachmentService - uploadAttachmentList - total: [${total}]` +
  //     `, pending: [${pending}], readyToUploadList: `,
  //   readyToUploadList
  // );
  // Here uses attachmentList to resolve the full list
  const updatedList: Attachment[] = [];
  for (let ccc = 0; ccc < attachmentList.length; ccc++) {
    const attachment = attachmentList[ccc];
    // console.debug(
    //   `AttachmentService - uploadAttachmentList - ccc: [${ccc}]` +
    //     `, attachment: `,
    //   attachment
    // );
    if (attachment.targetFile && !attachment.isUploaded) {
      let formData: FormData = new FormData();
      formData.append('file', attachment.targetFile);
      formData.append('versionNo', '1');
      try {
        const retData = await uploadAttachment(formData, total, pending);
        if (!retData) {
          throw new Error(`Upload attachment failed`);
        }
        pending--;
        attachment.id = retData.id;
        if (attachment.id) {
          FILE_UPLOAD_MAP[attachment.id.toString()] = attachment;
          // const arrBuf = new Blob([await attachment.targetFile.arrayBuffer()]);
          // FILE_UPLOAD_MAP[attachment.id.toString()] = arrBuf;
        }
        attachment.isUploaded = true;
        attachment.targetFile = undefined;
        updatedList.push(attachment);
      } catch (err) {
        console.error(
          `AttachmentService - uploadAttachmentList - err: `,
          err
        );
        pending--;
        attachment.uploadErr = err;
        attachment.isUploaded = true;
        attachment.targetFile = undefined;
        updatedList.push(attachment);
      }
    } else if (attachment.isUploaded) {
      updatedList.push(attachment);
    }
  }
  return updatedList;
};

const getAttachment = async (id: string): Promise<Attachment> => {
  const apiUrl = API_DETAIL.replace(/\{0\}/g, id);
  const { data } = await axiosService.get(`${apiUrl}`);
  return data as Attachment;
};

/**
 * Reference:
 * https://stackoverflow.com/a/31218143
 * https://stackoverflow.com/a/63965930
 * https://gist.github.com/jbutko/d7b992086634a94e84b6a3e526336da3
 *
 * @param attachment
 * @returns
 */
const downloadAttachment = async (
  attachment: Attachment
): Promise<any> => {
  if (attachment.id) {
    const doDownload = (
      byteArr: ArrayBuffer | Blob,
      attachment: Attachment
    ) => {
      const blob: Blob = new Blob([byteArr], {
        type: attachment.contentType,
      });
      const a = document.createElement('a');

      const url = URL.createObjectURL(blob);
      // console.debug(
      //   `AttachmentService - downloadAttachment - doDownload - url: [${url}]`
      // );
      function handleClick() {
        setTimeout(() => {
          URL.revokeObjectURL(url);
          /* eslint-disable-next-line no-restricted-globals */
          removeEventListener('click', handleClick);
        }, 150);
      }
      a.href = url;
      a.download = attachment.fileName || 'download-file';
      a.addEventListener('click', handleClick);
      a.click();

      // let reader = new FileReader();
      // reader.readAsDataURL(blob); // converts the blob to base64 and calls onload
      // reader.onload = function () {
      //   if (typeof reader.result === 'string') {
      //     a.href = reader.result; // data url
      //     a.click();
      //   }
      // };
    };
    const apiUrl = API_DOWNLOAD.replace(/\{0\}/g, attachment.id.toString());
    const response = await axiosService.get(`${apiUrl}`, {
      // headers: {
      //   'Content-Type': 'application/json',
      //   Accept: attachment.contentType,
      // },
      responseType: 'arraybuffer',
      // responseType: 'blob',
    });
    if (response?.data) {
      // console.debug(
      //   `AttachmentService - downloadAttachment - response.data.length: [${response.data.length}], response.data: `,
      //   response.data
      // );
      doDownload(response.data, attachment);
    } else {
      throw new Error(
        `Attachment not found [${attachment?.id?.toString()}]`
      );
    }
    return void 0;
  } else {
    return Promise.reject(attachment);
  }
};

const binaryStrToArrayBuffer = (binaryStr: string) => {
  let byteArr = null;
  // let binaryLen = binaryStr.length;
  // byteArr = new Uint8Array(binaryLen);
  // for (let ccc = 0; ccc < binaryLen; ccc++) {
  //   let ascii = binaryStr.charCodeAt(ccc);
  //   byteArr[ccc] = ascii;
  // }
  byteArr = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
  return byteArr;
};

const base64ToArrayBuffer = (base64Str: string) => {
  let byteArr = null;
  let binaryStr = atob(base64Str);
  byteArr = binaryStrToArrayBuffer(binaryStr);
  return byteArr;
};

const entityEncode = (arr: Uint8Array) => {
  return Array.from(arr).map((val) => 'U+' + toHex(val));
};
const toHex = (num: number) => {
  return num.toString(16).padStart(4, '0').toUpperCase();
};

const deleteAttachment = async (
  attachment: Attachment
): Promise<any> => {
  if (attachment.id) {
    const apiUrl = API_DELETE.replace(/\{0\}/g, attachment.id?.toString());
    const response = await axiosService.delete(`${apiUrl}`);
    return response;
  } else {
    Promise.reject(attachment);
  }
};

export {
  uploadAttachment,
  uploadAttachmentList,
  getAttachment,
  downloadAttachment,
  deleteAttachment,
};
