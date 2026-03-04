import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
};

const Testimonials = () => {
  const [[current, direction], setCurrent] = useState([0, 0]);

  const paginate = useCallback((newDir: number) => {
    setCurrent(([prev]) => {
      const next = (prev + newDir + testimonials.length) % testimonials.length;
      return [next, newDir];
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [paginate]);

  const t = testimonials[current];

  return (
    <section id="depoimentos" className="bg-cream py-20 md:py-28 overflow-hidden">
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
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-muted-foreground">
            Mais de 270 avaliações com nota 4.9 no Google
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative mx-auto mt-14 max-w-2xl">
          <div className="min-h-[280px] md:min-h-[240px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 shadow-lg md:p-12"
              >
                <Quote className="h-8 w-8 text-gold/30 mb-4" />
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="font-sans text-base leading-relaxed text-foreground/80 text-center md:text-lg">
                  "{t.text}"
                </p>
                <p className="mt-6 font-sans text-sm font-bold text-foreground tracking-wide uppercase">{t.name}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => paginate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/60 shadow-sm transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent([i, i > current ? 1 : -1])}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground/30"
                  }`}
                  aria-label={`Depoimento ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/60 shadow-sm transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
              aria-label="Próximo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
