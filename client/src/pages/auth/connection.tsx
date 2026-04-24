import connect from "../../assets/connection.png";
import bg from "../../assets/blob-scene-haikei.svg";
import { motion, AnimatePresence } from "framer-motion";

export default function Connection() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div 
                style={{ backgroundImage: `url(${bg})` }} 
                className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-40 blur-[1px] -z-10"
            />

            <AnimatePresence>
                <motion.img
                    src={connect}
                    alt="Conectar"
                    className="w-[80%] max-w-[900px] h-auto z-10 select-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                        opacity: 1, 
                        scale: 1,
                        y: [0, -30, 0] 
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </AnimatePresence>
        </div>
    );
}