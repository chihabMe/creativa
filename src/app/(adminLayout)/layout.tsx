"use client";

import { SessionProvider } from "next-auth/react";
import type React from "react";
import { ReactNode } from "react";

const AdminAuthLayout = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AdminAuthLayout;
