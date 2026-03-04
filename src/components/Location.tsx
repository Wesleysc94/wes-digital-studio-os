import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const Location = () => {
  return (
    <section id="localizacao" className="bg-cream py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Localização</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">Venha nos visitar</h2>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold text-foreground">Endereço</h3>
                  <p className="mt-1 font-sans text-sm text-muted-foreground">
                    Estr. Itaquera Guaianazes, 2295 – Jardim Helena, São Paulo – SP, 08420-000
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Estr.+Itaquera+Guaianazes+2295+Jardim+Helena+São+Paulo+SP+08420-000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-sans text-xs font-semibold text-primary hover:underline"
                  >
                    Abrir no Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold text-foreground">Telefone / WhatsApp</h3>
                  <a href="tel:01125525522" className="mt-1 block font-sans text-sm text-muted-foreground hover:text-primary transition-colors">
                    (011) 2552-5522
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold text-foreground">Horário de funcionamento</h3>
                  <p className="mt-1 font-sans text-sm text-muted-foreground">Seg a Sex: 9h às 18h</p>
                  <p className="font-sans text-sm text-muted-foreground">Sáb: 9h às 13h</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-border shadow-lg"
          >
            <iframe
              title="Localização Souffi Odontologia"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.5!2d-46.3985!3d-23.5370!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zEstr.+Itaquera+Guaianazes%2C+2295+-+Jardim+Helena%2C+S%C3%A3o+Paulo+-+SP%2C+08420-000!5e0!3m2!1spt-BR!2sbr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Location;
