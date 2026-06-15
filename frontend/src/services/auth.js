import api from './api'

export const login = (email, password) =>
  api.post('/auth/login/', { email, password })

export const logout = () =>
  api.post('/auth/logout/')

export const requestAccess = (email, name) =>
  api.post('/auth/request-access/', { email, name, role: 'nursing' })

export const setPassword = (token, password, confirm_password) =>
  api.post('/auth/set-password/', { token, password, confirm_password })

export const requestReset = (email) =>
  api.post('/auth/request-reset/', { email })

export const resetPassword = (token, new_password, confirm_password) =>
  api.post('/auth/reset-password/', { token, new_password, confirm_password })
