import { apiClient } from './client'

export const adminApi = {
  stats: () => apiClient.get('/admin/stats'),
  users: () => apiClient.get('/admin/users'),
  updateUser: (id, payload) => apiClient.patch(`/admin/users/${id}`, payload),
}