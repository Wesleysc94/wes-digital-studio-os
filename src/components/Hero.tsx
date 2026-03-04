import { Star, MessageCircle, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-clinic.jpg";
import { WHATSAPP_URL } from "./FloatingWhatsApp";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Clínica odontológica moderna Souffi Odontologia" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-dark/95 via-green-dark/80 to-green-dark/50" />
      </div>

      <div className="container relative z-10 py-12 md:py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 backdrop-blur-sm">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="font-sans text-sm font-medium text-gold-light">4.9 no Google · +270 avaliações</span>
            </div>

            <h1 className="font-display text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Dentista em Guaianases —{" "}
              <span className="text-gold">Souffi Odontologia</span>
            </h1>

            <p className="mt-5 max-w-lg font-sans text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              Atendimento humanizado, foco em conforto e tratamentos completos para o seu sorriso.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-8 py-4 font-sans font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
                Agendar no WhatsApp
              </a>
              <a
                href="#tratamentos"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 px-8 py-4 font-sans font-medium text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/10"
              >
                Ver tratamentos
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown className="h-6 w-6 text-primary-foreground/50" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
