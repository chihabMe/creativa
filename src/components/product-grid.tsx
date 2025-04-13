import ProductCard from "./product-card";
import { getFeaturedProducts } from "@/lib/data";
import * as motion from "motion/react-m";
import Link from "next/link";

interface ProductGridProps {
  products: Awaited<ReturnType<typeof getFeaturedProducts>>;
  title?: string;
}

const productVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductGrid({
  products,
  title = "Nouveauté",
}: ProductGridProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.h2
        className="mb-12 text-center text-3xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <div key={product.id} className="h-full">
            <motion.div
              variants={productVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full"
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}