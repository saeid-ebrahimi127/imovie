import { Button } from '#/components/ui/button.tsx'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible.tsx'
import { ScrollArea } from '#/components/ui/scroll-area.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx'
import { cn } from '#/lib/utils.ts'
import { Link } from '@tanstack/react-router'
import type { NavigateOptions } from '@tanstack/react-router'
import { ChevronLeftIcon, ChevronUpIcon, PanelRightIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'

export const ToggleSidebarBtn = ({
  openSidebar,
  onClick,
}: {
  openSidebar: boolean
  onClick: () => void
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={'ghost'}
          size={'icon'}
          onClick={onClick}
          className="toggle-sidebar-btn"
        >
          <PanelRightIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        {!openSidebar ? 'باز کردن پنل کناری' : 'بستن پنل'}
      </TooltipContent>
    </Tooltip>
  )
}

export const Sidebar = ({
  openSidebar,
  setOpenSidebar,
  topClassName,
  children,
}: {
  openSidebar: boolean
  setOpenSidebar: (value: boolean) => void
  topClassName: string
  children: ReactNode
}) => {
  useEffect(() => {
    const onDocumentKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenSidebar(false)
      }
    }

    const onDocumentClick = (e: PointerEvent) => {
      const { target } = e

      if (
        target instanceof HTMLElement &&
        !target.classList.contains('toggle-sidebar-btn') &&
        !target.closest('.sidebar')
      ) {
        setOpenSidebar(false)
      }
    }

    document.addEventListener('keydown', onDocumentKeydown)
    document.addEventListener('click', onDocumentClick)

    return () => {
      document.removeEventListener('keydown', onDocumentKeydown)
      document.removeEventListener('click', onDocumentClick)
    }
  }, [])

  return (
    <aside
      className={cn(
        'sidebar fixed right-0 bottom-0 z-50 flex max-h-screen w-64 flex-col border-l bg-white transition-all duration-300 dark:bg-zinc-900',
        topClassName,
        {
          'visible translate-x-0 opacity-100': openSidebar,
          'invisible translate-x-full opacity-0': !openSidebar,
        },
      )}
    >
      <div
        className={cn('mt-2 ml-4 flex justify-end', {
          'invisible opacity-0': !openSidebar,
        })}
      >
        <ToggleSidebarBtn
          openSidebar={openSidebar}
          onClick={() => {
            setOpenSidebar(false)
          }}
        />
      </div>
      <ScrollArea className="mt-4 min-h-0 flex-1 px-2">{children}</ScrollArea>
    </aside>
  )
}

const SidebarMenuItemBtn = (props: ComponentProps<typeof Button>) => {
  return (
    <Button
      {...props}
      variant={props.variant || 'ghost'}
      className={cn('size-full justify-start py-3', props.className)}
    />
  )
}

export const SidebarMenuItemCollapsible = ({
  initialOpenState,
  icon,
  text,
  children,
  openSidebar,
}: {
  initialOpenState: boolean
  icon: ReactNode
  text: ReactNode
  children: ReactNode
  openSidebar: boolean
}) => {
  const [open, setOpen] = useState(initialOpenState)

  useEffect(() => {
    if (!openSidebar) {
      setOpen(initialOpenState)
    }
  }, [openSidebar, initialOpenState])

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <SidebarMenuItemBtn
          className={cn(
            'hover:bg-primary/20! dark:hover:bg-primary/30! hover:text-primary! flex justify-between! dark:hover:text-white!',
            {
              'bg-primary/10! dark:bg-primary/20! text-primary! dark:text-white!':
                open,
            },
          )}
        >
          <span className="flex items-center gap-1.5">
            {icon}
            <span>{text}</span>
          </span>
          <ChevronUpIcon
            className={cn(
              'transition-transform duration-300',
              open ? 'rotate-180' : null,
            )}
          />
        </SidebarMenuItemBtn>
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  )
}

export const SidebarMenuItemLink = ({
  to,
  text,
  className,
}: {
  to: NavigateOptions['to']
  text: string
  className?: string
}) => {
  return (
    <SidebarMenuItemBtn asChild className={className}>
      <Link
        to={to}
        activeProps={{
          className:
            'bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary dark:text-white dark:bg-primary/20 dark:hover:bg-primary/30',
        }}
        inactiveProps={{
          className:
            'hover:bg-primary/20 hover:text-primary dark:hover:bg-primary/30 dark:hover:text-white',
        }}
      >
        <ChevronLeftIcon />
        <span>{text}</span>
      </Link>
    </SidebarMenuItemBtn>
  )
}
