import { createContext, useContext, ReactNode, useMemo, } from "react";
import { useGetCart } from "@/hooks";
import { CartData, CartItem } from "@/types/types";

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
  const { data, isLoading } = useGetCart();
  const cart: CartData = data?.data ?? data ?? {
    id: 0,
    items: [],
    subtotal: 0,
  };

  const addToCart = (item: CartItem) => {
    console.log("addToCart", item);
  };

  const removeFromCart = ( productId: number ) => {
    console.log("remoção do cart: ", productId);
  };

  const updateQuantity = ( productId: number, quantity: number ) => {
    console.log("update da Qunatity: ", productId, quantity);
  };

  const clearCart = () => {
    console.log("Clear do cart");
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