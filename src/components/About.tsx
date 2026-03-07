import { motion } from "framer-motion";
import { Shield, Heart, Sparkles } from "lucide-react";
import clinicImage from "@/assets/clinic-interior.jpg";
import dentistImage from "@/assets/dentist-portrait.jpg";

const pillars = [
  { icon: Heart, label: "Cuidado com pacientes" },
  { icon: Shield, label: "Ambiente seguro e moderno" },
  { icon: Sparkles, label: "Atendimento de qualidade" },
];

const About = () => {
  return (
    <section id="sobre" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image Composition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img src={clinicImage} alt="Interior moderno da clínica Aura Odonto Premium" className="w-full h-72 md:h-96 object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-4 md:-right-8 w-36 md:w-44 overflow-hidden rounded-2xl border-4 border-background shadow-xl">
              <img src={dentistImage} alt="Dentista profissional da Aura Odonto Premium" className="w-full h-44 md:h-52 object-cover" />
            </div>
          </motion.div>

          {/* Content Block */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Sobre Nós</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Aura Odonto Premium</h2>
            <div className="mt-6 h-1 w-16 rounded-full bg-gold" />
            <p className="mt-8 font-sans text-base leading-relaxed text-muted-foreground">
              A Aura Odonto Premium nasceu com o propósito de oferecer um atendimento odontológico diferenciado na Av. Paulista, na coração de São Paulo. Acreditamos que cuidar do sorriso vai além da técnica — é sobre acolhimento, respeito e confiança.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
              Nossa equipe é formada por profissionais dedicadas e constantemente atualizadas, prontas para oferecer tratamentos seguros, eficientes e com o máximo de conforto. Nosso ambiente é moderno, organizado e pensado para que cada paciente se sinta em casa.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
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
