"use client";
import { CartProvider } from "@/contexts/cart-context";
// import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { Session } from "next-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { LazyMotion, domAnimation } from "motion/react";

interface ProvidersProps {
  children: ReactNode;
  session?: Session | null;
}

const Providers = ({ children}: ProvidersProps) => {
  return (
    // <SessionProvider session={session}>
      <LazyMotion features={domAnimation}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </LazyMotion>
    // </SessionProvider>
  );
};

export default Providers;
