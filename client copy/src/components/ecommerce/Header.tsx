import { Search, ShoppingCart, User, MapPin, Heart, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
const Header = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-2">
          {/* Logo */}
          <a href="/" className="flex-shrink-0" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            <h1 className="text-xl font-extrabold text-primary-foreground md:text-2xl tracking-tight">
              MegaShop
            </h1>
          </a>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl">
            <div className="flex w-full rounded-md overflow-hidden bg-[hsl(var(--search-bg))] shadow-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos, marcas e muito mais..."
                className="w-full px-4 py-2.5 text-sm text-foreground outline-none bg-card"
              />
              <button type="submit" className="px-4 bg-card hover:bg-muted transition-colors border-l border-border">
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-5">
            <button 
              className="relative flex flex-col items-center text-primary-foreground hover:opacity-80 transition-opacity"
              onClick={() => navigate(isAuthenticated ? "/profile" : "/auth")}
            >
              <User className="h-5 w-5" />
              <span className="text-[10px] mt-0.5 font-medium">{loading ? "..." : user?.name ? `Olá, ${user.name.split(" ")[0]}` : "Conta"}</ span> 
            </button>
            <a href="#" className="flex flex-col items-center text-primary-foreground hover:opacity-80 transition-opacity">
              <Heart className="h-5 w-5" />
              <span className="text-[10px] mt-0.5 font-medium">Favoritos</span>
            </a>
            <button
              onClick={() => navigate("/cart")}
              className="relative flex flex-col items-center text-primary-foreground hover:opacity-80 transition-opacity"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="text-[10px] mt-0.5 font-medium">Carrinho</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu */}
          <button className="md:hidden text-primary-foreground" onClick={() => navigate("/cart")}>
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="bg-nav">
        <div className="container mx-auto flex items-center gap-6 px-4 py-2 overflow-x-auto text-nav-foreground text-sm">
          <a href="#" className="flex items-center gap-1 whitespace-nowrap hover:opacity-80 transition-opacity">
            <MapPin className="h-3.5 w-3.5" />
            <span>Informe seu CEP</span>
          </a>
          <div className="h-4 w-px bg-nav-foreground/20" />
          {["Ofertas do dia", "Histórico", "Supermercado", "Moda", "Vender", "Contato"].map((item) => (
            <a
              key={item}
              href="#"
              className="whitespace-nowrap hover:opacity-80 transition-opacity text-nav-foreground/80 hover:text-nav-foreground"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
