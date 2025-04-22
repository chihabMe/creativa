"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createUpdateCategory, getCategories } from "@/lib/actions/ category-actions"

// Schema for form validation
const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  description: z.string().optional(),
  featured: z.boolean(),
  displayOrder: z.coerce.number(),
  groupName: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>



type Category = Awaited<ReturnType<typeof getCategories>>[0]
interface CategoryFormProps {
  category: Category | null
  onClose: (success: boolean) => void
}

export default function CategoryForm({ category,  onClose }: CategoryFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Define common group names for dropdown
  const commonGroups = ["Modèles", "Catégories", "Styles", "Collections"]

  // Initialize form with category data or defaults
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: category
      ? {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          featured: category.featured ?? false,
          displayOrder: category.displayOrder ?? 0,
          groupName: category.groupName || "",
        }
      : {
          name: "",
          slug: "",
          description: "",
          featured: false,
          displayOrder: 0,
          groupName: "",
        },
  })

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
  }

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      const result = await createUpdateCategory(values)

      if (result?.data?.success) {
        toast({
          title: category ? "Catégorie mise à jour" : "Catégorie créée",
          description: result.data.message,
        })
        onClose(true)
      } else {
        toast({
          title: "Erreur",
          description: result?.data?.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden ID field for updates */}
        {category && <input type="hidden" {...form.register("id", { value: category.id })} />}

        {/* Name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nom de la catégorie"
                  onChange={(e) => {
                    field.onChange(e)
                    // Auto-generate slug if slug is empty or matches previous auto-generated slug
                    const currentSlug = form.getValues("slug")
                    const previousName = field.value
                    const previousAutoSlug = generateSlug(previousName)

                    if (!currentSlug || currentSlug === previousAutoSlug) {
                      form.setValue("slug", generateSlug(e.target.value))
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug field */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} placeholder="slug-de-la-categorie" />
              </FormControl>
              <FormDescription>Utilisé dans les URLs. Exemple: /category/slug-de-la-categorie</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Description de la catégorie" value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Group Name field */}
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Groupe</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un groupe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Aucun groupe</SelectItem>
                  {commonGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Utilisé pour regrouper les catégories dans le menu déroulant</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Display Order field */}
        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordre d'affichage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  min={0}
                  onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>Les catégories sont triées par ordre croissant (0, 1, 2, ...)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Featured field */}
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Mise en avant</FormLabel>
                <FormDescription>Les catégories mises en avant apparaissent dans le menu principal</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={() => onClose(false)}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : category ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
