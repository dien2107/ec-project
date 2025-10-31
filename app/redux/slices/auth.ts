import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/auth";
import { safeLocalStorage } from "~/helper/safeLocalStorage";
import * as userService from "~/services/customers";
type State = {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
};

const readStored = (key: string) => {
  if (typeof window === "undefined") return null;
  return safeLocalStorage.getItem(key) ?? sessionStorage.getItem(key);
};

const initialState: State = {
  user: null,
  accessToken: readStored("accessToken"),
  refreshToken: readStored("refreshToken"),
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    payload: { username: string; password: string; rememberMe?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const data = await authService.login(payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data ?? err?.message ?? "Login failed"
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await userService.getUserBySelf();
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data ?? err?.message ?? "Fetch user failed"
      );
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocal(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      safeLocalStorage.removeItem("accessToken");
      safeLocalStorage.removeItem("refreshToken");
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("user");
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const token = action.payload?.data?.accessToken ?? action.payload?.data?.token ?? null;
        const refresh = action.payload?.data?.refreshToken ?? null;
        const user = action.payload?.data?.user ?? null;

        state.accessToken = token;
        state.refreshToken = refresh;
        state.user = user ?? null;
        console.log("Login successful:", action.payload);
        const remember = (action.meta?.arg as any)?.rememberMe ?? true;

        try {
          if (typeof window !== "undefined") {
            if (remember) {
              token
                ? safeLocalStorage.setItem("accessToken", token)
                : safeLocalStorage.removeItem("accessToken");
              refresh
                ? safeLocalStorage.setItem("refreshToken", refresh)
                : safeLocalStorage.removeItem("refreshToken");

              sessionStorage.removeItem("accessToken");
              sessionStorage.removeItem("refreshToken");
            } else {
              token
                ? sessionStorage.setItem("accessToken", token)
                : sessionStorage.removeItem("accessToken");
              refresh
                ? sessionStorage.setItem("refreshToken", refresh)
                : sessionStorage.removeItem("refreshToken");

              safeLocalStorage.removeItem("accessToken");
              safeLocalStorage.removeItem("refreshToken");
            }
          }
        } catch (e) {
          console.warn("Persist auth tokens failed:", e);
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any) ?? "Login failed";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload ?? null;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { logoutLocal } = slice.actions;
export default slice.reducer;
