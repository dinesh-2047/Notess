import { apiClient } from './client'

export const authApi = {
  register: (payload) => apiClient.post('/auth/register', payload),
  verify: (payload) => apiClient.post('/auth/verify', payload),
  resendOtp: (payload) => apiClient.post('/auth/resend-otp', payload),
  login: (payload) => apiClient.post('/auth/login', payload),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
  forgotPassword: (payload) => apiClient.post('/auth/forgot-password', payload),
  resetPassword: (payload) => apiClient.post('/auth/reset-password', payload),
}
