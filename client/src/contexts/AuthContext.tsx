import Auth from "@/pages/Auth";
import { api } from "@/services/api";
import React,{ useEffect, useState, useContext, createContext } from "react";
import type { User, Notifications } from "@/types/types";
import { Notificacoes } from '../components/ecommerce/ProfileComponents';
import { useFetcher } from "react-router-dom";
import { useCart } from './CartContext';
interface AuthContextData {
    user: any;
    setUser:React.Dispatch<React.SetStateAction<User | null>>;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    loadNotifications: () => Promise<void>;
    loadCoupons: () => Promise<void>;
    loadCompras: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(() => {
        const user = localStorage.getItem('@App:user');
        if(!user || user == 'undefined' || user == 'null'){
            return null;
        }
        try {
            return JSON.parse(user);
            console.log(user);
        } catch (error) {
            //console.log("Sessao nao autenticada  catch", error);
            return null;
        }
    });

    useEffect(() => {
        async function loadStorageData() {
            try {
                const response = await  api.get('/me');
                const userData = response.data.user || response.data;
                if(userData.created_at){
                    userData.birthDate = userData.created_at;
                    userData.createdAtFormatted = new Date(userData.created_at).toLocaleDateString('pt-BR');
                    if(userData.birthDate){
                        userData.birthDate = userData.birthDate.split('T')[0];
                        userData.birthDateFormatted = new Date(userData.birthDate).toLocaleDateString('pt-BR');
                    } else {
                        userData.birthDateFormatted = "";
                    }
                }
                console.log("sessao nao autenticada no loadStorage",userData);
                loadNotifications();
                loadCoupons();
                loadCompras();
                if(response.data) {
                    setUser(response.data);
                    localStorage.setItem('@App:user', JSON.stringify(userData));
                }
            } catch (erro) {
                if(erro.response?.status == 401){
                    setUser(null);
                    console.log("Erro 401", erro);
                    //console.log("Sessao nao autenticada 401, mas mantivemos o nome do usuario no cache", erro);
                }
                console.log("sessao nao autenticada no loadStorage",erro)
            } finally {
                setLoading(false);
            }
        }
        loadStorageData();
    }, []);

    const login = async (credentials: any) => {
        await api.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
        const response = await api.post('/login', credentials);
        const returnData = await response.data.user;
        setUser(returnData);
        localStorage.setItem('@App:user', JSON.stringify(returnData));
    };

    const logout = async () => {
        const response = await api.post('/logout');
        setUser(null);
        localStorage.removeItem('@App:user');
    };

    const loadCoupons = async () => {
        if(!user) return;
        try {
            const response = await api.get('/profile-data/coupons');
            //console.log('Cupons', response.data);
            setUser((prevUser) => {
                if(!prevUser) return;
                return {
                    ...prevUser,
                    coupons: response.data
                }
            });
        } catch(error) {
            console.error("Erro ao carregar cupons", error);
        }
    }
    const loadNotifications = async () => {
        if(!user) return;
        try {
            const response = await api.get('/profile-data/notifications');
            //console.log('Notificacoes', response.data);
            setUser((prevUser) => {
                if(!prevUser) return;
                return {
                    ...prevUser,
                    notifications: response.data
                }
            });    
        } catch (error) {
            console.error("Erro ao carregar notificações", error);
        }
    };

    const loadCompras = async () => {
        if(!user) return;
        try {
            const response = await api.get('/profile-data/orders');
            //console.log('Compras', response.data);
            setUser((prevUser) => {
                if(!prevUser) return;
                return {
                    ...prevUser,
                    orders: response.data
                };
            });
        } catch(error) {
            console.error("Erro ao carregar compras", error);
        }
    };
    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            isAuthenticated: !!user,
            loading,
            login,
            logout,
            loadNotifications,
            loadCoupons,
            loadCompras
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);