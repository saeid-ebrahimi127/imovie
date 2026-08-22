import {
  Sidebar,
  SidebarMenuItemCollapsible,
  SidebarMenuItemLink,
  ToggleSidebarBtn,
} from '#/components/sidebar.tsx'
import { cn } from '#/lib/utils.ts'
import { useLocation } from '@tanstack/react-router'
import { UserIcon } from 'lucide-react'
import { useState } from 'react'

export const AuthenticatedSidebar = () => {
  const [openSidebar, setOpenSidebar] = useState(false)

  const { pathname } = useLocation()

  return (
    <>
      <div
        className={cn('fixed top-[calc(var(--header-height)+0.5rem)] right-4', {
          'invisible opacity-0': openSidebar,
        })}
      >
        <ToggleSidebarBtn
          openSidebar={openSidebar}
          onClick={() => {
            setOpenSidebar(true)
          }}
        />
      </div>
      <Sidebar
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        topClassName="top-(--header-height)"
      >
        <ul className="space-y-1">
          <li>
            <SidebarMenuItemCollapsible
              initialOpenState={pathname.startsWith('/my-dashboard/account')}
              icon={<UserIcon />}
              text="حساب کاربری"
              openSidebar={openSidebar}
            >
              <ul className="mt-1 space-y-1">
                <li>
                  <SidebarMenuItemLink
                    to="/my-dashboard/account/general-info"
                    text="اطلاعات عمومی"
                    className="pr-6"
                  />
                </li>
              </ul>
            </SidebarMenuItemCollapsible>
          </li>
        </ul>
      </Sidebar>
    </>
  )
}
