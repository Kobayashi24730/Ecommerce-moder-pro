import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "@/components/ecommerce/Header";
import Footer from "@/components/ecommerce/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import ListCouponsMark from "@/components/ecommerce/listCouponsMark";
import { useState } from "react";
const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();
  const coupon_usado = null;
  const [showOpenList, setShowOpenList] = useState(null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/40 mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Seu carrinho está vazio</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Adicione produtos para continuar comprando
          </p>
          <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground">
            Continuar comprando
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-foreground">
                Carrinho ({totalItems} {totalItems === 1 ? "item" : "itens"})
              </h1>
              <button
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-accent transition-colors"
              >
                Limpar carrinho
              </button>
            </div>

            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-card rounded-lg border border-border p-3 flex gap-3"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-md flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-medium text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <div className="mt-1">
                    {product.base_price && (
                      <span className="text-xs text-price-old line-through mr-2">
                        {formatPrice(Number(product.base_price))}
                      </span>
                    )}
                    <span className="text-base font-bold text-price">
                      {formatPrice(Number(product.base_price) * quantity)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-border rounded-md">
                      <button
                        onClick={() => updateQuantity(String(product.id), quantity - 1)}
                        className="p-1.5 hover:bg-muted transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm font-medium">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(String(product.id), quantity + 1)}
                        className="p-1.5 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground hover:text-accent transition-colors">
                      { coupon_usado == null ? (
                        <div>
                          Aplique um cupon: <button onClick={() => setShowOpenList(true)} className="text-success font-semibold">lista de cupons</button>
                        </div>
                      ) : (
                        <div>
                          Coupon aplicado: <span className="text-success font-semibold">{coupon_usado}</span>
                        </div>
                      )}
                    </p>
                    {showOpenList && (
                      <>
                        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowOpenList(false)}/>

                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-6 w-[90%] max-w-md z-50 shadow-2xl">
                          <button 
                            onClick={() => setShowOpenList(false)} 
                            className="absolute top-4 right-4 text-muted-foreground hover:text-accent transition-colors text-lg"
                          >
                            ✕
                          </button>

                          <div className="mb-4">
                            <h3 className="text-lg font-bold">Selecione um Cupom</h3>
                            <p className="text-sm text-muted-foreground">Escolha um dos seus cupons disponíveis</p>
                          </div>

                          <div className="max-h-[60vh] overflow-y-auto">
                            <ListCouponsMark />
                          </div>
                        </div>
                      </>
                    )}
                    <button
                      onClick={() => removeFromCart(String(product.id))}
                      className="p-1.5 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4 sticky top-28">
              <h2 className="text-base font-bold text-foreground mb-3">Resumo do pedido</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({totalItems} itens)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete</span>
                  <span className="text-success font-semibold">Grátis</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-xl font-extrabold text-price">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                {items[0]?.product.attributes && (
                  <p className="text-xs text-muted-foreground">
                    ou em até{" "}
                    <span className="font-semibold text-foreground">
                      12x de {formatPrice(totalPrice / 12)}
                    </span>{" "}
                    sem juros
                  </p>
                )}
              </div>

              <Button
                className="w-full mt-4 h-12 text-base font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Finalizar compra
              </Button>

              <p className="text-[11px] text-muted-foreground text-center mt-3">
                🔒 Pagamento 100% seguro
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
