import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Star, Truck, ShieldCheck, ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import Header from "@/components/ecommerce/Header";
import Footer from "@/components/ecommerce/Footer";
import { products } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-muted-foreground">Produto não encontrado</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
            Voltar ao início
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = product.images?.length ? product.images : [product.image];

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="p-4 md:p-6">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                {product.discount && (
                  <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-sm z-10">
                    {product.discount}% OFF
                  </span>
                )}
                <img
                  src={allImages[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImage === i
                          ? "border-primary"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 md:p-6 flex flex-col">
              <h1 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-star text-star"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews.toLocaleString()} avaliações)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 p-4 bg-background rounded-lg">
                {product.originalPrice && (
                  <span className="text-sm text-price-old line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-price">
                    {formatPrice(product.price)}
                  </span>
                  {product.discount && (
                    <span className="text-sm font-bold text-accent">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                {product.installments && (
                  <p className="text-sm text-muted-foreground mt-1">
                    em até{" "}
                    <span className="font-semibold text-foreground">
                      {product.installments}x de {formatPrice(product.price / product.installments)}
                    </span>{" "}
                    sem juros
                  </p>
                )}
              </div>

              {/* Shipping */}
              {product.freeShipping && (
                <div className="flex items-center gap-2 mt-3 p-3 bg-success/10 rounded-lg">
                  <Truck className="h-5 w-5 text-success" />
                  <div>
                    <span className="text-sm font-semibold text-success">Frete grátis</span>
                    <p className="text-xs text-muted-foreground">Chegará entre 3-7 dias úteis</p>
                  </div>
                </div>
              )}

              {/* Guarantee */}
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Garantia de 12 meses</span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mt-5">
                <span className="text-sm font-medium text-foreground">Quantidade:</span>
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-sm font-medium min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 mt-5">
                <Button
                  onClick={handleBuyNow}
                  className="w-full h-12 text-base font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Comprar agora
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full h-12 text-base font-bold border-primary text-primary hover:bg-primary/10"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adicionar ao carrinho
                </Button>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mt-6 pt-4 border-t border-border">
                  <h2 className="text-sm font-bold text-foreground mb-2">Descrição</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
