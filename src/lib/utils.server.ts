import { serverEnv } from '#/lib/env/env.server.ts'
import { nanoid } from 'nanoid'
import { appendFile, mkdir, rm, writeFile } from 'node:fs/promises'
import { isIP } from 'node:net'
import { resolve } from 'node:path'
import sharp from 'sharp'
import type { SharpInput } from 'sharp'

const logDirPath = resolve(process.cwd(), 'log')
const appLogFilePath = resolve(logDirPath, 'app.log')

const ensureLogDirExists = async () => {
  await mkdir(logDirPath, { recursive: true })
}

export const writeLogMessage = async ({ content }: { content: string }) => {
  await ensureLogDirExists()

  await appendFile(
    appLogFilePath,
    `${new Date().toLocaleString('fa-IR')}\n${content}\n`,
    'utf-8',
  )
}

export const devWipeLogMessages = async () => {
  if (serverEnv.APP_ENV === 'production') {
    console.error("you can't wipe log messages in production.")

    return
  }

  await ensureLogDirExists()

  await writeFile(appLogFilePath, '', 'utf-8')
}

export function getClientIP(request: Request): string {
  const headers = [
    'cf-connecting-ip',
    'true-client-ip',
    'fastly-client-ip',
    'x-real-ip',
    'x-client-ip',
    'x-forwarded-for',
  ]

  for (const header of headers) {
    const value = request.headers.get(header)

    if (!value) continue

    const ip = value.split(',')[0]?.trim()

    if (ip && isIP(ip)) {
      return ip
    }
  }

  return 'unknown'
}

export const resizeImage = (
  image: SharpInput,
  { width, height }: { width: number; height: number },
) => {
  return sharp(image).resize({ width, height }).toFormat('webp').toBuffer()
}

const uploadsDirPath = resolve(process.cwd(), 'uploads')
const imagesDirPath = resolve(uploadsDirPath, 'images')

const ensureImagesDirExists = async () => {
  await mkdir(imagesDirPath, { recursive: true })
}

export const storeImage = async (buffer: Buffer) => {
  await ensureImagesDirExists()

  const fileName = `${nanoid()}.webp`

  await writeFile(resolve(imagesDirPath, fileName), buffer)

  return { fileName }
}

export const deleteImage = async (path: string) => {
  if (path.startsWith(serverEnv.APP_URL)) {
    await ensureImagesDirExists()

    const fileName = path.split('/').at(-1)

    if (fileName) {
      await rm(resolve(imagesDirPath, fileName), {
        force: true,
      })
    }
  }
}

export const devWipeUploads = async () => {
  if (serverEnv.APP_ENV === 'production') {
    console.error("you can't wipe uploads in production.")

    return
  }

  await Promise.all([rm(imagesDirPath, { force: true, recursive: true })])
}
