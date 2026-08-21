import { CustomCard } from '#/components/custom-card.tsx'
import { LoadingSwapBtn } from '#/components/loading-swap-btn.tsx'
import { TextInput } from '#/components/text-input.tsx'
import { Button } from '#/components/ui/button.tsx'
import { FieldGroup } from '#/components/ui/field.tsx'
import { authClient } from '#/lib/auth-client.ts'
import {
  errorMessage,
  successMessage,
  toastBetterAuthError,
} from '#/lib/message.ts'
import { nameZodSchema } from '#/zod-schema/name-zod-schema.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouteContext, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const MyDashboardAccountGeneralInfo = () => {
  const {
    currentUser: { name },
  } = useRouteContext({ from: '/_authenticated' })

  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: nameZodSchema,
      }),
    ),
    defaultValues: {
      name,
    },
  })

  const router = useRouter()

  return (
    <CustomCard
      title={<h1>اطلاعات عمومی</h1>}
      description="اطلاعات عمومی خود را اینجا بروز کنید."
    >
      <form
        onSubmit={form.handleSubmit(async (data) => {
          try {
            const { error } = await authClient.updateUser({
              ...data,
            })

            if (error) {
              toastBetterAuthError(error)

              return
            }

            form.resetField('name', { defaultValue: data.name })

            toast.success(successMessage.changesSaved)

            router.invalidate({
              filter(r) {
                return r.routeId === '__root__'
              },
            })
          } catch {
            toast.error(errorMessage.generic)
          }
        })}
      >
        <FieldGroup>
          <TextInput
            control={form.control}
            name="name"
            label="نام"
            inputProps={{
              type: 'text',
              autoComplete: 'on',
              className: 'max-w-sm',
            }}
            autoFocus
          />
          <div className="mr-auto flex items-center gap-2">
            <Button
              type="button"
              disabled={form.formState.isSubmitting}
              variant={'outline'}
              onClick={() => {
                form.reset()
              }}
            >
              پاک کردن
            </Button>
            <LoadingSwapBtn
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              ذخیره
            </LoadingSwapBtn>
          </div>
        </FieldGroup>
      </form>
    </CustomCard>
  )
}
