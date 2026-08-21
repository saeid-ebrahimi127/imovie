import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu.tsx'
import { UserAvatar } from '#/components/user-avatar.tsx'
import type { UserRole } from '#/lib/const.ts'
import { Link } from '@tanstack/react-router'
import { Loader2Icon, LogOutIcon, UserIcon } from 'lucide-react'

type LogoutProps = { isPending: boolean; handler: () => Promise<void> }

export const UserDropdown = ({
  user: { name, image, role },
  logout,
}: {
  user: { name: string; image?: string; role: UserRole }
  logout: LogoutProps
}) => {
  const userAvatar = <UserAvatar user={{ name, image }} />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{userAvatar}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            {userAvatar}
            <div className="min-w-0 space-y-1">
              <div className="truncate text-sm text-black dark:text-white">
                {name}
              </div>
              <div className="truncate text-xs">
                {role === 'subscriber' && 'کاربر عادی'}
                {role === 'super_admin' && 'سوپر ادمین'}
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/">
              <UserIcon />
              پیشخوان من
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <LogoutDropdownMenuItem logout={logout} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const LogoutDropdownMenuItem = ({
  logout: { isPending, handler },
}: {
  logout: LogoutProps
}) => {
  return (
    <DropdownMenuItem
      disabled={isPending}
      variant="destructive"
      onSelect={async (e) => {
        e.preventDefault()

        await handler()
      }}
    >
      {isPending ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
      {isPending ? 'در حال خروج...' : 'خروج'}
    </DropdownMenuItem>
  )
}
