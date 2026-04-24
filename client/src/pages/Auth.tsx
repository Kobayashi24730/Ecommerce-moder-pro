import { useState } from "react";
import LogoLogin from "../assets/LogoLogin.png";
import LogoRegister from "../assets/LogoRegister.png";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bg from "../assets/blob-scene-haikei.svg";
import { useAddUser } from "@/hooks";
import { TPAddUsers, Props, TPGetUsers } from "@/types/types";
import { useAuth } from "../contexts/AuthContext";

export default function Auth() {
    const { login } = useAuth();
    const { mutate: mutateRegister } = useAddUser();
    const [isAuth, setIsAuth] = useState<"Login" | "Register">("Register");
    const navigate = useNavigate();
    const [FormAdd, setFormAdd] = useState<TPAddUsers>({
        name: "",
        email: "",
        password: "",
    });
    const [ Formget, setFormget ] = useState<TPGetUsers>({
        name: "",
        email: "",
        password: "",
    });
    async function onSubmitInfosToLogin(FormGet: TPGetUsers) {
        if(!FormGet.email || !FormGet.password){
            alert("Preencha todos os campos!");
            return;
        }
        try {
            await login({
                email: FormGet.email,
                password: FormGet.password
            });
            navigate("/");
            alert("Usuário logado com sucesso!");
        } catch (err) {
            alert("Erro ao logar usuário!");
            return;
        }
    }
    async function onSubmitInfosToRegister(FormAdd: TPAddUsers) {
        if(!FormAdd.name || !FormAdd.email || !FormAdd.password){
            alert("Preencha todos os campos!");
            return;
        }
        mutateRegister({
            name: FormAdd.name,
            email: FormAdd.email,
            password: FormAdd.password
        },{ onSuccess: () => {
            try {
                login({
                    email: FormAdd.email,
                    password: FormAdd.password
                });
                alert("Usuário cadastrado com sucesso!");
                navigate("/")
            } catch (err){
                alert("Erro ao cadastrar usuário!");
                return;
            }
        }, onError: () => {
            alert("Não foi possível cadastrar o usuário!");
            return;
        }});
    }
    function ToggleFunction() {
        setIsAuth(isAuth === "Login" ? "Register" : "Login");
    }
    const renderForm = () => {
        if(isAuth == "Login"){
            return(
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-email</label>
                        <input type="email" placeholder="seu@gmail.com" value={Formget.email} onChange={(e) => setFormget({ ...Formget, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" placeholder="********" value={Formget.password} onChange={(e) => setFormget({ ...Formget, password: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition" />
                    </div>
                </form>
            );
        } else {
            return(
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" placeholder="Your name" value={FormAdd.name} onChange={(e) => setFormAdd({ ...FormAdd, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none trasition"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-email</label>
                        <input type="email" placeholder="seu@email.com" value={FormAdd.email} onChange={(e) => setFormAdd({ ...FormAdd, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" placeholder="********" value={FormAdd.password} onChange={(e) => setFormAdd({ ...FormAdd, password: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition" />
                    </div>
                </form>
            );
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center p-4">

            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">{isAuth === "Login" ? "Login" : "Cadastro"}</h2>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={isAuth}
                        className="transition-all duration-500 animate-fade-in"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                    >
                        {renderForm()}
                    </motion.div>
                </AnimatePresence>

                { isAuth === "Login" && (
                    <div className="flex justify-end">
                        <a onClick={() => navigate("/forgot-password")} className="text-sm text-blue-600 hover:underline">Esqueceu sua senha?</a>
                    </div>
                )}

                <button onClick={() => isAuth  === "Login" ? onSubmitInfosToLogin(Formget) : onSubmitInfosToRegister(FormAdd) } type="submit" className="mt-3 w-full bg-[#FFC107] hover:bg-[#e6af00] text-gray-900 font-bold py-3 rounded-lg transition duration-300 shadow-md">{isAuth}</button>

                <div className="text-center text-sm text-gray-600 mt-8">
                    <a onClick={() => ToggleFunction()} className="font-bold text-gray-800 hover:text-yellow-600">{isAuth === "Login" ? "Nao possui uma conta?" : "Ja possui uma conta?"}</a>
                </div>
            </div>
            <AnimatePresence mode="wait">
                <motion.img
                    key={isAuth}
                    src={isAuth == "Login" ? LogoLogin : LogoRegister}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="w-[70%] max-w-lg"
                >
                </motion.img>
            </AnimatePresence>
        </div>
    )
}