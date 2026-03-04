import { motion } from "framer-motion";
import { Shield, Heart, Sparkles } from "lucide-react";

const pillars = [
  { icon: Heart, label: "Cuidado com pacientes" },
  { icon: Shield, label: "Ambiente seguro e moderno" },
  { icon: Sparkles, label: "Atendimento de qualidade" },
];

const About = () => {
  return (
    <section id="sobre" className="py-20 md:py-28 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Sobre Nós</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Souffi Odontologia</h2>
            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gold" />
            <p className="mt-8 font-sans text-base leading-relaxed text-muted-foreground">
              A Souffi Odontologia nasceu com o propósito de oferecer um atendimento odontológico diferenciado em Guaianases, na Zona Leste de São Paulo. Acreditamos que cuidar do sorriso vai além da técnica — é sobre acolhimento, respeito e confiança.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
              Nossa equipe é formada por profissionais dedicadas e constantemente atualizadas, prontas para oferecer tratamentos seguros, eficientes e com o máximo de conforto. Nosso ambiente é moderno, organizado e pensado para que cada paciente se sinta em casa.
            </p>

            {/* Pillar badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {pillars.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 shadow-sm"
                >
                  <p.icon className="h-4 w-4 text-primary" />
                  <span className="font-sans text-sm font-medium text-foreground">{p.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
