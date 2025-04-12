"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { CACHE_TAGS } from "@/lib/data";
import { adminAction } from "./safe-action";

// Schema for category creation/update
const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  parentId: z.string().nullable().optional(),
  displayOrder: z.number().default(0),
  groupName: z.string().optional(),
});

// Get all categories
export async function getCategories() {
  try {
    return await db.query.categories.findMany({
      orderBy: [sql`${categories.displayOrder} ASC, ${categories.name} ASC`],
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Get featured categories
export async function getFeaturedCategories() {
  try {
    return await db.query.categories.findMany({
      where: eq(categories.featured, true),
      orderBy: [sql`${categories.displayOrder} ASC, ${categories.name} ASC`],
    });
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    return [];
  }
}

// Get categories by group
export async function getCategoriesByGroup() {
  try {
    const allCategories = await db.query.categories.findMany({
      orderBy: [sql`${categories.displayOrder} ASC, ${categories.name} ASC`],
    });

    // Group categories by groupName
    const groupedCategories = allCategories.reduce((acc, category) => {
      const groupName = category.groupName || "Autres";
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(category);
      return acc;
    }, {} as Record<string, typeof allCategories>);

    return groupedCategories;
  } catch (error) {
    console.error("Error fetching categories by group:", error);
    return {};
  }
}

// Get category by ID
export async function getCategoryById(id: string) {
  try {
    return await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });
  } catch (error) {
    console.error(`Error fetching category by ID ${id}:`, error);
    return null;
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  try {
    return await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });
  } catch (error) {
    console.error(`Error fetching category by slug ${slug}:`, error);
    return null;
  }
}

// Create or update category
export const createUpdateCategory = adminAction
  .schema(categorySchema)
  .action(async ({ parsedInput: data }) => {
    try {
      if (data.id) {
        // Update existing category
        await db
          .update(categories)
          .set({
            name: data.name,
            slug: data.slug,
            description: data.description,
            featured: data.featured,
            displayOrder: data.displayOrder,
            groupName: data.groupName,
            updatedAt: new Date(),
          })
          .where(eq(categories.id, data.id));

        revalidateTag(CACHE_TAGS.categories);
        return { success: true, message: "Catégorie mise à jour avec succès" };
      } else {
        // Create new category
        await db.insert(categories).values({
          name: data.name,
          slug: data.slug,
          description: data.description,
          featured: data.featured,
          displayOrder: data.displayOrder,
          groupName: data.groupName,
        });

        revalidateTag(CACHE_TAGS.categories);
        return { success: true, message: "Catégorie créée avec succès" };
      }
    } catch (error) {
      console.error("Error creating/updating category:", error);
      return { success: false, message: "Une erreur est survenue" };
    }
  });

// Delete category
export const deleteCategory = adminAction
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    try {
      await db.delete(categories).where(eq(categories.id, id));
      revalidateTag(CACHE_TAGS.categories);
      return { success: true, message: "Catégorie supprimée avec succès" };
    } catch (error) {
      console.error("Error deleting category:", error);
      return { success: false, message: "Une erreur est survenue" };
    }
  });
