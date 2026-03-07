import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from "lucide-react";
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

  /* Reset auto-advance timer on manual interaction */
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  const manualPaginate = useCallback((newDir: number) => {
    setLastInteraction(Date.now());
    paginate(newDir);
  }, [paginate]);

  const manualGoTo = useCallback((index: number, dir: number) => {
    setLastInteraction(Date.now());
    setCurrent([index, dir]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      /* Auto-advance threshold */
      if (Date.now() - lastInteraction > 12000) {
        paginate(1);
      }
    }, 12000);
    return () => clearInterval(timer);
  }, [paginate, lastInteraction]);

  const t = testimonials[current];

  return (
    <section id="depoimentos" className="bg-cream py-24 md:py-32 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Depoimentos</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            O que nossos pacientes dizem
          </h2>
          <div className="mx-auto mt-5 flex items-center justify-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="font-sans text-base font-medium text-foreground/70 md:text-lg">
              Referência em odontologia na coração de São Paulo.
            </p>
          </div>
          <div className="mx-auto mt-4 flex items-center justify-center gap-1.5">
            {[...Array(5)].map((_, j) => (
              <Star key={j} className="h-5 w-5 fill-gold text-gold" />
            ))}
            <span className="ml-2 font-sans text-sm font-bold text-foreground">4.9</span>
            <span className="font-sans text-sm text-muted-foreground">· +270 avaliações no Google</span>
          </div>
        </motion.div>

        {/* Carousel Viewport */}
        <div className="relative mx-auto mt-16 max-w-2xl">
          <div className="relative min-h-[280px] md:min-h-[240px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 shadow-lg md:p-12"
              >
                <Quote className="h-10 w-10 text-gold/25 mb-5" />
                <p className="font-sans text-base leading-relaxed text-foreground/80 text-center md:text-lg">
                  "{t.text}"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="font-display text-sm font-bold text-primary">{t.name.charAt(0)}</span>
                  </div>
                  <p className="font-sans text-sm font-bold text-foreground tracking-wide">{t.name}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="relative z-10 mt-8 flex items-center justify-center gap-5">
            <button
              onClick={() => manualPaginate(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground/60 shadow-md transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg active:scale-95"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => manualGoTo(i, i > current ? 1 : -1)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === current ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/40"
                    }`}
                  aria-label={`Depoimento ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => manualPaginate(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground/60 shadow-md transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg active:scale-95"
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
