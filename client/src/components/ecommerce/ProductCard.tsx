import { Star, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetProducts } from "@/hooks";


const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });


const ProductCard = () => {
  const { data: products, isLoading, error } = useGetProducts();
  if (products) {
    console.log('data: ',products);
  }

  const product = products ? products[0] : null;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square bg-card overflow-hidden">
        {product.base_price && (
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-[11px] font-bold px-2 py-0.5 rounded-sm z-10">
            {product?.base_price}% OFF
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <h3 className="text-sm text-foreground line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-auto">
          {product.base_price && (
            <span className="text-xs text-price-old line-through">
              {formatPrice(product.stock)}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-price">
              {formatPrice(product.stock)}
            </span>
          </div>
          {product.description && (
            <p className="text-xs text-muted-foreground">
              em até <span className="font-semibold text-foreground">{product.description}x</span> sem juros
            </p>
          )}
        </div>

        {/* Shipping */}
        {product.company_id && (
          <div className="flex items-center gap-1 mt-1">
            <Truck className="h-3.5 w-3.5 text-success" />
            <span className="text-xs font-semibold text-success">Frete grátis</span>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.stock)
                    ? "fill-star text-star"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">
            ({product.stock.toLocaleString()})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
