"use client"

import Script from "next/script"

export default function HomeJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CRÉATIVA DÉCO",
    url: "https://creativadeco.com",
    logo: "https://creativadeco.com/logo.svg",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "05 52 79 66 95",
      contactType: "customer service",
      areaServed: "DZ",
      availableLanguage: "French",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dely Brahim rue ahmed Ouaked - devant la banque ABC",
      addressLocality: "Alger",
      addressRegion: "Alger",
      postalCode: "",
      addressCountry: "DZ",
    },
    sameAs: ["https://www.facebook.com/creativadeco", "https://www.instagram.com/creativadeco"],
  }

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
