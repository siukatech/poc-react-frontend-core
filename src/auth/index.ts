
import ProtectedResource from './components/ProtectedResource';
// import type {
//   ProtectedResourceAccessBy, ProtectedResourceDisplayType
// } from './components/ProtectedResource';
import {
  ProtectedResourceAccessBy, ProtectedResourceDisplayType
} from './components/ProtectedResource';

import { AuthContext, 
  // AuthContextObj 
} from './contexts/AuthContext';
import type { AuthContextObj } from './contexts/AuthContext';
import { AuthContextProvider } from './contexts/AuthContextProvider';

import { useAuthContext } from './hooks/useAuthContext';

import { 
  // User, 
  // UserPermission, 
  // DoAuthLoginPayload,
  STORAGE_KEYS, 
  STORAGE_KEY_TOKENS, 
  STORAGE_KEY_USER,
} from './models';
import type { 
  User, 
  UserPermission, 
  DoAuthLoginPayload,
} from './models';

import type { LoginService, DoCheckPermissionByRegex } from './services/LoginService';
import { AbstractLoginService } from './services/AbstractLoginService';

import authSliceReducer, {
  authSlice,
  bindAuth,
  clearAuth,
  selectAuthUser,
  useAuthSelector
} from './stores/authSlice';

export type {
  User, 
  UserPermission, 
  DoAuthLoginPayload, 
  AuthContextObj, 
  LoginService,
  DoCheckPermissionByRegex,
  // ProtectedResourceAccessBy,
  // ProtectedResourceDisplayType,
}
export {
  ProtectedResource,
  AuthContext,
  AuthContextProvider,
  useAuthContext,
  AbstractLoginService,
  authSliceReducer,
  authSlice,
  bindAuth,
  clearAuth,
  selectAuthUser,
  useAuthSelector,
  STORAGE_KEYS, 
  STORAGE_KEY_TOKENS, 
  STORAGE_KEY_USER,
  ProtectedResourceAccessBy,
  ProtectedResourceDisplayType,
}
