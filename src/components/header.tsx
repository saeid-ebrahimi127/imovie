import { Logo } from '#/components/logo.tsx'

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border border-b bg-white p-4 px-8 dark:bg-zinc-900">
      <Logo />
    </header>
  )
}
