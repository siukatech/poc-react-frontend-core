import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Provider } from 'react-redux';

import { AxiosError } from 'axios';

import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import themeOptions from '../themes/theme-options';

import LayoutLeft from '../components/LayoutLeft';
import LayoutMini from '../components/LayoutMini';
import MiniVariantDrawerLeft from '../components/MiniVariantDrawerLeft';

import { AuthContextProvider } from '../../auth';
import { AxiosInterceptor } from '../../axios';
import { LNG_MUI_LOCALE_MAP } from '../../i18n';

import store from '../stores/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      //
      // Reference:
      // https://www.youtube.com/watch?v=hd2F46ttt1U
      // https://github.com/TanStack/query/issues/2927
      // https://tanstack.com/query/v4/docs/react/guides/network-mode#network-mode-always
      // networkMode: 'offlineFirst',
      networkMode: 'always',
      //
      // Reference:
      // https://tanstack.com/query/v4/docs/react/guides/window-focus-refetching
      refetchOnWindowFocus: false,
      //
      // Reference:
      // https://stackoverflow.com/a/77210074
      onError: (err: unknown) => {
        // console.debug(
        //   `AppMain - queryClient - defaultOptions - onError - err: `,
        //   err
        // );
        if (err instanceof AxiosError) {
          let retStatus = err.response?.status;
          let errorCode = err.code;
          if (
            retStatus === 401 ||
            (retStatus == null && errorCode == 'ERR_NETWORK') || // CORS issue
            (retStatus === 500 && errorCode == 'ERR_CANCELED')
          ) {
            console.debug(
              `AppMain - queryClient - defaultOptions - onError - retStatus: [${retStatus}], errorCode: [${errorCode}]`,
              err
            );
            // window.location.assign(`/login`);
          }
        }
      },
    },
  },
});

const RouterMain = () => {
  const { i18n } = useTranslation();
  const muiLocale = LNG_MUI_LOCALE_MAP[i18n.language];
  const themeWithLocale = useMemo(
    () => createTheme(themeOptions, muiLocale),
    [themeOptions, muiLocale]
  );
  return (
    <>
      <ThemeProvider theme={themeWithLocale}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <AuthContextProvider>
                <AxiosInterceptor>
                  {/* <LayoutLeft /> */}
                  <LayoutMini />
                  {/* <MiniVariantDrawerLeft /> */}
                </AxiosInterceptor>
              </AuthContextProvider>
            </Provider>
          </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
};

export default RouterMain;
