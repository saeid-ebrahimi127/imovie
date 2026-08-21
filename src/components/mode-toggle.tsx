import {
  CheckIcon,
  MonitorIcon,
  Moon,
  MoonIcon,
  Sun,
  SunIcon,
} from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ComponentProps } from 'react'

export function ModeToggle({
  TooltipContentProps,
  DropdownMenuContentProps,
}: {
  TooltipContentProps?: ComponentProps<typeof TooltipContent>
  DropdownMenuContentProps?: ComponentProps<typeof DropdownMenuContent>
}) {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">انتخاب پوسته</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent {...TooltipContentProps}>انتخاب پوسته</TooltipContent>
      </Tooltip>
      <DropdownMenuContent {...DropdownMenuContentProps}>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <SunIcon />
          روشن
          {theme === 'light' && <CheckIcon className="mr-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <MoonIcon />
          تاریک
          {theme === 'dark' && <CheckIcon className="mr-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <MonitorIcon />
          سیستم
          {theme === 'system' && <CheckIcon className="mr-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
