import { Zap, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { flashDeals } from "@/data/mockProducts";

const FlashDeals = () => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent fill-accent" />
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Ofertas Relâmpago
            </h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver todas
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {flashDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
