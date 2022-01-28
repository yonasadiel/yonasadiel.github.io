import type { AppProps } from 'next/app'
import './global.scss'

function Olympus({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default Olympus
