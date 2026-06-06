import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'For Her',
  description: 'A letter, written just for her',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
