import forgot from "../../assets/forgotPassword.png";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotUser } from "../../hooks";
import { TPForgetUser } from "@/types/types";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { mutate } = useForgotUser();
    const [data,setData] = useState<TPForgetUser>({
        "email": ""
    });
    function checkPass(e: React.FormEvent){
        e.preventDefault();
        if(!data.email){
            alert("Preencha todos os campos!");
            return;
        }
        mutate({
            email: data.email
        },{
            onSuccess: () => {
                alert("Email enviado com sucesso!");
                navigate("/connection");
            },
            onError: () => {
                alert("Não foi possível enviar o email!");
                return;
            }
        })
    }
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Forgot your password??</h2>
                </div>
                <form className="space-y-5" onSubmit={checkPass}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input type="email" placeholder="seu@gmail.com" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value})}  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none trasition"/>
                    </div>
                    <button type="submit"className="mt-3 w-full bg-[#FFC107] hover:bg-[#e6af00] text-gray-900 font-bold py-3 rounded-lg transition duration-300 shadow-md">Enviar</button>
                </form>
            </div>
            <AnimatePresence>
                <motion.img
                    className="w-[70%] max-w-lg"
                    src={forgot}
                />
            </AnimatePresence>
        </div>
    );
}