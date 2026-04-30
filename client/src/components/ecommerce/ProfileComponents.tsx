import type { ProfileProps } from "@/types/types";
import { User } from "lucide-react";
import { useState } from "react";
import { Coupon } from '../../types/types';

export const Conta = ({ data } : ProfileProps) => {
    if(!data) return <div>carregando...</div>;
    return(
        <div className="bg-white p-6 rounded-xl shadow">
            <div key={data.id}>
                <h2 className="text-xl font-bold mb-4">Meu Perfil</h2>
                
                <div className="space-y-4">
                    <input placeholder="Nome do usuário" defaultValue={data.name} className="w-full border p-2 rounded" />
                    <input placeholder="Email" defaultValue={data.email} className="w-full border p-2 rounded" />
                    <input placeholder="Número de telefone" defaultValue={data.phone} className="w-full border p-2 rounded"/>
                    <input placeholder="CPF" defaultValue={data.cpf} className="w-full border p-2 rounded" />
                    <button type="submit" className="bg-yellow-400 px-4 py-2 rounded">Gravar alterações</button>
                </div>
            </div>
        </div>
    );
};

export const Compras = ({ data }: ProfileProps ) => {
    const [ item, setItem ] = useState(null);
    function search(item){
        return true;
    }
    const compras = data?.orders || [];
    if(!data) return <div>carregando...</div>;
    return(
        <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-xl font-bold mb-4">
                <h2>Minhas compras</h2>
                <div className="space-y-4">
                    <input placeholder="Buscar" value={item} className="w-full border p-2 rounded" onChange={(e) => setItem(e.target.value)} />
                    <button type="submit" onClick={() => search(item)} className="bg-yellow-400 px-4 py-2 rounded">Buscar</button>
                </div>
                {compras.length > 0 ? (
                    compras.map((c) => (
                        <div key={c.id}>
                            <h2>{c.total}</h2>
                            <p>{c.address.city}</p>
                            <p>{c.status}</p>
                            <p>{c.createdAt}</p>
                            <p>{c.paymentMethod.cardBrand}</p>
                        </div>
                    ))
                ) : (
                    <div>
                        <p>Nao tem compras</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Notificacoes = ({data}: ProfileProps) => {
    const notificacoes = data?.notifications || [];
    return(
        <div className="max-w-2xl mx-auto space-y-4 p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Notificações</h1>
            {notificacoes.length > 0 ? (
                notificacoes.map((n) => (
                    <div key={n.id} className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <img className="h-8 w-8 rounded-full object-cover" src={n.image} alt="Image for notification" />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <h2 className="font-bold text-gray-900 leading-tight">{n.title}</h2>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{n.message}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2"></p>
                            <div className="mt-3 flex gap-3">
                                <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">Marcar como lida</button>
                                <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">Excluir</button>
                            </div>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-500">
                    <p>Nao tem notificacoes</p>
                </div>
            )}
        </div>
    );
};

export const Coupons =  ({data}: ProfileProps) => {
    const coupons = data?.coupons || [];
    return (
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b">
                    <th className="p-3">Cupom</th>
                    <th className="p-3">Regras</th>
                    <th className="p-3">Tags</th>
                    <th className="p-3">Datas</th>
                    <th className="p-3 text-right">Ação</th>
                </tr>
            </thead>
            <tbody>
                {coupons.length > 0 ? (
                    coupons.map((c) => (
                        <tr key={c.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 flex items-center gap-3">
                                <img src={c.image} alt="icon" className="rounded" />
                                <div>
                                    <p className="font-bold">{c.tag}</p>
                                    <small className="text-gray-500">{c.code}</small>
                                </div>
                            </td>
                            <td className="p-3 text-sm">{c.min_value}</td>
                            <td className="p-3">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{c.tag}</span>
                            </td>
                            <td className="p-3 text-xs text-gray-600">
                                <p>Início: {c.start_date}</p>
                                <p className="font-medium text-red-500">Expira: {c.expiry_date}</p>
                            </td>
                            <td className="p-3 text-right">
                                <button className="bg-yellow-400 hover:bg-yellow-500 px-4 py-1.5 rounded-lg font-medium transition-colors">
                                    Aplicar
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (<tr><td colSpan={5} className="p-3">Nenhum cupom encontrado</td></tr>)}
            </tbody>
        </table>
    </div>
  );
};