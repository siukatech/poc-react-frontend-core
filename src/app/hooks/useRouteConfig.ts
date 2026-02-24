
import { useContext } from "react";
import { AppConfigContext } from '../contexts/AppConfigContext';

function useRouteConfig() {
  const appConfig = useContext(AppConfigContext);
  if (!appConfig) {
    throw new Error("AppConfigProvider missing");
  }
  return appConfig.routeConfig;
}

export {
  useRouteConfig
}
