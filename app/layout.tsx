import { LayoutProps } from '../.next/types/app/layout'
import { Roboto } from 'next/font/google'
import './global.css'
import './global.scss'

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})

const Olympus = ({ children }: LayoutProps) => {
  return (
    <html className={roboto.className}>
      <head>
        <link rel="icon" type="image/x-icon" href="/assets/favicon-32.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}

export default Olympus
