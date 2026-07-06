const BASE_URL = '/api/todos'

/**
 * Thin wrapper around fetch that throws a readable error
 * when the backend returns a non-2xx response.
 */
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    let message = `Yêu cầu thất bại (${res.status})`
    try {
      const body = await res.json()
      message = body.message || message
    } catch {
      // response has no JSON body (e.g. network error) - keep default message
    }
    throw new Error(message)
  }

  if (res.status === 204) return null
  return res.json()
}

export function fetchTodos({ keyword = '', completed = null, page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' } = {}) {
  const params = new URLSearchParams({ page, size, sortBy, direction })
  if (keyword) params.set('keyword', keyword)
  if (completed !== null) params.set('completed', completed)
  return request(`${BASE_URL}?${params.toString()}`)
}

export function createTodo(payload) {
  return request(BASE_URL, { method: 'POST', body: JSON.stringify(payload) })
}

export function updateTodo(id, payload) {
  return request(`${BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function toggleTodo(id) {
  return request(`${BASE_URL}/${id}/toggle`, { method: 'PATCH' })
}

export function deleteTodo(id) {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' })
}
