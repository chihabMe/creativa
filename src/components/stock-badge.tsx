import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface StockBadgeProps {
  stock: number
  lowStockThreshold?: number
}

export default function StockBadge({ stock, lowStockThreshold = 5 }: StockBadgeProps) {
  if (stock <= 0) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Rupture de stock
      </Badge>
    )
  }

  if (stock <= lowStockThreshold) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 border-yellow-500 bg-yellow-100 text-yellow-800">
        <AlertCircle className="h-3 w-3" />
        Stock limité ({stock} restant{stock > 1 ? "s" : ""})
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1 border-green-500 bg-green-100 text-green-800">
      <CheckCircle className="h-3 w-3" />
      En stock
    </Badge>
  )
}
