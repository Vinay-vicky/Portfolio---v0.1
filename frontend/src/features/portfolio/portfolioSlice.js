import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchPortfolio, submitContactForm } from './portfolioApi'

export const loadPortfolio = createAsyncThunk('portfolio/loadPortfolio', async () => {
  return fetchPortfolio()
})

export const sendContactMessage = createAsyncThunk(
  'portfolio/sendContactMessage',
  async (payload, { rejectWithValue }) => {
    try {
      return await submitContactForm(payload)
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Could not send message.')
    }
  },
)

const initialState = {
  profile: null,
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  loading: false,
  error: null,
  contactStatus: 'idle',
  contactError: null,
  contactSuccessMessage: null,
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPortfolio.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadPortfolio.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload.profile
        state.experiences = action.payload.experiences
        state.education = action.payload.education
        state.skills = action.payload.skills
        state.projects = action.payload.projects
      })
      .addCase(loadPortfolio.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Unable to load portfolio data.'
      })
      .addCase(sendContactMessage.pending, (state) => {
        state.contactStatus = 'loading'
        state.contactError = null
        state.contactSuccessMessage = null
      })
      .addCase(sendContactMessage.fulfilled, (state, action) => {
        state.contactStatus = 'succeeded'
        state.contactSuccessMessage = action.payload?.message || 'Message sent successfully.'
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.contactStatus = 'failed'
        state.contactError = action.payload || action.error.message || 'Could not send message.'
      })
  },
})

export default portfolioSlice.reducer
