import { CustomAlertDialog } from '#/components/custom-alert-dialog.tsx'
import { AlertDialogTrigger } from '#/components/ui/alert-dialog.tsx'
import { Button } from '#/components/ui/button.tsx'
import { errorMessage, successMessage } from '#/lib/message.ts'
import { deleteMyAccount } from '#/servefn/user.ts'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const MyDashboardAccountDeleteMyAccount = () => {
  const [isPending, setIsPending] = useState(false)

  const deleteMyAccountFn = useServerFn(deleteMyAccount)

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  return (
    <CustomAlertDialog
      trigger={
        <AlertDialogTrigger asChild>
          <Button type="button" variant={'destructive'}>
            <TrashIcon />
            حذف حساب کاربری من
          </Button>
        </AlertDialogTrigger>
      }
      isPending={isPending}
      action={async () => {
        try {
          setIsPending(true)

          const { errorMessage } = await deleteMyAccountFn()

          if (errorMessage) {
            toast.error(errorMessage)

            return
          }

          queryClient.removeQueries()

          await navigate({ to: '/auth', replace: true }).then(() => {
            toast.success(successMessage.yourAccountDeleted)
          })
        } catch {
          toast.error(errorMessage.generic)
        } finally {
          setIsPending(false)
        }
      }}
      actionPendingText="در حال حذف..."
      actionText="بله"
      description="آیا مطمئن هستید می خواهید حساب کاربری خود را حذف کنید؟ این عملیات غیر قابل بازگشت است."
    />
  )
}
