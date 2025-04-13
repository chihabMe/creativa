import { type NextRequest, NextResponse } from "next/server"
import { getProductsByIds } from "@/lib/data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const idsParam = searchParams.get("ids")

  if (!idsParam) {
    return NextResponse.json({ error: "No product IDs provided" }, { status: 400 })
  }

  try {
    const ids = idsParam.split(",")
    console.log(ids)
    const products = await getProductsByIds(ids)
    console.log("---------",products)

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching wishlist products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
