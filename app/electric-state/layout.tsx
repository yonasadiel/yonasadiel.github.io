'use client';

import { store } from './_lib/store'
import { Provider } from 'react-redux'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}