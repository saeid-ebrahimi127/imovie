import { MyDashboardAccount } from '#/components/_authenticated/my-dashboard/account/account.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs.tsx'
import { pageTitle } from '#/lib/head.ts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/my-dashboard')({
  component: RouteComponent,
  head() {
    return { meta: [{ title: pageTitle('پیشخوان من') }] }
  },
})

function RouteComponent() {
  return (
    <Tabs defaultValue="account">
      <TabsList className="h-auto! flex-wrap">
        <TabsTrigger value="account">حساب کاربری</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <MyDashboardAccount />
      </TabsContent>
    </Tabs>
  )
}
