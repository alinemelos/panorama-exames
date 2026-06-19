import api from './api'

export const listUsers = () => api.get('/auth/users/')
export const deleteUser = (id) => api.delete(`/auth/users/${id}/`)

export const listAccessRequests = () => api.get('/auth/access-requests/')
export const approveAccessRequest = (id, password, confirm_password) =>
  api.post(`/auth/access-requests/${id}/approve/`, { password, confirm_password })
export const rejectAccessRequest = (id) => api.delete(`/auth/access-requests/${id}/reject/`)

export const listResetRequests = () => api.get('/auth/reset-requests/')
export const approveResetRequest = (id, password, confirm_password) =>
  api.post(`/auth/reset-requests/${id}/approve/`, { password, confirm_password })
export const rejectResetRequest = (id) => api.delete(`/auth/reset-requests/${id}/reject/`)
