import { createContext, useContext, ReactNode, useMemo, } from "react";
import { useGetCart, useDelCart, useUpCart } from "@/hooks";
import { CartData, CartItem } from "@/types/types";
import { toast } from 'sonner';

interface CartContextType {
  cart: CartData;
  isLoading: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: ( productId: number, quantity: number ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext< CartContextType | undefined >(undefined);

export const CartProvider = ({ children, } : { children: ReactNode; }) => {
  const { mutate: delToCart } = useDelCart();
  const { mutate: upToCart } = useUpCart();
  const { data, isLoading } = useGetCart();
  const cart: CartData = data?.data ?? data ?? {
    id: 0,
    items: [],
    subtotal: 0,
  };

  const addToCart = (item: CartItem) => {
    toast.error("Erro ao adicionar produto ao carrinho. Tente novamente.", {
      description: 'Função de adicionar ao carrinho ainda não implementada.',
    });
  };
  
  const removeFromCart = ( productId: number ) => {
    if(!productId) {
      //console.error("Produto inválido");
      return;
    }
    delToCart(Number(productId), {
        onSuccess: () => { toast.success("Produto removido do carrinho com sucesso!"); },
        onError: () => {
          console.error("Erro ao remover produto do carrinho. Tente novamente.");
          toast.error("Erro ao remover produto do carrinho. Tente novamente.");
        }
    });
  };

  const updateQuantity = ( productId: number, quantity: number ) => {
    if(quantity <= 0 ) { removeFromCart(productId); return;}
    if(!productId || !quantity) {
      //console.error("Produto ou quantidade inválidos");
      return;
    }
    upToCart({ productId, quantity }, {
      onSuccess: () => { toast.success("Quantidade do produto atualizada com sucesso!"); },
       onError: () => {
        console.error("Erro ao atualizar a quantidade do produto. Tente novamente.");
        toast.error("Erro ao atualizar a quantidade do produto. Tente novamente.");
      }
    });
  };

  const clearCart = () => {
    if(cart.items.length === 0) {
      //alert("O carrinho já está vazio!");
      return;
    }
    cart.items.forEach(item => {
      removeFromCart(Number(item.product_id));
    });
    toast.success("Carrinho limpo com sucesso!");
  };

  const totalItems = useMemo(() => {
    return (cart?.items || []).reduce(
      (sum, item) => sum + (item?.quantity || 0),
      0
    );
  }, [cart.items]);

  const totalPrice = useMemo(() => {
    return (cart?.items || []).reduce(
      (sum, item) =>
        sum + (Number(item?.price || 0) * (item?.quantity || 0)),
      0
    );
  }, [cart.items]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};