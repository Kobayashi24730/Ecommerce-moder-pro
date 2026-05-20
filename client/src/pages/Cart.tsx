import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Ticket, X } from "lucide-react";
import Header from "@/components/ecommerce/Header";
import Footer from "@/components/ecommerce/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import ListCouponsMark from "@/components/ecommerce/listCouponsMark";
import { useState } from "react";
import {useAuth} from "@/contexts/AuthContext.tsx";
const formatPrice = (value: number)  => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart, } = useCart();
  const { user } = useAuth();
  const data = user ? {
    ...user,
    coupons: user.coupons || []
  } : null
  const coupon_usado = user?.coupons?.find(c => Number(c.status_id) === 1);
  const [showOpenList, setShowOpenList] = useState(false);
  const discount = coupon_usado ? Number(coupon_usado.min_value) : 0;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <ShoppingBag className="h-20 w-20 text-muted-foreground/40 mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Seu carrinho está vazio</h1>
          <p className="text-sm text-muted-foreground mb-6">Adicione produtos para continuar comprando</p>
          <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground">Continuar comprando</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                Seu Carrinho ({totalItems} {totalItems === 1 ? "item" : "itens"})
              </h1>
              <button
                onClick={clearCart}
                className="text-sm text-muted-foreground hover:text-destructive font-semibold transition-colors"
              >
                Limpar carrinho
              </button>
            </div>

            {cart.items.map((item) => (
              <div key={item.id} className="group bg-card rounded-xl border border-border hover:border-primary/30 p-5 flex gap-4 transition-all shadow-sm hover:shadow-md">
                <div className="relative h-28 w-28 flex-shrink-0">
                  <img
                    src={item?.image}
                    alt={item.name}
                    className="h-full w-full object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105"
                    onClick={() => navigate(`/product/${item.product_id}`)}
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3
                      className="text-base font-semibold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/product/${item.product_id}`)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2">Preço unitário: {formatPrice(Number(item.price))}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border rounded-lg bg-muted/30 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-2 hover:bg-muted transition-colors"
                          title="Diminuir quantidade"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 text-sm font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, Number(item.quantity) + 1)}
                          className="p-2 hover:bg-muted transition-colors"
                          title="Aumentar quantidade"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Coupon Button */}
                      <button
                        onClick={() => setShowOpenList(true)}
                        className="flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-all"
                        title="Aplicar cupom"
                      >
                        <Ticket className="h-3.5 w-3.5" />
                        Cupom
                      </button>
                    </div>

<<<<<<< HEAD
                    {/* Coupon */}
                    <div className="text-xs text-muted-foreground">
                      {!coupon_usado ? (
                        <div>
                          Aplique um cupom:{" "}
                          <button
                            onClick={() =>
                              setShowOpenList(true)
                            }
                            className="text-success font-semibold"
                          >
                            lista de cupons
                          </button>
                        </div>
                      ) : (
                        <div>
                          Cupom aplicado:{" "}
                          <span className="text-success font-semibold">
                            {coupon_usado.code}
                            <button
                                onClick={() =>
                                    setShowOpenList(true)
                                }
                                className="text-success font-semibold p-1.5"
                            >
                              lista outro coupons
                            </button>
                          </span>
                        </div>
                      )}
=======
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Subtotal</p>
                        <p className="text-lg font-bold text-price">{formatPrice(Number(item.price) * item.quantity)}</p>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(Number(item.product_id))}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                        title="Remover do carrinho"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
>>>>>>> 21be906 (feat: major UI overhaul for cart, coupons, profile and new address form modal)
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-28 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6">Resumo do Pedido</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-muted-foreground">
<<<<<<< HEAD
                  <span>
                    Subtotal ({totalItems} itens)
                  </span>

                  <span>
                    {formatPrice(totalPrice - discount)}
                  </span>
=======
                  <span>Subtotal ({totalItems} itens)</span>
                  <span>{formatPrice(totalPrice)}</span>
>>>>>>> 21be906 (feat: major UI overhaul for cart, coupons, profile and new address form modal)
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Frete</span>
                  <span className="text-success font-semibold">Grátis</span>
                </div>

<<<<<<< HEAD
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-bold text-foreground">
                    Total
                  </span>

                  <span className="text-xl font-extrabold text-price">
                    {formatPrice(totalPrice - discount)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  ou em até{" "}
                  <span className="font-semibold text-foreground">
                    12x de{" "}
                    {formatPrice(
                      Number(totalPrice - discount) / 12
                    )}
                  </span>{" "}
                  sem juros
=======
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-2xl font-extrabold text-price">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground pt-2">
                  ou em até <span className="font-semibold text-foreground">12x de {formatPrice(totalPrice / 12)}</span> sem juros
>>>>>>> 21be906 (feat: major UI overhaul for cart, coupons, profile and new address form modal)
                </p>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                className="w-full h-12 text-base font-bold bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-all"
              >
                Finalizar Compra
              </Button>

              <p className="text-[11px] text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                <span>🔒</span> Pagamento 100% seguro
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Coupons */}
      {showOpenList && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setShowOpenList(false)}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl p-6 w-[90%] max-w-2xl z-50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Ticket className="h-6 w-6 text-primary" />
                  Meus Cupons
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Selecione um cupom para aplicar ao seu pedido
                </p>
              </div>
              <button
                onClick={() => setShowOpenList(false)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                title="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <ListCouponsMark />
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Cart;
