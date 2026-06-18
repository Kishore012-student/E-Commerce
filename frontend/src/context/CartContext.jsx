import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getCart,
  addToCart as addToCartApi,
  updateCartItem,
  removeFromCart,
  clearCart as clearCartApi,
} from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], totalPrice: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await getCart();
      setCart(data.cart);
    } catch {
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      const { data } = await addToCartApi({ productId, quantity });
      setCart(data.cart);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await updateCartItem(productId, { quantity });
      setCart(data.cart);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await removeFromCart(productId);
      setCart(data.cart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCartItems = async () => {
    try {
      await clearCartApi();
      setCart({ items: [], totalPrice: 0 });
    } catch {
    }
  };

  const cartCount = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart: clearCartItems,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
