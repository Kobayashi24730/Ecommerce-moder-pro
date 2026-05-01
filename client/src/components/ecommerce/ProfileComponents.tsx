import type { ProfileProps } from "@/types/types";
import { User, Search, Package, MapPin, CreditCard, Calendar, Clock } from "lucide-react";
import { useState } from "react";

export const Conta = ({ data } : ProfileProps) => {
    if(!data) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
    return(
        <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
            <div key={data.id}>
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Meu Perfil</h2>
                
                <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground">Nome do usuário</label>
                        <input placeholder="Nome do usuário" defaultValue={data.name} className="w-full bg-background border border-input p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <input placeholder="Email" defaultValue={data.email} className="w-full bg-background border border-input p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground">Número de telefone</label>
                        <input placeholder="Número de telefone" defaultValue={data.phone} className="w-full bg-background border border-input p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"/>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground">CPF</label>
                        <input placeholder="CPF" defaultValue={data.cpf} className="w-full bg-background border border-input p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <button type="submit" className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-2.5 rounded-lg font-semibold transition-all mt-2">
                        Gravar alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Compras = ({ data }: ProfileProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    
    const compras = data?.orders || [];

    const filteredCompras = compras.filter(c => 
        c.status?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!data) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Minhas Compras</h2>
                        <p className="text-sm text-muted-foreground">Acompanhe o status e histórico dos seus pedidos.</p>
                    </div>
                    
                    <div className="relative flex items-center max-w-sm w-full">
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <input 
                            type="text"
                            placeholder="Buscar por status ou cidade..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="p-6">
                {filteredCompras.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredCompras.map((c) => (
                            <div key={c.id} className="group border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-muted/10 transition-all">
                                <div className="flex flex-col lg:flex-row justify-between gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-5 w-5 text-primary" />
                                            <span className="font-semibold text-lg">Pedido #{c.id}</span>
                                            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                c.status === 'Entregue' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {c.status}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                <span>{c.address?.city}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{c.createdAt}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                <span>{c.paymentMethod?.cardBrand}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>Total: <strong className="text-foreground">{c.total}</strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <button className="w-full lg:w-auto px-6 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg font-medium text-sm transition-colors">
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">Nenhuma compra encontrada</h3>
                        <p className="text-muted-foreground">Você ainda não realizou nenhuma compra ou sua busca não retornou resultados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Notificacoes = ({data}: ProfileProps) => {
    const notificacoes = data?.notifications || [];
    return(
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-6 tracking-tight">Notificações</h1>
            {notificacoes.length > 0 ? (
                notificacoes.map((n) => (
                    <div key={n.id} className="flex items-start gap-4 bg-card p-4 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                {n.image ? (
                                    <img className="h-10 w-10 rounded-full object-cover" src={n.image} alt="Notification" />
                                ) : (
                                    <Clock className="h-6 w-6 text-primary" />
                                )}
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <h2 className="font-bold text-foreground leading-tight">{n.title}</h2>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{n.message}</span>
                            </div>
                            <div className="mt-3 flex gap-3">
                                <button className="text-xs font-semibold text-primary hover:underline transition-all">Marcar como lida</button>
                                <button className="text-xs font-semibold text-destructive hover:underline transition-all">Excluir</button>
                            </div>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    </div>
                ))
            ) : (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">Você não tem notificações no momento.</p>
                </div>
            )}
        </div>
    );
};

export const Coupons =  ({data}: ProfileProps) => {
    const coupons = data?.coupons || [];
    return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
            <h2 className="text-2xl font-bold tracking-tight">Meus Cupons</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border bg-muted/20">
                        <th className="p-4 text-sm font-semibold text-muted-foreground">Cupom</th>
                        <th className="p-4 text-sm font-semibold text-muted-foreground">Regras</th>
                        <th className="p-4 text-sm font-semibold text-muted-foreground">Tags</th>
                        <th className="p-4 text-sm font-semibold text-muted-foreground">Datas</th>
                        <th className="p-4 text-sm font-semibold text-muted-foreground text-right">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.length > 0 ? (
                        coupons.map((c) => (
                            <tr key={c.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    {c.image && <img src={c.image} alt="icon" className="h-10 w-10 rounded border border-border" />}
                                    <div>
                                        <p className="font-bold text-foreground">{c.tag}</p>
                                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-primary">{c.code}</code>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">{c.min_value}</td>
                                <td className="p-4">
                                    <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">{c.tag}</span>
                                </td>
                                <td className="p-4 text-xs text-muted-foreground">
                                    <p>Início: {c.start_date}</p>
                                    <p className="font-medium text-destructive">Expira: {c.expiry_date}</p>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-1.5 rounded-lg font-medium transition-all text-sm">
                                        Aplicar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                Nenhum cupom encontrado
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};
