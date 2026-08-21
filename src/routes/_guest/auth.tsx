import { AuthForm } from '#/components/auth-form.tsx'
import { CustomCard } from '#/components/custom-card.tsx'
import { pageTitle } from '#/lib/head.ts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_guest/auth')({
  component: RouteComponent,
  head() {
    return { meta: [{ title: pageTitle('ثبت نام یا ورود') }] }
  },
})

function RouteComponent() {
  return (
    <div className="mx-auto my-16 max-w-sm">
      <CustomCard
        title={<h1>ثبت نام یا ورود</h1>}
        description="ابتدا ایمیل خود را وارد نمایید."
      >
        <AuthForm />
      </CustomCard>
    </div>
  )
}
