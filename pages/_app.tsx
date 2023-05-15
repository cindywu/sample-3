import '../styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <div className={'flex flex-col pt-4 justify-center items-center'}>
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  )
}
