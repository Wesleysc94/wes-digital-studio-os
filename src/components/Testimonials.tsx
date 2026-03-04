import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Ingrid Marques",
    text: "As melhores pessoas que conheci, Dr Carla e Dr Ianara são maravilhosas, cuidam bem da minha família, e nosso sorriso mudou muito depois que as conhecemos. Amo demais o consultório limpinho e muito aconchegante.",
  },
  {
    name: "Eliane Lima",
    text: "Pense em um lugar que acolhe o paciente, pense em um profissional que tira suas dúvidas, que te trata com carinho, tem paciência... Super indico a Dra. Ianara e a Dra Cláudia. Parabéns pelas ótimas profissionais que são.",
  },
  {
    name: "Viviane Nanes",
    text: "Gostaria de agradecer a excelência no meu atendimento, em especial Dra. Carla maravilhosa. Fiz um canal sem dor nenhuma, me tranquilizou o tempo todo. Consultório muito limpinho, organizado e agradável. Super indico!",
  },
  {
    name: "Sonia Selai",
    text: "Dou 10 estrelas. Clínica extremamente top! Dra. Ianara e Carla são profissionais maravilhosas, tratam os pacientes com carinho, respeito e cobram um preço muito bom e justo. Não troco por nada.",
  },
  {
    name: "Onaiane Caleffi",
    text: "Excelente atendimento! Preço justo! As dentistas são muito educadas e atenciosas, explicam tudo nos mínimos detalhes. Passo três vezes ao ano desde a inauguração e não troco de profissional. Super indico!",
  },
];

const Testimonials = () => {
  return (
    <section id="depoimentos" className="bg-cream py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Depoimentos</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
            O que nossos pacientes dizem
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
              <p className="mt-4 font-sans text-sm font-semibold text-foreground">{t.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional reviews below */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {testimonials.slice(3).map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
              <p className="mt-4 font-sans text-sm font-semibold text-foreground">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
