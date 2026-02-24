
import { useContext } from "react";
import { AppConfigContext } from '../contexts/AppConfigContext';

function useServiceConfig() {
  const appConfig = useContext(AppConfigContext);
  if (!appConfig) {
    throw new Error("AppConfigProvider missing");
  }
  return appConfig.serviceConfig;
}

export {
  useServiceConfig
}
