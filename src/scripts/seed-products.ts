import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { faker } from "@faker-js/faker"
import dotenv from "dotenv"
dotenv.config()

// Helper functions for product generation
const generateSizes = () => {
  const sizeOptions = [
    { size: "8x10", basePrice: 2000 },
    { size: "11x14", basePrice: 3000 },
    { size: "16x20", basePrice: 4000 },
    { size: "12x12", basePrice: 2500 },
    { size: "18x18", basePrice: 3500 },
    { size: "A4", basePrice: 1500 },
    { size: "A3", basePrice: 2500 },
  ]
  
  const count = faker.number.int({ min: 2, max: 4 })
  const selectedSizes = faker.helpers.arrayElements(sizeOptions, count)
  
  return selectedSizes.map(s => ({
    size: s.size,
    price: s.basePrice + faker.number.int({ min: -200, max: 500 })
  }))
}

const generateFrames = () => {
  const frameOptions = [
    { frame: "black", basePrice: 400 },
    { frame: "white", basePrice: 400 },
    { frame: "gold", basePrice: 700 },
    { frame: "silver", basePrice: 600 },
    { frame: "walnut", basePrice: 550 },
    { frame: "antique gold", basePrice: 800 },
    { frame: "dark wood", basePrice: 650 },
  ]
  
  const count = faker.number.int({ min: 2, max: 4 })
  const selectedFrames = faker.helpers.arrayElements(frameOptions, count)
  
  return selectedFrames.map(f => ({
    frame: f.frame,
    price: f.basePrice + faker.number.int({ min: -50, max: 100 })
  }))
}

const generateCategories = () => {
  const categories = [
    "portraits", "abstract", "landscape", "modern", 
    "classic", "photography", "illustration", 
    "vintage", "posters", "minimalist", "contemporary"
  ]
  
  return faker.helpers.arrayElements(categories, faker.number.int({ min: 1, max: 3 }))
}

const generateBadge = (): "new" | "bestseller" | "none" | "sale" => {
  const weights = [0.2, 0.2, 0.4, 0.2] // 20% new, 20% bestseller, 40% none, 20% sale
  const options = ["new", "bestseller", "none", "sale"] as const
  const weightedIndex = faker.number.int({ min: 0, max: weights.length - 1 })
  return options[weightedIndex]
}

const generateImages = () => {
  const count = faker.number.int({ min: 1, max: 3 })
  return Array.from({ length: count }, () => 
    faker.image.urlLoremFlickr({ category: 'art' }))
}

async function seedProducts() {
  try {

    // Generate 20 random products
    const productCount = 30
    const sampleProducts = Array.from({ length: productCount }, () => {
      const name = faker.commerce.productName()
      const basePrice = faker.number.int({ min: 1500, max: 5000 })
      
      return {
        name,
        slug: faker.helpers.slugify(name).toLowerCase(),
        description: faker.lorem.paragraph(),
        price: basePrice,
        stock: faker.number.int({ min: 5, max: 100 }),
        badge: generateBadge(),
        featured: faker.datatype.boolean({ probability: 0.3 }),
        images: generateImages(),
        categories: generateCategories(),
        sizes: generateSizes(),
        frames: generateFrames(),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent({ days: 30 }),
      }
    })

    // Insert all generated products
    await db.insert(products).values(sampleProducts)

    console.log(`Successfully seeded ${productCount} products.`)
    process.exit(0)
  } catch (error) {
    console.error("Error seeding products:", error)
    process.exit(1)
  }
}

seedProducts()