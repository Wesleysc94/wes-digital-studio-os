import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${form.name}. Telefone: ${form.phone}. ${form.message}`;
    const url = `https://wa.me/551125525522?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contato" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Contato</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Fale conosco</h2>
            <p className="mt-3 font-sans text-sm text-muted-foreground">Preencha o formulário e entraremos em contato pelo WhatsApp.</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-10 space-y-5 rounded-2xl border border-border bg-card p-8 shadow-lg"
          >
            <div>
              <label htmlFor="name" className="block font-sans text-sm font-semibold text-foreground">Nome</label>
              <input
                id="name"
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 block w-full rounded-xl border border-input bg-background px-4 py-3.5 font-sans text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/20"
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block font-sans text-sm font-semibold text-foreground">Telefone / WhatsApp</label>
              <input
                id="phone"
                type="tel"
                required
                maxLength={20}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-2 block w-full rounded-xl border border-input bg-background px-4 py-3.5 font-sans text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/20"
                placeholder="(11) 2552-5522"
              />
            </div>
            <div>
              <label htmlFor="message" className="block font-sans text-sm font-semibold text-foreground">Mensagem</label>
              <textarea
                id="message"
                rows={4}
                maxLength={1000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 block w-full resize-none rounded-xl border border-input bg-background px-4 py-3.5 font-sans text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/20"
                placeholder="Como podemos ajudar?"
              />
            </div>
            
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-8 py-4 font-sans font-bold text-primary-foreground"
                >
                  <CheckCircle className="h-5 w-5" />
                  Mensagem enviada!
                </motion.div>
              ) : (
                <motion.button
                  key="button"
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-sans font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]"
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="h-5 w-5" />
                  Enviar mensagem
                </motion.button>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
