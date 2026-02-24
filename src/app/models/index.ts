// types/AppConfig.ts
// import { UserService } from "../services/UserService";
// import { AuthService } from "../services/AuthService";
// import { ConfigService } from "../services/ConfigService";
import type { RouteObject } from 'react-router-dom';
import type { LoginService } from '../../auth';
import type { LayoutConfig, MenuItem } from '../../layout/models';

interface ServiceConfig {
  loginService: LoginService;
}

interface RouteConfig {
  childenRoutes: RouteObject[];
}

interface AppConfig {
  // userService: UserService;
  // authService: AuthService;
  // configService: ConfigService;
  serviceConfig: ServiceConfig;
  layoutConfig: LayoutConfig;
  routeConfig: RouteConfig;
}

export type {
  ServiceConfig,
  RouteConfig,
  AppConfig,
}