import axios, { AxiosError } from "axios";
import jwt_decode from 'jwt-decode';
import type { User, UserPermission, DoAuthLoginPayload } from "../models";
import type { DoCheckPermissionByRegex, LoginService } from "./LoginService";
import { restoreJsonStr, restoreRawStr, saveJsonObj, saveRawStr } from "../../utils/storage";
import { axiosService } from "../../axios";

abstract class AbstractLoginService implements LoginService {

  abstract getStorageKeyTokens(): string;
  abstract getStorageKeyUser(): string;
  abstract getStorageKeys(): string[];
  abstract getApiMyUserInfo(): string;
  abstract getApiMyPermissionInfo(): string;
  abstract getAppName(): string;
  abstract getApiOauthAuthorize(): string;
  abstract getApiOauthClientName(): string;
  abstract getApiOauthRefreshToken(): string;
  abstract getApiOauthLogout(): string;
  abstract getApiOauthToken(): string;

  restoreTokens() {
    return restoreJsonStr(this.getStorageKeyTokens());
  }
  restoreUser(): User {
    // if (sessionStorage.getItem('tokens')) {
    //   let tokens = JSON.parse(sessionStorage.getItem('tokens'));
    //   return jwt_decode(tokens.access_token);
    // }
    const user = restoreJsonStr(this.getStorageKeyUser());
    console.debug(`restoreUser - user: `, user);
    return user;
  }
  saveTokens(tokens: any): void {
    saveJsonObj(this.getStorageKeyTokens(), tokens);
  }
  saveUser(user: User): void {
    saveJsonObj(this.getStorageKeyUser(), user);
  }
  clearStorageItems(): void {
    const storageKeys: string[] = this.getStorageKeys();
    for (const storageKey of storageKeys) {
      sessionStorage.removeItem(storageKey);
    }
  }
  composePermissionPhrase(appResourceId: string, accessRight: string): string {
    // console.debug(`composePermissionPhrase - start`);
    const permissionPhrase = `${appResourceId}:${accessRight}`;
    console.debug(`composePermissionPhrase - permissionPhrase: [${permissionPhrase}]`);
    return permissionPhrase;
  }
  parseResourceName(resourceName: string): string[] {
    const resourceParts = resourceName.split('.');
    return resourceParts;
  }
  marshalPermissions(userPermissions: UserPermission[]) {
    let permissions: any = {};
    for (let ppp = 0; ppp < userPermissions.length; ppp++) {
      const userPermission = userPermissions[ppp];
      const permissionPhrase = this.composePermissionPhrase(
        userPermission.appResourceId,
        userPermission.accessRight
      );
      // const resourceParts = parseResourceName(userPermission.appResourceId);
      // permissions[resourceParts[0]] =
      //   permissions[resourceParts[0]] == null
      //     ? {}
      //     : permissions[resourceParts[0]];
      // permissions[resourceParts[0]][permissionPhrase] = userPermission;
      permissions[userPermission.applicationId] =
        permissions[userPermission.applicationId] == null
          ? {}
          : permissions[userPermission.applicationId];
      permissions[userPermission.applicationId][permissionPhrase] = userPermission;
    }
    return permissions;
  }
  async refreshUserInfo(user: any): Promise<void> {
    try {
      if (user != null) {
        //
        // tokens MUST be saved to the sessionStorage before my-user-info api called
        // extract the result.data and rename to myUserInfo
        const { data: myUserInfo } = await axiosService.get(this.getApiMyUserInfo());
        // const myUserInfo = myUserInfoRes.data;
        //
        const appName = this.getAppName();
        let myPermissionInfoApi = this.getApiMyPermissionInfo();
        myPermissionInfoApi = myPermissionInfoApi.replace(
          '{0}',
          appName
        );
        const { data: myPermissionInfo } = await axiosService.get(
          myPermissionInfoApi
        );
        const myUserPermissions = myPermissionInfo.userPermissionList;
        for (const key in myUserInfo) {
          user[key] = myUserInfo[key];
        }
        user['permissions'] = this.marshalPermissions(myUserPermissions);
        this.saveUser(user);
      } else {
        new AxiosError('Invalid login', AxiosError.ERR_BAD_REQUEST);
      }
    } catch (err) {
      console.error(`LoginService - refreshUserInfo - err: `, err);
      this.clearStorageItems();
      throw err;
    }
  }
  async doCheckTimeout(): Promise<any> {
    const tokens = this.restoreTokens();
    // console.debug('LoginService - doCheckTimeout - start - tokens: ', tokens);
    if (tokens != null) {
      try {
        let user = this.restoreUser();
        await this.refreshUserInfo(user);
        user = this.restoreUser();
      } catch (err) {
        // console.error('LoginService - doCheckTimeout - err: ', err);
        // clearStorageItems();
        // throw new AxiosError('Login timeout', AxiosError.ERR_CANCELED);
        // return Promise.reject(new AxiosError('Login timeout', AxiosError.ERR_CANCELED));
        return new AxiosError('Login timeout', AxiosError.ERR_CANCELED);
      }
    } else {
      // clearStorageItems();
      // throw new AxiosError('Access denied', AxiosError.ERR_BAD_REQUEST);
      // return Promise.reject(new AxiosError('Access denied', AxiosError.ERR_BAD_REQUEST));
      return new AxiosError('Access denied', AxiosError.ERR_BAD_REQUEST);
    }
    // console.debug('LoginService - doCheckTimeout - end');
  }
  async doAuthLogin(payload: DoAuthLoginPayload): Promise<User> {
    let oauthAuthorizeApi = this.getApiOauthAuthorize();

    // oauthAuthorizeApi += '/realms/react-backend-realm/protocol/openid-connect/token?client_id={client_id}&redirect_uri=http://localhost:3000/redirect&grant_type={grant_type}&code_verifier=${codeVerifier}&method=SHA-256';
    oauthAuthorizeApi = oauthAuthorizeApi.replace(
      '{0}',
      this.getApiOauthClientName()
    );
    // console.debug(
    //   'LoginService - doAuthLoginToStorage - oauthAuthorizeApi: [' +
    //     oauthAuthorizeApi +
    //     ']'
    // );
    const apiResponse = await axios.post(oauthAuthorizeApi, payload);
    const tokens = apiResponse.data;
    this.saveTokens(tokens);
    // console.debug('LoginService - doAuthLoginToStorage - tokens: ', tokens);
    //
    let user: any = jwt_decode(tokens.access_token);
    await this.refreshUserInfo(user);
    user = this.restoreUser();
    return user;
  }
  async doRefreshToken(): Promise<any> {
    const tokens = this.restoreTokens();
    const payload = {
      access_token: tokens?.access_token,
      refresh_token: tokens?.refresh_token,
    };

    let oauthRefreshTokenApi = this.getApiOauthRefreshToken();
    oauthRefreshTokenApi = oauthRefreshTokenApi.replace(
      '{0}',
      this.getApiOauthClientName()
    );
    // console.debug(
    //   'LoginService - doRefreshToken - oauthRefreshTokenApi: [' +
    //     oauthRefreshTokenApi +
    //     ']'
    // );
    try {
      const apiResponse = await axios.post(oauthRefreshTokenApi, payload);
      // console.debug('LoginService - doRefreshToken - apiResponse: ', apiResponse);
      const tokensRefreshed = apiResponse.data;
      // console.debug(
      //   'LoginService - doRefreshToken - tokensRefreshed 1: ',
      //   tokensRefreshed
      // );
      this.saveTokens(tokensRefreshed);
      // console.debug(
      //   'LoginService - doRefreshToken - tokensRefreshed 2: ',
      //   tokensRefreshed
      // );
      return tokensRefreshed;
    } catch (err) {
      console.error('LoginService - doRefreshToken - err: ', err);

      this.clearStorageItems();

      // return err as AxiosError;
      throw err;
    }
  }
  async doAuthLogout(): Promise<void> {
    // console.debug('LoginService - doAuthLogout - start');
    const tokens = this.restoreTokens();
    if (tokens != null) {
      try {
        let apiResponse = await axios.post(
          this.getApiOauthLogout(),
          {},
          {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          }
        );
        // console.debug('LoginService - doAuthLogout - apiResponse: ', apiResponse);
        this.clearStorageItems();
      } catch (err) {
        // console.debug('LoginService - doAuthLogout - err: ', err);
        this.clearStorageItems();
      }
    }
  }
  getAuthLoginUrl(): string {
    let oauthAuthorizeApi = this.getApiOauthAuthorize();
    oauthAuthorizeApi = oauthAuthorizeApi.replace(
      '{0}',
      this.getApiOauthClientName()
    );
    //
    //
    // codeVerifier and codeChallenge online generator
    // https://tonyxu-io.github.io/pkce-generator/
    //
    // Randomstring and uuidv4 are not ok, cannot use for codeVerifier
    // const codeVerifier = base64URLEncode(Randomstring.generate());
    // const codeVerifier = base64URLEncode(uuidv4());
    // CryptoJS.lib.WordArray.random is the ONLY option for codeVerifier
    const codeVerifier = CryptoJS.lib.WordArray.random(32).toString(
      CryptoJS.enc.Base64url
    );
    const codeChallenge = CryptoJS.SHA256(codeVerifier).toString(
      CryptoJS.enc.Base64url
    ); // here should use CryptoJS.enc.Base64url for url not CryptoJS.enc.Base64
    console.debug('getAuthLoginUrl - codeVerifier: [' + codeVerifier + ']');
    console.debug('getAuthLoginUrl - codeChallenge: [' + codeChallenge + ']');
    let authLoginUrl =
      oauthAuthorizeApi + '?' + 'codeChallenge={0}'.replace('{0}', codeChallenge);
    saveRawStr('CODE_VERIFIER', codeVerifier);
    saveRawStr('CODE_CHALLENGE', codeChallenge);
    return authLoginUrl;
  }
  async doAuthToken(code: string): Promise<User> {
    let oauthTokenApi = this.getApiOauthToken();

    // oauthAuthorizeApi += '/realms/react-backend-realm/protocol/openid-connect/token?client_id={client_id}&redirect_uri=http://localhost:3000/redirect&grant_type={grant_type}&code_verifier=${codeVerifier}&method=SHA-256';
    oauthTokenApi = oauthTokenApi
      .replace('{0}', this.getApiOauthClientName())
      .replace('{1}', code);
    const codeVerifier = restoreRawStr('CODE_VERIFIER');
    const codeChallenge = restoreRawStr('CODE_CHALLENGE');
    console.debug(
      'doAuthToken - oauthTokenApi: [' +
        oauthTokenApi +
        '], codeVerifier: [' +
        codeVerifier +
        '], codeChallenge: [' +
        codeChallenge +
        ']'
    );
    const apiResponse = await axios.post(oauthTokenApi, null, {
      params: {
        codeVerifier: codeVerifier,
      },
    });
    const tokens = apiResponse.data;
    this.saveTokens(tokens);
    // console.debug('LoginService - doAuthLoginToStorage - tokens: ', tokens);
    //
    let user: any = jwt_decode(tokens.access_token);
    await this.refreshUserInfo(user);
    user = this.restoreUser();
    return user;
  }

  /**
   * @description using iteration of the userPermissions' keys, performance will be an issue.
   * this is because the total number of userPermission depends on the permission granted of user, no guarantee.
   * so there is a split to group the userPermission by resourcePart[0], e.g. application.xxx.yyy, 'application' is the group.
   *
   * @example <caption>Test code of regex template 1.</caption>
   * // true
   * const regexTmpl = `ip-enduser-app.*.submissions:*`
   * .replaceAll(`.`, `\\.`)
   * .replaceAll(`*`, `[\\w\\W]+`);
   * const regexTester = new RegExp(regexTmpl, 'g');
   * const regexResult = regexTester.test('ip-enduser-app.mainMeun.submissions:view');
   * console.debug(`regexTmpl: [${regexTmpl}], regexResult: [${regexResult}]`);
   * @example <caption>Test code of regex template 2.</caption>
   * // false
   * const regexTmpl = `ip-enduser-app.*.submissions:create`
   * .replaceAll(`.`, `\\.`)
   * .replaceAll(`*`, `[\\w\\W]+`);
   * const regexTester = new RegExp(regexTmpl, 'g');
   * const regexResult = regexTester.test('ip-enduser-app.mainMeun.submissions:view');
   * console.debug(`regexTmpl: [${regexTmpl}], regexResult: [${regexResult}]`);
   *
   * @param user
   * @param resourceName
   * @param accessRights
   * @returns
   */
  doCheckPermissionByRegex: DoCheckPermissionByRegex = (user: undefined | User, resourceName: undefined | string, accessRights: undefined | string | string[]): boolean => {
    let hasPermission = false;
    if (user != null && resourceName != null && accessRights != null) {
      accessRights =
        typeof accessRights === 'string' ? [accessRights] : accessRights;
      const matchedPermissions: any[] = [];
      for (let ccc = 0; ccc < accessRights.length; ccc++) {
        const accessRight = accessRights[ccc];
        const resourcePhrase = this.composePermissionPhrase(resourceName, accessRight); // e.g. 'application.group.item:view'
        const userPermissions = user.permissions == null ? {} : user.permissions;
        // for...in - array
        // for...of - object
        // const resourceParts = parseResourceName(resourceName);
        // const resourcePartPermissions =
        //   userPermissions[resourceParts[0]] == null
        //     ? {}
        //     : userPermissions[resourceParts[0]];
        const appName = this.getAppName();
        const resourcePartPermissions =
          userPermissions[appName] == null ? {} : userPermissions[appName];
        // console.debug(
        //   `LoginService - doCheckPermissionByRegex - appName: [${appName}], resourceName: [${resourceName}], accessRight: [${accessRight}], resourcePartPermissions: `,
        //   resourcePartPermissions
        // );
        for (const permissionPhrase in resourcePartPermissions) {
          const userPermission = resourcePartPermissions[permissionPhrase];
          const regexTmpl = permissionPhrase
            .replaceAll(`.`, `\\.`)
            .replaceAll(`*`, `[\\w\\W]+`);
          const regexTester = new RegExp(regexTmpl, 'g');
          const regexResult = regexTester.test(resourcePhrase);
          // console.debug(
          //   `LoginService - doCheckPermissionByRegex - resourcePhrase: [${resourcePhrase}], regexTmpl: [${regexTmpl}], regexResult: [${regexResult}]`
          // );
          if (regexResult) {
            matchedPermissions.push({
              resourcePhrase,
              permissionPhrase,
              regexTmpl,
              userPermission,
            });
          }
        }
      }
      hasPermission = matchedPermissions.length > 0;
    }
    // console.debug(
    //   `LoginService - doCheckPermissionByRegex - hasPermission: [${hasPermission}], resourceName: [${resourceName}], accessRight: [${accessRights}]`
    // );
    return hasPermission;
  }

  // //parseResourceName
  // doCheckPermissionByMap(
  //   user: undefined | User,
  //   resourceName: undefined | string,
  //   accessRights: undefined | string | string[]
  // ): boolean {
  //   let hasPermission = false;
  //   if (user != null && resourceName != null && accessRights != null) {
  //     accessRights =
  //       typeof accessRights === 'string' ? [accessRights] : accessRights;
  //     const matchedPermissions: any[] = [];
  //     for (let ccc = 0; ccc < accessRights.length; ccc++) {
  //       const accessRight = accessRights[ccc];
  //       const resourcePhrase = this.composePermissionPhrase(resourceName, accessRight); // e.g. 'application.group.item:view'
  //       const userPermissions = user.permissions == null ? {} : user.permissions;
  //       // const resourceParts = parseResourceName(resourceName);
  //       // 2 to the 2 power.
  //       // application.group
  //       // application.*
  //       // *.group
  //       // *.*
  //       //
  //       // 2 to the 3 power.
  //       // application.group.item
  //       // application.group.*
  //       // application.*.item
  //       // application.*.*
  //       // *.group.item
  //       // *.group.*
  //       // *.*.item
  //       // *.*.*
  //       //
  //       // 2 to the 4 power.
  //       // application.type.group.item
  //       // application.type.group.*
  //       // application.type.*.item
  //       // application.type.*.*
  //       // application.*.group.item
  //       // application.*.group.*
  //       // application.*.*.item
  //       // application.*.*.*
  //       // *.type.group.item
  //       // *.type.group.*
  //       // *.type.*.item
  //       // *.type.*.*
  //       // *.*.group.item
  //       // *.*.group.*
  //       // *.*.*.item
  //       // *.*.*.*
  //       //
  //       // for...in - array
  //       // for...of - object
  //       //
  //       const resourceParts = ['application', 'menu', 'items'];
  //       const possibleResourceNames = [];
  //       for (let rrr1 = 0; rrr1 < resourceParts.length; rrr1++) {
  //         const refinedParts1 = [];
  //         const refinedParts2 = [];
  //         const refinedParts3 = [];
  //         const resourcePart1 = resourceParts[rrr1];
  //         for (let rrr2 = 0; rrr2 < rrr1; rrr2++) {
  //           const resourcePart2 = resourceParts[rrr2];
  //           refinedParts1.push(resourcePart2);
  //           refinedParts2.push(resourcePart2);
  //           refinedParts3.push(`*`);
  //         }
  //         refinedParts1.push(resourcePart1);
  //         refinedParts2.push(`*`);
  //         refinedParts3.push(`*`);
  //         for (let rrr3 = rrr1 + 1; rrr3 < resourceParts.length; rrr3++) {
  //           const resourcePart3 = resourceParts[rrr3];
  //           refinedParts1.push(resourcePart3);
  //           refinedParts2.push(`*`);
  //           refinedParts3.push(`*`);
  //         }
  //         possibleResourceNames.push(`${refinedParts1.join('.')}:*`);
  //         possibleResourceNames.push(`${refinedParts2.join('.')}:*`);
  //       }
  //       console.debug(
  //         `LoginService - doCheckPermissionByMap - possibleResourceNames: `,
  //         possibleResourceNames
  //       );

  //       // const resourceParts: string[] = ['menu', 'items'];
  //       // const possibleResourceNames: string[] = [];
  //       // for (let rrr1 = 0; rrr1 < resourceParts.length; rrr1++) {
  //       //   const refinedParts: string[] = [];
  //       //   const resourcePart1 = resourceParts[rrr1];
  //       //   for (let rrr2 = 0; rrr2 < rrr1; rrr2++) {
  //       //     const resourcePart2 = resourceParts[rrr2];
  //       //     refinedParts.push(resourcePart2);
  //       //   }
  //       //   refinedParts.push(`*`);
  //       //   for (let rrr3 = rrr1; rrr3 < resourceParts.length; rrr3++) {
  //       //     const resourcePart3 = resourceParts[rrr3];
  //       //     refinedParts.push(resourcePart3);
  //       //   }
  //       //   possibleResourceNames.push(`${refinedParts.join('.')}:${accessRight}`);
  //       //   possibleResourceNames.push(`${refinedParts.join('.')}:*`);
  //       // }
  //       // console.debug(`LoginService - doCheckPermissionByMap - possibleResourceNames: `, possibleResourceNames);
  //     }
  //     hasPermission = matchedPermissions.length > 0;
  //   }
  //   console.debug(
  //     `LoginService - doCheckPermissionByMap - hasPermission: [${hasPermission}]`
  //   );
  //   return hasPermission;
  // };

}

export {
  AbstractLoginService
}


