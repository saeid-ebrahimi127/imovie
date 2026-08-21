import { serverEnv } from '#/lib/env/env.server.ts'
import { appendFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

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
