// client/src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/config/axios";
import { RegisterData, LoginCredentials, User } from "@/types";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: User;
  token?: string;
  error?: string;
}

const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
};

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/register", data);
      // Store token in localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: LoginCredentials, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/login", data);
      // Store token in localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Async thunk for fetching user profile
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const res = await axios.get("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Async thunk for updating user profile
export const updateProfile = createAsyncThunk<
  { user: User }, // <- clearly say what we expect
  Partial<User>,
  { rejectValue: string }
>("auth/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token found");

    const res = await axios.put<{ user: User }>("/api/auth/profile", data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data; // TS knows it's { user: User }
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update profile"
    );
  }
});

// Async thunk for initializing auth state from localStorage
export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("token");
    if (token) {
      // If token exists, try to fetch user profile
      return dispatch(fetchProfile());
    }
    return null;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = undefined;
      state.token = undefined;
      state.error = undefined;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        // Clear invalid token
        state.token = undefined;
        localStorage.removeItem("token");
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
