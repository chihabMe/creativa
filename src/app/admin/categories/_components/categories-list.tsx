"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash2, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import CategoryForm from "./category-form"
import { deleteCategory, getCategories } from "@/lib/actions/ category-actions"


type Category = Awaited<ReturnType<typeof getCategories>>[0]
interface CategoriesListProps {
  categories: Category[]
}

export default function CategoriesList({ categories }: CategoriesListProps) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return

    const result = await deleteCategory({ id: categoryToDelete.id })

    if (result?.data?.success) {
      toast({
        title: "Catégorie supprimée",
        description: result.data.message,
      })
      // Refresh the page to show updated data
      window.location.reload()
    } else {
      toast({
        title: "Erreur",
        description: result?.data?.message,
        variant: "destructive",
      })
    }

    setIsDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }

  const handleEditClick = (category: Category) => {
    setCategoryToEdit(category)
    setIsFormDialogOpen(true)
  }

  const handleAddClick = () => {
    setCategoryToEdit(null)
    setIsFormDialogOpen(true)
  }

  const handleFormClose = (success: boolean) => {
    setIsFormDialogOpen(false)
    setCategoryToEdit(null)

    if (success) {
      // Refresh the page to show updated data
      window.location.reload()
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Catégories</h2>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une catégorie
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid flex-1 gap-2">
            <CardTitle>Gestion des catégories</CardTitle>
            <CardDescription>Vous avez {categories.length} catégories au total.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Groupe</TableHead>
                  <TableHead>Ordre</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Aucune catégorie trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>{category.groupName || "—"}</TableCell>
                      <TableCell>{category.displayOrder}</TableCell>
                      <TableCell>
                        {category.featured ? (
                          <Badge className="bg-green-500">Mise en avant</Badge>
                        ) : (
                          <Badge variant="outline">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/category/${category.slug}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Voir</span>
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleEditClick(category)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteClick(category)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie "{categoryToDelete?.name}" ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={(open) => !open && handleFormClose(false)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{categoryToEdit ? "Modifier la catégorie" : "Ajouter une catégorie"}</DialogTitle>
            <DialogDescription>
              {categoryToEdit
                ? "Modifiez les détails de la catégorie ci-dessous."
                : "Remplissez les détails pour créer une nouvelle catégorie."}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm category={categoryToEdit} categories={categories} onClose={handleFormClose} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
