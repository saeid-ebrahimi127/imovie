import { Logo } from '#/components/logo.tsx'
import { ModeToggle } from '#/components/mode-toggle.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx'
import { UserDropdown } from '#/components/user-dropdown.tsx'
import { useLogout } from '#/hooks/use-logout.ts'
import { Link, useRouteContext } from '@tanstack/react-router'
import { UserKey } from 'lucide-react'

export const Header = () => {
  const { user } = useRouteContext({ from: '__root__' })

  const logout = useLogout()

  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) items-center justify-between gap-4 border border-b bg-white p-4 px-8 dark:bg-zinc-900">
      <Logo />
      <div className="flex items-center gap-2">
        {user ? (
          <UserDropdown
            user={{
              name: user.name,
              image: user.image || undefined,
              role: user.role,
            }}
            logout={logout}
          />
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant={'outline'} size={'icon'}>
                <Link to="/auth">
                  <UserKey />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>ثبت نام یا ورود</TooltipContent>
          </Tooltip>
        )}
        <ModeToggle
          TooltipContentProps={{ align: 'end' }}
          DropdownMenuContentProps={{ align: 'end' }}
        />
      </div>
    </header>
  )
}
