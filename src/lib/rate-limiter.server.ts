import { createTooManyRequestsErrorMessage } from '#/lib/message.ts'
import { getRedisClient } from '#/lib/redis.server.ts'
import { getClientIP } from '#/lib/utils.server.ts'
import { APIError } from 'better-auth'
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible'

export const createRateLimiter = ({
  duration,
  points,
}: {
  duration: number
  points: number
}) => {
  return new RateLimiterRedis({
    duration,
    points,
    storeClient: getRedisClient(),
    keyPrefix: 'rate-limiter',
  })
}

export const handleBetterAuthRateLimiting = async (
  rateLimiter: RateLimiterRedis,
  key: string,
  request: Request,
  throwError = true,
) => {
  try {
    await rateLimiter.consume(`${key}:${getClientIP(request)}`)
  } catch (e) {
    if (e instanceof RateLimiterRes) {
      const errorMessage = createTooManyRequestsErrorMessage(e.msBeforeNext)

      if (throwError) {
        throw new APIError('TOO_MANY_REQUESTS', {
          message: errorMessage,
        })
      } else {
        return { errorMessage }
      }
    }

    throw e
  }
}
