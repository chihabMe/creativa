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
    price: "",
    description: "",
    stock: "",
    categoryIds: [] as string[],
    badge: "none",
    featured: false,
    sizes: [] as { size: string; price: string }[],
    frames: [] as {
      frame: string;
      price: string;
      subOptions: { name: string; price: string }[];
    }[],
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
      frames: [...prev.frames, { frame: "", price: "", subOptions: [] }],
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

  const handleAddSubOption = (frameIndex: number) => {
    const newFrames = [...formData.frames];
    newFrames[frameIndex].subOptions.push({ name: "", price: "" });
    setFormData((prev) => ({ ...prev, frames: newFrames }));
  };

  const handleSubOptionChange = (
    frameIndex: number,
    subOptionIndex: number,
    field: "name" | "price",
    value: string
  ) => {
    const newFrames = [...formData.frames];
    newFrames[frameIndex].subOptions[subOptionIndex][field] = value;
    setFormData((prev) => ({ ...prev, frames: newFrames }));
  };

  const handleRemoveSubOption = (
    frameIndex: number,
    subOptionIndex: number
  ) => {
    const newFrames = [...formData.frames];
    newFrames[frameIndex].subOptions = newFrames[frameIndex].subOptions.filter(
      (_, i) => i !== subOptionIndex
    );
    setFormData((prev) => ({ ...prev, frames: newFrames }));
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
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        stock: Number(formData.stock),
        badge: formData.badge as "none" | "new" | "bestseller" | "sale",
        featured: formData.featured,
        images: images.map((img) => img.url), // We only need the URLs for the database
        categoryIds: formData.categoryIds
          .map((cat) => categories.find((c) => c.slug === cat)?.id)
          .filter((id): id is string => Boolean(id)),
        sizes: formData.sizes.map((size) => ({
          size: size.size,
          price: Number(size.price),
        })),
        frames: formData.frames.map((frame) => ({
          frame: frame.frame,
          price: Number(frame.price),
          subOptions: frame.subOptions.map((subOption) => ({
            name: subOption.name,
            price: Number(subOption.price),
          })),
        })),
      };

      const result = await createProduct(productData);

      if (result?.data?.success) {
        toast({
          title: "Succès",
          description: result.data.message,
        });
        router.push("/admin/products");
      } else {
        toast({
          title: "Erreur",
          description:
            result?.data?.message ??
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
              <CardTitle>Variantes</CardTitle>
              <CardDescription>
                Ajoutez des tailles et options d'encadrement pour ce produit.
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
                    <div className="space-y-4">
                      {formData.frames.map((frame, frameIndex) => (
                        <div
                          key={frameIndex}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <Input
                              value={frame.frame}
                              onChange={(e) =>
                                handleFrameChange(
                                  frameIndex,
                                  "frame",
                                  e.target.value
                                )
                              }
                              placeholder="ex: SANS ENCADREMENT"
                              className="flex-1"
                            />
                            <Input
                              value={frame.price}
                              onChange={(e) =>
                                handleFrameChange(
                                  frameIndex,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="Supplément (DA)"
                              type="number"
                              className="w-32"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveFrame(frameIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Sub-options section */}
                          <div className="ml-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm text-muted-foreground">
                                Sous-options
                              </Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddSubOption(frameIndex)}
                                type="button"
                              >
                                <Plus className="mr-1 h-3 w-3" />
                                Ajouter une sous-option
                              </Button>
                            </div>

                            {frame.subOptions.length > 0 && (
                              <div className="space-y-2">
                                {frame.subOptions.map(
                                  (subOption, subOptionIndex) => (
                                    <div
                                      key={subOptionIndex}
                                      className="flex items-center space-x-2"
                                    >
                                      <Input
                                        value={subOption.name}
                                        onChange={(e) =>
                                          handleSubOptionChange(
                                            frameIndex,
                                            subOptionIndex,
                                            "name",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Nom de la sous-option"
                                        className="flex-1"
                                      />
                                      <Input
                                        value={subOption.price}
                                        onChange={(e) =>
                                          handleSubOptionChange(
                                            frameIndex,
                                            subOptionIndex,
                                            "price",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Prix (DA)"
                                        type="number"
                                        className="w-28"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleRemoveSubOption(
                                            frameIndex,
                                            subOptionIndex
                                          )
                                        }
                                        type="button"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
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
