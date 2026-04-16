import type { Metadata } from 'next'
import { DM_Sans, Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-display',
})

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'NearU Social',
  description: 'Hyperlocal social networking MVP with a production-ready mobile UI concept.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${dmSans.variable} ${notoSansKr.variable}`}>{children}</body>
    </html>
  )
}
