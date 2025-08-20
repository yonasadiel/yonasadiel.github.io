import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lateral',
}

export default function LateralLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}