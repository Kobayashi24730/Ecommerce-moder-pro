import type { ProfileProps, TPNitifyUser, User as userdata, TPEndereco, AdressModalProps } from "@/types/types";
import { User as UserIcon, Search, Package, MapPin, CreditCard, Calendar, Clock, Bell, Ticket, Phone, Fingerprint, Mail, ShieldCheck, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInfosUser, useReadUser, useStatusUser, useDeleteUser, useAddressesUser, useStantedAddress, useDelAddress } from "@/hooks";
import { handleStatusCoupon } from "@/services/users";
import { toast } from "sonner";

type Endereco = TPEndereco;

const EnderecoCard = ({ addr, onDel, onStanded }: { addr: Endereco, onDel: (id: number) => void, onStanded: (id: number) => void }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`group relative p-5 rounded-xl border transition-all duration-200 ${addr.isDefault ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/30 hover:shadow-md"}`}>
            <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm text-foreground truncate">
                            {addr.street}, {addr.number}
                        </p>
                        {addr.isDefault && (
                            <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Padrão
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                        {addr.neighborhood}, {addr.city} - {addr.state}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">CEP: {addr.zipCode}</p>
                    
                    {open && addr.complement && (
                        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50 italic">
                            Comp: {addr.complement}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!addr.isDefault && (
                            <button 
                                onClick={() => onStanded(addr.id)}
                                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all"
                                title="Definir como padrão"
                            >
                                <Check className="h-3.5 w-3.5" />
                            </button>
                        )}
                        <button 
                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all"
                            title="Editar endereço"
                        >
                            <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                            onClick={() => onDel(addr.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                            title="Excluir endereço"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tight"
                    >
                        {open ? "Fechar" : "Detalhes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Conta = ({ data } : ProfileProps) => {
    const [showAddressForm, setShowAddressForm] = useState(false);
    const { mutate: mutateInfos } = useInfosUser();
    const { mutate: mutateAddresses } = useAddressesUser();
    const { mutate: delAddress } = useDelAddress();
    const { mutate: standedAddress } = useStantedAddress();
    
    const [newData, setNewData] = useState<userdata>({
        id: 0,
        name: "",
        email: "",
        phone: "",
        cpf: "",
        birthDate: "",
        avatar: "",
        addresses: [],
        preferences: {
            newsletter: false,
            smsNotifications: false,
            emailNotifications: false,
        },
        emailVerifiedAt: "",
        twoFactorEnabled: false,
        createdAt: "",
        updatedAt: "",
    });

    const [newAdress, setNewAdresses] = useState<TPEndereco>({
        id: 0,
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Brasil',
        complement: '',
        isDefault: false
    });

    useEffect(() => {
        if (data) setNewData(data);
    }, [data]);

    if(!data) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    const handleDel = (id: number) => {
        delAddress(id, {
            onSuccess: () => toast.success('Endereço removido!'),
            onError: () => toast.error('Erro ao remover endereço')
        });
    };

    const handleStanded = (id: number) => {
        standedAddress(id, {
            onSuccess: () => toast.success('Endereço padrão atualizado!'),
            onError: () => toast.error('Erro ao atualizar endereço padrão')
        });
    };

    const onSubmitInfos = (values: any) => {
        if(!values.name || !values.email){
            toast.error("Nome e Email são obrigatórios!");
            return;
        }
        mutateInfos(values, {
            onSuccess: () => toast.success("Perfil atualizado!"),
            onError: () => toast.error("Erro ao atualizar perfil")
        });
    };

    const checkCEP = async (cep: string) => {
        const value = cep.replace(/\D/g, '');
        if(value.length === 8){
            try{
                const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
                const result = await response.json();
                if(!result.erro){
                    setNewAdresses(prev => ({
                        ...prev,
                        street: result.logradouro,
                        neighborhood: result.bairro,
                        city: result.localidade,
                        state: result.uf,
                        zipCode: result.cep
                    }));
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const onSubmitAddresses = (values: TPEndereco) => {
        if(!values.street || !values.city || !values.zipCode){
            toast.error("Preencha os campos obrigatórios!");
            return;
        }
        mutateAddresses(values, {
            onSuccess: () => {
                toast.success("Endereço adicionado!");
                setShowAddressForm(false);
                setNewAdresses({ id: 0, street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '', country: 'Brasil', complement: '', isDefault: false });
            },
            onError: () => toast.error("Erro ao adicionar endereço")
        });
    };

    return(
        <div className="space-y-6">
            {/* Seção: Informações Pessoais */}
            <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm border border-border">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <UserIcon className="h-6 w-6 text-primary" />
                    </div>
                    Informações Pessoais
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground ml-1">Nome Completo</label>
                        <input 
                            placeholder="Seu nome" 
                            defaultValue={data.name} 
                            onChange={(e) => setNewData({ ...newData, name: e.target.value })} 
                            className="w-full bg-background border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground ml-1">Email</label>
                        <input 
                            placeholder="seu@email.com" 
                            defaultValue={data.email} 
                            onChange={(e) => setNewData({ ...newData, email: e.target.value })} 
                            className="w-full bg-background border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground ml-1">Telefone</label>
                        <input 
                            placeholder="(00) 00000-0000" 
                            defaultValue={data.phone} 
                            onChange={(e) => setNewData({ ...newData, phone: e.target.value })} 
                            className="w-full bg-background border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground ml-1">CPF</label>
                        <input 
                            placeholder="000.000.000-00" 
                            defaultValue={data.cpf} 
                            onChange={(e) => setNewData({ ...newData, cpf: e.target.value })} 
                            className="w-full bg-background border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground ml-1">Data de Nascimento</label>
                        <input 
                            type="date" 
                            value={newData?.birthDate || ""} 
                            onChange={(e) => setNewData({ ...newData, birthDate: e.target.value })} 
                            className="w-full bg-background border border-input p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                        />
                    </div>
                </div>
                <button 
                    onClick={() => onSubmitInfos(newData)} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all mt-10"
                >
                    Salvar Alterações
                </button>
            </div>

            {/* Seção: Endereços de Entrega */}
            <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm border border-border">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        Meus Endereços
                    </h2>
                    <button 
                        onClick={() => setShowAddressForm(true)} 
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-xl transition-all border border-primary/20"
                    >
                        <Plus className="h-4 w-4" />
                        Novo Endereço
                    </button>
                </div>

                {data.addresses && data.addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.addresses.map((addr) => (
                            <EnderecoCard key={addr.id} addr={addr} onDel={handleDel} onStanded={handleStanded} />
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center border-2 border-dashed border-border rounded-2xl">
                        <MapPin className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">Nenhum endereço cadastrado ainda.</p>
                        <button 
                            onClick={() => setShowAddressForm(true)}
                            className="text-primary font-bold text-sm mt-2 hover:underline"
                        >
                            Cadastrar meu primeiro endereço
                        </button>
                    </div>
                )}

                {/* Modal de Adicionar Endereço */}
                {showAddressForm && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                            onClick={() => setShowAddressForm(false)}
                        />
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-3xl p-8 w-[95%] max-w-2xl z-[60] shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Plus className="h-6 w-6 text-primary" />
                                    </div>
                                    Novo Endereço
                                </h3>
                                <button
                                    onClick={() => setShowAddressForm(false)}
                                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground ml-1">CEP</label>
                                        <input
                                            type="text"
                                            placeholder="00000-000"
                                            className="w-full bg-background border border-input p-3.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            defaultValue={newAdress.zipCode}
                                            onChange={(e) => checkCEP(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground ml-1">Número</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: 123"
                                            className="w-full bg-background border border-input p-3.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={newAdress.number}
                                            onChange={(e) => setNewAdresses({...newAdress, number: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground ml-1">Rua / Logradouro</label>
                                    <input
                                        type="text"
                                        placeholder="Nome da rua"
                                        className="w-full bg-background border border-input p-3.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={newAdress.street}
                                        onChange={(e) => setNewAdresses({...newAdress, street: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground ml-1">Bairro</label>
                                        <input
                                            type="text"
                                            placeholder="Seu bairro"
                                            className="w-full bg-background border border-input p-3.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={newAdress.neighborhood}
                                            onChange={(e) => setNewAdresses({...newAdress, neighborhood: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground ml-1">Complemento</label>
                                        <input
                                            type="text"
                                            placeholder="Apto, Bloco, etc."
                                            className="w-full bg-background border border-input p-3.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={newAdress.complement}
                                            onChange={(e) => setNewAdresses({...newAdress, complement: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground ml-1">Cidade</label>
                                        <input
                                            type="text"
                                            placeholder="Sua cidade"
                                            className="w-full bg-background border border-input p-3.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={newAdress.city}
                                            onChange={(e) => setNewAdresses({...newAdress, city: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground ml-1">Estado (UF)</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: SP"
                                            className="w-full bg-background border border-input p-3.5 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={newAdress.state}
                                            onChange={(e) => setNewAdresses({...newAdress, state: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        onClick={() => setShowAddressForm(false)}
                                        className="flex-1 px-6 py-4 border border-border text-foreground font-bold rounded-2xl hover:bg-muted transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => onSubmitAddresses(newAdress)}
                                        className="flex-1 px-6 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                                    >
                                        Salvar Endereço
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Seção: Segurança e Preferências */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm border border-border">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        Segurança
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                            <div>
                                <p className="text-sm font-bold">Autenticação em 2 Fatores</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{data.twoFactorEnabled ? 'Ativado' : 'Desativado'}</p>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline uppercase tracking-tight">Configurar</button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                            <div>
                                <p className="text-sm font-bold">Senha</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Alterada há 3 meses</p>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline uppercase tracking-tight">Alterar</button>
                        </div>
                    </div>
                </div>

                <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-sm border border-border">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Bell className="h-5 w-5 text-primary" />
                        </div>
                        Preferências
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 cursor-pointer hover:bg-muted/50 transition-all">
                            <div>
                                <p className="text-sm font-bold">Newsletter</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Receba ofertas por e-mail</p>
                            </div>
                            <input type="checkbox" defaultChecked={data.preferences?.newsletter} className="w-5 h-5 rounded border-input text-primary focus:ring-primary" />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 cursor-pointer hover:bg-muted/50 transition-all">
                            <div>
                                <p className="text-sm font-bold">Notificações SMS</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Status de pedidos via SMS</p>
                            </div>
                            <input type="checkbox" defaultChecked={data.preferences?.smsNotifications} className="w-5 h-5 rounded border-input text-primary focus:ring-primary" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Compras = ({ data }: ProfileProps) => {
    if (!data?.orders || data.orders.length === 0) {
        return (
            <div className="bg-card p-12 rounded-2xl border border-border text-center shadow-sm">
                <Package className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Nenhuma compra ainda</h3>
                <p className="text-muted-foreground mb-6">Você ainda não realizou nenhum pedido em nossa loja.</p>
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
                    Ir para a Loja
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                </div>
                Histórico de Compras
            </h2>
            {data.orders.map((order: any) => (
                <div key={order.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all group">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Pedido #{order.id}</p>
                                <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.status === 'Entregue' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                            }`}>
                                {order.status}
                            </span>
                            <p className="text-lg font-extrabold text-price">{order.total}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Entrega em</p>
                                <p className="text-xs font-medium">{order.address?.city || 'Endereço não informado'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Pagamento</p>
                                <p className="text-xs font-medium">{order.paymentMethod?.cardBrand || 'Cartão de Crédito'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <button className="w-full mt-6 py-3 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-all uppercase tracking-widest">
                        Ver Detalhes do Pedido
                    </button>
                </div>
            ))}
        </div>
    );
};

export const Notificacoes = ({ data }: ProfileProps) => {
    if (!data?.notifications || data.notifications.length === 0) {
        return (
            <div className="bg-card p-12 rounded-2xl border border-border text-center shadow-sm">
                <Bell className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Tudo limpo por aqui!</h3>
                <p className="text-muted-foreground">Você não tem novas notificações no momento.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Bell className="h-6 w-6 text-primary" />
                </div>
                Notificações
            </h2>
            {data.notifications.map((notif: TPNitifyUser) => (
                <div key={notif.id} className={`p-5 rounded-2xl border transition-all ${notif.read_at ? 'bg-card border-border opacity-75' : 'bg-primary/5 border-primary/20 shadow-sm'}`}>
                    <div className="flex gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.read_at ? 'bg-muted' : 'bg-primary/20'}`}>
                            <Bell className={`h-5 w-5 ${notif.read_at ? 'text-muted-foreground' : 'text-primary'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                                <h4 className={`text-sm font-bold truncate ${notif.read_at ? 'text-muted-foreground' : 'text-foreground'}`}>
                                    {notif.data?.title || 'Nova Notificação'}
                                </h4>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium">
                                    {new Date(notif.created_at).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {notif.data?.message || 'Você recebeu uma nova atualização.'}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const Coupons = ({ data }: ProfileProps) => {
    if (!data?.coupons || data.coupons.length === 0) {
        return (
            <div className="bg-card p-12 rounded-2xl border border-border text-center shadow-sm">
                <Ticket className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Nenhum cupom disponível</h3>
                <p className="text-muted-foreground">Fique de olho em nossas promoções para ganhar descontos exclusivos!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Ticket className="h-6 w-6 text-primary" />
                </div>
                Meus Cupons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.coupons.map((coupon: any) => (
                    <div key={coupon.id} className="relative bg-card border border-border rounded-2xl p-6 overflow-hidden group hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-150" />
                        
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl font-black text-primary">
                                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `R$ ${coupon.discount_value}`}
                                </span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">OFF</span>
                            </div>
                            
                            <h4 className="text-sm font-bold text-foreground mb-1">{coupon.code}</h4>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 mb-4">
                                {coupon.description || 'Válido para toda a loja'}
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-[10px] font-medium">Expira em {new Date(coupon.expires_at).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter">
                                    Copiar
                                </button>
                            </div>
                        </div>
                        
                        {/* Detalhe de Cupom (Corte lateral) */}
                        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-background border border-border rounded-full -translate-y-1/2" />
                        <div className="absolute top-1/2 -right-2 w-4 h-4 bg-background border border-border rounded-full -translate-y-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
};
