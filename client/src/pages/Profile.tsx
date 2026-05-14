import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Conta, Compras, Notificacoes, Coupons } from '../components/ecommerce/ProfileComponents';
import Header from "@/components/ecommerce/Header";
import Footer from "@/components/ecommerce/Footer";
import { User, Package, Bell, Ticket } from "lucide-react";

export default function Profile() {
    const [active, setActive] = useState("Conta");
    const { user, loadNotifications } = useAuth();

    useEffect(() => {
        if (loadNotifications) {
            loadNotifications();
        }
    }, []);

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

    const menuItems = [
        { id: "Conta", label: "Minha Conta", icon: User },
        { id: "Compras", label: "Minhas Compras", icon: Package },
        { id: "Notificações", label: "Notificações", icon: Bell },
        { id: "cupons", label: "Meus Cupons", icon: Ticket },
    ];


    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar de Navegação */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-card rounded-xl shadow-sm border border-border p-4 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 px-2 tracking-tight">Perfil</h2>
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActive(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                            active === item.id 
                                            ? "bg-primary text-primary-foreground shadow-md" 
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Conteúdo Principal */}
                    <section className="flex-grow">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {active === "Conta" && <Conta data={userData} />}
                            {active === "Compras" && <Compras data={userData} />}
                            {active === "Notificações" && <Notificacoes data={userData} />}
                            {active === "cupons" && <Coupons data={userData} />}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
