import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import Header from "@/components/ecommerce/Header";
import Footer from "@/components/ecommerce/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProfileProps } from "@/types/types";
import {useAuth} from "@/contexts/AuthContext.tsx";

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, totalItems } = useCart();
  const { user, setUser } = useAuth();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const userData = user ? {
    ...user,
    orders: user.orders || [
      {
        id: 1024,
        total: "R$ 250,00",
        status: "Entregue",
        createdAt: "20/04/2026",
        address: { city: "São Paulo" },
        paymentMethod: { cardBrand: "Visa" }
      }
    ],
    notifications: user.notifications || [],
    coupons: user.coupons || []
  } : null;

  if (cart.items.length === 0 && step !== 3) {
    navigate("/cart");
    return null;
  }

  const handleFinishOrder = () => {
    setStep(3);
    // Aqui viria a chamada para a API do Laravel para salvar o pedido
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="bg-success/10 p-4 rounded-full mb-6">
            <CheckCircle2 className="h-16 w-16 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pedido Realizado com Sucesso!</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Obrigado por sua compra. Você receberá um e-mail com os detalhes do pedido e o código de rastreio em breve.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/")} variant="outline">
              Voltar para a Loja
            </Button>
            <Button onClick={() => navigate("/profile")} className="bg-primary">
              Ver Meus Pedidos
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao carrinho
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            <Card className={step === 1 ? "border-primary ring-1 ring-primary" : "opacity-70"}>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className={`p-2 rounded-full ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <MapPin className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-primary bg-primary/5 p-4 rounded-xl relative cursor-pointer">
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    {userData?.addresses?.find(addr => Number(addr.isDefault) === 1) ?  (
                        (() => {
                          const addr = userData?.addresses?.find(n => Number(n.isDefault) === 1);
                          return (
                                <>
                                  <p className="font-bold text-sm mb-1">{Number(addr?.isDefault) == 1 ? 'Principal' : 'Secundario'}</p>
                                  <p className="text-sm text-muted-foreground">{addr?.street}, {addr?.number}</p>
                                  <p className="text-sm text-muted-foreground">{addr?.city} - {addr?.country}</p>
                                  <p className="text-sm text-muted-foreground">CEP: {addr?.zipCode}</p>
                                </>
                              );
                            }) ()
                    ) : (
                        <div className="border border-red-200 bg-red-50 p-4 rounded-xl text-left">
                          <p className="text-sm text-red-600 font-medium">Nenhum endereço padrão selecionado.</p>
                          <Button variant="link" className="p-0 h-auto text-xs" onClick={() => navigate('/profile')}>
                            Configurar no perfil
                          </Button>
                        </div>
                    )}
                  </div>
                  <div
                      onClick={() => navigate('/profile')}
                      className="border border-border p-4 rounded-xl hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-center border-dashed"
                  >
                    <p className="text-sm text-muted-foreground font-medium">+ Adicionar ou alterar endereço</p>
                  </div>
                </div>
                {step === 1 && (
                  <Button onClick={() => setStep(2)} className="mt-6 w-full md:w-auto px-8">
                    {
                      userData?.addresses?.some(addr => Number(addr.isDefault) === 1)
                        ? "Continuar para Pagamento" : "Selecione um endereço padrão para continuar"
                    }
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Payment Method */}
            <Card className={step === 2 ? "border-primary ring-1 ring-primary" : step < 2 ? "opacity-50 pointer-events-none" : ""}>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className={`p-2 rounded-full ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Label
                    htmlFor="credit_card"
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "credit_card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="credit_card" id="credit_card" className="sr-only" />
                    <CreditCard className="h-6 w-6 mb-2" />
                    <span className="text-sm font-bold">Cartão</span>
                  </Label>
                  <Label
                    htmlFor="pix"
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "pix" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="pix" id="pix" className="sr-only" />
                    <div className="font-bold text-lg mb-1">PIX</div>
                    <span className="text-sm font-bold">Instantâneo</span>
                  </Label>
                  <Label
                    htmlFor="boleto"
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "boleto" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="boleto" id="boleto" className="sr-only" />
                    <div className="font-bold text-lg mb-1">📄</div>
                    <span className="text-sm font-bold">Boleto</span>
                  </Label>
                </RadioGroup>

                {step === 2 && (
                  <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <ShieldCheck className="h-4 w-4 text-success" />
                      Pagamento processado de forma segura
                    </div>
                    <Button onClick={handleFinishOrder} className="w-full h-12 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground">
                      Finalizar Pedido
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28">
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                  {cart.items.map((product) => (
                    <div key={product.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-md border border-border" />
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                          {product.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-2">{product.name}</p>
                        <p className="text-sm font-bold text-price">{formatPrice(Number(product.base_price))}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalItems} itens)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Frete</span>
                    <span className="text-success font-semibold">Grátis</span>
                  </div>
                  <div className="pt-2 flex justify-between items-baseline">
                    <span className="font-bold text-foreground text-base">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-price">
                        {formatPrice(totalPrice)}
                      </span>
                      <p className="text-[10px] text-muted-foreground">em até 10x sem juros</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs font-bold">Entrega Estimada</p>
                    <p className="text-[11px] text-muted-foreground">3 a 7 dias úteis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
