import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  return (
    <section className="relative">
      <div className="container mx-auto px-4 pt-4">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={heroBanner}
            alt="Ofertas imperdíveis"
            className="w-full h-[200px] md:h-[320px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent flex items-center">
            <div className="p-6 md:p-12 max-w-lg">
              <span className="inline-block bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-3">
                🔥 MEGA OFERTA
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-card mb-2 leading-tight">
                Até 60% OFF em Tecnologia
              </h2>
              <p className="text-card/80 text-sm md:text-base mb-4">
                Smartphones, notebooks e muito mais com frete grátis
              </p>
              <button className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-lg hover:bg-brand-dark transition-colors text-sm">
                Ver ofertas
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
