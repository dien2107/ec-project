import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/auth";
import { safeLocalStorage } from "~/helper/safeLocalStorage";
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
      const data = await authService.getCurrentUser();
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

        const token =
          action.payload?.accessToken ?? action.payload?.token ?? null;
        const refresh = action.payload?.refreshToken ?? null;
        const user = action.payload?.user ?? action.payload ?? null;

        state.accessToken = token;
        state.refreshToken = refresh;
        state.user = user ?? null;

        const remember = (action.meta?.arg as any)?.rememberMe ?? true;

        try {
          if (typeof window !== "undefined") {
            if (remember) {
              if (token) safeLocalStorage.setItem("accessToken", token);
              else safeLocalStorage.removeItem("accessToken");
              if (refresh) safeLocalStorage.setItem("refreshToken", refresh);
              else safeLocalStorage.removeItem("refreshToken");
              if (user) safeLocalStorage.setItem("user", JSON.stringify(user));
              sessionStorage.removeItem("accessToken");
              sessionStorage.removeItem("refreshToken");
              sessionStorage.removeItem("user");
            } else {
              if (token) sessionStorage.setItem("accessToken", token);
              else sessionStorage.removeItem("accessToken");
              if (refresh) sessionStorage.setItem("refreshToken", refresh);
              else sessionStorage.removeItem("refreshToken");
              if (user) sessionStorage.setItem("user", JSON.stringify(user));
              safeLocalStorage.removeItem("accessToken");
              safeLocalStorage.removeItem("refreshToken");
              safeLocalStorage.removeItem("user");
            }
          }
        } catch (e) {
          console.warn("persist auth storage failed", e);
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
