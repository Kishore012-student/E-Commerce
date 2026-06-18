import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getWishlist,
  addToWishlist as addToWishlistApi,
  removeFromWishlist,
} from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchWishlist();
    else setWishlist({ products: [] });
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await getWishlist();
      setWishlist(data.wishlist);
    } catch {
      setWishlist({ products: [] });
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      const { data } = await addToWishlistApi(productId);
      setWishlist(data.wishlist);
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const removeFromWishlistFn = async (productId) => {
    try {
      const { data } = await removeFromWishlist(productId);
      setWishlist(data.wishlist);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId) =>
    wishlist.products?.some((p) => p._id === productId || p === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist: removeFromWishlistFn,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
