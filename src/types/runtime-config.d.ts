export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      // API_BASE_URL?: string;
      // FEATURE_FLAG_X?: boolean;
      //
      APP_NAME?: string;
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

    };
  }
}
