import { auth } from '#/lib/auth.server.ts'
import { serverEnv } from '#/lib/env/env.server.ts'
import { getRequestHeaders, useSession } from '@tanstack/react-start/server'

export const getBetterAuthSession = () => {
  return auth.api.getSession({ headers: getRequestHeaders() })
}

type FlashMessage = { type: 'error' | 'success'; text: string }

const getAppSession = () => {
  return useSession<{ flashMessage: FlashMessage }>({
    name: 'app-session',
    password: serverEnv.APP_SESSION_PASSWORD,
    cookie: {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      httpOnly: true,
      secure: serverEnv.APP_ENV === 'production',
    },
  })
}

export const setFlashMessage = async (flashMessage?: FlashMessage) => {
  const appSession = await getAppSession()

  await appSession.update({ flashMessage })
}

export const getFlashMessage = async () => {
  const appSession = await getAppSession()

  const { flashMessage } = appSession.data

  appSession.update({ flashMessage: undefined })

  return flashMessage
}
