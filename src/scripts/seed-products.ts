import { db } from "@/lib/db";
import { products, categories, productCategories } from "@/lib/db/schema";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();
const initialProducts = [
  {
    name: "ISLAMIQUE NUANCE DE MARRON",
    price: 3900,
    image: "/images/products/ISLAMIQUE_NUANCE_DE_MARRON.jpg",
  },
  {
    name: "Ambre urbaine - orange marron beige abstrait",
    price: 3800,
    image: "/images/products/Ambre_urbaine_-_orange_marron_beige_abstrait.jpg",
  },
  {
    name: "Islamique doré fond marbré",
    price: 3900,
    image: "/images/products/Islamique_doré_fond_marbré.jpg",
  },
  {
    name: "Automne vibes",
    price: 3900,
    image: "/images/products/Automne_vibes.jpg",
  },
  {
    name: "Botanique rose",
    price: 3900,
    image: "/images/products/Botanique_rose.jpg",
  },
  {
    name: "Branche D'arbre Gold",
    price: 3000,
    image: "/images/products/Branche_Darbre_Gold.jpg",
  },
  {
    name: "Trio kalimate كلمات ( modele amira riaa )",
    price: 3900,
    image: "/images/products/Trio_kalimate_كلمات__modele_amira_riaa.jpg",
  },
  {
    name: "Botanique brique vert",
    price: 3900,
    image: "/images/products/Botanique_brique_vert.jpg",
  },
  {
    name: "Abstrait Montagne Beige Noir",
    price: 4800,
    image: "/images/products/Abstrait_Montagne_Beige_Noir.jpg",
  },
  {
    name: "The Brush Nude",
    price: 3900,
    image: "/images/products/The_Brush_Nude.jpg",
  },
  {
    name: "Mandala Marron TOILE",
    price: 3200,
    image: "/images/products/Mandala_Marron_TOILE.jpg",
  },
  {
    name: "Plume Bleu",
    price: 4600,
    image: "/images/products/Plume_Bleu.jpg",
  },
  {
    name: "Botanique marron vert",
    price: 4800,
    image: "/images/products/Botanique_marron_vert.jpg",
  },
  {
    name: "Flower Beige aesthetic",
    price: 3900,
    image: "/images/products/Flower_Beige_aesthetic.jpg",
  },
  {
    name: "Marron minimaliste line",
    price: 3100,
    image: "/images/products/Marron_minimaliste_line.jpg",
  },
  {
    name: "Boho Vert",
    price: 4800,
    image: "/images/products/Boho_Vert.jpg",
  },
];
const seedInitialProducts = async () => {};

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
  ];

  const count = faker.number.int({ min: 2, max: 4 });
  const selectedSizes = faker.helpers.arrayElements(sizeOptions, count);

  return selectedSizes.map((s) => ({
    size: s.size,
    price: s.basePrice + faker.number.int({ min: -200, max: 500 }),
  }));
};

const generateFrames = () => {
  const frameOptions = [
    { frame: "black", basePrice: 400 },
    { frame: "white", basePrice: 400 },
    { frame: "gold", basePrice: 700 },
    { frame: "silver", basePrice: 600 },
    { frame: "walnut", basePrice: 550 },
    { frame: "antique gold", basePrice: 800 },
    { frame: "dark wood", basePrice: 650 },
  ];

  const count = faker.number.int({ min: 2, max: 4 });
  const selectedFrames = faker.helpers.arrayElements(frameOptions, count);

  return selectedFrames.map((f) => ({
    frame: f.frame,
    price: f.basePrice + faker.number.int({ min: -50, max: 100 }),
  }));
};

const generateBadge = (): "none" | "new" | "bestseller" | "sale" => {
  const badges: ("none" | "new" | "bestseller" | "sale")[] = [
    "none",
    "new",
    "bestseller",
    "sale",
  ];
  const weights = [0.4, 0.2, 0.2, 0.2]; // 40% none, 20% new, 20% bestseller, 20% sale

  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) return badges[i];
  }
  return "none";
};

const generateImages = () => {
  const count = faker.number.int({ min: 2, max: 5 }); // Generate between 2 and 5 images
  return Array.from({ length: count }, () =>
    faker.image.urlPicsumPhotos({ width: 800, height: 600 })
  );
};

async function seedDatabase() {
  try {
    // Clear existing data (optional)
    await db.delete(productCategories);
    await db.delete(products);
    await db.delete(categories);

    console.log("Existing data cleared.");

    // Define category groups
    const categoryGroups = [
      {
        groupName: "Modèles",
        categories: [
          { name: "Portraits", description: "Beautiful portrait artwork" },
          { name: "Figures", description: "Artistic figure studies" },
          { name: "Silhouettes", description: "Elegant silhouette designs" },
        ],
      },
      {
        groupName: "Styles",
        categories: [
          { name: "Abstract", description: "Modern abstract artwork" },
          { name: "Minimalist", description: "Clean minimalist designs" },
          { name: "Contemporary", description: "Contemporary art pieces" },
          { name: "Vintage", description: "Classic vintage-inspired artwork" },
          { name: "Watercolor", description: "Delicate watercolor paintings" },
        ],
      },
      {
        groupName: "Catégories",
        categories: [
          { name: "Landscape", description: "Beautiful landscape paintings" },
          { name: "Nature", description: "Nature-inspired artwork" },
          { name: "Urban", description: "City and urban scenes" },
          { name: "Photography", description: "Fine art photography" },
          { name: "Illustration", description: "Hand-drawn illustrations" },
        ],
      },
    ];

    // Prepare categories for insertion with UUIDs
    const categoryData: {
      id: string;
      name: string;
      slug: string;
      description: string;
      featured: boolean;
      displayOrder: number;
      groupName: string;
      createdAt: Date;
      updatedAt: Date;
    }[] = [];
    const categoryMap = new Map(); // To store category id by name for later use
    let displayOrder = 0;

    categoryGroups.forEach((group) => {
      group.categories.forEach((category) => {
        const categoryId = uuidv4();
        categoryMap.set(category.name, categoryId);

        categoryData.push({
          id: categoryId,
          name: category.name,
          slug: faker.helpers.slugify(category.name).toLowerCase(),
          description: category.description,
          featured: faker.datatype.boolean({ probability: 0.2 }),
          displayOrder: displayOrder++,
          groupName: group.groupName,
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: faker.date.recent({ days: 30 }),
        });
      });
    });

    // Insert all categories
    await db.insert(categories).values(categoryData);
    console.log(`Successfully seeded ${categoryData.length} categories.`);

    // Generate products
    const productCount = 4;
    const productData = [];
    const productCategoryRelations: {
      productId: string;
      categoryId: string;
    }[] = [];

    initialProducts.forEach(async (product) => {
      productData.push({
        id: uuidv4(),
        name: product.name,
        slug: faker.helpers.slugify(product.name).toLowerCase(),
        description: faker.lorem.paragraph(),
        price: product.price,
        stock: faker.number.int({ min: 5, max: 100 }),
        badge: generateBadge(),
        featured: faker.datatype.boolean({ probability: 0.3 }),
        images: [product.image],
        sizes: generateSizes(),
        frames: generateFrames(),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent({ days: 30 }),
      });
    });

    for (let i = 0; i < productCount; i++) {
      const productId = uuidv4();
      const name = faker.commerce.productName();
      const basePrice = faker.number.int({ min: 1500, max: 5000 });

      // Create product
      productData.push({
        id: productId,
        name,
        slug: faker.helpers.slugify(`${name}-${basePrice}`).toLowerCase(),
        description: faker.lorem.paragraph(),
        price: basePrice,
        stock: faker.number.int({ min: 5, max: 100 }),
        badge: generateBadge(),
        featured: faker.datatype.boolean({ probability: 0.3 }),
        images: generateImages(),
        sizes: generateSizes(),
        frames: generateFrames(),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent({ days: 30 }),
      });

      // Create product-category relationships
      // Randomly assign 1-3 categories to each product
      const categoryCount = faker.number.int({ min: 1, max: 3 });
      const allCategoryNames = Array.from(categoryMap.keys());
      const selectedCategories = faker.helpers.arrayElements(
        allCategoryNames,
        categoryCount
      );

      selectedCategories.forEach((categoryName) => {
        const categoryId = categoryMap.get(categoryName);
        productCategoryRelations.push({
          productId,
          categoryId,
        });
      });
    }

    // Insert all products
    await db.insert(products).values(productData);

    // Insert product-category relationships
    if (productCategoryRelations.length > 0) {
      await db.insert(productCategories).values(productCategoryRelations);
    }

    console.log(
      `Successfully seeded ${productCount} products with ${productCategoryRelations.length} category relationships.`
    );
    console.log("Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    } else {
      console.error("An unknown error occurred:", error);
    }
    process.exit(1);
  }
}

seedDatabase();
