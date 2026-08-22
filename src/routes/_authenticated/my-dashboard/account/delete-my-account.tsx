import { MyDashboardAccountDeleteMyAccount } from '#/components/_authenticated/my-dashboard/account/delete-my-account.tsx'
import { CustomCard } from '#/components/custom-card.tsx'
import { pageTitle } from '#/lib/head.ts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/my-dashboard/account/delete-my-account',
)({
  component: RouteComponent,
  head() {
    return { meta: [{ title: pageTitle('حساب کاربری - حذف حساب کاربری من') }] }
  },
})

function RouteComponent() {
  return (
    <CustomCard
      title={<h1>حذف حساب کاربری من</h1>}
      description={
        <p className="text-destructive">
          برای حذف حساب کاربری خود از دکمه ی زیر استفاده نمایید. این عملیات غیر
          قابل بازگشت است.
        </p>
      }
    >
      <MyDashboardAccountDeleteMyAccount />
    </CustomCard>
  )
}
