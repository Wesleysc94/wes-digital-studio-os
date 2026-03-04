import { Star, MessageCircle, ChevronDown, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-clinic.jpg";
import { WHATSAPP_URL } from "./FloatingWhatsApp";

const Hero = () => {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Clínica odontológica moderna Souffi Odontologia em Guaianases" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-green-dark/95 via-green-dark/85 to-primary/60" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="container relative z-10 py-12 md:py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="font-display text-3xl font-bold leading-[1.1] text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Dentista em Guaianases com{" "}
              <span className="text-gold">atendimento humanizado</span>
            </h1>

            <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-primary-foreground/85 md:text-lg">
              Souffi Odontologia oferece tratamentos completos com foco em conforto, saúde e estética do sorriso.
            </p>

            {/* Star highlights */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-gold text-gold" />
                <span className="font-sans text-sm font-bold text-gold-light">4.9 no Google</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-gold text-gold" />
                <span className="font-sans text-sm font-bold text-gold-light">Mais de 270 avaliações de pacientes</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-[#25D366]" />
                <span className="font-sans text-xs font-medium text-primary-foreground/80">Agendamento imediato</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-gold" />
                <span className="font-sans text-xs font-medium text-primary-foreground/80">Orçamento facilitado</span>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-10 py-5 font-sans text-base font-bold text-primary-foreground shadow-[0_4px_24px_rgba(37,211,102,0.4)] transition-all md:text-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 4px 36px rgba(37,211,102,0.6)" }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="h-6 w-6" />
                Agendar no WhatsApp
              </motion.a>
              <motion.a
                href="#tratamentos"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-foreground/25 px-10 py-5 font-sans font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Ver Tratamentos
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
          <ChevronDown className="h-6 w-6 text-primary-foreground/40" />
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};

export default Hero;
