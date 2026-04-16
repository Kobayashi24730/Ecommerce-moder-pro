import { Star, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/data/mockProducts";

interface ProductCardProps {
  product: Product;
}

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square bg-card overflow-hidden">
        {product.discount && (
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-[11px] font-bold px-2 py-0.5 rounded-sm z-10">
            {product.discount}% OFF
          </span>
        )}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <h3 className="text-sm text-foreground line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-auto">
          {product.originalPrice && (
            <span className="text-xs text-price-old line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-price">
              {formatPrice(product.price)}
            </span>
          </div>
          {product.installments && (
            <p className="text-xs text-muted-foreground">
              em até <span className="font-semibold text-foreground">{product.installments}x</span> sem juros
            </p>
          )}
        </div>

        {/* Shipping */}
        {product.freeShipping && (
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
                  i < Math.floor(product.rating)
                    ? "fill-star text-star"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">
            ({product.reviews.toLocaleString()})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
