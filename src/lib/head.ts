import { clientEnv } from '#/lib/env/env.client.ts'
import { serverEnv } from '#/lib/env/env.server.ts'
import { createIsomorphicFn } from '@tanstack/react-start'

export const pageTitle = createIsomorphicFn()
  .server((title: string) => {
    return `${serverEnv.APP_NAME} - ${title}`
  })
  .client((title: string) => {
    return `${clientEnv.VITE_APP_NAME} - ${title}`
  })
