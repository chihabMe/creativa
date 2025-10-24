"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-m";
import {
  X,
  Minus,
  Plus,
  CreditCard,
  Home,
  MapPin,
  Loader2,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/cart-context";
import { createOrder } from "@/lib/actions/order-actions";

// Wilaya options for Algeria
const wilayaOptions = [
  { value: "1", label: "1 - Adrar" },
  { value: "2", label: "2 - Chlef" },
  { value: "3", label: "3 - Laghouat" },
  { value: "4", label: "4 - Oum El Bouaghi" },
  { value: "5", label: "5 - Batna" },
  { value: "6", label: "6 - Béjaïa" },
  { value: "7", label: "7 - Biskra" },
  { value: "8", label: "8 - Béchar" },
  { value: "9", label: "9 - Blida" },
  { value: "10", label: "10 - Bouira" },
  { value: "11", label: "11 - Tamanrasset" },
  { value: "12", label: "12 - Tébessa" },
  { value: "13", label: "13 - Tlemcen" },
  { value: "14", label: "14 - Tiaret" },
  { value: "15", label: "15 - Tizi Ouzou" },
  { value: "16", label: "16 - Alger" },
  { value: "17", label: "17 - Djelfa" },
  { value: "18", label: "18 - Jijel" },
  { value: "19", label: "19 - Sétif" },
  { value: "20", label: "20 - Saïda" },
  { value: "21", label: "21 - Skikda" },
  { value: "22", label: "22 - Sidi Bel Abbès" },
  { value: "23", label: "23 - Annaba" },
  { value: "24", label: "24 - Guelma" },
  { value: "25", label: "25 - Constantine" },
  { value: "26", label: "26 - Médéa" },
  { value: "27", label: "27 - Mostaganem" },
  { value: "28", label: "28 - M'Sila" },
  { value: "29", label: "29 - Mascara" },
  { value: "30", label: "30 - Ouargla" },
  { value: "31", label: "31 - Oran" },
  { value: "32", label: "32 - El Bayadh" },
  { value: "33", label: "33 - Illizi" },
  { value: "34", label: "34 - Bordj Bou Arreridj" },
  { value: "35", label: "35 - Boumerdès" },
  { value: "36", label: "36 - El Tarf" },
  { value: "37", label: "37 - Tindouf" },
  { value: "38", label: "38 - Tissemsilt" },
  { value: "39", label: "39 - El Oued" },
  { value: "40", label: "40 - Khenchela" },
  { value: "41", label: "41 - Souk Ahras" },
  { value: "42", label: "42 - Tipaza" },
  { value: "43", label: "43 - Mila" },
  { value: "44", label: "44 - Aïn Defla" },
  { value: "45", label: "45 - Naâma" },
  { value: "46", label: "46 - Aïn Témouchent" },
  { value: "47", label: "47 - Ghardaïa" },
  { value: "48", label: "48 - Relizane" },
];

// Animation variants for smoother transitions
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
};

const slideLeft = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
};

const zoomIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

// Staggered child animations
const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

export default function Cart() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    items,
    totalPrice,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    clearCart,
  } = useCart();
  const [step, setStep] = useState<"cart" | "checkout" | "payment" | "success">(
    "cart"
  );
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [animationDirection, setAnimationDirection] = useState<
    "forward" | "backward"
  >("forward");

  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    email: "",
    wilaya: "",
    commune: "",
    address: "",
    note: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // const handleCheckboxChange = (checked: boolean) => {
  //   setFormData((prev) => ({ ...prev}));

  //   // Clear error when field is edited
  //   if (formErrors.acceptTerms) {
  //     setFormErrors((prev) => {
  //       const newErrors = { ...prev };
  //       delete newErrors.acceptTerms;
  //       return newErrors;
  //     });
  //   }
  // };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const validateCheckoutForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Le nom est requis";
    if (!formData.phone.trim())
      errors.phone = "Le numéro de téléphone est requis";
    if (!formData.email.trim()) errors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Format d'email invalide";
    if (!formData.wilaya) errors.wilaya = "La wilaya est requise";
    if (!formData.commune.trim()) errors.commune = "La commune est requise";
    if (!formData.address.trim()) errors.address = "L'adresse est requise";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = () => {
    const errors: Record<string, string> = {};

    // if (!formData.acceptTerms)
    //   errors.acceptTerms = "Vous devez accepter les conditions générales";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    setAnimationDirection("forward");
    if (step === "cart") {
      setStep("checkout");
    } else if (step === "checkout") {
      if (validateCheckoutForm()) {
        setStep("payment");
      }
    }
  };

  const handleBack = () => {
    setAnimationDirection("backward");
    if (step === "checkout") {
      setStep("cart");
    } else if (step === "payment") {
      setStep("checkout");
    }
  };

  const handleClose = () => {
    closeCart();
    setStep("cart");
    // Don't reset form data to preserve it for the next time
  };

  const handleSubmitOrder = async () => {
    if (!validatePaymentForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.commune,
          state: formData.wilaya,
          postalCode: "",
        },
        items: items,
        total: totalPrice,
        paymentMethod: "cash",
        notes: formData.note,
      };

      // Submit order
      const result = await createOrder(orderData);

      if (result?.data?.success) {
        // Store order number for success page
        setOrderNumber(result.data.orderNumber || null);

        // Clear cart
        clearCart();

        // Show success message
        toast({
          title: "Commande réussie",
          description: "Votre commande a été enregistrée avec succès.",
        });

        // Move to success step
        setAnimationDirection("forward");
        setStep("success");
      } else {
        toast({
          title: "Erreur",
          description:
            result?.data?.message ||
            "Une erreur est survenue lors de la création de la commande.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création de la commande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewOrder = () => {
    // Close the cart
    closeCart();

    // Redirect to order details page
    if (orderNumber) {
      router.push(`/orders/${orderNumber}`);
    }
  };

  const handleContinueShopping = () => {
    closeCart();
    setStep("cart");
  };

  // Get animation variant based on current step and direction
  const getStepVariant = () => {
    if (step === "success") return zoomIn;
    return animationDirection === "forward" ? slideLeft : slideRight;
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      {/* <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Cart"
          // onClick={openCart}
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {totalItems}
            </span>
          </div>
        </Button>
      </SheetTrigger> */}
      <SheetContent className="w-full max-w-md p-0 sm:max-w-lg">
        <motion.div
          className="flex h-full flex-col"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.3 },
          }}
        >
          <SheetHeader className="relative border-b px-6 py-4">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.1,
                  duration: 0.3,
                },
              }}
            >
              <SheetTitle>
                {step === "cart" && "Panier"}
                {step === "checkout" && "Informations & Expédition"}
                {step === "payment" && "Paiement"}
                {step === "success" && "Commande confirmée"}
              </SheetTitle>
            </motion.div>

            {/* Progress indicator */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-emerald-600"
              initial={{ width: "0%" }}
              animate={{
                width:
                  step === "cart"
                    ? "25%"
                    : step === "checkout"
                    ? "50%"
                    : step === "payment"
                    ? "75%"
                    : "100%",
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                },
              }}
            />
          </SheetHeader>

          <ScrollArea className="flex-1">
            <AnimatePresence mode="wait" initial={false}>
              {step === "cart" && (
                <motion.div
                  key="cart"
                  variants={getStepVariant()}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6"
                >
                  {items.length === 0 ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-12"
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                    >
                      <p className="mb-4 text-lg font-medium">
                        Votre panier est vide
                      </p>
                      <Button className="bg-emerald-500" onClick={handleClose}>
                        Continuer vos achats
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="space-y-6"
                      variants={staggerItems}
                      initial="hidden"
                      animate="visible"
                    >
                      {items.map((item, index) => (
                        <motion.div
                          key={`${item.id}-${item.size}-${item.frame}-${
                            item.frameSubOption || ""
                          }`}
                          className="flex gap-4 border-b pb-4"
                          variants={itemFadeIn}
                          custom={index}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: index * 0.1,
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            },
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.9,
                            transition: { duration: 0.2 },
                          }}
                        >
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
                              <h3 className="text-sm font-medium">
                                {item.name}
                              </h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeItem(item.id)}
                              >
                                <motion.div
                                  whileHover={{ rotate: 90 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <X className="h-4 w-4" />
                                </motion.div>
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                              {item.size} / {item.frame}
                              {item.frameSubOption ? ` / ${item.frameSubOption}` : ""}
                            </p>
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 rounded-full p-0"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                </motion.div>
                                <span className="mx-2 w-6 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 rounded-full p-0"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </motion.div>
                              </div>
                              <p className="font-medium">{item.price} DA</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      <motion.div
                        className="space-y-2 pt-4"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: {
                            delay: 0.3,
                            duration: 0.5,
                          },
                        }}
                      >
                        <div className="flex justify-between">
                          <span>Sous-total</span>
                          <span>{totalPrice} DA</span>
                        </div>
                        {/* <div className="flex justify-between">
                          <span>Livraison</span>
                          <span>0 DA</span>
                        </div> */}
                        <motion.div
                          className="flex justify-between border-t pt-2 font-semibold"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: 0.4,
                              duration: 0.3,
                            },
                          }}
                        >
                          <span>Total</span>
                          <span>{totalPrice} DA</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === "checkout" && (
                <motion.div
                  key="checkout"
                  variants={getStepVariant()}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6 p-6"
                >
                  <motion.div
                    className="space-y-4"
                    variants={staggerItems}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemFadeIn}>
                      <Label htmlFor="phone" className="mb-1 block">
                        Numéro de téléphone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Numéro de téléphone"
                        className={formErrors.phone ? "border-red-500" : ""}
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-xs text-red-500">
                          {formErrors.phone}
                        </p>
                      )}
                    </motion.div>
                    <motion.div variants={itemFadeIn}>
                      <Label htmlFor="name" className="mb-1 block">
                        Nom
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nom"
                        className={formErrors.name ? "border-red-500" : ""}
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-xs text-red-500">
                          {formErrors.name}
                        </p>
                      )}
                    </motion.div>
                    <motion.div variants={itemFadeIn}>
                      <Label htmlFor="email" className="mb-1 block">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className={formErrors.email ? "border-red-500" : ""}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {formErrors.email}
                        </p>
                      )}
                    </motion.div>
                    <motion.div
                      variants={itemFadeIn}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <Label htmlFor="wilaya" className="mb-1 block">
                          Wilaya
                        </Label>
                        <Select
                          value={formData.wilaya}
                          onValueChange={(value) =>
                            handleSelectChange("wilaya", value)
                          }
                        >
                          <SelectTrigger
                            id="wilaya"
                            className={
                              formErrors.wilaya ? "border-red-500" : ""
                            }
                          >
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {wilayaOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.wilaya && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.wilaya}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="commune" className="mb-1 block">
                          Commune
                        </Label>
                        <Input
                          id="commune"
                          name="commune"
                          value={formData.commune}
                          onChange={handleInputChange}
                          placeholder="Commune"
                          className={formErrors.commune ? "border-red-500" : ""}
                        />
                        {formErrors.commune && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.commune}
                          </p>
                        )}
                      </div>
                    </motion.div>
                    <motion.div variants={itemFadeIn}>
                      <Label htmlFor="address" className="mb-1 block">
                        Adresse
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Adresse"
                        className={formErrors.address ? "border-red-500" : ""}
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-xs text-red-500">
                          {formErrors.address}
                        </p>
                      )}
                    </motion.div>
                  </motion.div>

                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="mb-4 text-lg font-medium">
                      Mode de livraison
                    </h3>
                    <RadioGroup
                      value={deliveryMethod}
                      onValueChange={setDeliveryMethod}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="home"
                          id="home"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="home"
                          className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border border-gray-200 p-4 transition-all duration-300 peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50"
                        >
                          <Home className="h-6 w-6" />
                          <span>À domicile</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="pickup"
                          id="pickup"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="pickup"
                          className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border border-gray-200 p-4 transition-all duration-300 peer-data-[state=checked]:border-emerald-600 peer-data-[state=checked]:bg-emerald-50"
                        >
                          <MapPin className="h-6 w-6" />
                          <span>Point de relais</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </motion.div>

                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="note" className="mb-1 block">
                      Note
                    </Label>
                    <Textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      placeholder="Note (optionnel)"
                      className="h-24"
                    />
                  </motion.div>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  variants={getStepVariant()}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6 p-6"
                >
                  <motion.div variants={fadeInUp}>
                    <h3 className="mb-4 text-lg font-medium">Récapitulatif</h3>
                    <motion.div
                      className="space-y-4 rounded-md bg-gray-50 p-4"
                      variants={staggerItems}
                      initial="hidden"
                      animate="visible"
                    >
                      {items.map((item, index) => (
                        <motion.div
                          key={`${item.id}-${item.size}-${item.frame}-${
                            item.frameSubOption || ""
                          }`}
                          className="flex justify-between border-b pb-2"
                          variants={itemFadeIn}
                          custom={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: index * 0.1,
                              duration: 0.3,
                            },
                          }}
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.size} / {item.frame}
                              {item.frameSubOption ? ` / ${item.frameSubOption}` : ""}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.price} DA x {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            {item.price * item.quantity} DA
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  <motion.div variants={fadeInUp} transition={{ delay: 0.3 }}>
                    <h3 className="mb-4 text-lg font-medium">Paiement</h3>
                    <RadioGroup defaultValue="cash" className="space-y-4">
                      <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <RadioGroupItem value="cash" id="cash" />
                        <Label
                          htmlFor="cash"
                          className="flex items-center gap-2"
                        >
                          <CreditCard className="h-5 w-5" />
                          Paiement à la livraison
                        </Label>
                      </motion.div>
                    </RadioGroup>
                  </motion.div>

                  <motion.div
                    className="space-y-2 pt-4"
                    variants={staggerItems}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4, staggerChildren: 0.1 }}
                  >
                    <motion.div
                      className="flex justify-between"
                      variants={itemFadeIn}
                    >
                      <span>Sous-total</span>
                      <span>{totalPrice} DA</span>
                    </motion.div>
                    <motion.div
                      className="flex justify-between"
                      variants={itemFadeIn}
                    >
                      <span>Réduction</span>
                      <span>0 DA</span>
                    </motion.div>
                    {/* <motion.div
                      className="flex justify-between"
                      variants={itemFadeIn}
                    >
                      <span>Livraison</span>
                      <span>0 DA</span>
                    </motion.div> */}
                    <motion.div
                      className="flex justify-between border-t pt-2 font-semibold"
                      variants={fadeInUp}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: 0.6,
                          duration: 0.3,
                        },
                      }}
                    >
                      <span>Total</span>
                      <span>{totalPrice} DA</span>
                    </motion.div>
                  </motion.div>

                  {/* <motion.div
                    className="flex items-center space-x-2"
                    variants={fadeInUp}
                    transition={{ delay: 0.7 }}
                  >
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={handleCheckboxChange}
                      className={formErrors.acceptTerms ? "border-red-500" : ""}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      J'ai lu et j'accepte les{" "}
                      <a href="#" className="text-emerald-600 underline">
                        conditions générales
                      </a>
                    </Label>
                  </motion.div>
                  {formErrors.acceptTerms && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.acceptTerms}
                    </p>
                  )} */}
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  variants={zoomIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center justify-center space-y-6 p-6 text-center"
                >
                  <motion.div
                    className="rounded-full bg-emerald-100 p-4"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      transition: {
                        delay: 0.2,
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      },
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        transition: {
                          delay: 0.5,
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        },
                      }}
                    >
                      <CheckCircle className="h-12 w-12 text-emerald-600" />
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 0.7,
                        duration: 0.5,
                      },
                    }}
                  >
                    <h3 className="text-xl font-bold">Commande confirmée !</h3>
                    <p className="text-gray-600">
                      Merci pour votre commande. Nous vous contacterons bientôt
                      pour confirmer la livraison.
                    </p>
                    {orderNumber && (
                      <motion.p
                        className="font-medium"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: {
                            delay: 1,
                            duration: 0.5,
                          },
                        }}
                      >
                        Numéro de commande:{" "}
                        <span className="font-bold">{orderNumber}</span>
                      </motion.p>
                    )}
                  </motion.div>
                  <motion.div
                    className="flex w-full flex-col gap-2 pt-4 sm:flex-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 1.2,
                        duration: 0.5,
                      },
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleContinueShopping}
                      >
                        Continuer vos achats
                      </Button>
                    </motion.div>
                    {orderNumber && (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1"
                      >
                        <Button className="w-full" onClick={handleViewOrder}>
                          Voir ma commande
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>

          <motion.div
            className="border-t p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                duration: 0.4,
              },
            }}
          >
            <div className="flex gap-4">
              {step !== "cart" && step !== "success" && (
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleBack}
                  >
                    Retour
                  </Button>
                </motion.div>
              )}
              {step === "cart" && (
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleContinue}
                    disabled={items.length === 0}
                  >
                    Continuer
                  </Button>
                </motion.div>
              )}
              {step === "checkout" && (
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleContinue}
                  >
                    Continuer
                  </Button>
                </motion.div>
              )}
              {step === "payment" && (
                <motion.div
                  className="flex-1"
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement...
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        J'ACHÈTE MAINTENANT
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
