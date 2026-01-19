import { createAuthClient } from 'better-auth/react'

const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321',
  basePath: '/api/auth',
})

export { authClient }
