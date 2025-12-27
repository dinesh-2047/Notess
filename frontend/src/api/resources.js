import { apiClient } from './client'

export const resourceApi = {
  list: (params) => apiClient.get('/resources', { params }),
  getBySlug: (slug) => apiClient.get(`/resources/${slug}`),
  download: (id) => apiClient.get(`/resources/${id}/download`),
  create: (formData) => apiClient.post('/resources', formData),
  update: (id, formData) => apiClient.patch(`/resources/${id}`, formData),
  remove: (id) => apiClient.delete(`/resources/${id}`),
}
