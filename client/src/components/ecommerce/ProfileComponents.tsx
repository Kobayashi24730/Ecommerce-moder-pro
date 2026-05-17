import {
    ProfileProps,
    TPEndereco,
    TPNitifyUser,
    AdressModalProps,
    User as userdata,
} from "@/types/types";
import { User as UserIcon, Search, Package, MapPin, CreditCard, Calendar, Clock, Bell, Ticket, Phone, Fingerprint, Mail, ShieldCheck, Plus, Trash2, Edit2, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useInfosUser, useReadUser, useStatusUser, useDeleteUser, useAddressesUser, useStantedAddress, useDelAddress } from "@/hooks";
import { handleStatusCoupon } from "@/services/users";
import { toast } from "sonner";
import { address } from "framer-motion/client";

export const Conta = ({data}: ProfileProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { mutate: mutateInfos } = useInfosUser();
    const { mutate: mutateAddresses } = useAddressesUser();
    const { mutate: delAddress } = useDelAddress();
    const { mutate: standedAddress } = useStantedAddress();
    const [ showAddresses, setshowAddresses ] = useState<boolean>(false);
    const [ newAdress, setNewAdresses ] = useState<TPEndereco>({
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

    function del(id: number) {
        if(!id) {
            console.error('Erro ao coletar o id do address!');
            return;
        } delAddress(id,{
            onSuccess: () => {
                toast.success('Address processando!');
            }, onError: () => {
                toast.error('Erro ao processar address!');
            }
        });
    }
    function standed(id: number) {
        if(!id || id === null) {
            console.error('Erro ao coletar o id do address!');
            return;
        } standedAddress(id,{
            onSuccess: () => {
                toast.success('Address processando!')
            },
            onError: () => {
                toast.error('Erro ao processar address!');
            }
        });
    }

    function onSubmitInfos(newData){
        console.log(newData);
        if(newData ==  null || !newData.name || !newData.email){
            toast.error("Preencha todos os campos  !");
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

    const OnChangeAddresses = ({ onClose, newAdress, setNewAdress, checkCEP, onSubmmitAddresses } : AdressModalProps) => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="absolute inset-0" onClick={onClose} />

                <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-8 transform transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Novo Endereço de Entrega
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Campo CEP */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500">CEP</label>
                            <input
                                type="text"
                                placeholder="00000-000"
                                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                defaultValue={newAdress.zipCode}
                                maxLength={8}
                                onChange={(e) => checkCEP(e.target.value)}
                            />
                        </div>

                        {/* Campo Rua */}
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-500">Rua / Logradouro</label>
                            <input
                                type="text"
                                placeholder="Ex: Avenida Paulista"
                                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                value={newAdress.street}
                                onChange={(e) => setNewAdresses({...newAdress, street: e.target.value})}
                            />
                        </div>

                        {/* Campo Número */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500">Número</label>
                            <input
                                type="text"
                                placeholder="Ex: 123"
                                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                value={newAdress.number}
                                onChange={(e) => setNewAdresses({...newAdress, number: e.target.value})}
                            />
                        </div>

                        {/* Campo Bairro */}
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-500">Bairro</label>
                            <input
                                type="text"
                                placeholder="Seu bairro"
                                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                value={newAdress.neighborhood}
                                onChange={(e) => setNewAdresses({...newAdress, neighborhood: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Ações do Modal */}
                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => onSubmitAddresses(newAdress)}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md shadow-slate-900/10 active:scale-[0.98] transition-all"
                        >
                            Confirmar Endereço
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    function onSubmitAddresses(address: TPEndereco) {
        if(!address || !address.street || !address.city){
            toast.error("Erro ao authenticar o usuario.!");
            return;
        }
        mutateAddresses(address,{
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

            {/* Seção: Endereços de Entrega */}
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Meus Endereços
                    </h2>
                    <button
                        onClick={() => setshowAddresses(true)}
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all">
                        <Plus className="h-4 w-4" />
                        Novo Endereço
                    </button>
                </div>
                {showAddresses && <OnChangeAddresses onClose={() => setshowAddresses(false)} newAdress={newAdress} setNewAdress={setNewAdresses} checkCEP={checkCEP} onSubmmitAddresses={onSubmitAddresses} />}
                {data.addresses && data.addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.addresses.map((addr) => (
                            <div key={addr.id} className={`group relative p-5 rounded-xl border-2 transition-all ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                                {addr.isDefault && (
                                    <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Check className="h-3 w-3" /> Padrão
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-start mb-3">
                                    <div className="space-y-1">
                                        <p className="font-bold text-base leading-tight">{addr.street}, {addr.number}</p>
                                        {addr.complement && <p className="text-xs text-muted-foreground italic">{addr.complement}</p>}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all" title="Editar">
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button onClick={() => del(Number(addr.id))} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all" title="Excluir">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{addr.neighborhood}</p>
                                    <p className="text-sm text-muted-foreground">{addr.city} - {addr.state}</p>
                                    <p className="text-sm font-medium mt-2">CEP: {addr.zipCode}</p>
                                </div>

                                {!addr.isDefault && (
                                    <button onClick={() => standed(Number(addr.id))} className="mt-4 w-full text-xs font-bold text-muted-foreground hover:text-primary py-2 border border-dashed border-border hover:border-primary rounded-lg transition-all">
                                        Definir como padrão
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                        <MapPin className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-muted-foreground">Você ainda não tem endereços cadastrados.</p>
                        <button className="mt-4 text-sm font-bold text-primary hover:underline">Cadastrar meu primeiro endereço</button>
                    </div>
                )}
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


const EnderecoCard = ({ addr }: { addr: TPEndereco }) => {
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
