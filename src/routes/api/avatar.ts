import { auth } from '#/lib/auth.server.ts'
import { serverEnv } from '#/lib/env/env.server.ts'
import { deleteImage, resizeImage, storeImage } from '#/lib/utils.server.ts'
import { requireAuthMiddlewareApi } from '#/middleware/require-auth.ts'
import { avatarZodSchema } from '#/zod-schema/image.ts'
import { createFileRoute } from '@tanstack/react-router'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'

export const Route = createFileRoute('/api/avatar')({
  server: {
    handlers({ createHandlers }) {
      return createHandlers({
        POST: {
          middleware: [requireAuthMiddlewareApi],
          async handler({ request, context: { currentUser } }) {
            try {
              const formData = await request.formData()

              const {
                success,
                error,
                data: avatar,
              } = avatarZodSchema.schema.safeParse(formData.get('avatar'))

              if (!success) {
                return Response.json(
                  { errorMessage: z.treeifyError(error).errors[0] },
                  { status: 400 },
                )
              }

              const avatarResizedBuffer = await resizeImage(
                await avatar.arrayBuffer(),
                {
                  width: 300,
                  height: 300,
                },
              )

              const { fileName } = await storeImage(avatarResizedBuffer)

              await auth.api.updateUser({
                body: {
                  image: new URL(
                    `/api/image/${fileName}`,
                    serverEnv.APP_URL,
                  ).toString(),
                },
                headers: getRequestHeaders(),
              })

              if (currentUser.image) {
                await deleteImage(currentUser.image)
              }

              return Response.json({}, { status: 201 })
            } catch {
              return Response.json({}, { status: 500 })
            }
          },
        },
      })
    },
  },
})
