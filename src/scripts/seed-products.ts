import { db } from "@/lib/db";
import { products, categories, productCategories } from "@/lib/db/schema";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

dotenv.config();

type ProductType = "Cadre avec Verre" | "Toile" | "Toile avec cadre";

const PRODUCT_TYPES: ProductType[] = [
  "Cadre avec Verre",
  "Toile",
  "Toile avec cadre",
];

const DEFAULT_FRAME_COLORS = ["Noir", "Blanc", "Bois"];

const FIXED_DIMENSIONS = [
  { size: "23x32 cm", price: 2500 },
  { size: "32x44 cm", price: 3800 },
  { size: "44x62 cm", price: 5700 },
  { size: "52x72 cm", price: 7500 },
  { size: "62x82 cm", price: 9500 },
];

const initialProducts = [
  { name: "ISLAMIQUE NUANCE DE MARRON", image: "/images/products/ISLAMIQUE_NUANCE_DE_MARRON.jpg" },
  { name: "Ambre urbaine - orange marron beige abstrait", image: "/images/products/Ambre_urbaine_-_orange_marron_beige_abstrait.jpg" },
  { name: "Islamique doré fond marbré", image: "/images/products/Islamique_doré_fond_marbré.jpg" },
  { name: "Automne vibes", image: "/images/products/Automne_vibes.jpg" },
  { name: "Botanique rose", image: "/images/products/Botanique_rose.jpg" },
  { name: "Branche D'arbre Gold", image: "/images/products/Branche_Darbre_Gold.jpg" },
  { name: "Trio kalimate كلمات ( modele amira riaa )", image: "/images/products/Trio_kalimate_كلمات__modele_amira_riaa.jpg" },
  { name: "Botanique brique vert", image: "/images/products/Botanique_brique_vert.jpg" },
  { name: "Abstrait Montagne Beige Noir", image: "/images/products/Abstrait_Montagne_Beige_Noir.jpg" },
  { name: "The Brush Nude", image: "/images/products/The_Brush_Nude.jpg" },
  { name: "Mandala Marron TOILE", image: "/images/products/Mandala_Marron_TOILE.jpg" },
  { name: "Plume Bleu", image: "/images/products/Plume_Bleu.jpg" },
  { name: "Botanique marron vert", image: "/images/products/Botanique_marron_vert.jpg" },
  { name: "Flower Beige aesthetic", image: "/images/products/Flower_Beige_aesthetic.jpg" },
  { name: "Marron minimaliste line", image: "/images/products/Marron_minimaliste_line.jpg" },
  { name: "Boho Vert", image: "/images/products/Boho_Vert.jpg" },
];

const generateDimensions = () => FIXED_DIMENSIONS.map((d) => ({ ...d }));

const chooseProductType = (name: string): ProductType => {
  if (name.toLowerCase().includes("toile")) return "Toile";
  return faker.helpers.arrayElement(PRODUCT_TYPES);
};

const buildSlug = (name: string) =>
  slugify(name, { lower: true, strict: true }) || `produit-${uuidv4().slice(0, 8)}`;

async function seedDatabase() {
  try {
    await db.delete(productCategories);
    await db.delete(products);
    await db.delete(categories);

    console.log("Existing product/category data cleared.");

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

    const categoryMap = new Map<string, string>();
    let displayOrder = 0;

    for (const group of categoryGroups) {
      for (const category of group.categories) {
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
      }
    }

    await db.insert(categories).values(categoryData);
    console.log(`Seeded ${categoryData.length} categories.`);

    const productData: any[] = [];
    const productCategoryRelations: { productId: string; categoryId: string }[] = [];

    const pushProduct = (name: string, image: string) => {
      const id = uuidv4();
      const productType = chooseProductType(name);
      const dimensions = generateDimensions();
      const minPrice = Math.min(...dimensions.map((d) => d.price));

      productData.push({
        id,
        name,
        slug: buildSlug(name),
        description: faker.lorem.paragraph(),
        price: minPrice,
        stock: 0,
        badge: faker.helpers.arrayElement(["none", "new", "bestseller", "sale"]),
        featured: faker.datatype.boolean({ probability: 0.3 }),
        images: [image],
        sizes: [],
        frames: [],
        materials: [productType],
        frameColors: productType === "Toile" ? [] : [...DEFAULT_FRAME_COLORS],
        dimensions,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent({ days: 30 }),
      });

      const categoryCount = faker.number.int({ min: 1, max: 3 });
      const allCategoryNames = Array.from(categoryMap.keys());
      const selectedCategories = faker.helpers.arrayElements(allCategoryNames, categoryCount);

      for (const categoryName of selectedCategories) {
        const categoryId = categoryMap.get(categoryName);
        if (categoryId) {
          productCategoryRelations.push({ productId: id, categoryId });
        }
      }
    };

    for (const p of initialProducts) {
      pushProduct(p.name, p.image);
    }

    const randomProductCount = 20;
    for (let i = 0; i < randomProductCount; i++) {
      const name = faker.commerce.productName();
      const image = faker.helpers.arrayElement(initialProducts).image;
      pushProduct(name, image);
    }

    await db.insert(products).values(productData);
    if (productCategoryRelations.length > 0) {
      await db.insert(productCategories).values(productCategoryRelations);
    }

    console.log(`Seeded ${productData.length} products and ${productCategoryRelations.length} category links.`);
    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    if (error instanceof Error) console.error(error.stack);
    process.exit(1);
  }
}

seedDatabase();
