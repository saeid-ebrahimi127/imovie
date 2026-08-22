import { z } from 'zod'

export const createImageZodSchema = (
  maxSizeInBytes = 2 * 1024 * 1024,
  validMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
) => {
  const maxSizeInMB = maxSizeInBytes / 1024 / 1024
  const prettyValidTypes = validMimes
    .map((mime) => mime.split('/')[1])
    .join(' ، ')

  const schema = z
    .instanceof(File, { error: 'فایلی یافت نشد.' })
    .refine((file) => {
      return file.size > 0
    }, 'فایل خالی است.')
    .refine((file) => {
      return file.size <= maxSizeInBytes
    }, `حداکثر حجم فایل ${maxSizeInMB} مگابایت است.`)
    .refine((file) => {
      return validMimes.includes(file.type)
    }, `فرمت های مجاز: ${prettyValidTypes}`)

  return { schema, maxSizeInMB, validMimes, prettyValidTypes }
}

export const avatarZodSchema = createImageZodSchema()
