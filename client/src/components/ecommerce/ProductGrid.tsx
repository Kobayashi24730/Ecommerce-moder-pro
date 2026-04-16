import ProductCard from "./ProductCard";
import { products } from "@/data/mockProducts";

const ProductGrid = () => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">
          Recomendados para você
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
