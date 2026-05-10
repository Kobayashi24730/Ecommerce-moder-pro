import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

export interface CartItem {
  id: number;
  cart_id: number;

  product_id: number;

  name: string;

  price: string;

  quantity: number;

  image: string;

  created_at: string;
  updated_at: string;
}

export interface CartData {
  id: number;
  items: CartItem[];
  subtotal: number;
}

interface CartContextType {
  cart: CartData;

  addToCart: (item: CartItem) => void;

  removeFromCart: (productId: number) => void;

  updateQuantity: (productId: number, quantity: number) => void;

  clearCart: () => void;

  totalItems: number;

  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cart, setCart] = useState<CartData>({
    id: 1,
    items: [],
    subtotal: 0,
  });

  const calculateSubtotal = (items: CartItem[]) => {
    return items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.items.find(
        (i) => i.product_id === item.product_id
      );

      let updatedItems: CartItem[];

      if (existing) {
        updatedItems = prev.items.map((i) =>
          i.product_id === item.product_id
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
              }
            : i
        );
      } else {
        updatedItems = [...prev.items, item];
      }

      return {
        ...prev,
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
      };
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const updatedItems = prev.items.filter(
        (i) => i.product_id !== productId
      );

      return {
        ...prev,
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
      };
    });
  };

  const updateQuantity = (
    productId: number,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) => {
      const updatedItems = prev.items.map((i) =>
        i.product_id === productId
          ? {
              ...i,
              quantity,
            }
          : i
      );

      return {
        ...prev,
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
      };
    });
  };

  const clearCart = () => {
    setCart((prev) => ({
      ...prev,
      items: [],
      subtotal: 0,
    }));
  };

  const totalItems = useMemo(() => {
    return cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [cart.items]);

  const totalPrice = useMemo(() => {
    return cart.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
  }, [cart.items]);

  return (
    <CartContext.Provider
      value={{
        cart,
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
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return ctx;
};