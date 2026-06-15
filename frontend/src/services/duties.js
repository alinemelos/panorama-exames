import api from './api'

export const getCurrent = () =>
  api.get('/core/duties/current/')

export const openDuty = (machineId) =>
  api.post('/core/duties/', { machine: machineId })

export const addCollection = (dutyId, count) =>
  api.post(`/core/duties/${dutyId}/collections/`, { count })

export const closeDuty = (dutyId, problemId = null) =>
  api.patch(`/core/duties/${dutyId}/close/`, { problem: problemId })
