"use client";

import { NextUIProvider } from '@nextui-org/react';
import { AppProvider } from '@contexts/appStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </AppProvider>
  )
};
