"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function OrderStatusFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get("status") || "all"

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value === "all") {
      params.delete("status")
    } else {
      params.set("status", value)
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-full md:w-40">
        <SelectValue placeholder="Statut" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les statuts</SelectItem>
        <SelectItem value="pending">En attente</SelectItem>
        <SelectItem value="processing">En cours</SelectItem>
        <SelectItem value="shipped">Expédié</SelectItem>
        <SelectItem value="delivered">Livré</SelectItem>
        <SelectItem value="cancelled">Annulé</SelectItem>
      </SelectContent>
    </Select>
  )
}
