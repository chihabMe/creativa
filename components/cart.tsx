"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, CreditCard, Home, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/contexts/cart-context"

export default function Cart() {
  const { items, totalPrice, isOpen, closeCart, removeItem, updateQuantity } = useCart()
  const [step, setStep] = useState<"cart" | "checkout" | "payment">("cart")
  const [deliveryMethod, setDeliveryMethod] = useState("home")
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    email: "",
    wilaya: "",
    commune: "",
    address: "",
    note: "",
    promoCode: "",
    acceptTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity)
    }
  }

  const handleContinue = () => {
    if (step === "cart") {
      setStep("checkout")
    } else if (step === "checkout") {
      setStep("payment")
    }
  }

  const handleBack = () => {
    if (step === "checkout") {
      setStep("cart")
    } else if (step === "payment") {
      setStep("checkout")
    }
  }

  const handleClose = () => {
    closeCart()
    setStep("cart")
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full max-w-md p-0 sm:max-w-lg">
        <motion.div
          className="flex h-full flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SheetHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <SheetTitle>
                {step === "cart" && "Panier"}
                {step === "checkout" && "Informations & Expédition"}
                {step === "payment" && "Paiement"}
              </SheetTitle>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <AnimatePresence mode="wait">
              {step === "cart" && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="mb-4 text-lg font-medium">Votre panier est vide</p>
                      <Button onClick={handleClose}>Continuer vos achats</Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.size}-${item.frame}`} className="flex gap-4 border-b pb-4">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium">{item.name}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeItem(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                              {item.size} / {item.frame}
                            </p>
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 rounded-full p-0"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="mx-2 w-6 text-center text-sm">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 rounded-full p-0"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="font-medium">{item.price} DA</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="space-y-2 pt-4">
                        <div className="flex justify-between">
                          <span>Sous-total</span>
                          <span>{totalPrice} DA</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Livraison</span>
                          <span>0 DA</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-semibold">
                          <span>Total</span>
                          <span>{totalPrice} DA</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === "checkout" && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 p-6"
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Numéro de téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Numéro de téléphone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="wilaya">Wilaya</Label>
                        <Select value={formData.wilaya} onValueChange={(value) => handleSelectChange("wilaya", value)}>
                          <SelectTrigger id="wilaya">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Adrar</SelectItem>
                            <SelectItem value="2">2 - Chlef</SelectItem>
                            <SelectItem value="16">16 - Alger</SelectItem>
                            <SelectItem value="31">31 - Oran</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="commune">Commune</Label>
                        <Select
                          value={formData.commune}
                          onValueChange={(value) => handleSelectChange("commune", value)}
                        >
                          <SelectTrigger id="commune">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="benaria">Benaria</SelectItem>
                            <SelectItem value="kouba">Kouba</SelectItem>
                            <SelectItem value="hydra">Hydra</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Adresse"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-medium">Mode de livraison</h3>
                    <RadioGroup
                      value={deliveryMethod}
                      onValueChange={setDeliveryMethod}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home" id="home" className="peer sr-only" />
                        <Label
                          htmlFor="home"
                          className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border border-gray-200 p-4 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-gray-50"
                        >
                          <Home className="h-6 w-6" />
                          <span>À domicile</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                        <Label
                          htmlFor="pickup"
                          className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border border-gray-200 p-4 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-gray-50"
                        >
                          <MapPin className="h-6 w-6" />
                          <span>Point de relais</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="note">Note</Label>
                    <Textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      placeholder="Note (optionnel)"
                      className="h-24"
                    />
                  </div>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 p-6"
                >
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Récapitulatif</h3>
                    <div className="space-y-4 rounded-md bg-gray-50 p-4">
                      {items.map((item) => (
                        <div
                          key={`${item.id}-${item.size}-${item.frame}`}
                          className="flex justify-between border-b pb-2"
                        >
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.size} / {item.frame}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.price} DA x {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">{item.price * item.quantity} DA</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="promo">Code promo</Label>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        APPLIQUER
                      </Button>
                    </div>
                    <Input
                      id="promo"
                      name="promoCode"
                      value={formData.promoCode}
                      onChange={handleInputChange}
                      placeholder="Code promo"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-medium">Paiement</h3>
                    <RadioGroup defaultValue="cash" className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Cash
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{totalPrice} DA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Réduction</span>
                      <span>0 DA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>0 DA</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Total</span>
                      <span>{totalPrice} DA</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" checked={formData.acceptTerms} onCheckedChange={handleCheckboxChange} />
                    <Label htmlFor="terms" className="text-sm">
                      J'ai lu et j'accepte les{" "}
                      <a href="#" className="text-blue-600 underline">
                        conditions générales
                      </a>
                    </Label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>

          <div className="border-t p-6">
            <div className="flex gap-4">
              {step !== "cart" && (
                <Button variant="outline" className="flex-1" onClick={handleBack}>
                  Retour
                </Button>
              )}
              {step === "payment" ? (
                <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled={!formData.acceptTerms}>
                  J'ACHÈTE MAINTENANT
                </Button>
              ) : (
                <Button className="flex-1" onClick={handleContinue} disabled={items.length === 0}>
                  Continuer
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}
