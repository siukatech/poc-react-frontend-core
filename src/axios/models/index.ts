import type { AxiosError, AxiosResponse } from "axios";

type AxiosErrDetail = {
  errCode?: string;
  errRes?: AxiosResponse<unknown, any>;
  resStatus?: number;
  resReqRes?: any;
  resData?: any;
};

type ResponseErr = {
  status?: number;
  timestamp?: string;
  path?: string;
  errCode?: string;
  message?: string;
  resData?: any;
  handler: ServerErrHandler;
};

type ServerErr = {
  axiosErr: AxiosError;
  responseErr: ResponseErr;
};

type ServerErrHandler = {
  title: string;
  path?: string;
  canLogout: boolean;
};

export type {
  AxiosErrDetail,
  ResponseErr,
  ServerErr,
  ServerErrHandler,
}
