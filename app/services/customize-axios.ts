import axios from "axios";
import type { RootState } from "~/redux/store";

// Hàm helper để lấy store (sẽ được inject sau khi store được tạo)
let getStore:
  | (() => {
      getState: () => RootState;
      dispatch: (action: any) => void;
    })
  | null = null;

export const injectStore = (store: {
  getState: () => RootState;
  dispatch: (action: any) => void;
}) => {
  getStore = () => store;
};

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "";
const instance = axios.create({
  baseURL,
  timeout: import.meta.env.VITE_API_TIMEOUT
    ? Number(import.meta.env.VITE_API_TIMEOUT)
    : 10000, // Fallback timeout
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

// request: attach access token
instance.interceptors.request.use((config) => {
  try {
    let token = null;
    if (getStore) {
      const state = getStore().getState();
      token = state.auth.accessToken;
    }
    if (token && config && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// response: handle 401 -> try refresh -> retry original request
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response ? error.response.status : null;
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers)
              originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      let refreshToken = null;
      if (getStore) {
        const state = getStore().getState();
        refreshToken = state.auth.refreshToken;
      }

      try {
        const raw = axios.create({ baseURL });
        const resp = await raw.post("/auth/refresh-token", { refreshToken });
        const data = resp.data;
        const newAccess = data?.accessToken ?? data?.token ?? null;
        const newRefresh = data?.refreshToken ?? null;

        if (newAccess && getStore) {
          // Cập nhật token mới vào store
          const { updateTokens } = await import("~/redux/slices/auth");
          getStore().dispatch(
            updateTokens({
              accessToken: newAccess,
              refreshToken: newRefresh,
            })
          );

          instance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
          processQueue(null, newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          return instance(originalRequest);
        }
        processQueue(new Error("No new access token"), null);
        return Promise.reject(error);
      } catch (err) {
        processQueue(err, null);
        // Dispatch logout khi refresh token thất bại
        if (getStore) {
          const { logoutLocal } = await import("~/redux/slices/auth");
          getStore().dispatch(logoutLocal());
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
