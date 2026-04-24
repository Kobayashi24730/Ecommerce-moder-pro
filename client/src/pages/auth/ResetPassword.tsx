import reset from "../../assets/ResetPassword.png";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function ResetPassword() {
    const navigate = useNavigate();
    function checkPass(){
        return true;
    }
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Reset your password</h2>
                </div>
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your password</label>
                        <input type="password" placeholder="********" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none trasition"/>
                    </div>
                    <button onClick={() => checkPass()} type="submit"className="mt-3 w-full bg-[#FFC107] hover:bg-[#e6af00] text-gray-900 font-bold py-3 rounded-lg transition duration-300 shadow-md">Enivar</button>
                </form>
            </div>
            <AnimatePresence>
                <motion.img
                    className="w-[70%] max-w-lg"
                    src={reset}
                />
            </AnimatePresence>
        </div>
    );
}