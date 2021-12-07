import { GoogleAuthProvider, signInWithPopup, User } from "@firebase/auth";
import { createGuard } from "utils";

import { firebaseAuth, googleAuthProvider } from "..";
import { AuthStatus } from "../types";
const userGuard = createGuard<User>("displayName");

export const authFromGoogle = async () => {
  let user: User | null = null;

  try {
    const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
    GoogleAuthProvider.credentialFromResult(result);
    user = result.user;
  } catch(error: any) {
    const errorCode = error?.code;
    const errorMessage = error?.message;
    GoogleAuthProvider.credentialFromError(error);
    console.error(`Error when try auth. Error code: ${errorCode}. > ${errorMessage} <`);      
  }

  return user;
};

export const getAuthResult = async (middleware: (user: User) => void) => {
  firebaseAuth.onAuthStateChanged(async (user) => {
    if (user) {
      middleware(user);
    }
  });
};

export const fireBaseAuth = async (middleware: (user: User) => void) => {
  const user = await authFromGoogle();

  if (userGuard(user)) {
    middleware(user);
  }
};

export const getLogOut = async (
  middleware: () => void,
  getMessage?: (type: AuthStatus) => void
) => {
  try {
    await firebaseAuth.signOut()
    getMessage && getMessage("success");
  } catch {
    getMessage && getMessage("error");
  }
  middleware()
};
