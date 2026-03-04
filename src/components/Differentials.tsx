import { Heart, Shield, Users, MapPin, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Heart, title: "Atendimento humanizado e acolhedor" },
  { icon: Shield, title: "Foco em conforto e clareza no tratamento" },
  { icon: Users, title: "Equipe preparada e ambiente organizado" },
  { icon: MapPin, title: "Localização fácil em Guaianases" },
  { icon: MessageCircle, title: "Agendamento rápido via WhatsApp" },
];

const Differentials = () => {
  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="container">
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5 backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/20">
                <item.icon className="h-5 w-5 text-gold" />
              </div>
              <p className="font-sans text-sm font-medium leading-relaxed text-primary-foreground/90">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Differentials;
