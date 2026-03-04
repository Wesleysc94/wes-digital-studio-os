import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="sobre" className="py-20 md:py-28">
      <div className="container">
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
            <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
              Do diagnóstico ao resultado final, trabalhamos com transparência e comprometimento para que você tenha o melhor resultado e a melhor experiência possível.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
