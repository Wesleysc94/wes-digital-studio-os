import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { WHATSAPP_URL } from "./FloatingWhatsApp";

const FinalCTA = () => {
  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
            Pronto para cuidar do seu sorriso?
          </h2>
          <p className="mt-5 font-sans text-base text-primary-foreground/80 md:text-lg">
            Agende sua avaliação pelo WhatsApp em poucos segundos.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-10 py-5 font-sans text-lg font-bold text-primary-foreground shadow-xl transition-transform hover:scale-105"
          >
            <MessageCircle className="h-6 w-6" />
            Agendar no WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
