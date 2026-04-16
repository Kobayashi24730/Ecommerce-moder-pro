const PromoBanner = () => {
  const promos = [
    { text: "Frete Grátis", sub: "acima de R$99", emoji: "🚚" },
    { text: "Até 12x", sub: "sem juros", emoji: "💳" },
    { text: "Cupom 15% OFF", sub: "primeira compra", emoji: "🎫" },
    { text: "Troca grátis", sub: "em 30 dias", emoji: "🔄" },
  ];

  return (
    <section className="py-3 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {promos.map((promo) => (
            <div
              key={promo.text}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <span className="text-2xl">{promo.emoji}</span>
              <div>
                <p className="text-sm font-bold text-foreground">{promo.text}</p>
                <p className="text-xs text-muted-foreground">{promo.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
