import { errorMessage } from '#/lib/message.ts'
import { useNavigate } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export const useAxiosErrorHandling = () => {
  const navigate = useNavigate()

  const handler = async (e: AxiosError) => {
    const { response } = e

    if (response) {
      const { status } = response

      if (status === 401) {
        await navigate({ to: '/auth', replace: true }).then(() => {
          toast.error(errorMessage.sessionInvalidOrExpired)
        })

        return
      }

      if (
        typeof response.data === 'object' &&
        response.data !== null &&
        'errorMessage' in response.data &&
        typeof response.data.errorMessage === 'string'
      ) {
        toast.error(response.data.errorMessage)

        return
      }
    }

    toast.error(errorMessage.generic)
  }

  return { handler }
}
