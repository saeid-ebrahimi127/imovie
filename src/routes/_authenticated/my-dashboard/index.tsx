import { CustomCard } from '#/components/custom-card.tsx'
import { pageTitle } from '#/lib/head.ts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/my-dashboard/')({
  component: RouteComponent,
  head() {
    return { meta: [{ title: pageTitle('پیشخوان من') }] }
  },
})

function RouteComponent() {
  return (
    <CustomCard
      title={<h1>پیشخوان من</h1>}
      description="برای دسترسی به بخش های مختلف پیشخوان من ، پنل کناری را باز کنید."
    />
  )
}
