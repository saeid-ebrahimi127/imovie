import { sendMagicLink } from '#/components/email/index.tsx'
import { getDb } from '#/db/index.server.ts'
import {
  accountTable,
  sessionTable,
  userTable,
  verificationTable,
} from '#/db/schema/auth-schema.server.ts'
import { serverEnv } from '#/lib/env/env.server.ts'
import type { ErrorMessageKey, SuccessMessageKey } from '#/lib/message.ts'
import { errorMessage, successMessage } from '#/lib/message.ts'
import {
  createRateLimiter,
  handleBetterAuthRateLimiting,
} from '#/lib/rate-limiter.server.ts'
import { getRedisClient } from '#/lib/redis.server.ts'
import { setFlashMessage } from '#/lib/session.server.ts'
import { writeLogMessage } from '#/lib/utils.server.ts'
import { redisStorage } from '@better-auth/redis-storage'
import { betterAuth } from 'better-auth'
import { localization } from 'better-auth-localization'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createAuthMiddleware } from 'better-auth/api'
import { magicLink } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

const signInViaMagicLinkRateLimiter = createRateLimiter({
  duration: 60,
  points: 5,
})
const verifyMagicLinkRateLimiter = createRateLimiter({
  duration: 60,
  points: 5,
})
const updateUserRateLimiter = createRateLimiter({
  duration: 60,
  points: 5,
})

export const auth = betterAuth({
  appName: serverEnv.APP_NAME,
  baseURL: serverEnv.BETTER_AUTH_BASE_URL,
  secret: serverEnv.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: false,
  },
  database: drizzleAdapter(getDb(), {
    provider: 'pg',
    schema: {
      user: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
    },
  }),
  plugins: [
    localization({ defaultLocale: 'fa-IR', fallbackLocale: 'default' }),
    magicLink({
      storeToken: 'hashed',
      expiresIn: 5 * 60,
      async sendMagicLink({ email, url }) {
        if (serverEnv.APP_ENV === 'production') {
          sendMagicLink({ to: email, url }).catch((e) => {
            const errorMessage = e instanceof Error ? e.message : String(e)

            writeLogMessage({
              content: `=== MAGIC LINK ===\n[error] ${errorMessage}\n`,
            })
          })
        } else {
          await writeLogMessage({
            content: `=== MAGIC LINK ===\n[email] ${email}\n[url]\n${url}\n`,
          })
        }
      },
    }),
    tanstackStartCookies(),
  ],
  advanced: {
    database: { generateId: false },
  },
  rateLimit: {
    enabled: false,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const { request, path } = ctx

      if (request) {
        if (path === '/sign-in/magic-link') {
          await handleBetterAuthRateLimiting(
            signInViaMagicLinkRateLimiter,
            path,
            request,
          )
        }

        if (path === '/magic-link/verify') {
          const result = await handleBetterAuthRateLimiting(
            verifyMagicLinkRateLimiter,
            path,
            request,
            false,
          )

          if (result?.errorMessage) {
            await setFlashMessage({
              type: 'error',
              message: result.errorMessage,
            })

            return new Response(undefined, {
              headers: {
                location: new URL('/auth', serverEnv.APP_URL).toString(),
              },
              status: 307,
            })
          }
        }

        if (path === '/update-user') {
          await handleBetterAuthRateLimiting(
            updateUserRateLimiter,
            path,
            request,
          )
        }
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      const returned = ctx.context.returned as { headers?: Headers } | null

      if (returned) {
        const location = returned.headers?.get('location')?.toString()

        if (location) {
          const error = new URL(location, serverEnv.APP_URL).searchParams
            .get('error')
            ?.toString()

          if (error) {
            const message = errorMessage[error as ErrorMessageKey] as
              string | undefined

            if (message) {
              await setFlashMessage({ type: 'error', message })
            }

            return
          }

          const success = new URL(location, serverEnv.APP_URL).searchParams
            .get('success')
            ?.toString()

          if (success) {
            const message = successMessage[success as SuccessMessageKey] as
              string | undefined

            if (message) {
              await setFlashMessage({ type: 'success', message })
            }
          }
        }
      }
    }),
  },
  verification: {
    disableCleanup: false,
    storeInDatabase: false,
    storeIdentifier: 'hashed',
  },
  secondaryStorage: redisStorage({
    client: getRedisClient(),
    keyPrefix: 'better-auth:',
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        fieldName: 'role',
      },
    },
  },
})
