import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20agendar%20uma%20consulta%20na%20Souffi%20Odontologia.";

const FloatingWhatsApp = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110 md:h-16 md:w-16"
    >
      <MessageCircle className="h-7 w-7 fill-current text-primary-foreground md:h-8 md:w-8" />
    </a>
  );
};

export default FloatingWhatsApp;
export { WHATSAPP_URL };
