import { MapPin, Phone, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Location = () => {
  return (
    <section id="localizacao" className="bg-cream py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-sans text-sm font-semibold uppercase tracking-widest text-gold">Localização</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Venha nos visitar</h2>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-foreground">Endereço</h3>
                <p className="mt-1 font-sans text-sm text-muted-foreground">Guaianases, São Paulo – SP</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-foreground">Telefone / WhatsApp</h3>
                <p className="mt-1 font-sans text-sm text-muted-foreground">(11) 99999-9999</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-foreground">Horário de funcionamento</h3>
                <p className="mt-1 font-sans text-sm text-muted-foreground">Seg a Sex: 9h às 18h</p>
                <p className="font-sans text-sm text-muted-foreground">Sáb: 9h às 13h</p>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-xl border border-border shadow-sm"
          >
            <iframe
              title="Localização Souffi Odontologia"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1976089766!2d-46.40798768502352!3d-23.542039784684657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce67e8e3bf7e55%3A0x5c5c5c5c5c5c5c5c!2sGuaianases%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              width="100%"
              height="350"
              style={{ border: 0 }}
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
