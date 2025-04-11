import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/product-actions";
import EditProduct from "../../_components/edit-product";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = params.id;
  const product = await getProductById(productId);
  if (!product) return notFound();

  return (
    <main>
      <EditProduct product={product} />
    </main>
  );
}
