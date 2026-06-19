import api from './api'

export const listMachines = () =>
  api.get('/core/machines/')

export const createMachine = (data) =>
  api.post('/core/machines/', data)

export const updateMachine = (id, data) =>
  api.put(`/core/machines/${id}/`, data)

export const deleteMachine = (id) =>
  api.delete(`/core/machines/${id}/`)

export const listExams = () =>
  api.get('/core/exams/')

export const createExam = (name) =>
  api.post('/core/exams/', { name })

export const listProblems = () =>
  api.get('/core/problems/')
