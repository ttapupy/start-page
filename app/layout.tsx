import './globals.css'
import {Inter} from 'next/font/google';
import Provider from './components/Provider'


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Feed Reader',
  description: 'IT, Science and other stuff',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body className={`${inter.variable}`}>
      <Provider>{children}</Provider>
      </body>
      </html>
  )
}
