import type React from "react";
import "./globals.css";
// import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster";
// import { auth } from "@/lib/auth";
import Providers from "@/components/providers";
// import RouteProgressBar from "@/components/route-progress-bar";

// const inter = Inter({ subsets: ["latin"] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="">
        <Providers >
            {children}
                    <Toaster />
        </Providers>
      </body>
    </html>
  );
}
