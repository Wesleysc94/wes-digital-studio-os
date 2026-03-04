import { Heart, Shield, Users, MapPin, MessageCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Heart, title: "Atendimento humanizado e acolhedor", desc: "Cada paciente é tratado com carinho, respeito e atenção individual." },
  { icon: Shield, title: "Foco em conforto e clareza", desc: "Explicamos cada etapa do tratamento para você se sentir seguro." },
  { icon: Users, title: "Equipe preparada e atualizada", desc: "Profissionais constantemente capacitadas nas melhores técnicas." },
  { icon: MapPin, title: "Localização fácil em Guaianases", desc: "Fácil acesso na Zona Leste de São Paulo." },
  { icon: MessageCircle, title: "Agendamento rápido via WhatsApp", desc: "Marque sua consulta em poucos segundos." },
  { icon: CheckCircle, title: "Orçamento justo e facilitado", desc: "Condições que cabem no seu bolso sem perder qualidade." },
];

const Differentials = () => {
  return (
    <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Diferenciais</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            Por que escolher a Souffi Odontologia
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur-sm transition-all hover:bg-primary-foreground/10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15">
                <item.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mt-4 font-sans text-sm font-bold text-primary-foreground">{item.title}</h3>
              <p className="mt-1.5 font-sans text-xs leading-relaxed text-primary-foreground/60">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Differentials;
