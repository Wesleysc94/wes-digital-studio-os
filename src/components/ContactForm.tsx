import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { WHATSAPP_URL } from "./FloatingWhatsApp";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${form.name}. Telefone: ${form.phone}. ${form.message}`;
    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="contato" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Contato</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Fale conosco</h2>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 space-y-5"
          >
            <div>
              <label htmlFor="name" className="block font-sans text-sm font-medium text-foreground">Nome</label>
              <input
                id="name"
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 block w-full rounded-lg border border-input bg-background px-4 py-3 font-sans text-sm text-foreground outline-none ring-ring focus:ring-2"
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block font-sans text-sm font-medium text-foreground">Telefone / WhatsApp</label>
              <input
                id="phone"
                type="tel"
                required
                maxLength={20}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-2 block w-full rounded-lg border border-input bg-background px-4 py-3 font-sans text-sm text-foreground outline-none ring-ring focus:ring-2"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label htmlFor="message" className="block font-sans text-sm font-medium text-foreground">Mensagem</label>
              <textarea
                id="message"
                rows={4}
                maxLength={1000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 block w-full resize-none rounded-lg border border-input bg-background px-4 py-3 font-sans text-sm text-foreground outline-none ring-ring focus:ring-2"
                placeholder="Como podemos ajudar?"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-sans font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]"
            >
              <Send className="h-5 w-5" />
              Enviar mensagem
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
