import { MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { WHATSAPP_URL } from "./FloatingWhatsApp";

const FinalCTA = () => {
  return (
    <section className="relative bg-primary py-24 md:py-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-foreground/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15">
            <MessageCircle className="h-8 w-8 text-gold" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl leading-tight">
            Pronto para cuidar do seu sorriso?
          </h2>
          <p className="mt-5 font-sans text-base text-primary-foreground/70 md:text-lg">
            Agende sua avaliação pelo WhatsApp em poucos segundos. Atendimento rápido e sem burocracia.
          </p>
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-10 py-5 font-sans text-lg font-bold text-primary-foreground shadow-[0_4px_30px_rgba(37,211,102,0.4)]"
            whileHover={{ scale: 1.05, boxShadow: "0 4px 40px rgba(37,211,102,0.6)" }}
            whileTap={{ scale: 0.98 }}
          >
            Agendar no WhatsApp
            <ArrowRight className="h-5 w-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
