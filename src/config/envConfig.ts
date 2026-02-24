// src/config/config.ts

interface RuntimeConfig {
  // API_BASE_URL: string;
  // FEATURE_FLAG_X: boolean;
  //
  APP_NAME: string;
  API_PATH_MY_PREFIX?: string;
  API_PATH_WEB_PREFIX?: string;
  API_PATH_V1_PUBLIC?: string;
  API_PATH_V1_PROTECTED?: string;
  API_PATH_V1_ENCRYPTED?: string;
  API_PREFIX_ENCRYPTED?: string;
  API_OAUTH_LOGIN?: string;
  API_OAUTH_PREFIX?: string;
  API_OAUTH_AUTHORIZE?: string;
  API_OAUTH_TOKEN?: string;
  API_OAUTH_REFRESH_TOKEN?: string;
  API_OAUTH_CLIENT_NAME?: string;
  API_PATH_MY_USER_INFO?: string;
  API_PATH_MY_PERMISSION_INFO?: string;
  API_PATH_I18N_LANG?: string;
  API_PATH_I18N_ALL?: string;
  API_PATH_ITEM?: string;
  API_PATH_MERCHANT?: string;
  API_PATH_ATTACHMENT_UPLOAD?: string;
  API_PATH_ATTACHMENT_DETAIL?: string;
  API_PATH_ATTACHMENT_DOWNLOAD?: string;
  API_PATH_ATTACHMENT_DELETE?: string;
  API_OAUTH_LOGOUT?: string;
  // //backend-timezone for display; frontend-timezone for data submission
  // TIMEZONE_BACKEND?: string;
  // TIMEZONE_FRONTEND?: string;
  //backend and frontend should use same UTC timezone
  TIMEZONE?: string;
  CI?: boolean;
}

const runtimeConfig = window.__RUNTIME_CONFIG__ ?? {};

const envConfig: RuntimeConfig = {
  // API_BASE_URL:
  //   runtimeConfig.API_BASE_URL ??
  //   import.meta?.env?.VITE_API_BASE_URL ??  // Vite
  //   process.env.REACT_APP_API_BASE_URL ?? // CRA
  //   "http://default-api",

  // FEATURE_FLAG_X:
  //   runtimeConfig.FEATURE_FLAG_X ?? false,

  APP_NAME: runtimeConfig.APP_NAME as string,
  API_PATH_MY_PREFIX: runtimeConfig.API_PATH_MY_PREFIX,
  API_PATH_WEB_PREFIX: runtimeConfig.API_PATH_WEB_PREFIX,
  API_PATH_V1_PUBLIC: runtimeConfig.API_PATH_V1_PUBLIC,
  API_PATH_V1_PROTECTED: runtimeConfig.API_PATH_V1_PROTECTED,
  API_PATH_V1_ENCRYPTED: runtimeConfig.API_PATH_V1_ENCRYPTED,
  API_PREFIX_ENCRYPTED: runtimeConfig.API_PREFIX_ENCRYPTED,
  API_OAUTH_LOGIN: runtimeConfig.API_OAUTH_LOGIN,
  API_OAUTH_PREFIX: runtimeConfig.API_OAUTH_PREFIX,
  API_OAUTH_AUTHORIZE: runtimeConfig.API_OAUTH_AUTHORIZE,
  API_OAUTH_TOKEN: runtimeConfig.API_OAUTH_TOKEN,
  API_OAUTH_REFRESH_TOKEN: runtimeConfig.API_OAUTH_REFRESH_TOKEN,
  API_OAUTH_CLIENT_NAME: runtimeConfig.API_OAUTH_CLIENT_NAME,
  API_PATH_MY_USER_INFO: runtimeConfig.API_PATH_MY_USER_INFO,
  API_PATH_MY_PERMISSION_INFO: runtimeConfig.API_PATH_MY_PERMISSION_INFO,
  API_PATH_I18N_LANG: runtimeConfig.API_PATH_I18N_LANG,
  API_PATH_I18N_ALL: runtimeConfig.API_PATH_I18N_ALL,
  API_PATH_ITEM: runtimeConfig.API_PATH_ITEM,
  API_PATH_MERCHANT: runtimeConfig.API_PATH_MERCHANT,
  API_PATH_ATTACHMENT_UPLOAD: runtimeConfig.API_PATH_ATTACHMENT_UPLOAD,
  API_PATH_ATTACHMENT_DETAIL: runtimeConfig.API_PATH_ATTACHMENT_DETAIL,
  API_PATH_ATTACHMENT_DOWNLOAD: runtimeConfig.API_PATH_ATTACHMENT_DOWNLOAD,
  API_PATH_ATTACHMENT_DELETE: runtimeConfig.API_PATH_ATTACHMENT_DELETE,
  API_OAUTH_LOGOUT: runtimeConfig.API_OAUTH_LOGOUT,
  // //backend-timezone for display; frontend-timezone for data submission
  // TIMEZONE_BACKEND: runtimeConfig.TIMEZONE_BACKEND,
  // TIMEZONE_FRONTEND: runtimeConfig.TIMEZONE_FRONTEND,
  //backend and frontend should use same UTC timezone
  TIMEZONE: runtimeConfig.TIMEZONE,
  CI: runtimeConfig.CI,

};

export type {
  RuntimeConfig
}

export {
  envConfig
}

