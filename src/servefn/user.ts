import { getDb } from '#/db/index.server.ts'
import { userTable } from '#/db/schema/auth-schema.server.ts'
import { auth } from '#/lib/auth.server.ts'
import { errorMessage } from '#/lib/message.ts'
import { createRateLimitingMiddleware } from '#/middleware/rate-limiting.ts'
import { requireAuthMiddleware } from '#/middleware/require-auth.ts'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'

export const deleteMyAccount = createServerFn({ method: 'POST' })
  .middleware([
    requireAuthMiddleware,
    createRateLimitingMiddleware({
      key: 'delete-my-account',
      duration: 60,
      points: 5,
    }),
  ])
  .handler(async ({ context: { currentUser, rateLimitingErrorMessage } }) => {
    if (rateLimitingErrorMessage) {
      return { errorMessage: rateLimitingErrorMessage }
    }

    await auth.api.revokeSessions({ headers: getRequestHeaders() })

    const [deletedUser] = await getDb()
      .delete(userTable)
      .where(eq(userTable.id, currentUser.id))
      .returning({ id: userTable.id })

    if (!deletedUser)
      return { errorMessage: errorMessage.failedDeletingYourAccount }

    return { errorMessage: null }
  })
