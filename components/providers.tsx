'use client';

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/useCart";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <CartProvider>
        <ToastProvider>
          {children}
          <Toaster position="top-center" />
        </ToastProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
