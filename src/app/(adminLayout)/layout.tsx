
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import type React from "react";
import { ReactNode } from "react";

const AdminAuthLayout = async ({children}:{children:ReactNode}) => {
    const session = await auth()
  return (
    <SessionProvider session={session} >
        {children}
    </SessionProvider>
  )
}

export default AdminAuthLayout;