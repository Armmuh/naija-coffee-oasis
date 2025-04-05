
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types/product';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subTotal: number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subTotal: 0,
});

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        // If there's an error, just start with an empty cart
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Calculate total items and subtotal
    const items = cartItems.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(items);
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubTotal(total);
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Item exists, update quantity
        return prevItems.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity } 
            : cartItem
        );
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
