"use client";
import { CartProvider } from "@/contexts/cart-context";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { Session } from "next-auth";
import { ThemeProvider } from "@/components/theme-provider";

interface ProvidersProps {
  children: ReactNode;
  session: Session | null;
}

const Providers = ({ children, session }: ProvidersProps) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="light">
          <CartProvider>
        {children}
          </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
