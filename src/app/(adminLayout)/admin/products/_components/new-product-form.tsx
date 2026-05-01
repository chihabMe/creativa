"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { createProduct } from "@/lib/actions/product-actions";
import { ImageUploader } from "@/components/admin/image-uploader";
import { getCategories } from "@/lib/actions/ category-actions";

type Category = Awaited<ReturnType<typeof getCategories>>[0];

interface NewProductFormProps {
  categories: Category[];
}

export default function NewProductForm({ categories }: NewProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryIds: [] as string[],
    badge: "none",
    featured: false,
    productType: "Cadre avec Verre",
    frameColors: ["Noir", "Blanc", "Bois"] as string[],
    dimensions: [
      { size: "23x32 cm", price: "2500" },
      { size: "32x44 cm", price: "3800" },
      { size: "44x62 cm", price: "5700" },
      { size: "52x72 cm", price: "7500" },
      { size: "62x82 cm", price: "9500" },
    ] as { size: string; price: string }[],
  });

  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categorySlug: string) => {
    if (formData.categoryIds.includes(categorySlug)) {
      setFormData((prev) => ({
        ...prev,
        categoryIds: prev.categoryIds.filter(
          (cat: string) => cat !== categorySlug
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categoryIds: [...prev.categoryIds, categorySlug],
      }));
    }
  };

  const handleAddFrameColor = () => {
    setFormData((prev) => ({
      ...prev,
      frameColors: [...prev.frameColors, ""],
    }));
  };

  const handleFrameColorChange = (index: number, value: string) => {
    const next = [...formData.frameColors];
    next[index] = value;
    setFormData((prev) => ({ ...prev, frameColors: next }));
  };

  const handleRemoveFrameColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      frameColors: prev.frameColors.filter((_, i) => i !== index),
    }));
  };

  const handleAddDimension = () => {
    setFormData((prev) => ({
      ...prev,
      dimensions: [...prev.dimensions, { size: "", price: "" }],
    }));
  };

  const handleDimensionChange = (
    index: number,
    field: "size" | "price",
    value: string
  ) => {
    const next = [...formData.dimensions];
    next[index][field] = value;
    setFormData((prev) => ({ ...prev, dimensions: next }));
  };

  const handleRemoveDimension = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: prev.dimensions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate that we have at least one image
      if (images.length === 0) {
        toast({
          title: "Erreur",
          description: "Veuillez ajouter au moins une image pour le produit.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Convert form data to the format expected by the server action
      const normalizedDimensions = formData.dimensions
        .filter((d) => d.size.trim() !== "")
        .map((d) => ({
          size: d.size.trim(),
          price: Number(d.price),
        }))
        .filter((d) => Number.isFinite(d.price) && d.price >= 0);

      if (normalizedDimensions.length === 0) {
        toast({
          title: "Erreur",
          description:
            "Veuillez ajouter au moins une dimension avec un prix valide.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const basePrice = Math.min(...normalizedDimensions.map((d) => d.price));

      const productData = {
        name: formData.name,
        price: basePrice,
        description: formData.description,
        stock: 0,
        badge: formData.badge as "none" | "new" | "bestseller" | "sale",
        featured: formData.featured,
        images: images.map((img) => img.url), // We only need the URLs for the database
        categoryIds: formData.categoryIds
          .map((cat) => categories.find((c) => c.slug === cat)?.id)
          .filter((id): id is string => Boolean(id)),
        materials: [formData.productType],
        frameColors:
          formData.productType === "Toile"
            ? []
            : formData.frameColors.map((c) => c.trim()).filter(Boolean),
        dimensions: normalizedDimensions,
      };

      const result = await createProduct(productData);

      if (result?.data?.success) {
        toast({
          title: "Succès",
          description: result.data.message,
        });
        router.push("/admin/products");
      } else {
        const validationMessage =
          result?.validationErrors
            ? "Données invalides. Vérifiez le nom, les dimensions et les prix."
            : undefined;
        const serverMessage =
          typeof result?.serverError === "string" ? result.serverError : undefined;
        toast({
          title: "Erreur",
          description:
            result?.data?.message ??
            validationMessage ??
            serverMessage ??
            "Une erreur est survenue lors de la création du produit.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du produit.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Ajouter un produit
          </h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              "Enregistrement..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations du produit</CardTitle>
              <CardDescription>
                Entrez les détails de base du produit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nom du produit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description du produit"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Badge</Label>
                  <Select
                    value={formData.badge}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, badge: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un badge (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="new">NOUVEAU</SelectItem>
                      <SelectItem value="bestseller">TOP VENTE</SelectItem>
                      <SelectItem value="sale">PROMO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="featured">Produit en vedette</Label>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Configuration Catalogue</CardTitle>
              <CardDescription>
                Choisissez un seul type produit, puis configurez ses couleurs de cadre et dimensions avec prix.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Type de produit</Label>
                  <Select
                    value={formData.productType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, productType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cadre avec Verre">Cadre avec Verre</SelectItem>
                      <SelectItem value="Toile">Toile</SelectItem>
                      <SelectItem value="Toile avec cadre">Toile avec cadre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.productType !== "Toile" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Couleurs d&apos;encadrement</Label>
                      <Button variant="outline" size="sm" onClick={handleAddFrameColor} type="button">
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.frameColors.map((color, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={color}
                            onChange={(e) => handleFrameColorChange(index, e.target.value)}
                            placeholder="ex: Noir"
                            className="flex-1"
                          />
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveFrameColor(index)} type="button">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Dimensions & prix</Label>
                    <Button variant="outline" size="sm" onClick={handleAddDimension} type="button">
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.dimensions.map((dimension, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={dimension.size}
                          onChange={(e) =>
                            handleDimensionChange(index, "size", e.target.value)
                          }
                          placeholder="ex: 23 x 32"
                          className="flex-1"
                        />
                        <Input
                          value={dimension.price}
                          onChange={(e) =>
                            handleDimensionChange(index, "price", e.target.value)
                          }
                          placeholder="Prix (DA)"
                          type="number"
                          className="w-32"
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveDimension(index)} type="button">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Catégories</CardTitle>
              <CardDescription>
                Sélectionnez les catégories pour ce produit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Aucune catégorie disponible.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.slug}`}
                        checked={formData.categoryIds.includes(category.slug)}
                        onCheckedChange={() =>
                          handleCategoryChange(category.slug)
                        }
                      />
                      <Label htmlFor={`category-${category.slug}`}>
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Ajoutez des images pour ce produit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                images={images}
                onChange={setImages}
                maxImages={5}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
