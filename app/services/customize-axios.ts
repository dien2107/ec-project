import axios from "axios";
import { safeLocalStorage } from "~/helper/safeLocalStorage";

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
    const token = safeLocalStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
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

      const refreshToken = safeLocalStorage.getItem("refreshToken");
      try {
        const raw = axios.create({ baseURL });
        const resp = await raw.post("/auth/refresh-token", { refreshToken });
        const data = resp.data;
        const newAccess = data?.accessToken ?? data?.token ?? null;
        const newRefresh = data?.refreshToken ?? null;

        if (newAccess) {
          safeLocalStorage.setItem("accessToken", newAccess);
          if (newRefresh) safeLocalStorage.setItem("refreshToken", newRefresh);
          instance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
          processQueue(null, newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return instance(originalRequest);
        }
        processQueue(new Error("No new access token"), null);
        return Promise.reject(error);
      } catch (err) {
        processQueue(err, null);
        safeLocalStorage.removeItem("accessToken");
        safeLocalStorage.removeItem("refreshToken");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
