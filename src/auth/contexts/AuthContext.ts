import { AxiosError } from "axios";
import type { User } from "../models";
import { createContext } from "react";
import type { DoCheckPermissionByRegex as DoCheckPermission } from '../services/LoginService';

type AuthContextObj = {
  user?: User;
  // doLogin: (payload: DoAuthLoginPayload) => void;
  doLogout: () => void;
  checkTimeout: () => void;
  checkPermission: DoCheckPermission;
  postLogin: (user?: User) => void;
  timeoutErr?: AxiosError;
};

const AuthContext = createContext<AuthContextObj>({
  // user: undefined,
  // doLogin: () => {},
  doLogout: () => {},
  checkTimeout: () => {},
  checkPermission: () => false,
  postLogin: () => {},
  // timeoutErr: AxiosError,
});

export type {
  AuthContextObj
}
export {
  AuthContext
}
