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
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.4)] md:h-[72px] md:w-[72px]"
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      animate={{ boxShadow: ["0 4px 20px rgba(37,211,102,0.3)", "0 4px 30px rgba(37,211,102,0.6)", "0 4px 20px rgba(37,211,102,0.3)"] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <MessageCircle className="h-8 w-8 fill-current text-primary-foreground md:h-9 md:w-9" />
    </motion.a>
  );
};

export default FloatingWhatsApp;
export { WHATSAPP_URL };
