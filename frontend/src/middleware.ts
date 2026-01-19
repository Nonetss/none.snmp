import { authClient } from '@/lib/auth-client'
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async ({ locals, request, url, redirect }, next) => {
  // Evitar bucles y peticiones innecesarias para recursos estáticos
  const isPublicAsset = url.pathname.includes('.') || url.pathname.startsWith('/_astro')
  const isAuthRoute = url.pathname.startsWith('/api/auth')
  const isLoginPage = url.pathname.startsWith('/login')

  if (isPublicAsset || isAuthRoute) {
    return next()
  }

  try {
    const { data: sessionData } = await authClient.getSession({
      fetchOptions: {
        headers: request.headers,
      },
    })

    if (sessionData) {
      locals.user = sessionData.user
      locals.session = sessionData.session
    } else {
      locals.user = null
      locals.session = null
    }

    // Redirigir si no hay sesión y no estamos en login
    if (!locals.session && !isLoginPage) {
      return redirect('/login')
    }

    // Redirigir a home si hay sesión y estamos en login
    if (locals.session && isLoginPage) {
      return redirect('/')
    }
  } catch (error) {
    console.error('Middleware Auth Error:', error)
    locals.user = null
    locals.session = null
  }

  return next()
})
