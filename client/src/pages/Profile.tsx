import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Conta, Compras, Notificacoes, Coupons } from '../components/ecommerce/ProfileComponents';
export default function Profile(){
    const [active, setActive ] = useState("Conta");
    const { user,loadNotifications } = useAuth();
    useEffect(() => {
        loadNotifications();
    }, []);
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className="w-64 bg-white shadow-md p-4">
                <h2 className="text-lg font-bold mb-4">Perfil</h2>

                <ul className="space-y-2">
                    <li onClick={() => setActive("Conta")} className="cursor-pointer hover:text-yellow-500">Minha conta</li>
                    <li onClick={() => setActive("Compras")} className="cursor-pointer hover:text-yellow-500">Minhas Compras</li>
                    <li onClick={() => setActive("Notificações")} className="cursor-pointer hover:text-yellow-500">Notificações</li>
                    <li onClick={() => setActive("cupons")} className="cursor-pointer hover:text-yellow-500">Meus cupons</li>
                </ul>
            </div>
            <div className="flex-1 p-8">
                { active == "Conta" && <Conta data={user} />}
                { active == "Compras" && <Compras data={user} />}
                { active == "Notificações" && <Notificacoes data={user} />}
                { active == "cupons" && <Coupons data={user} />}
            </div>
        </div>
    );
}