'use client'


import { ThemeProvider } from 'next-themes'
import type { FC, ReactNode } from 'react'

interface ProviderProps {
  children: ReactNode
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}

export default Provider;