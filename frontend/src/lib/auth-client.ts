import { createAuthClient } from 'better-auth/react'

// El nginx se encarga de redirigir /api al backend
// Construimos la URL absoluta usando el mismo origen (sin variables de entorno)
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/auth`
  }
  // En SSR, usar localhost como fallback (siempre será localhost en desarrollo/producción)
  return 'http://localhost/api/auth'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
})