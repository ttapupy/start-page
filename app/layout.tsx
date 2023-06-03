import './globals.css'
import { Inter, Montserrat, Figtree } from 'next/font/google';
import Provider from './components/Provider'


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figtree',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'Feed Reader',
  description: 'IT, Science and other stuff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} ${figtree.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
