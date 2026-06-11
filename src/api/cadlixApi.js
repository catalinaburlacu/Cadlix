import { AUTH_STORAGE_KEY } from '../constants/index.js';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

function resolveUrl(path) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
  if (!baseUrl) return path
  return `${baseUrl.replace(/\/$/, '')}${path}`
}

function getAuthToken() {
  try {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!auth) return null
    const parsed = JSON.parse(auth)
    return parsed?.token || null
  } catch {
    return null
  }
}

function storeTokens(token) {
  try {
    const existing = (() => {
      try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
      } catch { return {} }
    })()
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...existing, token }))
  } catch (error) {
    console.error('Failed to store tokens:', error)
  }
}

function clearTokens() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear tokens:', error)
  }
}

function clearUserData() {
  try {
    localStorage.removeItem('cadlix_user')
  } catch {}
}

async function parseResponse(response) {
  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new Error(message || `Request failed with status ${response.status}`)
  }
  if (response.status === 204) return null
  return response.json()
}

// ── Token expiry check ─────────────────────────────────────────────
function isTokenExpired(token) {
  if (!token) return true
  try {
    const payload = token.split('.')[1]
    if (!payload) return true
    const decoded = JSON.parse(atob(payload))
    // Refresh if expired or expires within 5 minutes
    return decoded.exp * 1000 < Date.now() + 5 * 60 * 1000
  } catch {
    return true
  }
}

// ── Refresh token logic ──────────────────────────────────────────────
// Refresh token is stored in an HTTP-only cookie, not in localStorage.
let isRefreshing = false
let refreshPromise = null

async function attemptTokenRefresh() {
  if (isRefreshing) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const response = await fetch(resolveUrl('/api/Login/refresh'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        clearTokens()
        clearUserData()
        return false
      }

      const data = await response.json()
      storeTokens(data.token ?? data.Token)
      return true
    } catch {
      clearTokens()
      clearUserData()
      return false
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

async function request(path, options = {}) {
  let token = getAuthToken()
  const headers = {
    ...DEFAULT_HEADERS,
    ...options.headers,
  }

  if (token) {
    if (isTokenExpired(token)) {
      const refreshed = await attemptTokenRefresh()
      token = refreshed ? getAuthToken() : null
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  let response = await fetch(resolveUrl(path), {
    ...options,
    headers,
    credentials: 'include',
  })

  if (response.status === 401 && token) {
    const refreshed = await attemptTokenRefresh()
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAuthToken()}`
      response = await fetch(resolveUrl(path), {
        ...options,
        headers,
        credentials: 'include',
      })
    }
  }

  return parseResponse(response)
}

// ── Upload helpers with 401 refresh support ──────────────────────────

function createUploadPromise(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const token = getAuthToken()
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    const xhr = new XMLHttpRequest()
    xhr.withCredentials = true

    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          })
        }
      })
    }

    xhr.addEventListener('load', async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          reject(new Error('Failed to parse upload response'))
        }
        return
      }

      if (xhr.status === 401 && token) {
        const refreshed = await attemptTokenRefresh()
        if (refreshed) {
          const newToken = getAuthToken()
          const retryXhr = new XMLHttpRequest()
          retryXhr.withCredentials = true
          if (onProgress) {
            retryXhr.upload.addEventListener('progress', (event) => {
              if (event.lengthComputable) {
                onProgress({
                  loaded: event.loaded,
                  total: event.total,
                  percentage: Math.round((event.loaded / event.total) * 100),
                })
              }
            })
          }
          retryXhr.addEventListener('load', () => {
            if (retryXhr.status >= 200 && retryXhr.status < 300) {
              try { resolve(JSON.parse(retryXhr.responseText)) }
              catch { reject(new Error('Failed to parse upload response')) }
            } else {
              reject(new Error(`Upload failed with status ${retryXhr.status}`))
            }
          })
          retryXhr.addEventListener('error', () => reject(new Error('Upload request failed')))
          retryXhr.addEventListener('abort', () => reject(new Error('Upload was cancelled')))
          retryXhr.open('POST', resolveUrl(url))
          retryXhr.setRequestHeader('Authorization', `Bearer ${newToken}`)
          retryXhr.send(formData)
          return
        }
      }

      reject(new Error(`Upload failed with status ${xhr.status}`))
    })

    xhr.addEventListener('error', () => reject(new Error('Upload request failed')))
    xhr.addEventListener('abort', () => reject(new Error('Upload was cancelled')))

    xhr.open('POST', resolveUrl(url))
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
    xhr.send(formData)
  })
}

export { storeTokens, clearTokens }

export const cadlixApi = {
  getHome: signal => request('/api/content/home', { signal }),
  getTrending: (period, filter, signal) => {
    const params = new URLSearchParams()
    if (period && period !== 'week') params.set('period', period)
    if (filter && filter !== 'all') params.set('filter', filter)
    const qs = params.toString()
    return request(`/api/content/trending${qs ? '?' + qs : ''}`, { signal })
  },
  getExplore: signal => request('/api/content/explore', { signal }),
  getLeaderboardPage: (count = 100, signal) => request(`/api/leaderboard/page?count=${count}`, { signal }),
  getLeaderboard: (count = 100, signal) => request(`/api/leaderboard?count=${count}`, { signal }),
  getLeaderboardUserRank: (userId, signal) => request(`/api/leaderboard/${userId}`, { signal }),
  getUsers: signal => request('/api/User', { signal }),
  getUser: (id, signal) => request(`/api/User/${id}`, { signal }),
  createUser: payload => request('/api/Login/register', { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: (id, payload) => request(`/api/User/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteUser: id => request(`/api/User/${id}`, { method: 'DELETE' }),
  login: payload => request('/api/Login/login', { method: 'POST', body: JSON.stringify(payload) }),
  getProfile: (userId, signal) => request(`/api/profile/${userId}`, { signal }),
  toggleLike: userId => request(`/api/profile/${userId}/like`, { method: 'POST' }),
  getLikeStatus: (userId, signal) => request(`/api/profile/${userId}/like`, { signal }),
  getActiveSubscription: (userId, signal) => request(`/api/subscription/${userId}/active`, { signal }),
  createSubscription: (userId, payload) => request(`/api/subscription/${userId}/create`, { method: 'POST', body: JSON.stringify(payload) }),
  cancelSubscription: userId => request(`/api/subscription/${userId}/cancel`, { method: 'POST' }),
  createContent: payload => request('/api/content/create', { method: 'POST', body: JSON.stringify(payload) }),
  getHistory: (userId, signal) => request(`/api/history/user/${userId}`, { signal }),
  getHistoryById: (id, signal) => request(`/api/history/${id}`, { signal }),
  createHistory: payload => request('/api/history/create', { method: 'POST', body: JSON.stringify(payload) }),
  createHistoryForUser: (userId, payload) => request(`/api/history/user/${userId}/create`, { method: 'POST', body: JSON.stringify(payload) }),
  updateHistory: (id, payload) => request(`/api/history/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteHistory: id => request(`/api/history/${id}`, { method: 'DELETE' }),
  deleteUserHistory: userId => request(`/api/history/user/${userId}`, { method: 'DELETE' }),
  getLists: (userId, signal) => request(`/api/lists/user/${userId}`, { signal }),
  getListsByStatus: (userId, status, signal) => request(`/api/lists/user/${userId}/status/${status}`, { signal }),
  getListById: (id, signal) => request(`/api/lists/${id}`, { signal }),
  createList: payload => request('/api/lists/create', { method: 'POST', body: JSON.stringify(payload) }),
  createListForUser: (userId, payload) => request(`/api/lists/user/${userId}/create`, { method: 'POST', body: JSON.stringify(payload) }),
  updateList: (id, payload) => request(`/api/lists/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  updateListStatus: (id, status) => request(`/api/lists/${id}/status/${status}`, { method: 'PUT' }),
  deleteList: id => request(`/api/lists/${id}`, { method: 'DELETE' }),
  deleteUserLists: userId => request(`/api/lists/user/${userId}`, { method: 'DELETE' }),
  getContentAll: signal => request('/api/content', { signal }),
  getContentByType: (type, signal) => request(`/api/content/type/${type}`, { signal }),
  getContentById: (id, signal) => request(`/api/content/${id}`, { signal }),
  updateContent: (id, payload) => request(`/api/content/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteContent: id => request(`/api/content/${id}`, { method: 'DELETE' }),
  getSeriesEpisodes: (seriesName, signal) => request(`/api/content/series/${encodeURIComponent(seriesName)}/episodes`, { signal }),
  searchContent: (query, signal) => request(`/api/content/search?query=${encodeURIComponent(query)}`, { signal }),
  searchHistory: (params = {}, signal) => {
    const qp = new URLSearchParams()
    if (params.userId) qp.append('userId', params.userId)
    if (params.query) qp.append('query', params.query)
    return request(`/api/history/search?${qp.toString()}`, { signal })
  },
  getAllMovies: signal => request('/api/movie', { signal }),
  getMovie: (id, signal) => request(`/api/movie/${id}`, { signal }),
  getMovieStreamUrl: (id, signal) => request(`/api/movie/${id}/stream`, { signal }),
  streamVideo: (fileName, signal) => request(`/api/streaming/${fileName}`, { signal }),
  uploadMovie: (formData, onProgress) => createUploadPromise('/api/movie/upload', formData, onProgress),
  uploadContent: (formData, onProgress) => createUploadPromise('/api/content/upload', formData, onProgress),
  uploadMediaForContent: (id, formData, onProgress) => createUploadPromise(`/api/content/${id}/upload-media`, formData, onProgress),

  // ── Review endpoints ──────────────────────────────────────────────
  getMovieReviews: (movieId, signal) => request(`/api/review/movie/${movieId}`, { signal }),
  getUserReviews: (userId, signal) => request(`/api/review/user/${userId}`, { signal }),
  getReview: (id, signal) => request(`/api/review/${id}`, { signal }),
  createReview: payload => request('/api/review', { method: 'POST', body: JSON.stringify(payload) }),
  updateReview: (id, payload) => request(`/api/review/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteReview: id => request(`/api/review/${id}`, { method: 'DELETE' }),
  toggleReviewLike: reviewId => request(`/api/review/${reviewId}/like`, { method: 'POST' }),
}
