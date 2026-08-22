import { LoadingSwapBtn } from '#/components/loading-swap-btn.tsx'
import { Button } from '#/components/ui/button.tsx'
import { UserAvatar } from '#/components/user-avatar.tsx'
import { useAxiosErrorHandling } from '#/hooks/use-axios-error-handling.ts'
import { errorMessage, successMessage } from '#/lib/message.ts'
import { avatarZodSchema } from '#/zod-schema/image.ts'
import { useRouteContext, useRouter } from '@tanstack/react-router'
import axios, { AxiosError } from 'axios'
import {
  ImageIcon,
  Trash2Icon,
  UploadCloudIcon,
  XCircleIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export const MyDashboardAccountAvatar = () => {
  const {
    currentUser: { image, name },
  } = useRouteContext({ from: '/_authenticated' })

  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const inputFileRef = useRef<HTMLInputElement | null>(null)

  const [isPending, setIsPending] = useState(false)

  const clearInputFile = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = ''
    }
  }

  useEffect(() => {
    if (!selectedAvatar) return

    const preview = URL.createObjectURL(selectedAvatar)

    setAvatarPreview(preview)

    return () => {
      URL.revokeObjectURL(preview)

      setAvatarPreview(null)
    }
  }, [selectedAvatar])

  const { handler: handleAxiosError } = useAxiosErrorHandling()

  const router = useRouter()

  const uploadOrDeleteAvatar = async (action: 'upload' | 'delete') => {
    try {
      if (action === 'upload') {
        if (!selectedAvatar) return

        setIsPending(true)

        const formData = new FormData()
        formData.set('avatar', selectedAvatar)

        await axios.post('/api/avatar', formData)

        setSelectedAvatar(null)

        toast.success(successMessage.yourAvatarSaved)
      }

      if (action === 'delete') {
        setIsPending(true)

        await axios.delete('/api/avatar')

        toast.success(successMessage.yourAvatarDeleted)
      }

      router.invalidate({
        filter(r) {
          return r.routeId === '__root__'
        },
      })
    } catch (e) {
      if (e instanceof AxiosError) {
        await handleAxiosError(e)

        return
      }

      toast.error(errorMessage.generic)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt={'عکس انتخاب شده'}
            className="size-20 rounded-full object-cover"
          />
        ) : (
          <UserAvatar
            user={{ name, image: image || undefined }}
            avatarClassName="size-20"
            avatarFallbackClassName="text-2xl"
          />
        )}
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-1">
          <p>حداکثر حجم عکس: {avatarZodSchema.maxSizeInMB} مگابایت</p>
          <p>فرمت های مجاز: {avatarZodSchema.prettyValidTypes}</p>
        </div>
        <Button
          type="button"
          variant={'outline'}
          onClick={() => {
            inputFileRef.current?.click()
          }}
          disabled={isPending}
        >
          <ImageIcon />
          انتخاب عکس
        </Button>
        {selectedAvatar && (
          <div className="flex flex-col items-center justify-center gap-y-3">
            <Button
              type="button"
              disabled={isPending}
              variant={'destructive'}
              onClick={() => {
                setSelectedAvatar(null)
              }}
            >
              <XCircleIcon />
              حذف عکس انتخاب شده
            </Button>
            <LoadingSwapBtn
              type="button"
              disabled={isPending}
              onClick={async () => {
                await uploadOrDeleteAvatar('upload')
              }}
            >
              <span className="flex items-center gap-1.5">
                <UploadCloudIcon />
                بارگذاری عکس
              </span>
            </LoadingSwapBtn>
          </div>
        )}
        {image && (
          <LoadingSwapBtn
            type="button"
            disabled={isPending}
            variant={'destructive'}
            onClick={async () => {
              await uploadOrDeleteAvatar('delete')
            }}
          >
            <span className="flex items-center gap-1.5">
              <Trash2Icon />
              حذف عکس کاربری
            </span>
          </LoadingSwapBtn>
        )}
      </div>
      <input
        accept={avatarZodSchema.validMimes.join(',')}
        type="file"
        className="sr-only"
        ref={inputFileRef}
        onChange={(e) => {
          try {
            const file = e.target.files?.[0]

            if (!file) {
              return
            }

            const { success, error } = avatarZodSchema.schema.safeParse(file)

            if (!success) {
              toast.error(z.treeifyError(error).errors[0])

              return
            }

            setSelectedAvatar(file)
          } finally {
            clearInputFile()
          }
        }}
      />
    </>
  )
}
