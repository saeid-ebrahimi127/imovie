import { AuthenticatedSidebar } from '#/components/_authenticated/authenticated-sidebar.tsx'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad({ context: { user } }) {
    if (!user) throw redirect({ to: '/auth', replace: true })

    return { currentUser: user }
  },
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-360">
      <AuthenticatedSidebar />
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  )
}
