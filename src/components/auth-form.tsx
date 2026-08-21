import { LoadingSwapBtn } from '#/components/loading-swap-btn.tsx'
import { TextInput } from '#/components/text-input.tsx'
import { FieldGroup } from '#/components/ui/field.tsx'
import { authClient } from '#/lib/auth-client.ts'
import {
  errorMessage,
  successMessage,
  toastBetterAuthError,
} from '#/lib/message.ts'
import { emailZodSchema } from '#/zod-schema/email-zod-schema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const AuthForm = () => {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: emailZodSchema,
      }),
    ),
    defaultValues: {
      email: '',
    },
  })

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        try {
          const { error } = await authClient.signIn.magicLink({
            ...data,
            name: 'بی نام',
            callbackURL: '/?success=loggedIn',
            newUserCallbackURL: '/?success=newUser',
            errorCallbackURL: '/auth',
          })

          if (error) {
            toastBetterAuthError(error)

            return
          }

          form.reset()

          toast.success(successMessage.magicLinkSent)
        } catch {
          toast.error(errorMessage.generic)
        }
      })}
    >
      <FieldGroup>
        <TextInput
          control={form.control}
          name="email"
          inputProps={{
            type: 'email',
            placeholder: 'ایمیل',
            autoComplete: 'on',
          }}
          autoFocus
        />
        <LoadingSwapBtn type="submit" disabled={form.formState.isSubmitting}>
          ارسال لینک جادویی
        </LoadingSwapBtn>
      </FieldGroup>
    </form>
  )
}
