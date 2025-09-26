// client/src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { RegisterData, LoginCredentials, User } from '@/types'

interface AuthState {
  isLoading: boolean
  user?: User
  token?: string
  error?: string
}

const initialState: AuthState = {
  isLoading: false,
}

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/auth/register', data)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: LoginCredentials, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/auth/login', data)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = undefined
      state.token = undefined
      state.error = undefined
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
