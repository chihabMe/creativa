import { type NextRequest, NextResponse } from "next/server"
import { getProductsByIds } from "@/lib/data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const idsParam = searchParams.get("ids")

  if (!idsParam) {
    return NextResponse.json({ error: "No product IDs provided" }, { status: 400 })
  }

  try {
    const ids = idsParam.split(",").map((id) => Number.parseInt(id, 10))
    const products = await getProductsByIds(ids)

    // Return products in the same order as the requested IDs
    const orderedProducts = ids.map((id) => products.find((product) => product.id === id)).filter(Boolean)

    return NextResponse.json(orderedProducts)
  } catch (error) {
    console.error("Error fetching recently viewed products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
