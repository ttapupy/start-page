"use client";

import { ThemeProvider } from "next-themes";
import { FC, ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="theme"
    >
      {children}
    </ThemeProvider>
  );
};

export default Provider;
