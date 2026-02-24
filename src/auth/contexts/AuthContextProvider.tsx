import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import jwt_decode from 'jwt-decode';
import axios, { AxiosError } from 'axios';

import { envConfig } from '../../config/envConfig';
import { useServiceConfig } from '../../app/hooks/useServiceConfig';
import type { User, DoAuthLoginPayload } from '../models';
import { AuthContext } from './AuthContext';

const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { loginService } = useServiceConfig();
  const [user, setUser] = useState<User | undefined>(() => {
    // // if (sessionStorage.getItem('tokens')) {
    // //   let tokens = JSON.parse(sessionStorage.getItem('tokens'));
    // //   return jwt_decode(tokens.access_token);
    // // }
    // const userStr = sessionStorage.getItem('user');
    // if (userStr) {
    //   let user = JSON.parse(userStr);
    //   return user;
    // }
    // return null;
    return loginService.restoreUser();
  });
  const [timeoutErr, setTimeoutErr] = useState<any>(null);

  useEffect(() => {
    if (user != null) {
      const fetchData = async () => {
        try {
          // // await checkTimeout();
          await checkTimeout();
          // try {
          //   checkTimeout();
          // } catch (err) {
          //   console.error('ProtectedResource - useEffect - err 1: ', err);
          //   setTimeoutErr(err);
          // }
        } catch (err) {
          console.error('ProtectedResource - useEffect - 2 - err: ', err);
          setTimeoutErr(err);
        }
      };
      fetchData();
      // .catch((reject) => {
      //   console.error('ProtectedResource - useEffect - reject 2: ', reject);
      //   (reject as Promise<AxiosError>).then((err) => setTimeoutErr(err));
      //   // setTimeoutErr(err);
      // })
      // try {
      //   checkTimeout();
      // } catch (err) {
      //   console.error('ProtectedResource - useEffect - err: ', err);
      //   setTimeoutErr(err);
      // }
    }
  }, [user]);

  const doLogin = async (payload: DoAuthLoginPayload) => {
    // let authCodeLoginUrl =
    //   envConfig.API_PATH_MY_PREFIX +
    //   envConfig.API_PATH_V1_PUBLIC +
    //   envConfig.API_OAUTH_AUTHORIZE;
    // // authCodeLoginUrl += '/realms/react-backend-realm/protocol/openid-connect/token?client_id={client_id}&redirect_uri=http://localhost:3000/redirect&grant_type={grant_type}&code_verifier=${codeVerifier}&method=SHA-256';
    // authCodeLoginUrl = authCodeLoginUrl.replace(
    //   '{0}',
    //   envConfig.API_OAUTH_CLIENT_NAME
    // );
    // console.debug(
    //   'AuthContextProvider - login - authCodeLoginUrl: [' +
    //     authCodeLoginUrl +
    //     ']'
    // );
    // const apiResponse = await axios.post(authCodeLoginUrl, payload);
    // const tokens = apiResponse.data;
    // sessionStorage.setItem('tokens', JSON.stringify(tokens));
    // //
    // // tokens MUST be saved to the sessionStorage before my-user-info api called
    // let myUserInfoUrl = envConfig.API_PATH_MY_PREFIX +
    // envConfig.API_PATH_V1_PROTECTED +
    // envConfig.API_PATH_MY_USER_INFO;
    // const myUserInfoRes = await axiosService.post(myUserInfoUrl);
    // const myUserInfo = myUserInfoRes.data;
    // //
    // let user = jwt_decode(tokens.access_token);
    // console.debug(
    //   'AuthContextProvider - login - user: [' + JSON.stringify(user) + '], myUserInfo: [' + JSON.stringify(myUserInfo) + ']'
    // );
    // for (const key in myUserInfo) {
    //   user[key] = myUserInfo[key];
    // }
    // sessionStorage.setItem('user', JSON.stringify(user));
    const user = await loginService.doAuthLogin(payload);
    // console.debug(
    //   'AuthContextProvider - login - user: [' + JSON.stringify(user) + ']'
    // );
    setUser(user);
    navigate('/');
  };

  const postLogin = (user?: User): void => {
    setUser(user);
    navigate('/');
  };

  // const doLogout = async (): Promise<void> => {
  //   // invoke the logout API call, for our NestJS API no logout API
  //   await doAuthLogout();

  //   //
  //   setUser(null);
  //   navigate('/');
  // };
  const doLogout = () => {
    // console.debug('AuthContext - doLogout - start');
    loginService.doAuthLogout();
    setUser(undefined);
    // console.debug('AuthContext - doLogout - end');
  };

  // const checkTimeout = async (): Promise<void> => {
  //   try {
  //     await doCheckTimeout();
  //   }
  //   catch (err) {
  //     console.error('AuthContext - checkTimeout - err: ', err);
  //     // return Promise.reject(err);
  //     throw err;
  //   }
  // }
  const checkTimeout = async () => {
    const timeoutErr = await loginService.doCheckTimeout();
    if (timeoutErr != null) {
      // return Promise.reject(timeoutErr);
      throw timeoutErr;
    }
    // return Promise.resolve();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        // doLogin,
        doLogout,
        checkTimeout,
        checkPermission: loginService.doCheckPermissionByRegex,
        postLogin,
        timeoutErr,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export {
  AuthContextProvider
}
