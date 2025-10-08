import React, { createContext, useState, useEffect, useContext } from 'react';
import { ref, set, onValue, remove } from 'firebase/database';
import { database } from '../src/config/firebase';
import { AuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      loadCartFromFirebase();
    } else {
      loadCartFromLocal();
    }
  }, [user]);

  const loadCartFromFirebase = () => {
    if (!user) return;

    const cartRef = ref(database, `carts/${user.uid}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const cartArray = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
        setCart(cartArray);
        saveCartToLocal(cartArray);
      } else {
        setCart([]);
      }
    });

    return unsubscribe;
  };

  const loadCartFromLocal = async () => {
    try {
      const localCart = await AsyncStorage.getItem('cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      }
    } catch (error) {
      console.error('Error loading cart from local storage:', error);
    }
  };

  const saveCartToLocal = async (cartData) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to local storage:', error);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const existingItemIndex = cart.findIndex(item => item.productId === product.id);
      let updatedCart;

      if (existingItemIndex !== -1) {
        updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        const newItem = {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: quantity
        };
        updatedCart = [...cart, newItem];
      }

      const cartRef = ref(database, `carts/${user.uid}`);
      await set(cartRef, updatedCart.reduce((acc, item) => {
        acc[item.productId] = item;
        return acc;
      }, {}));

      setCart(updatedCart);
      saveCartToLocal(updatedCart);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const updatedCart = cart.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );

      const cartRef = ref(database, `carts/${user.uid}`);
      await set(cartRef, updatedCart.reduce((acc, item) => {
        acc[item.productId] = item;
        return acc;
      }, {}));

      setCart(updatedCart);
      saveCartToLocal(updatedCart);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const itemRef = ref(database, `carts/${user.uid}/${productId}`);
      await remove(itemRef);

      const updatedCart = cart.filter(item => item.productId !== productId);
      setCart(updatedCart);
      saveCartToLocal(updatedCart);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const cartRef = ref(database, `carts/${user.uid}`);
      await remove(cartRef);
      setCart([]);
      saveCartToLocal([]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};