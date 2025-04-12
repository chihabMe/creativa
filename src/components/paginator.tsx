"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"

interface PaginationProps {
  totalPages: number
  currentPage: number
  baseUrl: string
}

export function Paginator({ totalPages, currentPage, baseUrl }: PaginationProps) {
  // If there's only 1 page or less, don't show pagination
  if (totalPages <= 1) {
    return null
  }

  // Function to create page URL with correct pagination
  const createPageUrl = (pageNumber: number) => {
    // Handle separators in the URL properly
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}page=${pageNumber}`
  }

  // Create an array of page numbers to display
  const getPageNumbers = () => {
    const pages = []
    
    // Always show first page
    pages.push(1)
    
    // Calculate range to show
    const rangeStart = Math.max(2, currentPage - 1)
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1)
    
    // Add ellipsis after first page if necessary
    if (rangeStart > 2) {
      pages.push('ellipsis-start')
    }
    
    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }
    
    // Add ellipsis before last page if necessary
    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis-end')
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center space-x-2">
      {/* First page button */}
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === 1}
      >
        <Link href={createPageUrl(1)}>
          <ChevronsLeft className="h-4 w-4" />
        </Link>
      </Button>
      
      {/* Previous page button */}
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === 1}
      >
        <Link href={createPageUrl(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <Button
              key={`ellipsis-${index}`}
              variant="outline"
              size="icon"
              disabled
            >
              ...
            </Button>
          )
        }
        
        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            asChild={currentPage !== page}
            disabled={currentPage === page}
          >
            {currentPage !== page ? (
              <Link href={createPageUrl(page as number)}>
                {page}
              </Link>
            ) : (
              <span>{page}</span>
            )}
          </Button>
        )
      })}
      
      {/* Next page button */}
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === totalPages}
      >
        <Link href={createPageUrl(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
      
      {/* Last page button */}
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === totalPages}
      >
        <Link href={createPageUrl(totalPages)}>
          <ChevronsRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}