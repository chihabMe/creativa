"use client"

import { Facebook, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface SocialShareProps {
  url: string
  title: string
  description?: string
}

export default function SocialShare({ url, title  }: SocialShareProps) {
  const { toast } = useToast()

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  // const encodedDescription = description ? encodeURIComponent(description) : ""

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  // const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  // const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`

  const handleShare = (platform: string, shareUrl: string) => {
    window.open(shareUrl, `share-${platform}`, "width=600,height=400")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papiers.",
        })
      },
      () => {
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien.",
          variant: "destructive",
        })
      },
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">Partager :</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => handleShare("facebook", facebookUrl)}
      >
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Partager sur Facebook</span>
      </Button>
      {/* <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full bg-sky-500 text-white hover:bg-sky-600"
        onClick={() => handleShare("twitter", twitterUrl)}
      >
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Partager sur Twitter</span>
      </Button> */}
      {/* <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full bg-blue-700 text-white hover:bg-blue-800"
        onClick={() => handleShare("linkedin", linkedinUrl)}
      >
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">Partager sur LinkedIn</span>
      </Button> */}
      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={copyToClipboard}>
        <LinkIcon className="h-4 w-4" />
        <span className="sr-only">Copier le lien</span>
      </Button>
    </div>
  )
}
