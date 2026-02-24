interface User {
  userId: string;
  permissions?: any;
}

interface UserPermission {
  applicationId: string;
  appResourceId: string;
  accessRight: string;
}

type DoAuthLoginPayload = {
  username?: string;
  password?: string;
};

const STORAGE_KEYS = ['tokens', 'user'];
const [STORAGE_KEY_TOKENS, STORAGE_KEY_USER] = STORAGE_KEYS;

export type { User, UserPermission, DoAuthLoginPayload };

export {
  STORAGE_KEYS, STORAGE_KEY_TOKENS, STORAGE_KEY_USER
}


