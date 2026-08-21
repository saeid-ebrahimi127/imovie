import { EmailLogo } from '#/components/email/email-logo.tsx'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from 'react-email'

export default function MagicLink({ url }: { url: string }) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            fontFamily: {
              sans: ['Vazirmatn', 'Inter', 'sans-serif'],
            },
          },
        },
      }}
    >
      <Html lang="fa-IR" dir="rtl">
        <Head>
          <title>لینک جادویی</title>
          <style>
            {`@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Vazirmatn:wght@100..900&display=swap');`}
          </style>
        </Head>
        <Preview>لینک جادویی</Preview>
        <Body dir="rtl" className="bg-gray-100 font-sans antialiased">
          <Container className="my-16 rounded-xl border border-gray-200 bg-white p-4">
            <EmailLogo />
            <Heading className="text-xl font-medium">لینک جادویی</Heading>
            <Text className="text-base">با سلام 👋</Text>
            <Text>برای ادامه روی دکمه ی (لینک) زیر کلیک کنید.</Text>
            <Text className="flex items-center justify-center">
              <Button
                href={url}
                target="_blank"
                className="cursor-pointer rounded-xl bg-[#ca3500] px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-[#ca3500]/80"
              >
                لینک جادویی
              </Button>
            </Text>
            <Text>
              دقت نمایید که لینک مورد نظر فقط تا 5 دقیقه ی دیگر قابل استفاده
              خواهد بود.
            </Text>
            <Hr />
            <Text className="text-xs text-gray-600">
              در صورتی که این ایمیل به اشتباه برای شما ارسال شده است ، آن را
              نادیده بگیرید.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}
