import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

const AUTH_PATHS_WITHOUT_RETRY = ['/auth/login/', '/auth/refresh/', '/auth/logout/']

let refreshPromise = null

function isAuthPath(url = '') {
  return AUTH_PATHS_WITHOUT_RETRY.some(path => url.includes(path))
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    if (response?.status !== 401 || config._retry || isAuthPath(config.url)) {
      return Promise.reject(error)
    }
    config._retry = true

    if (!refreshPromise) {
      refreshPromise = api.post('/auth/refresh/').finally(() => {
        refreshPromise = null
      })
    }

    try {
      await refreshPromise
      return api(config)
    } catch {
      localStorage.removeItem('user')
      window.location.href = '/'
      return Promise.reject(error)
    }
  }
)

export default api
