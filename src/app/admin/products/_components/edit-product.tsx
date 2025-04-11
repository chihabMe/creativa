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
import { getProductById } from "@/lib/data";
import React from "react";
import { updateProduct } from "@/lib/actions/product-actions";
interface Props {
  product: NonNullable<Awaited<ReturnType<typeof getProductById>>>;
}

const categories = [
  { value: "islamique", label: "Islamique" },
  { value: "abstrait", label: "Abstrait" },
  { value: "botanique", label: "Botanique" },
  { value: "minimaliste", label: "Minimaliste" },
  { value: "grand-tableaux", label: "Grand Tableaux" },
  { value: "vases", label: "Vases" },
  { value: "miroirs", label: "Miroirs" },
  { value: "bougies", label: "Bougies" },
];
const EditProduct = ({ product }: Props) => {
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
    price: product.price.toString(),
    description: product.description || "",
    stock: product.stock.toString(),
    categories: product.categories || [],
    badge: product.badge || "none",
    featured: product.featured || false,
    sizes:
      product.sizes?.map((size: { size: string; price: number }) => ({
        size: size.size,
        price: size.price.toString(),
      })) || [],
    frames:
      product.frames?.map((frame: { frame: string; price: number }) => ({
        frame: frame.frame,
        price: frame.price.toString(),
      })) || [],
  });

  const [images, setImages] =
    useState<{ url: string; publicId: string }[]>(productImages);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    if (formData.categories.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((cat) => cat !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, value],
      }));
    }
  };

  const handleAddSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", price: "" }],
    }));
  };

  const handleSizeChange = (
    index: number,
    field: "size" | "price",
    value: string
  ) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = value;
    setFormData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const handleRemoveSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleAddFrame = () => {
    setFormData((prev) => ({
      ...prev,
      frames: [...prev.frames, { frame: "", price: "" }],
    }));
  };

  const handleFrameChange = (
    index: number,
    field: "frame" | "price",
    value: string
  ) => {
    const newFrames = [...formData.frames];
    newFrames[index][field] = value;
    setFormData((prev) => ({ ...prev, frames: newFrames }));
  };

  const handleRemoveFrame = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      frames: prev.frames.filter((_, i) => i !== index),
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
      const productData = {
        id: product.id,
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        stock: Number(formData.stock),
        badge: formData.badge as "none" | "new" | "bestseller" | "sale",
        featured: formData.featured,
        images: images.map((img) => img.url), // We only need the URLs for the database
        categories: formData.categories,
        sizes: formData.sizes.map((size) => ({
          size: size.size,
          price: Number(size.price),
        })),
        frames: formData.frames.map((frame) => ({
          frame: frame.frame,
          price: Number(frame.price),
        })),
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
        toast({
          title: "Erreur",
          description: result?.data?.message ?? "",
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (DA)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
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
                    onValueChange={(value: "none" | "new" | "bestseller" | "sale") =>
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
              <CardTitle>Variantes</CardTitle>
              <CardDescription>
                Modifiez les tailles et options d'encadrement pour ce produit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Tailles disponibles</Label>
                    <Button variant="outline" size="sm" onClick={handleAddSize}>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter une taille
                    </Button>
                  </div>

                  {formData.sizes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune taille ajoutée.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {formData.sizes.map((size, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            value={size.size}
                            onChange={(e) =>
                              handleSizeChange(index, "size", e.target.value)
                            }
                            placeholder="ex: 1M×50CM"
                            className="flex-1"
                          />
                          <Input
                            value={size.price}
                            onChange={(e) =>
                              handleSizeChange(index, "price", e.target.value)
                            }
                            placeholder="Prix (DA)"
                            type="number"
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSize(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Options d'encadrement</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddFrame}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter une option
                    </Button>
                  </div>

                  {formData.frames.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune option d'encadrement ajoutée.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {formData.frames.map((frame, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            value={frame.frame}
                            onChange={(e) =>
                              handleFrameChange(index, "frame", e.target.value)
                            }
                            placeholder="ex: SANS ENCADREMENT"
                            className="flex-1"
                          />
                          <Input
                            value={frame.price}
                            onChange={(e) =>
                              handleFrameChange(index, "price", e.target.value)
                            }
                            placeholder="Supplément (DA)"
                            type="number"
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFrame(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={formData.categories.includes(category.value)}
                      onCheckedChange={() =>
                        handleCategoryChange(category.value)
                      }
                    />
                    <Label htmlFor={`category-${category.value}`}>
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
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
