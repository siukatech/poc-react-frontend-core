
import { AppConfigContext } from './contexts/AppConfigContext';
import { AppConfigProvider } from './contexts/AppConfigProvider';
// import { useLayoutConfig } from '../layout/hooks/useLayoutConfig';
import { useServiceConfig } from './hooks/useServiceConfig';
import { useRouteConfig } from './hooks/useRouteConfig';
import type { RouteConfig, AppConfig } from './models';
import AppRouter from './components/AppRouter';

export type {
  RouteConfig, 
  AppConfig,
}
export {
  AppConfigContext,
  AppConfigProvider,
  // useLayoutConfig,
  useServiceConfig,
  useRouteConfig,
  AppRouter,
}
