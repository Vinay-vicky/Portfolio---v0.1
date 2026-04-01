import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginAdmin } from '../portfolio/portfolioApi'

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginAdmin(credentials)
      localStorage.setItem('adminToken', data.token)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Login failed')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('adminToken')
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('adminToken') || null,
    isAuthenticated: !!localStorage.getItem('adminToken'),
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export default authSlice.reducer
