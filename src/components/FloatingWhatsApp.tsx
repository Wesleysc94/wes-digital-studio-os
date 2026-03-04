import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_URL = "https://wa.me/551125525522?text=Olá!%20Gostaria%20de%20agendar%20uma%20consulta%20na%20Souffi%20Odontologia.";

const FloatingWhatsApp = () => {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-4 shadow-[0_4px_24px_rgba(37,211,102,0.4)] md:px-6 md:py-4"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      animate={{ boxShadow: ["0 4px 20px rgba(37,211,102,0.3)", "0 4px 30px rgba(37,211,102,0.6)", "0 4px 20px rgba(37,211,102,0.3)"] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <MessageCircle className="h-7 w-7 fill-current text-primary-foreground md:h-8 md:w-8" />
      <span className="hidden font-sans text-sm font-bold text-primary-foreground sm:inline">Agendar</span>
    </motion.a>
  );
};

export default FloatingWhatsApp;
export { WHATSAPP_URL };
