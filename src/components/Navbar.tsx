import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Tratamentos", href: "#tratamentos" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Localização", href: "#localizacao" },
  { label: "Contato", href: "#contato" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between py-4">
        <a href="#" className="font-display text-xl font-bold text-primary md:text-2xl">
          Souffi <span className="text-gold">Odontologia</span>
        </a>
        
        {/* Desktop */}
        <ul className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="font-sans text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground" aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
          >
            <ul className="container flex flex-col gap-4 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setOpen(false)} className="block font-sans text-base font-medium text-foreground/80 hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
