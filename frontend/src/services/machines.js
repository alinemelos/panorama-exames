import api from './api'

export const listMachines = () =>
  api.get('/core/machines/')

export const listProblems = () =>
  api.get('/core/problems/')
