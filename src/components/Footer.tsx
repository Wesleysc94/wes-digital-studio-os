import { WHATSAPP_URL } from "./FloatingWhatsApp";
import { MessageCircle, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-display text-xl font-bold text-primary">
              Souffi <span className="text-gold">Odontologia</span>
            </p>
            <p className="mt-2 flex items-center justify-center gap-1 font-sans text-xs text-muted-foreground md:justify-start">
              <MapPin className="h-3 w-3" />
              Estr. Itaquera Guaianazes, 2295 – Jardim Helena, SP
            </p>
            <p className="mt-1 flex items-center justify-center gap-1 font-sans text-xs text-muted-foreground md:justify-start">
              <Phone className="h-3 w-3" />
              (011) 2552-5522
            </p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-sans text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            Agendar consulta
          </a>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="font-sans text-xs text-muted-foreground">
            © {new Date().getFullYear()} Souffi Odontologia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
