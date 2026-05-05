import Header from "@/components/ecommerce/Header";
import HeroBanner from "@/components/ecommerce/HeroBanner";
import CategoryNav from "@/components/ecommerce/CategoryNav";
import PromoBanner from "@/components/ecommerce/PromoBanner";
import FlashDeals from "@/components/ecommerce/FlashDeals";
import ProductGrid from "@/components/ecommerce/ProductGrid";
import Footer from "@/components/ecommerce/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <CategoryNav />
        <PromoBanner />
        <FlashDeals />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
