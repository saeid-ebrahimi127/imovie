import { appName } from '#/lib/my-utils.ts'

export const pageTitle = (title: string) => {
  return `${appName()} - ${title}`
}
