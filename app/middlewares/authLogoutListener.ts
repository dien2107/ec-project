import { createListenerMiddleware } from "@reduxjs/toolkit";
import { logoutLocal } from "~/redux/slices/auth";

const authLogoutListener = createListenerMiddleware();

authLogoutListener.startListening({
  predicate: (action, currentState: any, previousState: any) => {
    const prevAccess = previousState?.auth?.accessToken;
    const currentAccess = currentState?.auth?.accessToken;

    // Chỉ cần kiểm tra token trong Redux state
    const tokenCleared = !!(prevAccess && !currentAccess);

    return tokenCleared;
  },
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(logoutLocal());
  },
});

export default authLogoutListener;
