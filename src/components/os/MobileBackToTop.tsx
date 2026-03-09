import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

export function MobileBackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 680);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.84 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.84 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 lg:hidden"
        >
          <button
            type="button"
            aria-label="Voltar ao topo"
            onClick={scrollToTop}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-background/78 text-accent shadow-[0_18px_38px_-24px_hsl(var(--accent)/0.52)] backdrop-blur-xl transition-all duration-200 hover:bg-card hover:shadow-[0_22px_48px_-24px_hsl(var(--accent)/0.62)]"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
