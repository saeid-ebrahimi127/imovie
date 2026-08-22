import { MyDashboardAccountAvatar } from '#/components/_authenticated/my-dashboard/account/avatar.tsx'
import { CustomCard } from '#/components/custom-card.tsx'
import { pageTitle } from '#/lib/head.ts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/my-dashboard/account/avatar',
)({
  component: RouteComponent,
  head() {
    return { meta: [{ title: pageTitle('حساب کاربری - عکس کاربری') }] }
  },
})

function RouteComponent() {
  return (
    <CustomCard
      title={<h1>عکس کاربری</h1>}
      description="در اینجا می توانید عکس کاربری خود را تغییر دهید."
    >
      <MyDashboardAccountAvatar />
    </CustomCard>
  )
}
