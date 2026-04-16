const Footer = () => {
  const sections = [
    {
      title: "Sobre",
      links: ["Quem somos", "Trabalhe conosco", "Termos de uso", "Privacidade"],
    },
    {
      title: "Ajuda",
      links: ["Central de ajuda", "Como comprar", "Como vender", "Devoluções"],
    },
    {
      title: "Pagamento",
      links: ["Cartão de crédito", "Boleto", "Pix", "Mercado Pago"],
    },
    {
      title: "Redes sociais",
      links: ["Instagram", "Facebook", "Twitter", "YouTube"],
    },
  ];

  return (
    <footer className="bg-nav text-nav-foreground mt-8">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-sm mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-nav-foreground/70 hover:text-nav-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-nav-foreground/10 mt-8 pt-6 text-center text-xs text-nav-foreground/50">
          © 2026 MegaShop. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
