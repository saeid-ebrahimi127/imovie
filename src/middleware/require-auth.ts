import { getBetterAuthSession } from '#/lib/session.server.ts'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'

export const requireAuthMiddlewareApi = createMiddleware({
  type: 'request',
}).server(async ({ next }) => {
  const betterAuthSession = await getBetterAuthSession()

  if (!betterAuthSession) {
    return new Response(undefined, {
      status: 401,
    })
  }

  const { user } = betterAuthSession

  return next({ context: { currentUser: { image: user.image } } })
})

export const requireAuthMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  const betterAuthSession = await getBetterAuthSession()

  if (!betterAuthSession) {
    throw redirect({ to: '/auth', replace: true })
  }

  const {
    user: { id },
  } = betterAuthSession

  return next({ context: { currentUser: { id } } })
})
