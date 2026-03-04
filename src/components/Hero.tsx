import { Star, MessageCircle, ChevronDown, Phone } from "lucide-react";
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
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="container relative z-10 py-12 md:py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 backdrop-blur-md">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="font-sans text-sm font-semibold text-gold-light">4.9 no Google · +270 avaliações</span>
            </div>

            <h1 className="font-display text-3xl font-bold leading-[1.1] text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Dentista em Guaianases —{" "}
              <span className="text-gold">Souffi Odontologia</span>
            </h1>

            <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              Atendimento humanizado, foco em conforto e tratamentos completos para o seu sorriso.
            </p>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-[#25D366]" />
                <span className="font-sans text-xs font-medium text-primary-foreground/70">Agendamento imediato</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-gold" />
                <span className="font-sans text-xs font-medium text-primary-foreground/70">Orçamento facilitado</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 font-sans text-base font-bold text-primary-foreground shadow-[0_4px_20px_rgba(37,211,102,0.3)] transition-all"
                whileHover={{ scale: 1.05, boxShadow: "0 4px 30px rgba(37,211,102,0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="h-5 w-5" />
                Agendar no WhatsApp
              </motion.a>
              <a
                href="tel:01125525522"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/20 px-8 py-4 font-sans font-medium text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/10"
              >
                <Phone className="h-4 w-4" />
                (011) 2552-5522
              </a>
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
