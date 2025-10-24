"use client";
import { CartProvider } from "@/contexts/cart-context";
// import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { Session } from "next-auth";
import { LazyMotion, domAnimation } from "motion/react";

interface ProvidersProps {
  children: ReactNode;
  session?: Session | null;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    // <SessionProvider session={session}>
    <LazyMotion features={domAnimation}>
      <CartProvider>{children}</CartProvider>
    </LazyMotion>
    // </SessionProvider>
  );
};

export default Providers;
