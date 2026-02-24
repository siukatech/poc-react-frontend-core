import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  if (authContext == null) {
    throw new Error(`AuthContext must be used with AuthContextProvider`);
  }
  return authContext;
};

export {
  useAuthContext
}
