import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import { Header } from '#/components/header.tsx'
import { ThemeProvider } from '#/components/theme-provider.tsx'
import { DirectionProvider } from '#/components/ui/direction.tsx'
import { Toaster } from '#/components/ui/sonner.tsx'
import { TooltipProvider } from '#/components/ui/tooltip.tsx'
import { pageTitle } from '#/lib/head.ts'
import { getAppBootstrapData } from '#/servefn/app-bootstrap-data.ts'
import type { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: pageTitle('ساخته شده با Tanstack Start'),
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  async beforeLoad() {
    const { user, flashMessage } = await getAppBootstrapData()

    return { user, flashMessage }
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { flashMessage } = Route.useRouteContext()

  useEffect(() => {
    if (flashMessage) {
      toast[flashMessage.type](flashMessage.message)
    }
  }, [flashMessage])

  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="w-full overflow-x-hidden bg-orange-100 font-sans antialiased dark:bg-zinc-900">
        <DirectionProvider dir="rtl">
          <TooltipProvider>
            <ThemeProvider defaultTheme="system" storageKey="theme">
              <Header />
              <main className="p-8">{children}</main>
            </ThemeProvider>
          </TooltipProvider>
          <Toaster
            closeButton
            expand
            duration={8000}
            className="pointer-events-auto font-sans!"
            position="top-center"
          />
        </DirectionProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
