// client/src/store/slices/authSlice.js
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const { apiService } = require("@/services/api");

// ------------------------
// Initial State
// ------------------------
const token = localStorage.getItem("healthmitra_token");

const initialState = {
  isLoading: false,
  isAuthenticated: !!token,
  user: undefined,
  token: token || undefined,
  error: undefined,
};

// ------------------------
// Async Thunks
// ------------------------

// Registration
const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiService.post("/auth/register", data);
      localStorage.setItem("healthmitra_token", res.token);
      localStorage.setItem("healthmitra_refresh_token", res.refreshToken);
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login
const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiService.post("/auth/login", data);
      localStorage.setItem("healthmitra_token", res.token);
      localStorage.setItem("healthmitra_refresh_token", res.refreshToken);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Fetch Profile
const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiService.get("/auth/profile");
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// ------------------------
// Slice
// ------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = undefined;
      state.token = undefined;
      state.isAuthenticated = false;
      state.error = undefined;
      localStorage.removeItem("healthmitra_token");
      localStorage.removeItem("healthmitra_refresh_token");
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
        state.error = action.payload;
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
        state.error = action.payload;
      })

      // Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

// ------------------------
// Exports
// ------------------------
module.exports = {
  reducer: authSlice.reducer,
  logout: authSlice.actions.logout,
  registerUser,
  loginUser,
  fetchProfile,
};
