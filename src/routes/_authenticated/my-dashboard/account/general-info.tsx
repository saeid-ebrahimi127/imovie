import { MyDashboardAccountGeneralInfo } from '#/components/_authenticated/my-dashboard/account/general-info.tsx'
import { pageTitle } from '#/lib/head.ts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/my-dashboard/account/general-info',
)({
  component: RouteComponent,
  head() {
    return { meta: [{ title: pageTitle('حساب کاربری - اطلاعات عمومی') }] }
  },
})

function RouteComponent() {
  return <MyDashboardAccountGeneralInfo />
}
