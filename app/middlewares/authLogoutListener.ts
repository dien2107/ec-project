import { createListenerMiddleware } from "@reduxjs/toolkit";
import { safeLocalStorage } from "~/helper/safeLocalStorage";
import { logoutLocal } from "~/redux/slices/auth";
const authLogoutListener = createListenerMiddleware();

authLogoutListener.startListening({
  predicate: (action, currentState: any, previousState: any) => {
    const prevAccess = previousState?.auth?.accessToken;
    const currentAccess = currentState?.auth?.accessToken;

    const tokenCleared = !!(prevAccess && !currentAccess);
    const tokenRemovedFromStorage = !!(
      !safeLocalStorage.getItem("accessToken") && prevAccess
    );

    return tokenCleared || tokenRemovedFromStorage;
  },
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(logoutLocal());
  },
});

export default authLogoutListener;
