import { createSafeActionClient } from "next-safe-action"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const action = createSafeActionClient()

export const adminAction = createSafeActionClient().use(async ({ next }) => {  
  const session = await getServerSession(authOptions)
  if (!session || !session.user) throw new Error("Unauthorized user")

  return next({ ctx: { user: session.user } })
})

