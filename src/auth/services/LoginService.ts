import type { User, UserPermission, DoAuthLoginPayload } from "../models";
import { restoreJsonStr, saveJsonObj } from '../../utils/storage';

interface DoCheckPermissionByRegex {
  (
    user: undefined | User,
    resourceName: undefined | string,
    accessRights: undefined | string | string[]
  ): boolean;
}

interface LoginService {
  getStorageKeyTokens(): string;
  restoreTokens(): any;
  restoreUser(): User;
  saveTokens(tokens: any): void;
  saveUser(user: User): void;
  clearStorageItems(): void;
  composePermissionPhrase(
    appResourceId: string,
    accessRight: string
  ): string;
  parseResourceName(resourceName: string): string[];
  marshalPermissions(userPermissions: UserPermission[]): any;
  refreshUserInfo(user: any): Promise<void>;
  doCheckTimeout(): Promise<any>;
  doAuthLogin(payload: DoAuthLoginPayload): Promise<User>;
  doRefreshToken(): Promise<any>;
  doAuthLogout(): Promise<void>;
  getAuthLoginUrl(): string;
  doAuthToken(code: string): Promise<User>;
  doCheckPermissionByRegex: DoCheckPermissionByRegex;
  // doCheckPermissionByMap(
  //   user: undefined | User,
  //   resourceName: undefined | string,
  //   accessRights: undefined | string | string[]
  // ): boolean

}

export type {
  LoginService
  , DoCheckPermissionByRegex
}
