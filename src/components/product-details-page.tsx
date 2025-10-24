"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-m";
import { Minus, Plus, ShoppingCart, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/cart-context";
import ProductCard from "@/components/product-card";
import Breadcrumb from "@/components/breadcrumb";
import WishlistButton from "@/components/wishlist-button";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import RecentlyViewedProducts from "@/components/recently-viewed-products";
import StockBadge from "@/components/stock-badge";
import SocialShare from "@/components/social-share";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";

interface ProductDetailsPageProps {
  product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;
  relatedProducts: Awaited<ReturnType<typeof getRelatedProducts>>;
}

export default function ProductDetailsPage({
  product,
  relatedProducts,
}: ProductDetailsPageProps) {
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0
      ? product.sizes[0].size
      : "1M×50CM"
  );
  const [selectedFrame, setSelectedFrame] = useState(
    product.frames && product.frames.length > 0
      ? product.frames[0].frame
      : "SANS"
  );

  // Get the current frame's sub-options
  const currentFrameSubOptions =
    product.frames?.find((f) => f.frame === selectedFrame)?.subOptions || [];

  const [selectedFrameSubOption, setSelectedFrameSubOption] = useState(
    currentFrameSubOptions.length > 0 ? currentFrameSubOptions[0].name : ""
  );

  // Update selected sub-option when frame changes
  useEffect(() => {
    const newFrameSubOptions =
      product.frames?.find((f) => f.frame === selectedFrame)?.subOptions || [];
    if (newFrameSubOptions.length > 0) {
      setSelectedFrameSubOption(newFrameSubOptions[0].name);
    } else {
      setSelectedFrameSubOption("");
    }
  }, [selectedFrame, product.frames]);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    (product.images && product.images[0]) || ""
  );
  const { toast } = useToast();
  const {
    addItem: addItemToCart,
    removeItem: removeItemFromCart,
    items: cartItems,
    openCart,
  } = useCart();
  const { addItem } = useRecentlyViewedStore();

  // Check if this product configuration is already in the cart
  const isInCart = () => {
    return cartItems.some(
      (item) =>
        item.id === product.id.toString() &&
        item.size === selectedSize &&
        item.frame === selectedFrame &&
        item.frameSubOption === selectedFrameSubOption
    );
  };

  // Get cart item if it exists
  const getCartItem = () => {
    return cartItems.find(
      (item) =>
        item.id === product.id.toString() &&
        item.size === selectedSize &&
        item.frame === selectedFrame &&
        item.frameSubOption === selectedFrameSubOption
    );
  };

  useEffect(() => {
    // Add the current product to recently viewed
    addItem(product.id);
  }, [product.id, addItem]);

  // Calculate the final price based on selected size and frame
  const getSelectedSizePrice = () => {
    if (product.sizes && product.sizes.length > 0) {
      const size = product.sizes.find((s) => s.size === selectedSize);
      return size ? size.price : product.price;
    }
    return product.price;
  };

  const getSelectedFramePrice = () => {
    if (product.frames && product.frames.length > 0) {
      const frame = product.frames.find((f) => f.frame === selectedFrame);
      return frame ? frame.price : 0;
    }
    return 0;
  };

  const getSelectedFrameSubOptionPrice = () => {
    if (product.frames && product.frames.length > 0) {
      const frame = product.frames.find((f) => f.frame === selectedFrame);
      if (frame && frame.subOptions && frame.subOptions.length > 0) {
        const subOption = frame.subOptions.find(
          (s) => s.name === selectedFrameSubOption
        );
        return subOption ? subOption.price : 0;
      }
    }
    return 0;
  };

  const finalPrice =
    product.price +
    getSelectedSizePrice() +
    getSelectedFramePrice() +
    getSelectedFrameSubOptionPrice();

  const handleAddToCart = () => {
    const existingItem = getCartItem();

    if (existingItem) {
      // If the item is already in the cart, remove it
      removeItemFromCart(
        existingItem.id,
        selectedSize,
        selectedFrame,
        selectedFrameSubOption
      );

      toast({
        title: "Produit retiré du panier",
        description: `${product.name} a été retiré de votre panier.`,
      });
    } else {
      // If not in cart, add it
      addItemToCart({
        id: product.id.toString(),
        name: product.name,
        price: finalPrice,
        quantity,
        size: selectedSize,
        frame: selectedFrame,
        frameSubOption: selectedFrameSubOption,
        image: (product.images && product.images[0]) || "",
      });

      toast({
        title: "Produit ajouté au panier",
        description: `${product.name} a été ajouté à votre panier.`,
      });
    }
  };

  const handleBuyNow = () => {
    // Always add to cart when buying now (will replace if exists)
    addItemToCart({
      id: product.id.toString(),
      name: product.name,
      price: finalPrice,
      quantity,
      size: selectedSize,
      frame: selectedFrame,
      frameSubOption: selectedFrameSubOption,
      image: (product.images && product.images[0]) || "",
    });

    openCart();
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Determine the cart button state
  const cartItemExists = isInCart();
  const cartButtonText = cartItemExists
    ? "Retirer du panier"
    : "Ajouter au panier";
  const cartButtonIcon = cartItemExists ? (
    <Trash2 className="mr-1 h-4 w-4" />
  ) : (
    <ShoppingCart className="mr-1 h-4 w-4" />
  );
  const cartButtonVariant = cartItemExists ? "destructive" : "outline";

  return (
    <main className="container mx-auto ">
      <section className="px-4 py-4 md:py-8">
        <Breadcrumb
          items={[
            {
              label: product.categories?.[0] || "Produits",
              href: `/category/${product.categories?.[0] || ""}`,
            },
            { label: product.name, href: `/products/${product.id}` },
          ]}
        />

        <div className="mb-8 grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-3 md:space-y-4">
            <motion.div
              className="relative aspect-square overflow-hidden rounded-lg border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            <div className="flex flex-wrap gap-2">
              {product.images?.map((img, index) => (
                <motion.div
                  key={index}
                  className={`relative h-16 w-16 sm:h-20 sm:w-20 cursor-pointer overflow-hidden rounded-md border ${
                    selectedImage === img ? "ring-2 ring-black" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Thumbnail ${index}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.categories?.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase()}`}
                    className="text-xs sm:text-sm text-gray-500 hover:text-black hover:underline"
                  >
                    {category}
                  </Link>
                ))}
              </div>
              <div className="mt-2 inline-block">
                <StockBadge stock={product.stock} />
              </div>
              <p className="mt-3 text-xl sm:text-2xl font-semibold">
                {finalPrice} DA
              </p>
            </motion.div>

            <div className="space-y-4">
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium">Tailles</h3>
                  <RadioGroup
                    value={selectedSize}
                    onValueChange={setSelectedSize}
                    className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4"
                  >
                    {product.sizes.map((size) => (
                      <div
                        key={size.size}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={size.size}
                          id={`size-${size.size}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`size-${size.size}`}
                          className="flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-gray-200 h-12 px-2 sm:px-3 py-2 text-center text-xs sm:text-sm peer-data-[state=checked]:border-gray-800 peer-data-[state=checked]:bg-gray-800 peer-data-[state=checked]:text-white"
                        >
                          <span>{size.size}</span>
                          {size.price > 0 && (
                            <span className="text-[10px] sm:text-xs opacity-75">
                              +{size.price.toLocaleString("fr-DZ")} DA
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {product.frames && product.frames.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium">Encadrement</h3>
                  <RadioGroup
                    value={selectedFrame}
                    onValueChange={setSelectedFrame}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                  >
                    {product.frames.map((frame) => (
                      <div
                        key={frame.frame}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={frame.frame}
                          id={`frame-${frame.frame}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`frame-${frame.frame}`}
                          className="flex w-full cursor-pointer items-center justify-between h-12 rounded-md border border-gray-200 px-2 sm:px-3 py-2 text-xs sm:text-sm peer-data-[state=checked]:border-gray-400 peer-data-[state=checked]:bg-gray-800 peer-data-[state=checked]:text-white"
                        >
                          <span>{frame.frame}</span>
                          {frame.price > 0 && (
                            <span className="font-semibold">
                              +{frame.price.toLocaleString("fr-DZ")} DA
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {currentFrameSubOptions.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium">
                    Options pour {selectedFrame}
                  </h3>
                  <RadioGroup
                    value={selectedFrameSubOption}
                    onValueChange={setSelectedFrameSubOption}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                  >
                    {currentFrameSubOptions.map((subOption) => (
                      <div
                        key={subOption.name}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={subOption.name}
                          id={`framesuboption-${subOption.name}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`framesuboption-${subOption.name}`}
                          className="flex w-full cursor-pointer items-center justify-between h-12 rounded-md border border-gray-200 px-2 sm:px-3 py-2 text-xs sm:text-sm peer-data-[state=checked]:border-gray-800 peer-data-[state=checked]:bg-gray-800 peer-data-[state=checked]:text-white"
                        >
                          <span>{subOption.name}</span>
                          <span className="font-semibold">
                            +{subOption.price.toLocaleString("fr-DZ")} DA
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              <div>
                <h3 className="mb-2 font-medium">Quantité</h3>
                <div className="flex h-10 w-32 items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-full rounded-r-none"
                    onClick={decreaseQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex h-full flex-1 items-center justify-center border-y">
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-full rounded-l-none"
                    onClick={increaseQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:items-stretch">
                <Button
                  className="w-full sm:w-auto sm:flex-1 md:w-1/3 h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0
                    ? "Rupture de stock"
                    : "J'achète maintenant"}
                </Button>
                <div className="flex w-full gap-2">
                  <Button
                    variant={cartButtonVariant}
                    className={`flex-1 h-12 active:scale-95 transition-transform ${
                      cartItemExists
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : ""
                    }`}
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                  >
                    {cartButtonIcon}
                    <span className="hidden sm:inline mr-1">
                      {cartButtonText}
                    </span>
                    <span className="sm:hidden">
                      {cartItemExists ? "Retirer" : "Panier"}
                    </span>
                  </Button>
                  <WishlistButton
                    productId={product.id}
                    productName={product.name}
                    variant="outline"
                    className="h-12 w-12"
                  />
                </div>
              </div>

              {cartItemExists && (
                <div className="flex items-center mt-2 text-sm text-emerald-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span>
                    {getCartItem()?.quantity || quantity} dans votre panier
                  </span>
                </div>
              )}
            </div>

            {product.description && (
              <div className="pt-2 md:pt-4">
                <h3 className="mb-1 md:mb-2 font-medium">Description</h3>
                <p className="text-sm md:text-base text-gray-700">
                  {product.description}
                </p>
              </div>
            )}

            <div className="pt-2 md:pt-4">
              <SocialShare
                url={`https://creativadeco.com/products/${product.slug}`}
                title={product.name}
              />
            </div>
          </div>
        </div>

        {/* Related Products */}
      </section>
      {relatedProducts.length > 0 && (
        <section className="mt-10 md:mt-16">
          <motion.h2
            className="mb-4 md:mb-8 text-center text-xl md:text-2xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Vous pourriez aussi aimer
          </motion.h2>
          <div className="grid grid-cols-2 gap-3 md:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>
      )}
      <RecentlyViewedProducts currentProductId={product.id} />
    </main>
  );
}
