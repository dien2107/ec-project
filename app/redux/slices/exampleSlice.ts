import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "~/services/customize-axios";

// Types
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

interface ExampleState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ExampleState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

// Async thunk - chỉ giữ fetchUsers
export const fetchUsers = createAsyncThunk(
  "example/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      console.log("Users API Status:", response.status);
      return response.data as User[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch users"
      );
    }
  }
);

// Slice
const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users - chỉ handle fetchUsers
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedUser, clearSelectedUser } =
  exampleSlice.actions;
export default exampleSlice.reducer;
