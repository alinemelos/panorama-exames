import api from './api'

export const getDashboard = (params = {}) =>
  api.get('/core/dashboard/', { params })
