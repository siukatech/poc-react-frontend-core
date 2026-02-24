// context/AppConfigProvider.tsx
// import React, { ReactNode, useMemo } from "react";
import React, { useMemo } from "react";
import type { ReactNode } from "react";
import { AppConfigContext } from "./AppConfigContext";
import type { AppConfig } from "../models";

interface Props {
  appConfig: AppConfig;
  children: ReactNode;
}

const AppConfigProvider: React.FC<Props> = ({
  appConfig,
  children,
}: Props) => {
  const memoizedAppConfig = useMemo(() => appConfig, [appConfig]);

  return (
    <AppConfigContext.Provider value={memoizedAppConfig}>
      {children}
    </AppConfigContext.Provider>
  );
};

export {
  AppConfigProvider
}
