const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container text-center">
        <p className="font-display text-lg font-bold text-primary">
          Souffi <span className="text-gold">Odontologia</span>
        </p>
        <p className="mt-2 font-sans text-xs text-muted-foreground">
          Guaianases – São Paulo – SP · © {new Date().getFullYear()} Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
