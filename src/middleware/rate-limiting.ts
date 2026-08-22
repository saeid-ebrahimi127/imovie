import {
  createTooManyRequestsErrorMessage,
  errorMessage,
} from '#/lib/message.ts'
import { createRateLimiter } from '#/lib/rate-limiter.server.ts'
import { getClientIP } from '#/lib/utils.server.ts'
import { createMiddleware } from '@tanstack/react-start'
import { RateLimiterRes } from 'rate-limiter-flexible'

export const createRateLimitingMiddleware = ({
  key,
  duration,
  points,
}: {
  key: string
  duration: number
  points: number
}) =>
  createMiddleware({
    type: 'request',
  }).server(async ({ next, request }) => {
    let rateLimitingErrorMessage: string | null = null

    try {
      await createRateLimiter({ duration, points }).consume(
        `${key}:${getClientIP(request)}`,
      )
    } catch (e) {
      if (e instanceof RateLimiterRes) {
        rateLimitingErrorMessage = createTooManyRequestsErrorMessage(
          e.msBeforeNext,
        )
      } else {
        rateLimitingErrorMessage = errorMessage.generic
      }
    }

    return next({ context: { rateLimitingErrorMessage } })
  })
