import './globals.css'
import { Inter, Montserrat } from 'next/font/google';
import Provider from './components/Provider'


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
 
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'News Feed',
  description: 'Tech and Gastro',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
