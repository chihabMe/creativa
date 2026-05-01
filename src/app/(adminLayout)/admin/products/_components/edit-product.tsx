"use client";
import { ImageUploader } from "@/components/admin/image-uploader";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Plus, X } from "lucide-react";
import { getProductById } from "@/lib/actions/product-actions";
import type React from "react";
import { updateProduct } from "@/lib/actions/product-actions";
import { getCategories } from "@/lib/actions/ category-actions";

interface Props {
  product: NonNullable<Awaited<ReturnType<typeof getProductById>>>;
  categories: Awaited<ReturnType<typeof getCategories>>;
}

const EditProduct = ({ product, categories }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productImages =
    product?.images?.map((url: string) => {
      const parts = url.split("/");
      const filename = parts[parts.length - 1];
      const folderPath = parts[parts.length - 2];
      // Remove file extension
      const publicIdBase = filename.split(".")[0];
      const publicId = `${folderPath}/${publicIdBase}`;

      return {
        url,
        publicId,
      };
    }) ?? [];

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || "",
    categories:
      product.productCategories?.map(
        (productCategory) => productCategory.category.slug
      ) || ([] as string[]),
    badge: product.badge || "none",
    featured: product.featured || false,
    productType:
      product.materials && product.materials.length > 0
        ? product.materials[0]
        : "Cadre avec Verre",
    frameColors: product.frameColors && product.frameColors.length > 0
      ? product.frameColors
      : ["Noir", "Blanc", "Bois"],
    dimensions:
      product.dimensions && product.dimensions.length > 0
        ? product.dimensions.map((d) => ({
            size: d.size,
            price: d.price.toString(),
          }))
        : [
            { size: "23x32 cm", price: "2500" },
            { size: "32x44 cm", price: "3800" },
            { size: "44x62 cm", price: "5700" },
            { size: "52x72 cm", price: "7500" },
            { size: "62x82 cm", price: "9500" },
          ],
  });

  const [images, setImages] =
    useState<{ url: string; publicId: string }[]>(productImages);

  // Fetch categories from the database

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categorySlug: string) => {
    if (formData.categories.includes(categorySlug)) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((cat) => cat !== categorySlug),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, categorySlug],
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
        id: product.id,
        name: formData.name,
        price: basePrice,
        description: formData.description,
        stock: product.stock,
        badge: formData.badge as "none" | "new" | "bestseller" | "sale",
        featured: formData.featured,
        images: images.map((img) => img.url), // We only need the URLs for the database
        categories: formData.categories,
        categoryIds: formData.categories
          .map((category) => {
            const categoryObj = categories.find((cat) => cat.slug === category);
            return categoryObj ? categoryObj.id : null;
          })
          .filter(Boolean) as string[],
        materials: [formData.productType],
        frameColors:
          formData.productType === "Toile"
            ? []
            : formData.frameColors.map((c) => c.trim()).filter(Boolean),
        dimensions: normalizedDimensions,
      };

      console.log(productData);
      const result = await updateProduct(productData);
      console.log(result);

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
            "Échec de la mise à jour du produit.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la mise à jour du produit.",
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
            Modifier le produit
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
                Modifiez les détails de base du produit.
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
                    onValueChange={(
                      value: "none" | "new" | "bestseller" | "sale"
                    ) => setFormData((prev) => ({ ...prev, badge: value }))}
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
                Choisissez un seul type produit, puis modifiez ses couleurs de cadre et dimensions avec prix.
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
                        checked={formData.categories.includes(category.slug)}
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
                Modifiez les images pour ce produit.
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
};

export default EditProduct;
