import type { ProfileProps, TPNitifyUser, User as userdata } from "@/types/types";
import { User as UserIcon, Search, Package, MapPin, CreditCard, Calendar, Clock, Bell, Ticket, Phone, Fingerprint, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useInfosUser, useReadUser, useStatusUser, useDeleteUser, useAddressesUser } from "@/hooks";
import { handleStatusCoupon } from "@/services/users";
import { toast } from "sonner";
import { address } from "framer-motion/client";

type Endereco = {
    id: number;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
    complement: string;
};

const EnderecoCard = ({ addr }: { addr: Endereco }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`p-4 rounded-lg border ${addr.isDefault ? "border-primary bg-primary/5" : "border-border"}`}>
            <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                    <p className="font-bold text-sm truncate">
                        {addr.street}, {addr.number}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                        {addr.neighborhood}, {addr.city} - {addr.state}
                    </p>
                    <p className="text-xs text-muted-foreground">CEP: {addr.zipCode}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {addr.isDefault && (
                        <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            Padrão
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="border border-primary px-3 py-1 rounded-lg text-xs font-bold text-primary hover:underline"
                    >
                        {open ? "Ocultar" : "Ver detalhes"}
                    </button>
                </div>
            </div>

            {open && (
                <div className="mt-3 rounded-md bg-muted/20 border border-border p-3">
                    <p className="text-xs text-muted-foreground">
                        Rua: <span className="text-foreground font-medium">{addr.street}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Número: <span className="text-foreground font-medium">{addr.number}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Bairro: <span className="text-foreground font-medium">{addr.neighborhood}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Cidade/UF: <span className="text-foreground font-medium">{addr.city} - {addr.state}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        CEP: <span className="text-foreground font-medium">{addr.zipCode}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export const Conta = ({ data } : ProfileProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { mutate: mutateInfos } = useInfosUser();
    const { mutate: mutateAddresses } = useAddressesUser();
    const [ showAddresses, setshowAddresses ] = useState<boolean>(false);
    const [ newAdress, setNewAdresses ] = useState<Endereco>({
        id: 0,
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Brasil',
        isDefault: false,
        complement: 'casa'
    });
    const [ newData, setNewData ] = useState<userdata>({
        id: 0,
        name: "",
        email: "",
        // 👤 Perfil
        phone: "",
        cpf: "",
        birthDate: "",
        avatar: "",
        // 📍 Endereços
        addresses: [],
        // 🔔 Preferências
        preferences: {
            newsletter: false,
            smsNotifications: false,
            emailNotifications: false,
        },
        // 🔒 Segurança
        emailVerifiedAt: "",
        twoFactorEnabled: false,
        // 🕒 Controle
        createdAt: "",
        updatedAt: "",
    });

    useEffect(() => {
        setNewData(data);
    }, [data]);

    if(!data) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    function onSubmitInfos(newData){
        console.log(newData);
        if(newData ==  null || !newData.name || !newData.email){
            toast.error("Preencha todos os campos!");
            return;
        }
        mutateInfos({
                id: newData.id,
                name: newData.name,
                email: newData.email,
                phone: newData.phone,
                preferences: newData.preferences,
                birthDate: newData.birthDate
            },{
                onSuccess: () => toast.success("Informações alteradas com sucesso!"),
                onError: () => console.error("Não foi possível alterar as informações")
        });
    }
    const checkCEP = async (cep: string) => {
        const value = cep.replace(/\D/g, '');
        if(value.length === 8){
            try{
                const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
                const data = await response.json();
                if(!data.erro){
                    setNewAdresses(prev => ({
                        ...prev,
                        street: data.lagroradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf,
                        zipCode: data.cep
                    }));
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    const OnChangeAddresses = () => {
        return(
            <div className="mt-4 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 animate-in fade-in slide-in-from-top-4">
                <h3 className="font-bold mb-4">Novo Endereço de Entrega</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text" 
                        placeholder="CEP" 
                        className="p-2 border rounded-lg"
                        defaultValue={newAdress.zipCode}
                        onChange={(e) => checkCEP(e.target.value)} 
                    />
                    <input
                        type="text"
                        placeholder="Rua" 
                        className="p-2 border rounded-lg md:col-span-2"
                        defaultValue={newAdress.street}
                        onChange={(e) => setNewAdresses({...newAdress, street: e.target.value})}
                    />
                    <input
                        type="text" 
                        placeholder="Número" 
                        className="p-2 border rounded-lg"
                        value={newAdress.number}
                        onChange={(e) => setNewAdresses({...newAdress, number: e.target.value})}
                    />
                    <input
                        type="text"
                        placeholder="Bairro" 
                        className="p-2 border rounded-lg"
                        value={newAdress.neighborhood}
                        onChange={(e) => setNewAdresses({...newAdress, neighborhood: e.target.value})}
                    />
                    <button 
                        onClick={() => onSubmitAddresses(newAdress)}
                        className="bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                    >
                        Confirmar Endereço
                    </button>
                </div>
            </div>
        )
    }

    function onSubmitAddresses(newData) {
        if(!newData || !newData.street | !newData.city){
            toast.error("Erro ao authenticar o usuario.!");
            return;
        }
        mutateAddresses(newData,{
            onSuccess: () => toast.success("Endereço adicionado com sucesso!"),
            onError: (err) => {
                console.error('Erro ao adicionar endereço', err);
                toast.error("Erro ao adicionar endereço");
            }
        })
    }

    return(
        <div className="space-y-6">
            {/* Seção: Informações Pessoais */}
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-primary" />
                    Informações Pessoais
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <UserIcon className="h-3.5 w-3.5" /> Nome Completo
                        </label>
                        <input placeholder="Nome do usuário" defaultValue={data.name} onChange={(e) => setNewData({ ...newData, name: e.target.value })} className="w-full bg-background border border-input p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" /> Email
                        </label>
                        <input placeholder="Email" defaultValue={data.email} onChange={(e) => setNewData({ ...newData, email: e.target.value })} className="w-full bg-background border border-input p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" /> Telefone
                        </label>
                        <input placeholder="Número de telefone" defaultValue={data.phone} onChange={(e) => setNewData({ ...newData, phone: e.target.value })} className="w-full bg-background border border-input p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"/>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Fingerprint className="h-3.5 w-3.5" /> CPF
                        </label>
                        <input placeholder="CPF" defaultValue={data.cpf} onChange={(e) => setNewData({ ...newData, cpf: e.target.value })} className="w-full bg-background border border-input p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" /> Data de Nascimento
                        </label>
                        <input type="date" value={data?.birthDate  || ""} onChange={(e) => setNewData({ ...newData, birthDate: e.target.value })} className="w-full bg-background border border-input p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                </div>
                <button onClick={() => onSubmitInfos(newData)} type="submit" className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-2.5 rounded-lg font-semibold transition-all mt-8">
                    Salvar Alterações
                </button>
            </div>

            {/* Seção: Endereço Padrão */}
            {data.addresses && data.addresses.length > 0 && (
                <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Endereço de Entrega
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.addresses.map((addr) => (
                            <div key={addr.id} className={`p-4 rounded-lg border ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm">{addr.street}, {addr.number}</span>
                                    {addr.isDefault && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Padrão</span>}
                                </div>
                                <p className="text-xs text-muted-foreground">{addr.neighborhood}, {addr.city} - {addr.state}</p>
                                <p className="text-xs text-muted-foreground">CEP: {addr.zipCode}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Seção: infos checkout */}
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        endereços de entrega
                    </h2>

                    {Array.isArray(data.addresses) && data.addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.addresses.map((addr) => (
                                <EnderecoCard key={addr.id} addr={addr} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-2">
                            <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado ainda.</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Adicionar novos endereços de entrega</p>
                    <button
                        type="button"
                        onClick={() => setshowAddresses(true)}
                        className="ml-auto border border-primary px-4 py-2 rounded-lg text-xs font-bold text-primary hover:underline"
                    >
                        + Adicionar
                    </button>
                </div>
                {showAddresses && <OnChangeAddresses />}
            </div>


            {/* Seção: Segurança e Preferências */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Segurança
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p className="text-sm font-medium">Autenticação em 2 Fatores</p>
                                <p className="text-xs text-muted-foreground">{data.twoFactorEnabled ? 'Ativado' : 'Desativado'}</p>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline">Configurar</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p className="text-sm font-medium">Senha</p>
                                <p className="text-xs text-muted-foreground">Alterada há 3 meses</p>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline">Alterar</button>
                        </div>
                    </div>
                </div>

                <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        Preferências
                    </h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" onClick={() => setNewData({ ...newData, preferences: { ...newData.preferences, newsletter: !newData.preferences?.newsletter}})} defaultChecked={data.preferences?.newsletter} className="h-4 w-4 rounded border-input text-primary focus:ring-primary" />
                            <span className="text-sm group-hover:text-primary transition-colors">Receber Newsletter</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" onClick={() => setNewData({ ...newData, preferences: { ...newData.preferences, emailNotifications: !newData.preferences?.emailNotifications}})} defaultChecked={data.preferences?.emailNotifications} className="h-4 w-4 rounded border-input text-primary focus:ring-primary" />
                            <span className="text-sm group-hover:text-primary transition-colors">Notificações por Email</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" onClick={() => setNewData({ ...newData, preferences: {...newData.preferences, smsNotifications: !newData.preferences?.smsNotifications}})}defaultChecked={data.preferences?.smsNotifications} className="h-4 w-4 rounded border-input text-primary focus:ring-primary" />
                            <span className="text-sm group-hover:text-primary transition-colors">Notificações por SMS</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Compras = ({ data }: ProfileProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const compras = Array.isArray(data?.orders) ? data?.orders : [];
    const [showDetalhes, setShowDetales] = useState(false);
    const [idDetalhes, setIdDetalhes] = useState(null);
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
    const HandleDetalhes = ({ id }: { id: number}) => {
        return (
            <>
                {filteredCompras.filter(compra => compra.id === id).map(compra => (
                    <div className="space-y-4 p-6 border-b border-border ">
                        <h1 className="text-2xl font-bold text-foreground mb-6 tracking-tight">Detalhes da Compra</h1>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Status: {compra.status}</p>
                        </div>
                    </div>
                ))}
            </>
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
                                                c.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
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
                                                <span>Total: <strong className="text-foreground">R$ {c.total}</strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <button onClick={() => {setShowDetales(!showDetalhes); setIdDetalhes(c.id)}} className="w-full lg:w-auto px-6 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg font-medium text-sm transition-colors">
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
                {showDetalhes && <HandleDetalhes id={idDetalhes} />}
            </div>
        </div>
    );
};

export const Notificacoes = ({data}: ProfileProps) => {
    const { mutate: mutateRead } = useReadUser();
    const { mutate: mutateDelete } = useDeleteUser();
    const notificacoes = data?.notifications || [];
    function markAsRead(id, status){
        if(id == null || status == null || status == undefined || id == undefined) {
            console.error('Erro ao marcar notificação como lida');
            return;
        }
        mutateRead({
            id: id,
            read: status
        }, {
            onSuccess: () => toast.success('Notificação marcada como lida'),
            onError: () => console.error('Erro ao marcar notificação como lida')
        });
    }
    function markAsDelete(id: number){
        if(!id){
            console.error('Erro ao excluir notificação');
            return;
        }
        mutateDelete(Number(id), {
            onSuccess: () => toast.success('Notificação excluida com sucesso!'),
            onError: () => console.error('Erro ao excluir notificação')
        })
    }
    return(
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground mb-6 tracking-tight">Notificações</h1>
            {notificacoes.length > 0 ? (
                    notificacoes.map((n, index) => (
                        <div key={`notif-${n.id}-${index}`} className="flex items-start gap-4 bg-card p-4 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
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
                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{n.created_at}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                                <div className="mt-3 flex gap-3">
                                    <button type="submit" onClick={() =>  markAsRead(n.id, n.read)} className="text-xs font-semibold text-primary hover:underline transition-all">{Number(n.read) === 1 ? "marcar como lida" : "desmarcar como lida" }</button>
                                    <button type="submit" onClick={() => markAsDelete(n.id)} className="text-xs font-semibold text-destructive hover:underline transition-all">Excluir</button>
                                </div>
                            </div>
                            {!n.read && <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>}
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
    const { mutate: mutateStatus } = useStatusUser();
    const coupons = Array.isArray(data?.coupons) ? data.coupons : [];
    const validateCoupons = coupons.filter((e) => {
        const expired_date = new Date(e.expiry_date);
        const current_date = new Date();
        return expired_date > current_date;
    });

    function markAsUsed(id, status){
        if(!id){
            return console.error('ID do cupom é necessário para marcar como usado');
        }
        const curentStatus = Number(status) === 1 ? 0 : 1;
        mutateStatus({
            id: id,
            status_id: curentStatus,
            email: data?.email,
            name: data?.name
        }, {
            onSuccess: () => {
                toast.success('Cupom marcado como usado');
            },
            onError: () => {
                toast.error('Erro ao marcar cupom como usado');
            }
        });
    }
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
                        validateCoupons.map((c) => (
                            <tr key={c.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    {c.image && <img src={c.image} alt="icon" className="h-10 w-10 rounded border border-border" />}
                                    <div>
                                        <p className="font-bold text-foreground">{Number(c.status_id) == 1 ? 'Usado' : 'Disponível'}</p>
                                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-primary">{c.code}</code>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">Mínimo: R$ {c.min_value}</td>
                                <td className="p-4">
                                    <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">{c.tag}</span>
                                </td>
                                <td className="p-4 text-xs text-muted-foreground">
                                    <p>Início: {c.start_date}</p>
                                    <p className="font-medium text-destructive">Expira: {c.expiry_date}</p>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => markAsUsed(c.id, c.status_id)} className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-1.5 rounded-lg font-medium transition-all text-sm">
                                        {Number(c.status_id) == 1 ? 'Desmarcar' : 'Aplicar'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                <Ticket className="h-12 w-12 mx-auto mb-4 opacity-20" />
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
