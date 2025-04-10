"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import Script from "next/script"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // Generate JSON-LD for breadcrumbs
  const generateJsonLd = () => {
    const itemListElement = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://creativadeco.com",
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: `https://creativadeco.com${item.href}`,
      })),
    ]

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: itemListElement,
    }

    return JSON.stringify(jsonLd)
  }

  return (
    <>
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateJsonLd() }}
      />
      <nav className="mb-4 flex items-center text-sm text-gray-500">
        <Link href="/" className="flex items-center hover:text-black">
          <Home className="mr-1 h-3 w-3" />
          Accueil
        </Link>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <ChevronRight className="mx-2 h-3 w-3" />
            {index === items.length - 1 ? (
              <span className="font-medium text-black">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-black">
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}
