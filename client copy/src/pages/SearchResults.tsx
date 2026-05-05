import { useSearchParams } from "react-router-dom";
import Header from "@/components/ecommerce/Header";
import Footer from "@/components/ecommerce/Footer";
import ProductCard from "@/components/ecommerce/ProductCard";
import { searchProducts } from "@/data/mockProducts";
import { SearchX } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const results = searchProducts(query);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-lg font-bold text-foreground">
            Resultados para: <span className="text-primary">&quot;{query}&quot;</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            {results.length} produto{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <SearchX className="h-16 w-16 mb-4" />
            <p className="text-lg font-medium">Nenhum produto encontrado</p>
            <p className="text-sm">Tente buscar por outro termo</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
