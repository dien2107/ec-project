import { safeLocalStorage } from "~/helper/safeLocalStorage";
import instance from "./customize-axios";

type LoginPayload = { username: string; password: string };
type RegisterPayload = Record<string, any>;
type ForgotPayload = { email: string };
type ResetPayload = { token: string; Password: string };
type ChangePasswordPayload = { oldPassword: string; newPassword: string };

export const login = async (payload: LoginPayload) => {
  const res = await instance.post("/auth/login", payload);
  return res.data;
};

export const register = async (payload: RegisterPayload) => {
  const res = await instance.post("/auth/register", payload);
  return res.data;
};

export const forgotPassword = async (payload: ForgotPayload) => {
  const res = await instance.post("/auth/forgot-password", payload);
  return res.data;
};

export const resetPassword = async (payload: ResetPayload) => {
  const res = await instance.post("/auth/reset-password", payload);
  return res.data;
};

export const refreshToken = async (refreshToken?: string) => {
  // NOTE: customize-axios will call /auth/refresh-token via a raw axios instance to avoid interceptor loop.
  const body = refreshToken ? { refreshToken } : {};
  const res = await instance.post("/auth/refresh-token", body);
  return res.data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const res = await instance.post("/users/change-password", payload);
  return res.data;
};

export const logout = async () => {
  // optional logout api if backend supports it
  try {
    await instance.post("/auth/logout");
  } catch {
    // ignore
  }
  safeLocalStorage.removeItem("accessToken");
  safeLocalStorage.removeItem("refreshToken");
};
export const getAuthVerify = async (token: string) => {
   console.log(token);
  const res = await instance.get("/auth/verify", {
    params: { token },
  });
  return res.data;
}