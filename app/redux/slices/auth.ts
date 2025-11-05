import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/auth";
import * as userService from "~/services/customers";

type State = {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  user: null,
  accessToken: null,
  refreshToken: null,
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
      // redux-persist sẽ tự động xóa khỏi localStorage
    },
    updateTokens(state, action) {
      // Action để cập nhật token khi refresh thành công
      const { accessToken, refreshToken } = action.payload;
      if (accessToken) state.accessToken = accessToken;
      if (refreshToken) state.refreshToken = refreshToken;
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
          action.payload?.data?.accessToken ??
          action.payload?.data?.token ??
          null;
        const refresh = action.payload?.data?.refreshToken ?? null;
        const user = action.payload?.data?.user ?? null;

        state.accessToken = token;
        state.refreshToken = refresh;
        state.user = user ?? null;
        console.log("Login successful:", action.payload);

        // redux-persist sẽ tự động lưu vào localStorage
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

export const { logoutLocal, updateTokens } = slice.actions;
export default slice.reducer;
