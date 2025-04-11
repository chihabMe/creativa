import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useIsHydrated } from "@/hooks/use-is-hydrated"
import {motion} from "motion/react"

interface WishlistButtonProps {
  productId: string;
  productName: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export default function WishlistButton({
  productId,
  productName,
  className,
  variant = "outline",
}: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore()
  const { toast } = useToast()
  const hydrated = useIsHydrated()

  const inWishlist = hydrated ? isInWishlist(productId) : false

  const toggleWishlist = () => {
    if (inWishlist) {
      removeItem(productId)
      toast({
        title: "Retiré des favoris",
        description: `${productName} a été retiré de vos favoris.`,
      })
    } else {
      addItem(productId)
      toast({
        title: "Ajouté aux favoris",
        description: `${productName} a été ajouté à vos favoris.`,
      })
    }
  }

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Button
        variant={variant}
        size="icon"
        onClick={toggleWishlist}
        className={cn(className)}
        aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors duration-200",
            inWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
          )}
        />
      </Button>
    </motion.div>
  )
}
