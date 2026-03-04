import { Stethoscope, SmilePlus, Crown, Sparkles, Syringe, HeartPulse, MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { WHATSAPP_URL } from "./FloatingWhatsApp";

const treatments = [
  { icon: Stethoscope, title: "Avaliação Clínica", desc: "Diagnóstico completo com planejamento personalizado para o seu tratamento." },
  { icon: SmilePlus, title: "Ortodontia", desc: "Aparelhos fixos e alinhadores para corrigir a posição dos dentes com conforto." },
  { icon: Crown, title: "Prótese e Implantes", desc: "Recupere dentes perdidos com implantes modernos e próteses de alta qualidade." },
  { icon: Sparkles, title: "Facetas em Resina", desc: "Transforme seu sorriso com facetas estéticas naturais e duradouras." },
  { icon: Syringe, title: "Harmonização Orofacial", desc: "Procedimentos estéticos para equilibrar e valorizar a harmonia do seu rosto." },
  { icon: HeartPulse, title: "Tratamento Clínico Geral", desc: "Limpezas, restaurações, canais e cuidados para manter sua saúde bucal em dia." },
];

const Treatments = () => {
  return (
    <section id="tratamentos" className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Nossos Serviços</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Tratamentos</h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-muted-foreground">
            Oferecemos tratamentos completos para cuidar da sua saúde bucal e transformar o seu sorriso.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((t, i) => (
            <motion.a
              key={i}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-gold/40 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg">
                <t.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{t.title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 font-sans text-xs font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Saiba mais <ArrowRight className="h-3 w-3" />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 font-sans text-base font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
          >
            <MessageCircle className="h-5 w-5" />
            Falar com a clínica no WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Treatments;
