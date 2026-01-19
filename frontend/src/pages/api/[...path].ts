import type { APIRoute } from 'astro'

export const ALL: APIRoute = async ({ request, params }) => {
  let backendUrl = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3000'
  // Limpiar barra final si existe para evitar dobles barras
  if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1)

  const path = params.path
  const url = new URL(request.url)
  const targetUrl = `${backendUrl}/api/${path}${url.search}`

  const headers = new Headers(request.headers)
  headers.set('host', new URL(backendUrl).host)

  // No borrar referer ni origin ya que better-auth los usa para validaciones CSRF
  // Pero sí podemos asegurar que apunten al backend si es necesario,
  // aunque better-auth suele preferir el origin del cliente.

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body:
        request.method !== 'GET' && request.method !== 'HEAD'
          ? await request.arrayBuffer()
          : undefined,
      redirect: 'manual',
    })

    // Extraer el cuerpo como buffer para asegurar que se envía completo
    const resBody = await response.arrayBuffer()

    // Clonar las cabeceras de respuesta
    const resHeaders = new Headers()

    // Copiar todas las cabeceras excepto las que maneja Astro/Node automáticamente
    for (const [key, value] of response.headers.entries()) {
      if (
        !['content-encoding', 'transfer-encoding', 'content-length'].includes(key.toLowerCase())
      ) {
        resHeaders.append(key, value)
      }
    }

    // Manejo especial para múltiples Set-Cookie (vital para better-auth)
    // @ts-ignore - getSetCookie existe en entornos modernos de Node/Bun
    if (response.headers.getSetCookie) {
      resHeaders.delete('set-cookie')
      // @ts-ignore
      for (const cookie of response.headers.getSetCookie()) {
        resHeaders.append('set-cookie', cookie)
      }
    }

    return new Response(resBody, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    })
  } catch (error) {
    console.error(`Proxy Error fetching ${targetUrl}:`, error)
    return new Response(
      JSON.stringify({
        error: 'Proxy error',
        target: targetUrl,
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
