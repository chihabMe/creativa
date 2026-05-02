"use server";

import { z } from "zod";
import { and, eq, ne } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { adminAction } from "@/lib/actions/safe-action";
import { db } from "@/lib/db";
import { adminPreferences, siteSettings, users } from "@/lib/db/schema";

const profileSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis"),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(1, "Confirmation requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "La confirmation ne correspond pas au nouveau mot de passe",
  });

const preferencesSchema = z.object({
  notificationsEnabled: z.boolean(),
  orderAutoRefresh: z.boolean(),
  ordersPageSize: z.coerce.number().min(5).max(100),
  productsPageSize: z.coerce.number().min(5).max(100),
});

const siteSettingsSchema = z.object({
  supportEmail: z.string().email("Email support invalide"),
  phone: z.string().optional().default(""),
  whatsapp: z.string().optional().default(""),
  address: z.string().optional().default(""),
});

export async function getAdminSettings(userId: string) {
  const [user, preferences, settings] = await Promise.all([
    db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { name: true, email: true, passwordChangedAt: true },
    }),
    db.query.adminPreferences.findFirst({
      where: eq(adminPreferences.userId, userId),
    }),
    db.query.siteSettings.findFirst(),
  ]);

  return {
    user: user
      ? {
          name: user.name,
          email: user.email,
          passwordChangedAt: user.passwordChangedAt
            ? user.passwordChangedAt.toISOString()
            : null,
        }
      : null,
    preferences: preferences ?? {
      notificationsEnabled: true,
      orderAutoRefresh: false,
      ordersPageSize: 10,
      productsPageSize: 10,
    },
    site: settings ?? {
      supportEmail: "esprit.creativadeco@gmail.com",
      phone: "",
      whatsapp: "",
      address: "",
    },
  };
}

export const updateAdminProfile = adminAction.schema(profileSchema).action(async ({ parsedInput, ctx }) => {
  const userId = ctx.user.id;

  const existing = await db.query.users.findFirst({
    where: and(eq(users.email, parsedInput.email), ne(users.id, userId)),
    columns: { id: true },
  });

  if (existing) {
    return { success: false, message: "Cet email est déjà utilisé." };
  }

  await db
    .update(users)
    .set({
      name: parsedInput.name.trim(),
      email: parsedInput.email.trim().toLowerCase(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin/settings");
  return { success: true, message: "Profil mis à jour." };
});

export const updateAdminPassword = adminAction.schema(passwordSchema).action(async ({ parsedInput, ctx }) => {
  const userId = ctx.user.id;

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { id: true, password: true },
  });

  if (!currentUser?.password) {
    return { success: false, message: "Compte invalide." };
  }

  const validCurrentPassword = await compare(parsedInput.currentPassword, currentUser.password);
  if (!validCurrentPassword) {
    return { success: false, message: "Mot de passe actuel incorrect." };
  }

  const nextPasswordHash = await hash(parsedInput.newPassword, 10);

  await db
    .update(users)
    .set({
      password: nextPasswordHash,
      passwordChangedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin/settings");
  return { success: true, message: "Mot de passe mis à jour." };
});

export const updateAdminPreferences = adminAction
  .schema(preferencesSchema)
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.user.id;

    await db
      .insert(adminPreferences)
      .values({
        userId,
        notificationsEnabled: parsedInput.notificationsEnabled,
        orderAutoRefresh: parsedInput.orderAutoRefresh,
        ordersPageSize: parsedInput.ordersPageSize,
        productsPageSize: parsedInput.productsPageSize,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: adminPreferences.userId,
        set: {
          notificationsEnabled: parsedInput.notificationsEnabled,
          orderAutoRefresh: parsedInput.orderAutoRefresh,
          ordersPageSize: parsedInput.ordersPageSize,
          productsPageSize: parsedInput.productsPageSize,
          updatedAt: new Date(),
        },
      });

    revalidatePath("/admin/settings");
    return { success: true, message: "Préférences mises à jour." };
  });

export const updateSiteSettings = adminAction.schema(siteSettingsSchema).action(async ({ parsedInput }) => {
  const existing = await db.query.siteSettings.findFirst({ columns: { id: true } });

  if (!existing) {
    await db.insert(siteSettings).values({
      supportEmail: parsedInput.supportEmail.trim().toLowerCase(),
      phone: parsedInput.phone?.trim() || "",
      whatsapp: parsedInput.whatsapp?.trim() || "",
      address: parsedInput.address?.trim() || "",
      updatedAt: new Date(),
    });
  } else {
    await db
      .update(siteSettings)
      .set({
        supportEmail: parsedInput.supportEmail.trim().toLowerCase(),
        phone: parsedInput.phone?.trim() || "",
        whatsapp: parsedInput.whatsapp?.trim() || "",
        address: parsedInput.address?.trim() || "",
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, existing.id));
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true, message: "Paramètres du site mis à jour." };
});
