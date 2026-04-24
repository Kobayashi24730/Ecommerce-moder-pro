import Auth from "@/pages/Auth";
import { api } from "@/services/api";
import React,{ useEffect, useState, useContext, createContext } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}
interface AuthContextData {
    user: any;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(() => {
        const user = localStorage.getItem('@App:user');
        return user ? JSON.parse(user) : null;
    });
    useEffect(() => {
        async function loadStorageData() {
            try {
                const response = await  api.get('/me');
                if(response.data) {
                    setUser(response.data);
                    localStorage.setItem('@App:user', JSON.stringify(response.data));
                }
            } catch (erro) {
                setUser(null);
                console.log("Sessao nao autenticada");
            } finally {
                setLoading(false);
            }
        }
        loadStorageData();
    }, []);

    const login = async (credentials: any) => {
        const response = await api.post('/login', credentials);
        const returnData = await response.data.user;
        setUser(response.data.user);
        localStorage.setItem('@App:user', JSON.stringify(returnData.name));
    };

    const logout = async () => {
        const response = await api.post('/logout');
        setUser(null);
        localStorage.removeItem('@App:user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);